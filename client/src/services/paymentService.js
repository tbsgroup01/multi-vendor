import api from "./api";

export const paymentService = {
  // 1. Dynamically inject Razorpay Checkout script if not already present
  loadRazorpayScript: () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  // 2. Get Public Razorpay Key
  getRazorpayKey: async () => {
    const res = await api.get("/payment/key");
    return res?.keyId;
  },

  // 3. Create Razorpay Order on server
  createOrder: async (amount) => {
    const res = await api.post("/payment/create-order", { amount });
    return res;
  },

  // 4. Verify Payment signature on server
  verifyPayment: async (paymentData) => {
    const res = await api.post("/payment/verify", paymentData);
    return res;
  },

  // 5. Complete end-to-end checkout opener
  openCheckout: async ({
    amount,
    prefill = {},
    shippingAddress,
    onSuccess,
    onError,
    onModalClose,
  }) => {
    try {
      const isLoaded = await paymentService.loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }
      const orderData = await paymentService.createOrder(amount);
      if (!orderData || !orderData.orderId) {
        throw new Error(orderData?.message || "Failed to initiate payment order");
      }
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "ShopMart MultiVendor",
        description: "Order Checkout Payment",
        order_id: orderData.orderId,
        prefill: {
          name: prefill.name || "Customer",
          email: prefill.email || "customer@example.com",
          contact: prefill.contact || "98xxxxxxxx",
        },
        theme: {
          color: "#059669",
        },
        modal: {
          ondismiss: () => {
            if (onModalClose) onModalClose();
          },
        },
        handler: async (response) => {
          try {
            const verifyResult = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress,
              amount,
            });

            if (onSuccess) {
              onSuccess(verifyResult, response);
            }
          } catch (verifyErr) {
            if (onError) {
              onError(verifyErr?.message || "Payment verification failed");
            }
          }
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", (response) => {
        if (onError) {
          onError(response.error?.description || "Payment failed at gateway");
        }
      });
      razorpayInstance.open();
    } catch (err) {
      if (onError) {
        onError(err?.message || "Payment initialization failed");
      }
    }
  },
};

export default paymentService;
