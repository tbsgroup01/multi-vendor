/**
 * Unified Services Barrel Export for MultiVendor Frontend
 * Allows importing services individually or collectively:
 * 
 * Example:
 * import { authService, productService, cartService, paymentService } from "../services";
 * // or
 * import paymentService from "../services/paymentService";
 */

export { default as api, getAuthToken, setAuthToken, clearAuthToken, SERVER_URL, BASE_URL, getUploadUrl } from "./api";
export { default as authService } from "./authService";
export { default as productService } from "./productService";
export { default as categoryService } from "./categoryService";
export { default as cartService } from "./cartService";
export { default as orderService } from "./orderService";
export { default as subscriptionService } from "./subscriptionService";
export { default as vendorService } from "./vendorService";
export { default as adminService } from "./adminService";
export { default as paymentService } from "./paymentService";
