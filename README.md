# Campus Corner — Campus Convenience Store POS

IT 415 Midterm Practical Examination · Scenario 5

A cash-only point of sale made with Next.js App Router, TypeScript, Tailwind CSS, and React state. No database, authentication, inventory, API routes, or payment gateway.

## Run locally

Requires Node.js 20.9 or later and npm.

~~~bash
npm install
npm run dev
~~~

Open http://localhost:3000. The first screen offers **Dine In** and **Take Out**.

~~~bash
npm run lint
npm run build
npm start
~~~

Stop the development server before starting the production server on the same port.

## Scenario 5 products

- Instant Noodles — ₱18.00
- Potato Chips — ₱25.00
- Soft Drink (Can) — ₱25.00
- Bottled Water — ₱20.00
- Ballpen (piece) — ₱12.00
- Notebook (piece) — ₱35.00

## Files and responsibilities

- app/page.tsx: first page, displaying order-type selection.
- app/pos/page.tsx: POS route with the Suspense boundary required for reading query parameters.
- app/layout.tsx and app/globals.css: page metadata, system fonts, Tailwind theme, and global styles.
- app/icon.svg: store icon.
- components/order-type-selection.tsx: two large order-type options.
- components/pos-screen.tsx: React state, category filters, order summary, quantity controls, cash form, and reset.
- components/product-card.tsx: product image, name, category, price, and Add to Cart button.
- components/receipt.tsx: payment confirmation and digital receipt.
- components/brand.tsx and components/icon.tsx: small reusable visual components.
- data/products.ts: the exact six products and TypeScript models.
- utils/cart.ts: pure functions for adding, changing quantities, removing, and totaling items.
- utils/format.ts: Philippine peso formatting with two decimal places.
- utils/payment.ts: payment validation and change calculation.
- public/products/: six original lightweight SVG placeholder illustrations, served locally.

The interface uses Georgia for warm serif headings and Segoe UI/Arial for readable controls. Images and fonts require no third-party requests. No new dependencies were added.

## How it works (oral-checking notes)

### Order type

The first-page links open /pos?type=dine-in or /pos?type=take-out. PosRoute reads the query parameter and displays the corresponding label in the header, order summary, and receipt. A missing or invalid order type displays the selection screen. Changing order type clears the transaction first. The keyed POS component also starts fresh when switching between order types.

### Cart state and quantities

The cart is a React useState array. Add to Cart inserts a product with quantity 1. Adding the same product again increments the existing item instead of creating a duplicate row. The quantity buttons exist only in the order summary after a product has been added.

Updates use functional state setters and new arrays/objects. Minus decreases the quantity to a minimum of 1, where it becomes disabled. Remove deletes the entire row. Category filters only change which product cards are visible; they do not change the cart.

### Subtotals and total

Each subtotal is unit price × quantity. The overall total is derived from the current cart on every render; there is no separate total state to get out of sync. Checkout calculations use whole centavos, and display values are formatted as Philippine pesos.

### Cash validation

The form uses a numeric input with a 0.01 step. Custom validation runs on submission (the form uses noValidate so native browser messages do not replace the required exam messages).

Blank, non-numeric, negative, non-finite, unsafe, and malformed values return:

> Please enter a valid payment amount.

Amounts must be ordinary decimal numbers with at most two decimal places. A valid amount below the total returns:

> Insufficient payment. Please enter at least ₱[TOTAL].

The placeholder is replaced with the formatted current total, for example ₱135.00. Zero is treated as insufficient for a nonempty order. Browsers may filter letters from a number input; an empty or malformed result is still rejected.

An empty cart cannot be paid. Valid payment computes change = amount paid − total, in whole centavos.

### Confirmation and receipt

Successful payment creates a receipt object containing a CC-prefixed random transaction reference, selected order type, a copied snapshot of the items, total, amount paid, and change. The receipt component derives each line subtotal from the saved items and displays the payment confirmation. Product additions and cart edits are locked after payment so the paid order cannot change.

### New transaction

New Transaction clears the cart, cash input, receipt, confirmation, errors, and category filter. It retains the selected order type for the next customer. Change order type also clears the transaction and returns to the first page.

Everything is in memory. Refreshing the page clears the cart and receipt; the order type stays in the URL. Receipts are not saved as transaction history.

## Practical examination checklist

1. Open / and select Dine In. Confirm Dine In appears on the POS.
2. Add each of the six products once. The total should be **₱135.00**.
3. Increase Instant Noodles to 2. Its subtotal should be **₱36.00**, and the total **₱153.00**.
4. Decrease it to 1, then remove Ballpen. The total should be **₱123.00**.
5. Submit blank cash or negative cash: the exact valid-payment error should appear.
6. Try non-numeric input (the browser may filter it); it must never complete a payment.
7. Enter 100 for the ₱123.00 order: expect **Insufficient payment. Please enter at least ₱123.00.**
8. Enter 150.50: payment succeeds, and change is **₱27.50**.
9. Check the receipt reference, Dine In label, items, quantities, subtotals, total, amount paid, and change.
10. Confirm the paid cart cannot be edited, then select New Transaction. Cart, cash, receipt, confirmation, and errors must be cleared.
11. Change order type to Take Out and repeat with exact cash; change must be **₱0.00**.
12. Visit /pos without a type (or with an invalid type); the order-type selection must appear.
