
## Project Overview

Build a complete production-ready tourism platform called **Insaniat Parjatan**.

The company organizes Sundarban tours in Bangladesh.

The platform allows users to:

* Explore tour packages
* View package details
* Read blogs
* Browse gallery
* Submit contact messages
* View testimonials
* Book tours
* Pay using Bkash or Nagad
* Manage bookings
* Manage profile
* Access customer dashboard
* Access admin dashboard

The system must be:

* Fast
* Secure
* SEO Optimized
* Mobile First
* Accessible
* Scalable
* Production Ready

---

# Technology Stack

## Frontend

* Next.js App Router
* JavaScript (No TypeScript)
* React
* Tailwind CSS
* Shadcn UI
* Firebase Authentication
* Axios
* TanStack Query
* React Hook Form
* Zod
* Framer Motion
* Sonner
* React Icons

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Firebase Admin SDK

## Image Storage

Cloudinary

Store only image URLs inside MongoDB.

---

# Required Frontend Packages

npm install axios @tanstack/react-query react-hook-form zod framer-motion firebase react-icons sonner clsx tailwind-merge

---

# Required Backend Packages

npm install express mongoose cors dotenv helmet express-rate-limit firebase-admin cookie-parser bcrypt jsonwebtoken morgan cloudinary multer multer-storage-cloudinary

npm install -D nodemon

---

# Authentication

Use Firebase Authentication ONLY.

Methods:

* Email Password Login
* Google Login (Optional)

Flow:

User Login
→ Firebase Auth
→ Firebase ID Token
→ Axios Request
→ Backend Verification
→ MongoDB User Lookup
→ Role Verification
→ Response

Never trust frontend roles.

Backend must verify Firebase token on every protected request.

---

# User Roles

## customer

Permissions:

* View Packages
* Create Booking
* Make Payments
* View Own Bookings
* View Payment History
* Update Profile

## admin

Permissions:

* Full Access
* Manage Packages
* Manage Bookings
* Manage Payments
* Manage Blogs
* Manage Gallery
* Manage Testimonials
* Manage Users
* Manage Contact Messages
* View Analytics

No public admin registration.

---

# Initial Admin

Create one admin manually during deployment.

Example:

email: "[bushra.arifeen@gmail.com](mailto:bushra.arifeen@gmail.com)"
role: "admin"
}

---

# Backend Security

Must include:

* Firebase Verification Middleware
* Role Middleware
* Helmet
* CORS
* Rate Limiting
* Zod Validation
* Morgan Logging
* Input Sanitization

---

# Payment Security

Payment Methods:

* Bkash
* Nagad
* Rocket
* Bank trnsaction

Rules:

Never trust frontend payment status.

Never mark payment paid from frontend.

Never update payment records from client requests.

Backend must verify every transaction.

Statuses:

pending
paid
failed

Payment Flow:

Booking Created
→ Payment Record Created
→ Pending
→ User Pays
→ Transaction Submitted
→ Backend Verification
→ Paid
→ Booking Confirmed

Additional Security:

* Transaction ID uniqueness
* Payment logs
* Admin approval option
* Firebase verification
* Rate limiting

---

# Database Collections

## users

{
firebaseUid,
name,
email,
phone,
address,
photo,
role,
createdAt
}

## packages

{
title,
slug,
description,
duration,
price,
location,
images,
featured,
included,
excluded,
itinerary,
createdAt
}

## bookings

{
userId,
packageId,
paymentId,
bookingStatus,
paymentStatus,
createdAt
}

## payments

{
userId,
bookingId,
amount,
paymentMethod,
transactionId,
paymentStatus,
verifiedByAdmin,
paidAt
}

## blogs

{
title,
slug,
content,
thumbnail,
author,
createdAt
}

## gallery

{
title,
image,
createdAt
}

## testimonials

{
name,
designation,
photo,
review,
rating
}

## contacts

{
name,
email,
phone,
message,
status
}

---

# API Security

Use:

* Firebase Admin Verification
* Rate Limiting
* Helmet
* Zod Validation
* Morgan
* CORS Restriction

Never expose MongoDB directly.

Never trust frontend validation.

---

# Axios Architecture

services/

api.js
auth.service.js
package.service.js
booking.service.js
payment.service.js
blog.service.js
gallery.service.js
testimonial.service.js
contact.service.js

Requirements:

* Interceptors
* Auto Token Attach
* Global Error Handling
* Environment Variables

---

# TanStack Query

Required For:

* Packages
* Blogs
* Gallery
* Testimonials
* Dashboard Stats
* Bookings
* Payments

---

# Next.js Caching Strategy

Static Pages:

Home
About
Contact

export const revalidate = 300

ISR:

Packages → 120

Blogs → 600

Gallery → 600

Blog Details → 86400

Dynamic:

Dashboard
Admin
Checkout
Booking
Payments

export const dynamic = "force-dynamic"

cache: "no-store"

---

# UI Requirements

Nature Inspired Tourism Design

Requirements:

* Mobile First
* Responsive
* Smooth Animations
* WhatsApp Floating Button
* Fast Navigation
* Accessibility Friendly

---

# Required Shadcn Components

* Button
* Input
* Textarea
* Card
* Dialog
* Alert Dialog
* Sheet
* Dropdown Menu
* Select
* Tabs
* Badge
* Table
* Pagination
* Skeleton
* Avatar
* Tooltip
* Breadcrumb
* Separator
* Calendar
* Sonner

Always use cn() utility.

---

# Notification System

Create:

useSuccessAlert()
useErrorAlert()
useDeleteConfirmation()

Use Sonner for all notifications.

---

# Required Hooks

src/hooks/

useAuth.js
useAxios.js
usePackages.js
useBookings.js
usePayments.js
useBlogs.js
useGallery.js
useSuccessAlert.js
useErrorAlert.js
useDeleteConfirmation.js

---

# Loading Components

FullPageLoader

ButtonLoader

TableLoader

---

# Skeleton Components

PackageCardSkeleton

BlogCardSkeleton

DashboardSkeleton

GallerySkeleton

TableSkeleton

---

# Empty States

No Packages Found

No Blogs Found

No Gallery Found

No Bookings Found

No Payments Found

Each must contain:

* Icon
* Message
* Optional Action Button

---

# Required Pages

Public:

* Home
* About
* Packages
* Package Details
* Blog
* Blog Details
* Gallery
* Testimonials
* Contact

Customer Dashboard:

* Overview
* My Bookings
* Payment History
* Profile

Admin Dashboard:

* Analytics
* Packages
* Bookings
* Payments
* Blogs
* Gallery
* Testimonials
* Users
* Contact Messages

System Pages:

* Loading Page
* Error Page
* Not Found Page (404)
* Unauthorized Page (401)
* Forbidden Page (403)

---

# Folder Structure

Frontend

src/

app/
components/
features/
hooks/
services/
providers/
lib/
utils/
constants/

Backend

src/

config/
controllers/
middlewares/
models/
routes/
services/
validators/
utils/

---

# Deployment

Frontend:

Vercel

Backend:

Render

Database:

MongoDB Atlas

Auth:

Firebase

Image Storage:

Cloudinary

---

# Performance Goals

* Lighthouse > 90
* SEO Optimized
* Lazy Loading
* Next Image Optimization
* Cloudinary Optimization
* ISR for Public Pages
* Minimal API Calls

---

# Development Order

Phase 1

* Authentication
* Layout
* Home
* Packages
* Package Details

Phase 2

* Booking System
* Checkout
* Payments
* Customer Dashboard

Phase 3

* Blogs
* Gallery
* Testimonials

Phase 4

* Admin Dashboard
* Analytics
* User Management
* Payment Management

Phase 5

* SEO
* Security Hardening
* Performance Optimization
* Deployment

---

# Final Goal

Build a secure, scalable, SEO-friendly tourism platform for Insaniat Parjatan using production-grade architecture, Firebase authentication, secure payment verification, role-based authorization, Next.js App Router, Express.js backend, MongoDB Atlas, Cloudinary storage, TanStack Query caching, and a modern mobile-first user experience.
