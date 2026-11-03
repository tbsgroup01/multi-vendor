/**
 * Unified Services Barrel Export for MultiVendor Frontend
 * Allows importing services individually or collectively:
 * 
 * Example:
 * import { authService, productService, cartService } from "../services";
 * // or
 * import productService from "../services/productService";
 */

export { default as api, getAuthToken, setAuthToken, clearAuthToken } from "./api";
export { default as authService } from "./authService";
export { default as productService } from "./productService";
export { default as categoryService } from "./categoryService";
export { default as cartService } from "./cartService";
export { default as orderService } from "./orderService";
export { default as subscriptionService } from "./subscriptionService";
export { default as vendorService } from "./vendorService";
export { default as adminService } from "./adminService";

