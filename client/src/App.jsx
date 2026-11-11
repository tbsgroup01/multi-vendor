import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./features/ui/pages/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import CategoryDetails from "./features/ui/pages/CategoryDetails";
import ProductDetailspage from "./features/ui/pages/ProductDetailspage";
import Shop from "./features/ui/pages/Shop";
import Cart from "./features/ui/pages/Cart";
import MyOrders from "./features/ui/pages/MyOrders";
import AddAddress from "./features/ui/components/AddAddress";
import Navbar from "./features/ui/components/Navbar";
import { ProtectedRoute, PublicRoute } from "./features/auth/RoleMiddleware";
import { CartProvider } from "./context/CartContext";

// Lazy-loaded routes for code splitting and instant page refreshes
const PrivacyPolicies = lazy(() => import("./features/ui/pages/PrivacyPolicies"));
const TermsConditions = lazy(() => import("./features/ui/pages/TermsConditions"));

// Vendor Routes (Lazy loaded)
const Dashboard = lazy(() => import("./features/vendor/pages/Dashboard"));
const ProductsManagement = lazy(() => import("./features/vendor/pages/ProductsManagement"));
const OrdersManagement = lazy(() => import("./features/vendor/pages/OrdersManagement"));
const Payments = lazy(() => import("./features/vendor/pages/Payments"));
const Settings = lazy(() => import("./features/vendor/pages/Settings"));
const Notifications = lazy(() => import("./features/vendor/pages/Notifications"));
const VendorPlans = lazy(() => import("./features/vendor/pages/Plans"));

// Admin Routes (Lazy loaded)
const AdminDashboard = lazy(() => import("./features/admin/pages/Dashboard"));
const AdminVendors = lazy(() => import("./features/admin/pages/Vendors"));
const AdminCustomers = lazy(() => import("./features/admin/pages/Customers"));
const AdminCategories = lazy(() => import("./features/admin/pages/CategoriesManagement"));
const AdminSubCategories = lazy(() => import("./features/admin/pages/SubCategoriesManagement"));
const AdminPayments = lazy(() => import("./features/admin/pages/Payments"));
const AdminSubscription = lazy(() => import("./features/admin/pages/Subscription"));
const AdminSetting = lazy(() => import("./features/admin/pages/Setting"));

const PageLoader = () => (
  <div className="min-h-[50vh] w-full flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
  </div>
);

export default function App() {
  const location = useLocation();
  const isVendorRoute = location.pathname.startsWith("/vendor");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = location.pathname.startsWith("/login") || location.pathname.startsWith("/register");

  return (
    <CartProvider>
      <div className="min-h-screen w-full flex flex-col bg-[#F6F8FD] font-sans overflow-x-clip">
        {!isVendorRoute && !isAdminRoute && !isAuthRoute && <Navbar />}
        <div className="flex-1 w-full">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Storefront Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/addresses" element={<MyOrders />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/address/add" element={<AddAddress />} />
          <Route path="/profile" element={<MyOrders />} />
          <Route path="/category/:slug" element={<CategoryDetails />} />
          <Route path="/category" element={<CategoryDetails />} />
          <Route path="/product/:id" element={<ProductDetailspage />} />
          <Route path="/privacy" element={<PrivacyPolicies />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/plans" element={<ProtectedRoute allowedRoles={["vendor"]}> <VendorPlans /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />

          {/* Login Route (Redirects already logged in users to their role dashboard) */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>

          {/* Admin Routes - Protected for role: 'admin' */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminDashboard /> </ProtectedRoute>}/>
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminDashboard /> </ProtectedRoute>}/>
          <Route path="/admin/vendors" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminVendors /></ProtectedRoute>}/>
          <Route path="/admin/customers" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminCustomers /></ProtectedRoute>}/>
          <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminCategories /></ProtectedRoute>}/>
          <Route path="/admin/sub-categories" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminSubCategories /></ProtectedRoute>}/>
          <Route path="/admin/subcategories" element={<Navigate to="/admin/sub-categories" replace />} />
          <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminPayments /></ProtectedRoute> }/>
          <Route path="/admin/subscriptions" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminSubscription /></ProtectedRoute>}/>
          <Route path="/admin/subscription" element={<Navigate to="/admin/subscriptions" replace />} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminSetting /></ProtectedRoute>}/>
          <Route path="/admin/setting" element={<Navigate to="/admin/settings" replace />} />
          <Route path="/admin/*" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminDashboard /></ProtectedRoute>}/>

          {/* Vendor Routes - Protected for role: 'vendor' */}
          <Route path="/vendor" element={<ProtectedRoute allowedRoles={["vendor"]}> <Dashboard /></ProtectedRoute>}/>
          <Route path="/vendor/dashboard" element={<ProtectedRoute allowedRoles={["vendor"]}> <Dashboard /></ProtectedRoute>}/>
          <Route path="/vendor/products" element={<ProtectedRoute allowedRoles={["vendor"]}> <ProductsManagement /></ProtectedRoute>}/>
          <Route path="/vendor/orders" element={<ProtectedRoute allowedRoles={["vendor"]}> <OrdersManagement /></ProtectedRoute>}/>
          <Route path="/vendor/payments" element={<ProtectedRoute allowedRoles={["vendor"]}> <Payments /></ProtectedRoute>}/>
          <Route path="/vendor/settings" element={<ProtectedRoute allowedRoles={["vendor"]}> <Settings /></ProtectedRoute>}/>
          <Route path="/vendor/notifications" element={<ProtectedRoute allowedRoles={["vendor"]}> <Notifications /></ProtectedRoute>}/>
          <Route path="/vendor/plans" element={<ProtectedRoute allowedRoles={["vendor"]}> <VendorPlans /></ProtectedRoute>}/>
          <Route path="/vendor/subscription" element={<Navigate to="/vendor/plans" replace />} />
          <Route path="/vendor/subscriptions" element={<Navigate to="/vendor/plans" replace />} />
          <Route path="/vendor/*" element={<ProtectedRoute allowedRoles={["vendor"]}> <Dashboard /></ProtectedRoute>}/>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </div>
    </div>
    </CartProvider>
  );
}