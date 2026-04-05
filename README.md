# Artha | Wealth Intelligence

**Artha** is a premium, single-page financial tracking and wealth intelligence platform built with **React**, **TypeScript**, and **Tailwind CSS**. Designed for high-end analytical depth and visual excellence, Artha provides a sophisticated interface for managing personal or institutional finances with localized context.

---

## 🌟 Key Features

- **Premium UI/UX**: A bespoke Indigo & Slate design system with glassmorphic cards and dynamic radial gradients.
- **Dynamic Role Branding**: Context-aware headers that update based on active user identity (Admin/Viewer).
- **Wealth Performance Tracking**: Real-time analytical charts (Recharts) for balance trends and categorical spending.
- **Financial Localization**: Global enforcement of **INR (₹)** with pre-seeded, realistic Indian financial data.
- **Role-Based Access Simulation**: Demonstrative Admin and Viewer roles to showcase permission-dependent interface behavior.
- **Offline Persistence**: Secure state synchronization with `localStorage` for an immediate, reliable user experience.

## 🛠 Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Visualizations**: [Recharts](https://recharts.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide-React](https://lucide.dev/)

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd finance-hub-insights-main
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## 📋 Project Structure

- `src/components`: Reusable UI components and layout fragments.
- `src/pages`: Main view modules (Dashboard, Ledger, Insights).
- `src/store`: Centralized state management using Zustand.
- `src/lib`: Logic utilities and localized mock data generation.

