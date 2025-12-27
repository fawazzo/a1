# Lezzet Express - Turkish Food Delivery Web Application

A modern, professional front-end Turkish food delivery web application built with React, inspired by Yemek Sepeti.

## Features

- 🏠 **Ana Sayfa (Homepage)**: Hero section, search bar, featured restaurants, and categories
- 🍽️ **Restoran Listesi (Restaurant List)**: Advanced filtering options (cuisine type, delivery time, rating, minimum order)
- 📋 **Restoran Detay (Restaurant Detail)**: Menu categories, food items with images and prices
- 🛒 **Sepet (Cart)**: Shopping cart with quantity controls and checkout
- 🔐 **Kullanıcı Girişi/Kayıt (Login/Register)**: Authentication modals with Turkish interface

## Tech Stack

- **React 18** - UI framework
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Main navigation header
│   ├── Cart.jsx            # Shopping cart modal
│   └── LoginModal.jsx      # Login/Register modal
├── pages/
│   ├── HomePage.jsx        # Landing page
│   ├── RestaurantListPage.jsx  # Restaurant listing with filters
│   └── RestaurantDetailPage.jsx # Restaurant menu
├── App.jsx                 # Main app component
├── main.jsx               # App entry point
└── index.css              # Global styles
```

## Features in Detail

### Ana Sayfa (Homepage)
- Vibrant hero section with search functionality
- Category cards (Pizza, Kebap, Kahve, Tatlı, Vejetaryen)
- Featured restaurants grid
- Promotional banner

### Restoran Listesi (Restaurant List)
- Filter sidebar with multiple options
- Sorting functionality
- Restaurant cards with ratings and delivery info
- Responsive grid layout

### Restoran Detay (Restaurant Detail)
- Restaurant information header
- Category-based menu navigation
- Food items with images and descriptions
- Add to cart functionality

### Sepet (Cart)
- Item quantity controls
- Price calculation
- Checkout button
- Empty cart state

### Login/Register
- Toggle between login and register
- Form validation ready
- Social login options (Google, Facebook)
- Responsive design

## Color Scheme

- **Primary**: Orange (#FF6B00) - Main brand color
- **Secondary**: Gold (#FFD700) - Accent color
- **Accent**: Red (#FF4444) - Call-to-action color

## Responsive Design

Fully responsive for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)

## Language

All UI text is in Turkish (Türkçe) as per requirements.

## Note

This is a front-end only application. No backend integration is included.
