# 🐾 Zootopia Petshop System

A professional, enterprise-ready Petshop management system built with **React**, **Vite**, and **Supabase**. This project follows the **Vertical Slicing** architecture and **MVP (Model-View-Presenter)** design pattern to ensure scalability, maintainability, and clear separation of concerns.

## 🏗️ Architecture: Vertical Slicing & MVP

This system is organized by features rather than by technical layers. Each feature (e.g., Auth, Cart, Profile) resides in its own "slice" within `src/features/`.

### **Design Pattern (MVP)**
Inside each slice, we follow the **Model-View-Presenter** pattern:
*   **Model**: Manages data fetching and state logic (via Supabase and React Context).
*   **View**: Pure UI components built with Tailwind CSS.
*   **Presenter**: Logic hooks that connect the View to the Model, handling business rules.

## ✨ Key Features

*   🔐 **Secure Authentication**: User registration and login powered by Supabase Auth.
*   🛒 **Persistent Shopping Cart**: State-of-the-art cart system with real-time database synchronization.
*   📅 **Service Booking**: Appointment management for grooming and consultations.
*   👤 **Profile Management**: Detailed account settings, including avatar uploads and password changes.
*   🛍️ **Product Catalog**: Dynamic product browsing with category filtering.
*   📱 **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite)
*   **Styling**: Tailwind CSS
*   **Backend/Database**: Supabase (PostgreSQL)
*   **State Management**: React Context API & useReducer
*   **Icons**: Google Material Symbols

## 🚀 Getting Started

### **1. Prerequisites**
*   **Node.js** (v18+)
*   **npm** or **yarn**

### **2. Installation**
```bash
git clone https://github.com/VeryLuckyMe/petshop.git
cd petshop
npm install
```

### **3. Environment Setup**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### **4. Database Setup**
Ensure the following tables are created in your Supabase project:
*   `products`
*   `appointments`
*   `cart`
*   `zootopiaDatabase` (Profiles)

### **5. Run Locally**
```bash
npm run dev
```

## 📝 Assignment Requirements
This project fulfills the requirements for:
*   **Backend Development & Deployment**: Full Supabase integration and normalized database schema.
*   **React Web Development**: Modular architecture, polished UI/UX, and complex state management.

---
Built with ❤️ by Clarence Kirk Macapagal
```
