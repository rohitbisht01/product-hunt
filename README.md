# Product Hunt

Product Hunt is a subscription-based platform where developers and creators can **showcase their projects**, and other users can **discover and upvote** them. It offers a space similar to Product Hunt, helping tech enthusiasts find new apps, tools, and services every day.

---

## ✨ Features

- 🔐 User Authentication (GitHub & Google via NextAuth)
- 🛠️ Post your product and get visibility
- 💬 Explore and upvote products by others
- 🆓 Free plan allows posting **1 product**
- 💳 Stripe-powered payments to unlock **premium**
- 🌟 Premium users can post **unlimited products**
- 🖼️ Upload product images and descriptions
- 🛡️ **Admin Dashboard** to manage and **approve/reject** product submissions

---

## 🧾 Tech Stack

- **Frontend/Backend**: Next.js
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js (GitHub & Google)
- **Payments**: Stripe
- **File Uploads**: UploadThing

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:rohitbisht01/product-hunt.git
cd product-hunt
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Enviroment variables

```bash
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

DATABASE_URL=""
UPLOADTHING_TOKEN=''

# Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SIGNING_SECRET=

ADMIN_USERNAME=
ADMIN_PASSWORD=
```

### 4. Run the app locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🛠 Admin Capabilities

- ✅ **Approve** product submissions
- ❌ **Reject** inappropriate or incomplete submissions
- 🧑‍💻 **View** all posted products and user details

Access the Admin Dashboard at:

```bash
http://localhost:3000/admin
```
