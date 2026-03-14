import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

persistent actor {
  include MixinStorage();

  public type Category = {
    id : Text;
    name : Text;
    description : Text;
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    stock : Nat;
    category : Text;
    sizes : [Text];
    images : [Storage.ExternalBlob];
    createdAt : Int;
  };

  public type OrderItem = {
    productId : Text;
    quantity : Nat;
    size : Text;
  };

  public type Order = {
    id : Text;
    userId : Principal;
    items : [OrderItem];
    address : Text;
    phone : Text;
    paymentMethod : {
      #COD;
      #GPay;
    };
    total : Nat;
    status : Text;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    address : Text;
    phone : Text;
  };

  let categories = Map.empty<Text, Category>();
  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query func getAllCategories() : async [Category] {
    categories.values().toArray();
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public shared func createCategory(category : Category) : async () {
    categories.add(category.id, category);
  };

  public shared func updateCategory(category : Category) : async () {
    categories.add(category.id, category);
  };

  public shared func deleteCategory(id : Text) : async () {
    categories.remove(id);
  };

  public query func getProductById(productId : Text) : async ?Product {
    products.get(productId);
  };

  public shared func createProduct(product : Product) : async () {
    products.add(product.id, product);
  };

  public shared func updateProduct(product : Product) : async () {
    products.add(product.id, product);
  };

  public shared func deleteProduct(productId : Text) : async () {
    products.remove(productId);
  };

  public shared func bulkDeleteProducts(productIds : [Text]) : async () {
    for (id in productIds.values()) {
      products.remove(id);
    };
  };

  public query func getProductsByCategory(categoryId : Text) : async [Product] {
    let productArray = products.values().toArray();
    productArray.filter(func(prod) { prod.category == categoryId });
  };

  public query func getProductsSortedByPrice() : async [Product] {
    products.values().toArray();
  };

  public query func getProductsSortedByStock() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func placeOrder(items : [OrderItem], address : Text, phone : Text, paymentMethod : { #COD; #GPay }, total : Nat) : async (Text) {
    let orderId = "order-" # orders.size().toText() # "-" # (Time.now() % 1000000).toText();
    let newOrder : Order = {
      id = orderId;
      userId = caller;
      items;
      address;
      phone;
      paymentMethod;
      total;
      status = "pending";
      createdAt = Time.now();
    };
    orders.add(orderId, newOrder);
    orderId;
  };

  public shared func updateOrderStatus(orderId : Text, status : Text) : async () {
    switch (orders.get(orderId)) {
      case (?order) {
        let updatedOrder = {
          id = order.id;
          userId = order.userId;
          items = order.items;
          address = order.address;
          phone = order.phone;
          paymentMethod = order.paymentMethod;
          total = order.total;
          status;
          createdAt = order.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
      case (null) { Runtime.trap("Order not found"); };
    };
  };

  public query func getAllOrders() : async [Order] {
    orders.values().toArray();
  };

  public query ({ caller }) func getOrdersByUser() : async [Order] {
    let ordersArray = orders.values().toArray();
    ordersArray.filter(func(order) { order.userId == caller });
  };

  public shared func deleteOrder(orderId : Text) : async () {
    orders.remove(orderId);
  };

  public shared ({ caller }) func saveUserProfile(name : Text, email : Text, address : Text, phone : Text) : async () {
    let profile : UserProfile = { name; email; address; phone };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };
};
