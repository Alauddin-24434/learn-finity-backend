

# Academi Backend

Welcome to the **Academi Backend** repository\! This project serves as the robust API for the Academi platform, handling user authentication, data management, and various core functionalities. It's built with Node.js, Express, and TypeScript, utilizing Prisma for database interactions and a suite of modern tools for a scalable and maintainable architecture.

-----

## 🚀 Features

  * **User Authentication & Authorization**: Secure signup, login, and role-based access control using JWTs.
  * **Database Management**: Powered by Prisma ORM for efficient and type-safe database operations (PostgreSQL).
  * **Cloudinary Integration**: For seamless image and file uploads.
  * **Payment Gateway Integration**: AamarPay integration for handling payments.
  * **Real-time Communication**: Socket.IO for potential real-time features.
  * **Robust API Design**: Organized routes and controllers for various functionalities.
  * **Secure & Scalable**: Implements best practices for security and performance.

-----

## 🛠️ Technologies Used

  * **Node.js**: JavaScript runtime environment.
  * **Express.js**: Fast, unopinioned, minimalist web framework for Node.js.
  * **TypeScript**: Strongly typed superset of JavaScript.
  * **Prisma**: Next-generation ORM for Node.js and TypeScript.
  * **PostgreSQL**: Powerful, open-source object-relational database system.
  * **JWT (JSON Web Tokens)**: For secure authentication.
  * **Bcrypt**: For hashing passwords.
  * **Cloudinary**: Cloud-based image and video management.
  * **Multer & Multer-Storage-Cloudinary**: For handling file uploads.
  * **Zod**: TypeScript-first schema declaration and validation library.
  * **Dotenv**: For loading environment variables from a `.env` file.
  * **Cors**: Middleware for enabling Cross-Origin Resource Sharing.
  * **Helmet**: Helps secure Express apps by setting various HTTP headers.
  * **Morgan**: HTTP request logger middleware for Node.js.

-----

## ⚙️ Getting Started

Follow these steps to get your development environment up and running.

### Prerequisites

Make sure you have the following installed:

  * **Node.js** (v18 or higher recommended)
  * **npm** (Node Package Manager) or **pnpm** (preferred)
  * **PostgreSQL** database (locally or a hosted instance)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Alauddin-24434/academi-backend.git
    cd academi-backend
    ```

2.  **Install dependencies:**

    This project uses `pnpm` for package management. If you don't have it, install it globally:

    ```bash
    npm install -g pnpm
    ```

    Then, install the project dependencies:

    ```bash
    pnpm install
    ```

3.  **Set up Environment Variables:**

    Create a `.env` file in the root of the project and populate it with your environment variables. Here's an example:

    ```env
    # ===============================================
    # Academi Backend Environment Variables
    #
    # This file contains configuration settings for the backend application.
    # For local development, copy this content into a new file named `.env`
    # in the root of your project and fill in the appropriate values.
    #
    # DO NOT COMMIT THIS FILE TO VERSION CONTROL!
    # ===============================================


    # --- Server Configuration ---
    # The port on which the Express server will run.
    PORT=5000

    # --- Database Configuration ---
    #
    # PostgreSQL database connection URLs.
    #
    # DATABASE_URL: Used for production/connection pooling (e.g., Supabase pooler).
    #               For local development, you can often use the DIRECT_URL format.
    # DIRECT_URL:   Direct connection to the database. Primarily used by Prisma
    #               for migrations and other direct database operations.
    #
    # Replace 'your_username', 'your_password', 'your_host', 'your_port',
    # and 'your_database_name' with your actual database credentials.
    #
    # Example for a local PostgreSQL instance:
    # DATABASE_URL="postgresql://your_username:your_password@localhost:5432/academi_db?schema=public"
    # DIRECT_URL="postgresql://your_username:your_password@localhost:5432/academi_db?schema=public"
    DATABASE_URL="postgresql://your_supabase_pooler_username:your_supabase_pooler_password@your_supabase_pooler_host:6543/your_supabase_db?pgbouncer=true"
    DIRECT_URL="postgresql://your_supabase_username:your_supabase_password@your_supabase_direct_host:5432/your_supabase_db"


    # --- JWT (JSON Web Token) Configuration ---
    #
    # JWT_ACCESS_TOKEN_SECRET: A long, random string for signing access tokens.
    #                          Generate a strong one (e.g., using `openssl rand -hex 32`).
    # JWT_REFRESH_TOKEN_SECRET: A long, random string for signing refresh tokens.
    #                           Should be different from the access token secret.
    # JWT_ACCESS_TOKEN_EXPIRATION: How long access tokens are valid (e.g., 15m, 1h, 1d).
    # JWT_REFRESH_TOKEN_EXPIRATION: How long refresh tokens are valid (e.g., 7d, 30d).
    JWT_ACCESS_TOKEN_SECRET=some_very_strong_random_secret_for_access_tokens
    JWT_REFRESH_TOKEN_SECRET=another_very_strong_random_secret_for_refresh_tokens
    JWT_ACCESS_TOKEN_EXPIRATION=15m
    JWT_REFRESH_TOKEN_EXPIRATION=7d

    # --- Application Environment ---
    #
    # NODE_ENV: Set to 'development' for local dev, 'production' for deployment.
    # CLIENT_URL: The URL of your frontend application. Used for CORS and redirects.
    NODE_ENV=development
    CLIENT_URL=http://localhost:3000

    # --- Cloudinary Configuration ---
    #
    # Credentials for Cloudinary image/file upload service.
    # Replace with your actual Cloudinary account details.
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # --- AamarPay Payment Gateway Configuration ---
    #
    # Credentials for AamarPay payment gateway integration.
    # AAMARPAY_STORE_ID: Your AamarPay store ID.
    # AAMARPAY_SIGNATURE_KEY: Your AamarPay signature key.
    AAMARPAY_STORE_ID=your_aamarpay_store_id
    AAMARPAY_SIGNATURE_KEY=your_aamarpay_signature_key

    # --- Payment Redirect URLs ---
    #
    # URLs where AamarPay will redirect after payment attempts.
    # For development, these should point to your local backend.
    # For production, these should point to your deployed backend URL.
    SUCCESS_URL=https://learning-platform-backend-production-839d.up.railway.app/api/payments/success
    FAIL_URL=https://learning-platform-backend-production-839d.up.railway.app/api/payments/fail
    CANCEL_URL=https://learning-platform-backend-production-839d.up.railway.app/api/payments/cancel
    ```

    **Important:** For `DATABASE_URL` and `DIRECT_URL`, you'll need to replace the example values with your actual PostgreSQL connection strings. For development, you can use a local PostgreSQL instance.

4.  **Database Setup:**

    Generate the Prisma client and run migrations:

    ```bash
    pnpm run prisma:generate
    pnpm run prisma:migrate
    ```

    This will create your database schema and tables based on your Prisma schema.

-----

## 🚀 Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
pnpm run dev
```

The server will typically run on `https://learning-platform-backend-production-839d.up.railway.app` (or the `PORT` specified in your `.env` file).

### Production Mode

To build the project and run it in production mode:

```bash
pnpm run build
pnpm run prod
```

-----

## 🐳 Dockerization

This project includes a `Dockerfile` for easy containerization, making deployment more consistent and portable.

### Build the Docker Image

```bash
docker build -t academi-backend .
```

### Run the Docker Container

```bash
docker run -p 5000:5000 --env-file .env academi-backend
```

**Note:** Ensure your `.env` file is correctly configured for the container environment, especially the `DATABASE_URL` and other service URLs.


-----

## 🤝 Contributing

Contributions are welcome\! If you find a bug or have a feature request, please open an issue. If you'd like to contribute code, please fork the repository and submit a pull request.

-----

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
