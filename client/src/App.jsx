import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F6F8FD] font-sans overflow-x-clip">
      <Navbar />
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
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
