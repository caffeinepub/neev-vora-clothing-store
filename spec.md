# Meet Enterprise

## Current State
- Auth page uses Internet Identity (useInternetIdentity hook) for login
- Navbar has Crown icon linking to /admin for logged-in users
- Footer shows only copyright text and 'Meet Enterprise'
- AdminPanel checks identity from Internet Identity for access

## Requested Changes (Diff)

### Add
- Normal email/password auth: Signup (Name, Contact Number, Address, WhatsApp Number, Email, Password - all compulsory) and Login (Email + Password)
- Quick Links section in Footer: Shop All, My Orders, Support & FAQ, Admin, Contact, support@meetenterprise.com
- Local auth state management (localStorage for session)
- A 'My Orders' page showing orders for the logged-in user

### Modify
- Auth page: Replace Internet Identity with custom email/password signup/login form
- Navbar: Remove Crown icon; remove useInternetIdentity dependency; show user name when logged in with logout button
- Footer: Add Quick Links section above copyright
- AdminPanel: Remove Internet Identity dependency; keep PIN/biometric gate (no login required to attempt admin access)

### Remove
- Crown icon and useInternetIdentity hook usage from Navbar
- Internet Identity login from Auth page

## Implementation Plan
1. Create AuthContext with local user state (signup/login/logout stored in localStorage, users stored in backend)
2. Rewrite Auth.tsx with tab-based Login/Signup forms, all fields validated
3. Update Navbar.tsx: remove Crown/II imports, use AuthContext, show login/logout
4. Update Footer.tsx: add Quick Links grid with navigation links and email
5. Add MyOrders page showing orders for current user
6. Update AdminPanel.tsx: remove II dependency, keep PIN gate accessible to all
7. Update App.tsx: add /my-orders route, wrap with AuthProvider
