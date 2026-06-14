# SmartCafe — Missing Features + Full Development Prompt

## What Is Currently Under Development (Based On Your Screen Recording)

Your project already has:

* Customer QR menu page
* Category filters
* Food cards
* Cart functionality
* Admin dashboard structure
* Basic UI design

But these sections/features are still incomplete or under development:

### 1. Menu Management

Currently showing:

> "This section is under development"

Needs:

* Add/Edit/Delete menu items
* Category management
* Upload food images
* Toggle item availability
* Price editing
* Search/filter menu items
* Popular items tagging

---

### 2. Table Management System

Missing:

* Live table occupancy status
* Table assignment tracking
* QR-table linking
* Free/Occupied indicators
* Reset table button

Needs:

* Green = Available
* Red = Occupied
* Auto-occupy when customer scans QR
* Waiter/Cashier can mark table as free after customer leaves

---

### 3. Authentication System

Currently missing separate login systems.

Need role-based authentication for:

### Admin Login

Access:

* Full dashboard
* Menu management
* Analytics
* Staff management
* Table management
* Orders overview

### Kitchen Login

Access:

* Incoming orders
* Order preparation status
* Mark order as:

  * Preparing
  * Ready
  * Delivered

### Cashier Login

Access:

* Billing
* Payment verification
* Table release button
* Order history
* Generate invoice

### Customer

NO login required.
Only:

* Scan QR
* Enter name
* Order food

---

### 4. Customer Verification Flow

Missing important flow.

Required flow:

1. Customer scans QR from table.
2. QR contains table number.
3. Before entering menu:

   * Ask customer name.
4. Save:

   * customerName
   * tableNumber
   * sessionTime
5. Mark table as OCCUPIED automatically.
6. Customer enters ordering page.

Example:
Table 5 QR → opens:
`/table/5`

Popup:
"Enter Your Name"

After submit:

* Table 5 becomes occupied.
* Orders are linked to that customer.

---

### 5. Order Lifecycle System

Needs complete realtime workflow:

Customer places order
↓
Kitchen receives order instantly
↓
Kitchen marks preparing
↓
Kitchen marks ready
↓
Waiter delivers
↓
Cashier completes payment
↓
Cashier clicks:
"Mark Table Free"
↓
Table becomes available again

---

### 6. Realtime Features Missing

Need Socket.IO realtime updates:

* New order notifications
* Live kitchen updates
* Table occupancy updates
* Order status changes
* Realtime billing updates

---

### 7. Waiter Panel Missing

Add waiter/staff dashboard:

Features:

* View occupied tables
* View active orders
* Deliver order button
* Call waiter notifications
* Mark table cleaned

---

### 8. Billing System Missing

Need:

* GST calculations
* Generate invoice
* Print bill
* Razorpay integration
* UPI QR payment
* Payment success tracking

---

### 9. Analytics Dashboard Missing

Admin analytics:

* Total sales
* Daily revenue
* Top selling items
* Occupied tables count
* Active orders
* Kitchen load
* Customer trends

---

# COMPLETE DEVELOPMENT PROMPT

Build a complete production-level SmartCafe QR Ordering System with modern UI, realtime functionality, authentication, table management, kitchen workflow, cashier system, and QR ordering.

TECH STACK:
Frontend:

* React.js
* Tailwind CSS
* Framer Motion
* Axios
* React Router DOM
* Socket.IO Client
* React Query
* Zustand or Context API

Backend:

* Node.js
* Express.js
* Socket.IO
* JWT Authentication
* Multer image uploads

Database:

* MongoDB + Mongoose

Payments:

* Razorpay integration
* UPI support

MAIN FEATURES:

1. CUSTOMER QR ORDERING FLOW

* Every table has a unique QR code.
* QR opens route:
  /table/:tableNumber

Before entering menu:

* Show beautiful modal/page asking:
  "Enter Your Name"

After entering name:

* Save customer session.
* Mark table as OCCUPIED automatically.
* Store:

  * customer name
  * table number
  * session id
  * timestamp

Then redirect customer to menu.

Customer Features:

* Browse menu
* Search items
* Filter categories
* Add to cart
* Place order
* View live order status
* Call waiter button
* Bill request button

2. TABLE MANAGEMENT SYSTEM
   Create realtime table management.

Table states:

* Available
* Occupied
* Cleaning
* Reserved

Features:

* Auto occupy table after QR verification.
* Realtime status updates.
* Admin/Waiter/Cashier can manage status.

IMPORTANT:
Cashier and Waiter dashboard must have button:
"Mark Table Free"

When clicked:

* End current session.
* Clear active cart/orders.
* Change table status to AVAILABLE.
* Ready for next customer.

UI:

* Green tables = Available
* Red tables = Occupied
* Yellow = Cleaning

3. ROLE-BASED AUTHENTICATION
   Create separate login pages.

A. ADMIN LOGIN
Route:
/admin/login

Access:

* Full dashboard
* Menu management
* Analytics
* Staff management
* Orders
* Tables
* QR generation

B. KITCHEN LOGIN
Route:
/kitchen/login

Access:

* Incoming orders
* Live order queue
* Update statuses:

  * Preparing
  * Ready
  * Completed

Realtime kitchen display.

C. CASHIER LOGIN
Route:
/cashier/login

Access:

* Billing
* Payment processing
* Invoice generation
* Table release button
* Order history

D. WAITER LOGIN
Route:
/waiter/login

Access:

* Active tables
* Delivery status
* Customer calls
* Cleaning status

E. CUSTOMER
NO LOGIN REQUIRED.
Only QR + name verification.

4. MENU MANAGEMENT
   Admin can:

* Add/Edit/Delete menu items
* Upload images
* Add categories
* Toggle availability
* Set prices
* Mark popular items
* Add preparation time

5. REALTIME ORDER SYSTEM
   Use Socket.IO.

Flow:
Customer places order
↓
Kitchen receives instantly
↓
Kitchen updates status
↓
Customer sees live updates
↓
Cashier sees billing updates

6. DASHBOARD UI
   Create modern premium cafe dashboard.

Use:

* Glassmorphism
* Soft shadows
* Rounded cards
* Smooth animations
* Responsive layouts

Dashboard Widgets:

* Total Orders
* Active Tables
* Revenue
* Pending Orders
* Kitchen Queue

7. QR SYSTEM
   Generate QR for every table.

Example:
Table 1 → QR → /table/1
Table 2 → QR → /table/2

Admin can:

* Download QR
* Print QR
* Regenerate QR

8. DATABASE STRUCTURE
   Collections:

* users
* tables
* menuItems
* orders
* sessions
* payments
* categories

9. SECURITY

* JWT auth
* Protected routes
* Role middleware
* Secure APIs
* Validation
* Rate limiting

10. EXTRA FEATURES

* Dark/light mode
* Order notifications
* Sound alerts in kitchen
* Mobile responsive
* PWA support
* Offline caching
* Loading skeletons
* Toast notifications
* Admin analytics charts

11. DESIGN REQUIREMENTS
    Theme:

* Premium cafe brown + cream colors
* Minimal luxury aesthetic
* Smooth transitions
* Modern card UI
* Responsive mobile-first design

12. DEPLOYMENT READY
    Frontend:

* Vercel ready

Backend:

* Render/Railway ready

Environment variables setup.

13. FILE STRUCTURE
    Create proper scalable architecture:

* components
* pages
* hooks
* services
* routes
* middleware
* models
* sockets
* context/store

14. BUILD COMPLETE WORKING SYSTEM
    Do NOT create placeholders.
    Do NOT leave pages under development.
    Create full functional implementations.
    Include:

* backend APIs
* frontend pages
* realtime sockets
* database models
* authentication
* protected routes
* UI components
* state management
* payment integration
* QR generation
* image upload system
* production-level code
