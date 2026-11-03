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
import PrivacyPolicies from "./features/ui/pages/PrivacyPolicies";
import TermsConditions from "./features/ui/pages/TermsConditions";
import Navbar from "./features/ui/components/Navbar";
import Dashboard from "./features/vendor/pages/Dashboard";
import ProductsManagement from "./features/vendor/pages/ProductsManagement";
// import CategoriesManagement from "./features/vendor/pages/CategoriesManagement";
import OrdersManagement from "./features/vendor/pages/OrdersManagement";
import Payments from "./features/vendor/pages/Payments";
import Settings from "./features/vendor/pages/Settings";
import Notifications from "./features/vendor/pages/Notifications";
import AdminDashboard from "./features/admin/pages/Dashboard";
import AdminVendors from "./features/admin/pages/Vendors";
import AdminCustomers from "./features/admin/pages/Customers";
import AdminPayments from "./features/admin/pages/Payments";
import AdminSubscription from "./features/admin/pages/Subscription";
import AdminSetting from "./features/admin/pages/Setting";
import { PublicRoute } from "./features/auth/RoleMiddleware";
import CategoriesManagement from "./features/vendor/pages/CategoriesManagement";

export default function App() {
  const location = useLocation();
  const isVendorRoute = location.pathname.startsWith("/vendor");
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F6F8FD] font-sans overflow-x-clip">
      {!isVendorRoute && !isAdminRoute && <Navbar />}
      <div className="flex-1 w-full">
        <Routes>
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
          <Route path="/register" element={<Register />} />

          {/* Public Route (Redirects logged in admin/vendor to their respective dashboards) */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/subscription" element={<AdminSubscription />} />
          <Route path="/admin/subscriptions" element={<AdminSubscription />} />
          <Route path="/admin/setting" element={<AdminSetting />} />
          <Route path="/admin/settings" element={<AdminSetting />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<CategoriesManagement />} />

          <Route path="/vendor" element={<Dashboard />} />
          <Route path="/vendor/dashboard" element={<Dashboard />} />
          <Route path="/vendor/products" element={<ProductsManagement />} />
          <Route path="/vendor/orders" element={<OrdersManagement />} />
          <Route path="/vendor/payments" element={<Payments />} />
          <Route path="/vendor/settings" element={<Settings />} />
          <Route path="/vendor/notifications" element={<Notifications />} />
          <Route path="/vendor/*" element={<Dashboard />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
