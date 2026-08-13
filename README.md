# 🛒 Ipaye Cart — Multi-Vendor Electronics Marketplace

> **A modern, scalable multi-vendor e-commerce platform for buying and selling electronic gadgets, built with a focus on secure payments, vendor management, inventory control, and seamless customer experience.**

![Ipaye Cart](https://img.shields.io/badge/Ipaye%20Cart-Multi--Vendor%20E--Commerce-black?style=for-the-badge\&logo=shopify)
![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🛍️ Overview

**Ipaye Cart** is a full-stack **multi-vendor e-commerce marketplace** designed specifically for selling electronic gadgets and accessories.

The platform allows multiple vendors to create stores, list products, manage inventory, process orders, and monitor sales — while customers can browse products, add items to their cart, securely checkout, make payments through **Stripe**, or select **Cash on Delivery (COD)**.

The architecture is designed with real-world e-commerce workflows in mind, including authentication, authorization, product management, order processing, payment verification, inventory management, reviews, notifications, and administrative control.

---

## ✨ Core Features

### 👤 Customer Experience

* 🔐 User registration and authentication
* 👤 Customer profile management
* 🔎 Product search
* 🏷️ Product categories
* 🔥 Featured products
* 📊 Product filtering and sorting
* 🛒 Shopping cart
* ❤️ Wishlist
* 📦 Order management
* 🚚 Order tracking
* ⭐ Product reviews and ratings
* 📍 Shipping address management
* 🧾 Order history
* 💳 Stripe payments
* 💵 Cash on Delivery
* 🔔 Order notifications

---

### 🏪 Multi-Vendor Marketplace

Vendors can operate their own stores within the Ipaye Cart marketplace.

**Vendor capabilities include:**

* 🏪 Create and manage vendor store
* 📦 Add products
* ✏️ Update products
* 🗑️ Delete products
* 🏷️ Manage product categories
* 📊 Manage inventory
* 💰 Set product prices
* 🖼️ Upload product images
* 📋 View customer orders
* 🔄 Update order status
* 📈 View sales analytics
* 💵 Track revenue
* ⭐ Monitor product reviews
* 🏆 Vendor dashboard

---

### 🛒 Product Management

Each product can contain:

```text
Product
├── Name
├── Description
├── Price
├── Discount
├── Category
├── Brand
├── SKU
├── Images
├── Stock Quantity
├── Specifications
├── Ratings
├── Reviews
└── Vendor
```

Supported electronic categories can include:

* 💻 Laptops
* 📱 Smartphones
* 🎧 Headphones
* ⌚ Smartwatches
* 🖥️ Monitors
* ⌨️ Keyboards
* 🖱️ Mice
* 🎮 Gaming Accessories
* 📷 Cameras
* 🔊 Speakers
* 🔌 Chargers
* 🔋 Power Banks
* 🧩 Computer Accessories

---

# 💳 Payment System

Ipaye Cart supports multiple payment methods.

### 💳 Stripe

Customers can securely pay for their orders through **Stripe Checkout**.

Payment workflow:

```text
Customer
   │
   ▼
Shopping Cart
   │
   ▼
Checkout
   │
   ▼
Stripe Checkout
   │
   ▼
Payment Confirmation
   │
   ▼
Webhook Verification
   │
   ▼
Create / Confirm Order
   │
   ▼
Update Inventory
```

Important payment responsibilities include:

* Stripe Checkout integration
* Payment session creation
* Payment status verification
* Webhook handling
* Failed payment handling
* Successful payment handling
* Order-payment association
* Transaction records
* Idempotent payment processing

---

### 💵 Cash on Delivery

Customers can also select:

> **Cash on Delivery (COD)**

COD workflow:

```text
Customer
   │
   ▼
Place Order
   │
   ▼
COD Selected
   │
   ▼
Order Confirmed
   │
   ▼
Vendor Processes Order
   │
   ▼
Order Shipped
   │
   ▼
Customer Receives Order
   │
   ▼
Payment Collected
   │
   ▼
Order Completed
```

---

# 📦 Order Management

Orders follow a structured lifecycle:

```text
PENDING
   ↓
CONFIRMED
   ↓
PROCESSING
   ↓
SHIPPED
   ↓
DELIVERED
   ↓
COMPLETED
```

Possible exception states:

```text
CANCELLED
REFUNDED
PAYMENT_FAILED
```

Customers can view:

* Order number
* Products purchased
* Quantity
* Price
* Shipping information
* Payment method
* Payment status
* Order status
* Delivery status
* Order date

---

# 📊 Vendor Dashboard

Each vendor receives a dedicated dashboard.

```text
┌─────────────────────────────────────────────┐
│              VENDOR DASHBOARD               │
├─────────────────────────────────────────────┤
│                                             │
│  💰 Revenue          📦 Orders              │
│  $24,850             184                    │
│                                             │
│  🛍️ Products         📈 Sales               │
│  126                 +18.5%                 │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Recent Orders                              │
│  ─────────────────────────────────────────  │
│  #IPY-10234     Processing                  │
│  #IPY-10235     Shipped                     │
│  #IPY-10236     Delivered                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

# 👑 Admin Dashboard

The administrator has complete control over the marketplace.

### Admin capabilities

* 👥 Manage users
* 🏪 Manage vendors
* 📦 Manage products
* 🗂️ Manage categories
* 🛒 Manage orders
* 💳 Monitor payments
* 💰 Monitor transactions
* ⭐ Moderate reviews
* 🚫 Suspend vendors
* 📊 Platform analytics
* 🔐 Role management
* ⚙️ Platform configuration

---

# 🔐 Authentication & Authorization

Ipaye Cart uses role-based access control.

### Roles

```text
USER
 │
 ├── Customer
 │
 └── Vendor

ADMIN
```

Example permissions:

| Feature            | Customer |  Vendor | Admin |
| ------------------ | :------: | :-----: | :---: |
| Browse Products    |     ✅    |    ✅    |   ✅   |
| Add to Cart        |     ✅    |    ✅    |   ✅   |
| Place Orders       |     ✅    |    ✅    |   ✅   |
| Manage Products    |     ❌    |    ✅    |   ✅   |
| Manage Store       |     ❌    |    ✅    |   ✅   |
| View Sales         |     ❌    |    ✅    |   ✅   |
| Manage Vendors     |     ❌    |    ❌    |   ✅   |
| Manage Users       |     ❌    |    ❌    |   ✅   |
| Platform Analytics |     ❌    | Limited |   ✅   |

---

# 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │    Customers     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Web Frontend   │
                    │                  │
                    │ React / Next.js  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    REST API      │
                    │                  │
                    │ Authentication   │
                    │ Products         │
                    │ Cart             │
                    │ Orders           │
                    │ Vendors          │
                    │ Payments         │
                    └────────┬─────────┘
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
       ┌──────────┐    ┌──────────┐    ┌──────────┐
       │ Database │    │  Stripe  │    │ Storage  │
       │          │    │ Payments │    │  Images  │
       └──────────┘    └──────────┘    └──────────┘
```

---

# 🧰 Tech Stack

## Frontend

* ⚛️ React / Next.js
* 📘 TypeScript
* 🎨 Tailwind CSS
* 🔄 React Query
* 🧭 React Router
* 📝 Form validation
* 📱 Responsive UI

## Backend

Depending on implementation:

* ☕ Java 21
* 🌱 Spring Boot
* 🗄️ Spring Data JPA
* 🔐 Spring Security
* 🔑 JWT Authentication
* 📡 REST APIs
* 🧩 Hibernate
* 🧪 JUnit / Mockito

## Database

* 🐘 PostgreSQL
* 🗃️ Redis — caching/session support where applicable

## Payments

* 💳 Stripe
* 💵 Cash on Delivery

## Infrastructure

* 🐳 Docker
* ☁️ Cloud deployment
* 🔄 CI/CD
* 🔐 Environment-based configuration

---

# 🗂️ Project Structure

```text
ipaye-cart/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/ipaye/cart/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── exception/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       ├── service/
│   │   │   │       └── payment/
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

# 🗃️ Core Domain Model

```text
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Customer       Vendor
 │               │
 │               ▼
 │             Store
 │               │
 │               ▼
 │            Products
 │               │
 └───────┐       │
         ▼       │
       Cart      │
         │       │
         ▼       │
       Order ◄───┘
         │
         ▼
      Payment
         │
         ▼
     Transaction
```

### Main entities

```text
User
Vendor
Store
Product
Category
ProductImage
Cart
CartItem
Order
OrderItem
Payment
Transaction
Address
Review
Wishlist
Notification
```

---

# 🔌 REST API

Example API structure:

### Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Products

```http
GET    /api/v1/products
GET    /api/v1/products/{id}
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
```

### Cart

```http
GET    /api/v1/cart
POST   /api/v1/cart/items
PUT    /api/v1/cart/items/{id}
DELETE /api/v1/cart/items/{id}
```

### Orders

```http
POST /api/v1/orders
GET  /api/v1/orders
GET  /api/v1/orders/{id}
PUT  /api/v1/orders/{id}/status
```

### Payments

```http
POST /api/v1/payments/stripe/checkout
POST /api/v1/payments/cod
POST /api/v1/payments/webhook
```

### Vendors

```http
POST /api/v1/vendors
GET  /api/v1/vendors/{id}
GET  /api/v1/vendors/{id}/products
GET  /api/v1/vendors/{id}/orders
GET  /api/v1/vendors/{id}/analytics
```

---

# 🔎 Search & Discovery

Ipaye Cart provides powerful product discovery capabilities.

Customers can search by:

```text
Product Name
Brand
Category
Price Range
Rating
Availability
Vendor
```

Example:

```text
Search: "Gaming Laptop"

Filters:
├── Price
├── Brand
├── RAM
├── Storage
├── Processor
├── GPU
├── Rating
└── Availability
```

---

# ⭐ Reviews & Ratings

Customers can review products after purchasing.

Features include:

* ⭐ 1–5 star ratings
* 📝 Written reviews
* 🖼️ Optional review images
* 👍 Helpful reviews
* 🚫 Review moderation
* 📊 Average product rating

---

# 📦 Inventory Management

The inventory system helps vendors maintain accurate stock levels.

```text
Product Added
     │
     ▼
Stock = 50
     │
     ▼
Customer Orders 2
     │
     ▼
Stock = 48
     │
     ▼
Low Stock Alert
     │
     ▼
Vendor Restocks
```

Features:

* Stock tracking
* SKU management
* Low-stock alerts
* Inventory adjustments
* Out-of-stock handling
* Automatic stock reduction after confirmed orders

---

# 🔔 Notifications

Users can receive notifications for:

* ✅ Order confirmation
* 💳 Payment confirmation
* 📦 Order shipped
* 🚚 Order delivered
* ❌ Order cancellation
* 💰 Payment failure
* ⭐ Review activity
* 📦 Low inventory

---

# 🛡️ Security

Security is treated as a first-class concern.

### Implemented / planned security measures

* 🔐 JWT authentication
* 🔑 Password hashing
* 👮 Role-based authorization
* 🛡️ API endpoint protection
* 🔒 HTTPS in production
* 🧹 Input validation
* 🚫 Rate limiting
* 🔐 Secure environment variables
* 💳 Stripe webhook verification
* 🛡️ CORS configuration
* 🧾 Audit logging

> **Never store Stripe card details directly in the application database.**

---

# 🧪 Testing

Testing strategy covers the major business workflows.

```text
Unit Tests
    │
    ├── Authentication
    ├── Product Service
    ├── Cart Service
    ├── Order Service
    ├── Payment Service
    └── Vendor Service

Integration Tests
    │
    ├── Database
    ├── Authentication
    ├── Orders
    └── Payments

End-to-End Tests
    │
    └── Customer → Checkout → Payment → Order
```

---

# 🐳 Docker

The project can be containerized for consistent development and deployment.

```bash
git clone https://github.com/yourusername/ipaye-cart.git

cd ipaye-cart

docker compose up --build
```

---

# ⚙️ Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL=

# Authentication
JWT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Application
APP_URL=
FRONTEND_URL=

# Storage
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

> Never commit `.env` files or secret API keys to GitHub.

---

# 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ipaye-cart.git

cd ipaye-cart
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Configure your database, authentication, and Stripe credentials.

### 3. Start the backend

```bash
cd backend

./mvnw spring-boot:run
```

### 4. Start the frontend

```bash
cd frontend

npm install
npm run dev
```

### 5. Open the application

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:8080
```

---

# 💳 Stripe Development

For local development, Stripe webhooks can be forwarded to the backend using the Stripe CLI.

Example:

```bash
stripe listen --forward-to localhost:8080/api/v1/payments/webhook
```

Use Stripe's test environment when developing payment functionality.

---

# 📈 Future Roadmap

### Phase 1 — Foundation

* [x] Project architecture
* [ ] Authentication
* [ ] Product catalog
* [ ] Categories
* [ ] Shopping cart

### Phase 2 — Marketplace

* [ ] Vendor registration
* [ ] Vendor stores
* [ ] Vendor dashboard
* [ ] Inventory management
* [ ] Vendor analytics

### Phase 3 — Payments

* [ ] Stripe Checkout
* [ ] Stripe webhooks
* [ ] Payment verification
* [ ] Cash on Delivery
* [ ] Transaction history

### Phase 4 — Customer Experience

* [ ] Wishlist
* [ ] Reviews
* [ ] Product recommendations
* [ ] Order tracking
* [ ] Notifications

### Phase 5 — Scale

* [ ] Redis caching
* [ ] Search optimization
* [ ] Background jobs
* [ ] Event-driven architecture
* [ ] Observability
* [ ] CI/CD
* [ ] Horizontal scaling

---

# 📊 Engineering Highlights

Ipaye Cart demonstrates practical implementation of:

| Engineering Area | Implementation             |
| ---------------- | -------------------------- |
| Authentication   | JWT + Spring Security      |
| Authorization    | RBAC                       |
| Payments         | Stripe + COD               |
| Database         | PostgreSQL                 |
| ORM              | Hibernate / JPA            |
| API              | REST                       |
| Frontend         | React / Next.js            |
| Styling          | Tailwind CSS               |
| Validation       | DTO + Bean Validation      |
| Testing          | JUnit + Mockito            |
| Containerization | Docker                     |
| Caching          | Redis                      |
| Architecture     | Layered / Modular          |
| Security         | JWT + Webhook Verification |
| Deployment       | Cloud + CI/CD              |

---

# 🎯 What This Project Demonstrates

**Ipaye Cart** is more than a basic CRUD application.

It demonstrates the ability to design and implement real-world e-commerce workflows involving:

* 🏗️ Scalable application architecture
* 🔐 Secure authentication and authorization
* 💳 Third-party payment integration
* 🛒 Complex shopping-cart workflows
* 📦 Inventory management
* 🏪 Multi-tenant/vendor functionality
* 📊 Business analytics
* 🗄️ Relational database modeling
* 🔄 Transaction management
* 🧪 Automated testing
* 🐳 Containerized development
* 🚀 Production-oriented deployment

---

# 👨‍💻 Author

### **Ipaye Tunde**

Software Engineer focused on building **scalable backend systems, full-stack applications, APIs, payment systems, and business-oriented software solutions.**

💻 **GitHub:** `@engripaye`

---

# 📄 License

This project is licensed under the **MIT License**.

---

## ⭐ Support the Project

If you find **Ipaye Cart** useful or interesting:

⭐ Star the repository
🍴 Fork the project
🐛 Report issues
💡 Suggest improvements
🤝 Contribute to the project

---

<div align="center">

### 🛒 **Ipaye Cart**

**Buy Smart. Sell Better.**

*Modern Multi-Vendor Electronics Marketplace*

⭐ **Built with scalability, security, and real-world e-commerce workflows in mind.**

</div>
