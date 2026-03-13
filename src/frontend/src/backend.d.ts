import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Category {
    id: string;
    name: string;
    description: string;
}
export interface OrderItem {
    size: string;
    productId: string;
    quantity: bigint;
}
export interface Order {
    id: string;
    status: string;
    total: bigint;
    paymentMethod: Variant_COD_GPay;
    userId: Principal;
    createdAt: bigint;
    address: string;
    phone: string;
    items: Array<OrderItem>;
}
export interface Product {
    id: string;
    name: string;
    createdAt: bigint;
    description: string;
    sizes: Array<string>;
    stock: bigint;
    category: string;
    price: bigint;
    images: Array<ExternalBlob>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_COD_GPay {
    COD = "COD",
    GPay = "GPay"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkDeleteProducts(productIds: Array<string>): Promise<void>;
    createCategory(category: Category): Promise<void>;
    createProduct(product: Product): Promise<void>;
    deleteCategory(id: string): Promise<void>;
    deleteOrder(orderId: string): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getAllCategories(): Promise<Array<Category>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserRole(): Promise<UserRole>;
    getOrdersByUser(): Promise<Array<Order>>;
    getProductById(productId: string): Promise<Product | null>;
    getProductsByCategory(categoryId: string): Promise<Array<Product>>;
    getProductsSortedByPrice(): Promise<Array<Product>>;
    getProductsSortedByStock(): Promise<Array<Product>>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(items: Array<OrderItem>, address: string, phone: string, paymentMethod: Variant_COD_GPay, total: bigint): Promise<string>;
    reorder(orderId: string): Promise<void>;
    updateCategory(category: Category): Promise<void>;
    updateOrderAddress(orderId: string, address: string, phone: string): Promise<void>;
    updateOrderPayment(orderId: string, paymentMethod: Variant_COD_GPay): Promise<void>;
    updateOrderStatus(orderId: string, status: string): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
