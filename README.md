# GravityPay - Secure Payment Gateway Simulation

A mid-level frontend implementation of a Payment Gateway UI built with Next.js (App Router), TypeScript, and Zustand.

## Features

- **Live Card Preview**: Real-time visual representation of card details as you type.
- **Card Detection**: Automatically detects Visa, Mastercard, and Amex based on card number prefixes.
- **Real-time Validation**: Validates all fields (Card Number, Expiry, CVV, Amount) on blur or as you type.
- **Payment Lifecycle**: Full state management for Idle, Processing, Success, Failed, and Timeout states.
- **Gateway Simulation**: A mock API route handles payments with randomized outcomes:
  - Success (60%)
  - Failed (25%) with specific reason strings.
  - Timeout (15%) - Simulates a slow network, handled via `AbortController` on the frontend (6s cutoff).
- **Retry Logic**: Supports up to 3 retry attempts for failed or timed-out transactions.
- **Idempotency**: Generates a unique transaction ID on the frontend using `crypto.randomUUID()` to ensure consistent history across retries.
- **Transaction History**: Persists past transactions in `localStorage` with detailed view capabilities.
- **Premium UI**: Modern, glassmorphic design using Tailwind CSS 4, Framer Motion for animations, and Inter typography.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd assesment
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open in browser**: Navigate to `http://localhost:3000`.

## Assumptions & Decisions

- **State Management**: Zustand was chosen over Redux Toolkit for its minimal boilerplate and excellent performance with React 19.
- **Validation**: Manual validation logic was implemented in `utils/` to demonstrate fundamental knowledge without relying on libraries like Zod or Yup (though they would be preferred in production).
- **Persistence**: `zustand/middleware`'s `persist` was used to handle `localStorage` synchronization seamlessly.
- **Accessibility**: ARIA labels and `aria-describedby` were added to form inputs for screen reader support.

## Future Improvements

- **Security**: Implement server-side validation and checksums for payment payloads.
- **UX**: Add a "Save Card" feature (simulated) and more comprehensive tooltips for field requirements.
- **Testing**: Add Playwright/Cypress for E2E testing of the payment flow and Vitest for utility unit tests.
- **Accessibility**: Further refine keyboard navigation and focus management for the modal and status transitions.
# payment-system-assesment
