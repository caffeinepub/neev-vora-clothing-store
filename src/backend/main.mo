import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
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
    category : Text;
    sizes : [Text];
    image : Storage.ExternalBlob;
    stock : Nat;
    createdAt : Int;
  };

  public type OrderItem = {
    productId : Text;
    size : Text;
    quantity : Nat;
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
    phone : Text;
    address : Text;
  };

  let categories = Map.empty<Text, Category>();
  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return null;
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      return null;
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func createCategory(category : Category) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { return };
    categories.add(category.id, category);
  };

  public shared ({ caller }) func updateCategory(category : Category) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { return };
    categories.add(category.id, category);
  };

  public shared ({ caller }) func deleteCategory(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { return };
    categories.remove(id);
  };

  public query func getAllCategories() : async [Category] {
    categories.values().toArray();
  };

  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { return };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { return };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { return };
    products.remove(id);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProductsByCategory(categoryId : Text) : async [Product] {
    let filteredProducts = products.entries().toArray().filter(
      func((_, prod)) {
        prod.category == categoryId;
      }
    ).map(
      func((_, prod)) { prod }
    );
    filteredProducts;
  };

  public shared ({ caller }) func bulkDeleteProducts(ids : [Text]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { return };
    for (id in ids.values()) {
      products.remove(id);
    };
  };

  public query func getProductById(id : Text) : async ?Product {
    products.get(id);
  };

  public query func getProductsSortedByPrice() : async [(Text, Product)] {
    products.toArray();
  };

  public query func getProductsSortedByStock() : async [(Text, Product)] {
    products.toArray();
  };

  public shared ({ caller }) func placeOrder(items : [OrderItem], address : Text, phone : Text, paymentMethod : { #COD; #GPay }, total : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { return };
    let orderId = "order-" # orders.size().toText();
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
  };

  public query ({ caller }) func getOrdersByUser() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    let filteredOrders = orders.entries().toArray().filter(
      func((_, order)) {
        order.userId == caller
      }
    ).map(
      func((_, order)) {
        order
      }
    );
    filteredOrders;
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    let ordersArray = orders.toArray();
    ordersArray.map(func((_, v)) { v });
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { return };
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

  public shared ({ caller }) func reorder(orderId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { return };
    switch (orders.get(orderId)) {
      case (?order) {
        let newOrderId = "order-" # Time.now().toText();
        let newOrder : Order = {
          id = newOrderId;
          userId = order.userId;
          items = order.items;
          address = order.address;
          phone = order.phone;
          paymentMethod = order.paymentMethod;
          total = order.total;
          status = "pending";
          createdAt = Time.now();
        };
        orders.add(newOrderId, newOrder);
      };
      case (null) { Runtime.trap("Order not found"); };
    };
  };

  public shared ({ caller }) func updateOrderAddress(orderId : Text, address : Text, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { return };
    switch (orders.get(orderId)) {
      case (?order) {
        let updatedOrder = {
          id = order.id;
          userId = order.userId;
          items = order.items;
          address;
          phone;
          paymentMethod = order.paymentMethod;
          total = order.total;
          status = order.status;
          createdAt = order.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
      case (null) { Runtime.trap("Order not found"); };
    };
  };

  public shared ({ caller }) func updateOrderPayment(orderId : Text, paymentMethod : { #COD; #GPay }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { return };
    switch (orders.get(orderId)) {
      case (?order) {
        let updatedOrder = {
          id = order.id;
          userId = order.userId;
          items = order.items;
          address = order.address;
          phone = order.phone;
          paymentMethod;
          total = order.total;
          status = order.status;
          createdAt = order.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
      case (null) { Runtime.trap("Order not found"); };
    };
  };
};
