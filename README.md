# Insaniat Parjatan - Sundarban Tourism Platform

Insaniat Parjatan is a complete, production-ready tour operator platform specialized in organizing Sundarban tours in Bangladesh. It features premium nature-inspired design elements, booking systems, secure payment flows, and dedicated dashboards for both customers and administrators.

---

## 🚀 Key Features

- **Nature-Inspired Responsive UI**: Mobile-first premium layout styled with Tailwind CSS, supporting dark/light mode toggles and smooth Framer Motion animations.
- **BD Government Holidays Calendar**: Built-in 2026 public holidays calendar integrated with the Package Details sidebar and Checkout pages. Customers can view official holidays easily and pick them to autofill dates.
- **Bilingual Blogs & Auto-Translation**: Full support for writing blogs in both English and Bangla. Includes real-time translation triggers (EN ⇄ BN) using Google's translation api in the admin panel and a language toggle for public readers.
- **Role-Based Auth (Firebase)**: Authentication and access control handled via Firebase Auth on the client and Firebase Admin SDK on the backend.
  - Automatically flags user `bushra.arifeen@gmail.com` as `"admin"` role upon registration.
- **Dynamic Checkout & Payments**: Interactive booking creation with payments verified securely on the backend (supporting Bkash, Nagad, Rocket, Bank).
- **Comprehensive Administration**: Admin dashboards for managing packages, bookings, payments, blogs, testimonials, contact inquiries, and users.
- **Interactive Tour Analytics**: Live tracking of visitor stats, booking volumes, and revenue metrics.
- **Next.js Caching & ISR**: Caching optimization implemented at page and service levels to achieve fast speeds and high SEO/Lighthouse scoring.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js App Router (JavaScript)
- **Styling**: Tailwind CSS, Shadcn UI, Vanilla CSS variables
- **State & Queries**: Axios, TanStack React Query, React Hook Form, Zod
- **Animations**: Framer Motion, React Icons, Sonner notifications

### Backend & Storage
- **Runtime**: Node.js & Next.js API Route Handlers
- **Database**: MongoDB Atlas with Mongoose
- **Image Storage**: Cloudinary integration for uploading/replacing photos
- **Authentication**: Firebase Authentication & Firebase Admin SDK

---

## 📁 Project Structure

```
src/
├── app/                  # Next.js Pages & Route Handlers
│   ├── (auth)/           # Authentication views (Login, SignUp)
│   ├── (public)/         # Visitor pages (Home, About, Packages, Blog, Contact, Gallery)
│   ├── admin/            # Administrative dashboard views
│   ├── checkout/         # Booking checkout wizard & payment submission
│   ├── dashboard/        # Customer personal panel
│   └── api/              # Unified API routes (blogs, packages, payments, seed, etc.)
├── components/           # Reusable UI & Layout components
│   ├── layout/           # Shared components like Navbar, Footer
│   ├── shared/           # BDHolidaysCalendar, WhatsAppButton, and others
│   └── ui/               # Core atomic layout elements (Shadcn components)
├── features/             # Feature-specific components (packages grid, blogs grid, etc.)
├── hooks/                # Custom React queries, alerts, and state hooks
├── lib/                  # Library setups (db connections, firebase init, sanitize utilities)
├── providers/            # React context providers (Auth, Query, Theme, Language)
├── services/             # Axios and Server fetch calls for API transactions
└── utils/                # Formatting, SEO metadata, and Translator utilities
```

---

## ⚙️ Environment Configuration

Set up a `.env` or `.env.local` file in the root directory based on the following variables:

```env
# Next.js configurations
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# MongoDB
MONGODB_URI=your-mongodb-atlas-connection-uri

# Firebase Client SDK (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK (Private)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-escaped-private-key\n-----END PRIVATE KEY-----\n"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Support Number
NEXT_PUBLIC_WHATSAPP_NUMBER=8801884545974
```

---

## 💾 Database Seeding

To seed the initial admin profile (`bushra.arifeen@gmail.com`), default tour packages, bilingual blog articles, client testimonials, and image gallery:

1. Configure your `.env.local` variables with valid MongoDB credentials.
2. Start the development server.
3. Access `/api/seed` in your browser or client tool (e.g. Postman).
4. The system will create the admin user and populate mock data safely without overriding existing items.

---

## 🏁 How to Run

1. Clone or open the workspace folder.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the website.
