# Meet Enterprise

## Current State
- Order confirmation page shows a Digital Lucky Voucher Card with a random voucher code (ME-XXXXXXXX) for all orders regardless of total.
- Admin panel has tabs: Dashboard, Products, Categories, Orders. Orders tab shows Order ID, Items, Total, Payment, Status, Actions.
- Admin panel has no Users tab.
- Backend has no `getAllUsers` method; UserProfile stores name, email, address, phone. Whatsapp is collected in signup form but not stored in backend.
- Voucher code is generated randomly on the frontend on page load.

## Requested Changes (Diff)

### Add
- A reminder notice on the order confirmation page for orders below ₹1500: show a gold-styled banner like "Your order qualifies! Spend ₹1,500 or more to earn a Lucky Voucher on your next order." — the order still goes through normally.
- A "Users" tab in the admin panel showing all registered users with Name, Phone Number, and WhatsApp Number.
- Voucher code shown inside each order row/detail in the admin panel Orders tab (only for orders ≥ ₹1500).

### Modify
- OrderConfirmation page: only show the Digital Lucky Voucher Card if order total ≥ ₹1500. For orders below ₹1500, show the order confirmation with a reminder: "Shop for ₹1,500 or more to earn a Lucky Voucher on your next order!"
- Voucher code generation: make it deterministic based on the order ID (so admin and customer always see the same code). Use a hash of the order ID to generate the ME-XXXXXXXX code consistently.
- Auth signup: save user data (name, contactNumber, whatsappNumber) to localStorage under key `me_users` (an array) so admin panel can display all registered users. Each entry: `{name, email, contactNumber, whatsappNumber, registeredAt}`.
- Admin panel Tab type: add "users" tab.

### Remove
- Nothing removed.

## Implementation Plan
1. **OrderConfirmation.tsx**: 
   - Read `me_last_order_total` from localStorage and compute totalINR.
   - If totalINR >= 1500: show full voucher card (existing behavior), generating code deterministically from order ID.
   - If totalINR < 1500: show a simplified confirmation page with a gold reminder banner: "🎫 Shop for ₹1,500 or more to earn a Lucky Voucher on your next order!"
   - Deterministic voucher: hash the order ID string into 8 alphanumeric chars (simple char-code based hash).

2. **Auth.tsx**: During signup success, append user data `{name, email, contactNumber, whatsappNumber, registeredAt: Date.now()}` to `me_users` array in localStorage.

3. **AdminPanel.tsx**:
   - Add `"users"` to the Tab type and tabs list.
   - In Users tab: read `me_users` from localStorage and display a table with columns: Name, Phone Number, WhatsApp Number, Email.
   - In Orders tab: for each order, if `Number(o.total)/100 >= 1500`, show the deterministic voucher code (same algorithm as OrderConfirmation) in the order row.
   - Add a "Voucher" column to the orders table.
