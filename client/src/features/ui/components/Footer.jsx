import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Phone,
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                ShopMore
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's favorite multi-vendor marketplace. Delivering electronics, groceries, fashion, and home essentials in 10-15 minutes.
            </p>
          
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3.5 tracking-wide">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Daily Fresh & Groceries</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Mobiles & Laptops</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Fashion & Streetwear</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Beauty & Personal Care</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Home & Kitchen Appliances</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3.5 tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Help & Support</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Track Your Order</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Shipping Rates & Policies</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Sell With Us */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3.5 tracking-wide">
              For Vendors
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white transition-all font-bold"
                >
                  Become a Seller →
                </Link>
              </li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors mt-2 inline-block">Seller Dashboard</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Vendor Guidelines</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Seller Protection Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopMore Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/security" className="hover:text-slate-300 transition-colors">Security</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

