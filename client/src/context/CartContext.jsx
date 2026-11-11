import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartService, getUploadUrl } from "../services";

const CartContext = createContext(null);

const GUEST_CART_KEY = "guest_cart";

const resolveCartImage = (images, fallbackImg) => {
  let img = fallbackImg;
  if (images) {
    if (Array.isArray(images) && images.length > 0) {
      img = images[0];
    } else if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
        else img = images;
      } catch {
        img = images.split(",")[0]?.trim();
      }
    }
  }
  return (
    getUploadUrl(img) ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=500&fit=crop&q=80"
  );
};
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const getIsLoggedIn = useCallback(() => {
    try {
      const token = localStorage.getItem("token");
      return Boolean(
        token &&
        token !== "null" &&
        token !== "undefined" &&
        typeof token === "string" &&
        token.trim().length > 10
      );
    } catch {
      return false;
    }
  }, []);
  const getGuestCart = () => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };
  const saveGuestCart = (items) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
    setCartItems(items);
    window.dispatchEvent(new Event("cart_updated"));
  };
  const fetchDbCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cartService.getCart();
      const guestItems = getGuestCart();
      const mockItems = guestItems.filter((gi) => isNaN(Number(gi.productId)));
      if (res && res.cart && Array.isArray(res.cart.items)) {
        const mapped = res.cart.items.map((i) => {
          const price = Number(i.unitPrice ?? i.price ?? 0);
          const mrp = Number(i.originalPrice ?? i.mrp ?? price);
          return {
            id: i.id,
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            unit: i.variantName || i.unit || "1 unit",
            price,
            mrp,
            discountText: null,
            quantity: i.quantity,
            image: resolveCartImage(i.images, i.image),
            availableStock: i.availableStock,
          };
        });
        setCartItems([...mapped, ...mockItems]);
      } else {
        setCartItems(mockItems);
      }
    } catch (err) {
      console.error("Failed to fetch cart from DB, switching to guest cart:", err);
      setCartItems(getGuestCart());
    } finally {
      setLoading(false);
    }
  }, []);
  const syncGuestCartToDb = useCallback(async () => {
    const guestItems = getGuestCart();
    const numericGuest = guestItems.filter((i) => !isNaN(Number(i.productId)));
    if (numericGuest.length > 0 && getIsLoggedIn()) {
      try {
        const payload = numericGuest.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity || 1,
        }));
        await cartService.syncCart(payload);
        const remainingMock = guestItems.filter((i) => isNaN(Number(i.productId)));
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(remainingMock));
      } catch (err) {
        console.error("Failed to sync guest cart to DB:", err);
      }
    }
    await fetchDbCart();
  }, [fetchDbCart, getIsLoggedIn]);

  // Initial Cart Load
  useEffect(() => {
    if (getIsLoggedIn()) {
      const guestItems = getGuestCart();
      const hasNumeric = guestItems.some((i) => !isNaN(Number(i.productId)));
      if (hasNumeric) {
        syncGuestCartToDb();
      } else {
        fetchDbCart();
      }
    } else {
      const items = getGuestCart();
      setCartItems(items);
      setLoading(false);
    }

    const handleSync = (e) => {
      if (e.key === GUEST_CART_KEY) {
        if (!getIsLoggedIn()) {
          setCartItems(getGuestCart());
        }
      }
    };

    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
    };
  }, [fetchDbCart, getIsLoggedIn, syncGuestCartToDb]);

  // 4. Add to Cart (Guest & Logged In)
  const addToCart = async (product, qty = 1, variant = null) => {
    const rawId = product?.id ?? product?.productId;
    const isNumericId = !isNaN(Number(rawId)) && Number(rawId) > 0;
    const pId = isNumericId ? Number(rawId) : String(rawId);
    const vId = variant?.id && !isNaN(Number(variant.id)) ? Number(variant.id) : null;
    const price = Number(
      variant?.price ??
        (product.discountPrice && Number(product.discountPrice) > 0
          ? product.discountPrice
          : product.price) ??
        0
    );
    const mrp = Number(
      variant?.mrp ??
        (product.discountPrice && Number(product.discountPrice) > 0
          ? product.price
          : product.mrp ?? price) ??
        price
    );
    const unit = variant?.unit || variant?.name || product.unit || "1 unit";
    const name = variant?.name
      ? `${product.name || product.title} (${variant.name})`
      : product.name || product.title || "Product";
    const image = resolveCartImage(
      variant?.images || product.images,
      product.image
    );

    // 1. INSTANT OPTIMISTIC UI UPDATE
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          (String(i.productId) === String(pId) || String(i.id) === String(pId)) &&
          (vId ? String(i.variantId) === String(vId) : !i.variantId)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qty,
        };
        return updated;
      }

      const newItem = {
        id: isNumericId ? `temp_${pId}_${vId || "base"}` : `guest_${pId}_${vId || "base"}`,
        productId: pId,
        variantId: vId,
        name,
        unit,
        price,
        mrp,
        discountText: null,
        quantity: qty,
        image,
        availableStock: product.stock || 50,
      };
      return [newItem, ...prev];
    });

    // 2. Persist to guest localStorage for mock items or when guest
    const saveToLocalStorage = () => {
      const current = getGuestCart();
      const existingIdx = current.findIndex(
        (i) =>
          String(i.productId) === String(pId) &&
          (vId ? String(i.variantId) === String(vId) : !i.variantId)
      );
      let updated;
      if (existingIdx > -1) {
        updated = [...current];
        updated[existingIdx].quantity += qty;
      } else {
        const newItem = {
          id: `guest_${pId}_${vId || "base"}`,
          productId: pId,
          variantId: vId,
          name,
          unit,
          price,
          mrp,
          discountText: null,
          quantity: qty,
          image,
          availableStock: product.stock || 50,
        };
        updated = [newItem, ...current];
      }
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
      } catch (e) {}
    };

    // 3. Persist to DB or localStorage
    if (getIsLoggedIn() && isNumericId) {
      try {
        await cartService.addToCart({
          productId: pId,
          variantId: vId,
          quantity: qty,
        });
        await fetchDbCart();
      } catch (err) {
        console.warn("DB AddToCart failed, fallback to local storage:", err);
        saveToLocalStorage();
      }
    } else {
      saveToLocalStorage();
    }
  };

  // 5. Update Quantity (+1 or -1)
  const updateQuantity = async (itemId, delta) => {
    const target = cartItems.find(
      (i) =>
        i.id === itemId ||
        String(i.productId) === String(itemId) ||
        (Number(itemId) && Number(i.productId) === Number(itemId))
    );
    if (!target) return;
    const targetId = target.id;
    const targetProductId = target.productId;
    const nextQty = target.quantity + delta;

    // Instant optimistic update
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (
            i.id === targetId ||
            String(i.productId) === String(targetProductId) ||
            String(i.id) === String(targetProductId)
          ) {
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );

    // Also update guest localStorage
    const current = getGuestCart();
    const updatedGuest = current
      .map((i) => {
        if (
          i.id === targetId ||
          String(i.productId) === String(targetProductId) ||
          String(i.id) === String(targetProductId)
        ) {
          return nextQty > 0 ? { ...i, quantity: nextQty } : null;
        }
        return i;
      })
      .filter(Boolean);
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedGuest));
    } catch (e) {}

    const isDbItem =
      getIsLoggedIn() &&
      !String(targetId).startsWith("guest_") &&
      !String(targetId).startsWith("temp_") &&
      !isNaN(Number(targetProductId));

    if (isDbItem) {
      try {
        if (nextQty <= 0) {
          await cartService.removeFromCart(targetId);
        } else {
          await cartService.updateCartItem(targetId, nextQty);
        }
      } catch (err) {
        console.error("Failed to update cart item in DB:", err);
        await fetchDbCart();
      }
    }
  };

  // 6. Remove Single Item
  const removeFromCart = async (itemId) => {
    const target = cartItems.find(
      (i) =>
        i.id === itemId ||
        String(i.productId) === String(itemId) ||
        (Number(itemId) && Number(i.productId) === Number(itemId))
    );
    const targetId = target ? target.id : itemId;
    const targetProductId = target ? target.productId : itemId;

    // Instant optimistic removal from UI
    setCartItems((prev) =>
      prev.filter(
        (i) =>
          i.id !== targetId &&
          String(i.productId) !== String(targetProductId) &&
          String(i.id) !== String(targetId)
      )
    );

    // ALWAYS update guest localStorage
    const current = getGuestCart();
    const updatedGuest = current.filter(
      (i) =>
        i.id !== targetId &&
        String(i.productId) !== String(targetProductId) &&
        String(i.id) !== String(targetId)
    );
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedGuest));
    } catch (e) {}

    const isDbItem =
      getIsLoggedIn() &&
      !String(targetId).startsWith("guest_") &&
      !String(targetId).startsWith("temp_");

    if (isDbItem) {
      try {
        await cartService.removeFromCart(targetId);
      } catch (err) {
        console.error("Failed to remove cart item in DB:", err);
      }
    }
  };

  // 7. Clear Entire Cart
  const clearCart = async () => {
    // 1. Instantly clear in-memory state
    setCartItems([]);

    // 2. ALWAYS clear localStorage completely
    try {
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (e) {}

    // 3. Clear database cart if logged in
    if (getIsLoggedIn()) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error("Failed to clear cart in DB:", err);
      }
    }
  };

  // 8. Helper to get quantity for a specific product
  const getItemQuantity = (productId, variantId = null) => {
    if (!productId && productId !== 0) return 0;
    const strId = String(productId);
    const numId = !isNaN(Number(productId)) ? Number(productId) : null;
    const vId = variantId ? String(variantId) : null;

    const item = cartItems.find((i) => {
      const matchProduct =
        String(i.productId) === strId ||
        String(i.id) === strId ||
        (numId !== null && Number(i.productId) === numId) ||
        (numId !== null && Number(i.id) === numId) ||
        i.id === `guest_${strId}_${vId || "base"}`;
      const matchVariant = vId ? String(i.variantId) === vId : true;
      return matchProduct && matchVariant;
    });
    return item ? item.quantity : 0;
  };

  // Computed Totals
  const cartCount = cartItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const cartTotal = cartItems.reduce(
    (acc, curr) => acc + (curr.price || 0) * (curr.quantity || 1),
    0
  );
  const cartMrpTotal = cartItems.reduce(
    (acc, curr) => acc + (curr.mrp || curr.price || 0) * (curr.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        cartMrpTotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        syncGuestCartToDb,
        refreshCart: fetchDbCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
