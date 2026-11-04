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
import OrdersManagement from "./features/vendor/pages/OrdersManagement";
import Payments from "./features/vendor/pages/Payments";
import Settings from "./features/vendor/pages/Settings";
import Notifications from "./features/vendor/pages/Notifications";
import AdminDashboard from "./features/admin/pages/Dashboard";
import AdminVendors from "./features/admin/pages/Vendors";
import AdminCustomers from "./features/admin/pages/Customers";
import AdminCategories from "./features/admin/pages/CategoriesManagement";
import AdminSubCategories from "./features/admin/pages/SubCategoriesManagement";
import AdminPayments from "./features/admin/pages/Payments";
import AdminSubscription from "./features/admin/pages/Subscription";
import AdminSetting from "./features/admin/pages/Setting";
import { ProtectedRoute, PublicRoute } from "./features/auth/RoleMiddleware";

export default function App() {
  const location = useLocation();
  const isVendorRoute = location.pathname.startsWith("/vendor");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = location.pathname.startsWith("/login") || location.pathname.startsWith("/register");

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F6F8FD] font-sans overflow-x-clip">
      {!isVendorRoute && !isAdminRoute && !isAuthRoute && <Navbar />}
      <div className="flex-1 w-full">
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
          <Route path="/vendor/*" element={<ProtectedRoute allowedRoles={["vendor"]}> <Dashboard /></ProtectedRoute>}/>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}