# 🏠 House Finder App (Bambili) — User Flow & Pages Plan

## 🌟 1. Landing Experience (Public Entry Point)

### 📍 Page: Home (`/`)

This is the marketing + first impression page.

### 🎯 Purpose:
Convince students that this platform solves their housing problem in Bambili.

### 🧩 Sections:
- Hero section:
  - “Find affordable student housing in Bambili without stress”
  - Background image showing student life / housing
- Short “How it works” section:
  - Search → Compare → Contact landlord
- Featured listings preview (limited, no login required)
- Optional testimonials for trust
- CTA button:
  - **“Find a House Now”**

### 🚦 Flow behavior:
- If user clicks **“Find a House Now”**:
  - If NOT authenticated → redirect to `/auth`
  - If authenticated → redirect to `/listings`

---

## 🔐 2. Authentication Flow

### 📍 Page: Auth (`/auth`)

### 🎯 Purpose:
Handle login and signup in one simple interface.

### 🧩 Features:
- Toggle between Login / Sign Up
- Email + password fields
- Clean and minimal UI

### 🚦 After authentication:
- Redirect user to `/listings`

---

## 🏘️ 3. Main Application (Core Experience)

### 📍 Page: Listings (`/listings`)

### 🎯 Purpose:
Allow users to browse all available houses.

### 🧩 Features:
- Grid/list of house cards
- Search bar (location, price, type)
- Filters:
  - Price range
  - Distance from campus
  - Room type
- Each listing card includes:
  - Image
  - Price
  - Location
  - Availability badge

### 🚦 Flow behavior:
- Clicking a listing → `/listing/[id]`

---

## 🏡 4. House Detail Page

### 📍 Page: Listing Detail (`/listing/[id]`)

### 🎯 Purpose:
Help users evaluate a house and contact the landlord.

### 🧩 Features:
- Image gallery
- Full description
- Price details
- Location information
- Availability status
- Contact button (WhatsApp / call)
- Optional: save listing

### 🚦 Flow behavior:
- Contact button opens WhatsApp or contact form
- Optional inquiry saved in database

---

## ❤️ 5. Saved Listings (Optional)

### 📍 Page: Saved (`/saved`)

### 🎯 Purpose:
Allow users to save houses they like.

### 🧩 Features:
- List of saved houses
- Remove from saved list

---

## 👤 6. Profile Page

### 📍 Page: Profile (`/profile`)

### 🎯 Purpose:
Basic user account management.

### 🧩 Features:
- User info
- Saved listings
- Logout button

---

# 🔴 7. Admin System (Private Only)

⚠️ Admin accounts are NOT publicly created.

They are manually added by the platform owner.

---

## 📍 Page: Admin Dashboard (`/admin`)

### 🎯 Purpose:
Manage all listings on the platform.

### 🔐 Access:
- Only users with role = `admin`
- No public admin signup allowed

---

## 🧩 Admin Flow

### ➤ Dashboard Home
- Total listings
- Active listings
- Recently added houses

---

### ➤ Create Listing (`/admin/new`)
- Upload images
- Add title, price, description, location
- Publish listing

---

### ➤ Manage Listings (`/admin/listings`)
- View all houses
- Edit / delete listings
- Toggle availability

---

### ➤ Edit Listing (`/admin/edit/[id]`)
- Update listing information

---

# 🔁 FULL USER JOURNEY

## 👤 First-time user:
Home → CTA click → Auth → Listings → Listing detail → Contact landlord

## 👤 Returning user:
Home → Listings → Filter → Listing detail → Contact landlord

## 🧑‍💼 Admin:
Manual login → Admin dashboard → Create listings → Manage listings

---

# ⚡ KEY UX PRINCIPLES

- Listings page is the core of the platform
- Home page should feel like a real solution, not just info
- Authentication should be minimal friction
- Admin system is fully hidden from public users
- Trust is built through controlled listings + clean UI

---

# 🎯 MVP (Minimum Viable Product)

Build this first:

- Home page with CTA
- Auth page (login/signup)
- Listings page
- Listing detail page
- Admin ability to create/manage listings

---

# 🚀 GOAL

A simple, fast, trusted platform where:
- Students can easily find housing in Bambili
- Landlords can post verified listings
- Admin controls everything for trust and safety