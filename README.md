# E-Commerce Backend API

A production-grade, concurrency-safe RESTful API for managing categories, products, carts, and order checkout. Built using **Node.js**, **Express**, **MongoDB**, and **Mongoose**.

---

## Architectural Highlights

This API was engineered to resolve critical production issues regarding concurrency, data integrity, request validation, and error safety. Below are the key design choices made during development:

### 1. Concurrency-Safe Inventory Control (Atomic Decrements)
*   **The Problem**: In a standard "read-then-write" checkout sequence, multiple concurrent requests can read the same stock value before updating it. This creates race conditions that lead to overselling (negative stock) and inventory discrepancies.
*   **The Solution**: We implemented atomic updates using MongoDB's `$inc` operator in conjunction with query filtering:
    ```javascript
    const updatedProduct = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: item.quantity }, isActive: { $ne: false } },
        { $inc: { stock: -item.quantity } },
        { new: true }
    );
    ```
    This ensures that stock is only decremented if the current inventory is greater than or equal to the requested quantity. If the write fails or the product is inactive, the checkout is rejected.
*   **Transactional Integrity (Atomic Rollback)**: If a checkout involves multiple products and one product fails the stock check, the system executes an atomic rollback block, restoring stock values for all previously decremented items to ensure data consistency across the database.

### 2. Standardized Responses & Request Validation
*   **Validation**: We replaced ad-hoc controller validation blocks with declarative validation chains using `express-validator` at the route level. All inputs (like IDs and quantities) are verified before hitting the controllers.
*   **Unified Errors (`AppError` & Centered Handler)**: We introduced a custom `AppError` class extending `Error` to represent operational errors (e.g. `400 Bad Request`, `404 Not Found`).
*   **Safe DB Message Masking**: The centralized error handling middleware transforms raw, leak-prone Mongoose errors (like schema `ValidationError` or `11000` duplicate key codes) into client-friendly, sanitized JSON responses while preserving stack traces in non-production environments.

### 3. Soft Deletes & Historical Integrity
*   **The Problem**: If a product is hard-deleted from the database, all historical orders containing that product would point to a non-existent reference, causing administrative reports, revenue aggregations, and business metrics to fail or output `null`.
*   **The Solution**: We implemented the **Soft Delete** pattern on the Product schema:
    ```javascript
    isActive: { type: Boolean, default: true, select: false }
    ```
    Instead of hard-deleting, products are flagged as inactive (`isActive: false`). A pre-find query hook is applied to exclude inactive products from standard listings:
    ```javascript
    ProductSchema.pre(/^find/, function() {
        this.find({ isActive: { $ne: false } });
    });
    ```
    This hides deleted items from the storefront while preserving their records in historical order collections.

### 4. Checkout Price Snapshots
*   To prevent price manipulation and ensure cart data integrity, prices are never accepted from client request bodies.
*   At checkout, the API performs a direct database lookup to obtain product prices and generates an immutable snapshot of the product `name` and `price` inside the `Order` record. This guarantees that future price updates or product deletions never alter historical billing data.

---

## Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   MongoDB Instance (Atlas or local replica set)

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory and specify your Mongoose URI:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   NODE_ENV=development
   ```

### Seeding the Database
To reset the database and seed it with categories, slugified identifiers, and products with initialized stocks:
```bash
npm run seed
```

### Running the App
To boot the Express server:
```bash
npm start
```
The server will start executing on `http://localhost:5000`.

### Running Syntax Tests
To run syntax checks on all project assets:
```bash
npm test
```
