# Prisma Blog App - System Documentation

## 1. Project Overview

**Project Name**: Prisma Blog App
**Purpose**: A robust, scalable backend application for a modern blog platform. It provides a RESTful API for managing users, posts, and comments, with secure authentication and role-based access control.
**Target Users**:

- **Visitors**: Read posts and comments.
- **Authenticated Users**: Create posts (if allowed), comment, and manage their profile.
- **Admins**: Manage all content, user roles, and system configuration.

**Key Features**:

- User Authentication (Email/Password & Google OAuth).
- Role-Based Access Control (RBAC) with User, Admin, and Moderator roles.
- CRUD operations for Posts and Comments.
- Nested commenting system (replies to replies).
- Advanced filtering, searching, and pagination for posts.
- Post statistics for usage analytics.
- Email verification system.

---

## 2. Tech Stack

### Core Runtime

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js (v5)

### Database & ORM

- **Database**: PostgreSQL
- **ORM**: Prisma (v7)

### Authentication

- **Library**: [Better Auth](https://better-auth.com/)
- **Mechanisms**: Email/Password, Google OAuth
- **Session Management**: Database-backed sessions

### Utilities

- **Validation**: Zod (inferred from service logic and standard practices).
- **Email**: Nodemailer for sending verification emails.
- **Logging**: Custom logger middleware.
- **CORS**: Configured for secure cross-origin requests.

### Package Management

- **Manager**: pnpm (v10.21.0)
- **Scripts**: `tsx` for running TypeScript files directly.

---

## 3. System Architecture

### Overview

This is a monolithic REST API backend following a **layered architecture**:

1.  **Route Layer**: Defines endpoints and maps them to controllers.
2.  **Controller Layer**: Handles HTTP requests/responses and parses standard inputs.
3.  **Service Layer**: Contains business logic and interacts with the database via Prisma.
4.  **Middleware Layer**: Handles cross-cutting concerns (Auth, Logging, Error Handling).

### Folder Structure (`src/`)

- `server.ts`: Entry point. Connects DB and starts the server.
- `app.ts`: App configuration (middleware, routes).
- `modules/`: Feature-based architecture.
  - `post/`: Post-related routes, controllers, services, and types.
  - `comment/`: Comment-related logic.
- `middlewares/`: Global middlewares (`auth`, `errorHandler`, `logger`).
- `lib/`: External library configurations (`prisma`, `auth`, `email`).
- `utils/`: Helper functions (e.g., pagination helpers).

### Request Flow

1.  **Request** hits `server.ts` -> `app.ts`.
2.  **Middlewares** (Logger, CORS, JSON Parser) process the request.
3.  **Router** matches path (e.g., `/posts`).
4.  **Auth Middleware** (if protected) verifies session/token and role.
5.  **Controller** extracts data and calls **Service**.
6.  **Service** executes logic (Prisma queries) and returns data.
7.  **Controller** sends JSON response.
8.  **Error Handler** catches any exceptions and formats the error response.

---

## 4. Environment & Configuration

### Required Environment Variables (.env)

- `PORT`: Server port (e.g., `5000`).
- `DATABASE_URL`: PostgreSQL connection string.
- `APP_ORIGIN`: Allowed frontend origin (CORS).
- `APP_URL`: Base URL of the application (for email links).
- `GOOGLE_CLIENT_ID`: Google OAuth ID.
- `GOOGLE_CLIENT_SECRET`: Google OAuth Secret.
- `BETTER_AUTH_SECRET`: Secret key for Better Auth.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: For Nodemailer.

### Scripts

- `pnpm dev`: Runs server in watch mode (`tsx watch src/server.ts`).
- `pnpm build`: Compiles TypeScript to JavaScript.
- `pnpm prisma:generate`: Generates Prisma Client.
- `pnpm prisma:migrate`: Runs database migrations.
- `pnpm prisma:studio`: Opens Prisma Studio GUI.
- `pnpm auth:generate`: Generates Better Auth schema.
- `pnpm admin:seed`: Seeds the database with an admin user.

---

## 5. Database Design

### Models

#### 1. User

Represents a registered user.

- **Fields**: `id` (String), `name`, `email` (Unique), `role` (Enum), `status` (Enum), `image`, `createdAt`, `updatedAt`, `emailVerified`.
- **Enums**:
  - `UserRole`: `USER`, `ADMIN`, `MODERATOR`
  - `UserStatus`: `ACTIVE`, `INACTIVE`, `BANNED`
- **Relations**: Has many `Post`, `Comment`, `Session`, `Account`.

#### 2. Session

Tracks active user sessions.

- **Fields**: `id`, `token`, `expiresAt`, `ipAddress`, `userAgent`, `userId`.

#### 3. Post

Represents a blog article.

- **Fields**: `id` (UUID), `title`, `content` (Text), `thumbnail`, `isFeatured` (Bool), `status` (Enum), `tags` (String[]), `views` (Int).
- **Enums**:
  - `PostStatus`: `PUBLISHED`, `ARCHIVED`, `DRAFT`
- **Relations**: Belongs to `User` (Author), Has many `Comment`.

#### 4. Comment

Represents a comment implementation with support for nested replies.

- **Fields**: `id` (UUID), `content` (Text), `status` (Enum), `parentId` (Nullable), `postId`.
- **Enums**:
  - `CommentStatus`: `APPROVED`, `REJECTED`
- **Relations**: Belongs to `Post`, `User` (Author). Can have a `parent` comment (Self-relation).

#### 5. Account & Verification

Used internally by Better Auth for OAuth and email verification flows.

---

## 6. Authentication & Authorization

### Flow

- **Login**: Users authenticate via `/api/auth/sign-in/email` or Google.
- **Session**: A session token is created and stored in a secure HttpOnly cookie.
- **Middleware**: The `auth(AllowedRoles...)` middleware protects routes.
  - Checks if a valid session exists.
  - Verifies if `user.role` is in the allowed list.

### Roles

- **USER**: Standard access. Can create posts (if configured), comment, and manage own data.
- **ADMIN**: Full access. Can manage all posts, comments, and user statuses.
- **MODERATOR**: Content moderation capabilities (implied, extensible).

---

## 7. API Documentation

### Base URL

`http://localhost:5000` (or `APP_URL`)

### **Authentication**

Managed by Better Auth at `/api/auth/*`. see [Better Auth Docs](https://better-auth.com/) for detailed client usage.

### **Posts Module**

#### 1. Get All Posts

- **URL**: `GET /posts`
- **Auth**: Public
- **Query Params**:
  - `page`: (Int) Page number (default 1).
  - `limit`: (Int) Items per page (default 10).
  - `search`: (String) Search title, content, or tags.
  - `tags`: (String) Comma-separated tags (e.g., "tech,news").
  - `isFeatured`: (Boolean) `true`/`false`.
  - `status`: (String) `PUBLISHED` | `DRAFT` | `ARCHIVED`.
  - `authorId`: (String) Filter by author.
  - `sortBy`: (String) Field to sort by (e.g., `createdAt`).
  - `sortOrder`: (String) `asc` | `desc`.
- **Response**:
  ```json
  {
    "success": true,
    "message": "Post retrieve successfully!",
    "meta": { "total": 100, "page": 1, "totalPages": 10, "limit": 10 },
    "data": [ ...postObjects ]
  }
  ```

#### 2. Get My Posts

- **URL**: `GET /posts/my-posts`
- **Auth**: Required (USER, ADMIN)
- **Query Params**: Same as "Get All Posts".
- **Description**: Retrieves posts created by the currently logged-in user.

#### 3. Get Post Stats

- **URL**: `GET /posts/stats`
- **Auth**: Required (ADMIN)
- **Description**: Returns aggregated statistics (total posts, views, comments, user/admin post counts).

#### 4. Get Post by ID

- **URL**: `GET /posts/:id`
- **Auth**: Public
- **Description**: Fetches a single post with its **comments** (nested structure: Parent -> Replies -> Replies). Increments view count.

#### 5. Create Post

- **URL**: `POST /posts`
- **Auth**: Required (USER, ADMIN)
- **Body**:
  ```json
  {
    "title": "My Post Title",
    "content": "Rich text content here...",
    "tags": ["tech", "prisma"],
    "isFeatured": false, // Optional
    "thumbnail": "https://example.com/image.jpg", // Optional
    "status": "PUBLISHED" // Optional (Default: PUBLISHED)
  }
  ```

#### 6. Update Post

- **URL**: `PATCH /posts/:id`
- **Auth**: Required (Owner or ADMIN)
- **Body**: Partial of Create Post body.
- **Rules**:
  - Normal users can only update their own posts.
  - Only ADMIN can change `isFeatured`.

#### 7. Delete Post

- **URL**: `DELETE /posts/:id`
- **Auth**: Required (Owner or ADMIN)

---

### **Comments Module**

#### 1. Create Comment

- **URL**: `POST /comments`
- **Auth**: Required (USER, ADMIN)
- **Body**:
  ```json
  {
    "content": "This is a comment",
    "postId": "uuid-of-post",
    "parentId": "uuid-of-parent-comment" // Optional (for replies)
  }
  ```

#### 2. Get Comment by ID

- **URL**: `GET /comments/:id`
- **Auth**: Public
- **Description**: Returns comment with parent details.

#### 3. Get Author's Comments

- **URL**: `GET /comments/author/:id`
- **Auth**: Public

#### 4. Update Comment

- **URL**: `PATCH /comments/:id`
- **Auth**: Required (Owner or ADMIN)
- **Body**: `{ "content": "Updated content" }`

#### 5. Change Comment Status

- **URL**: `PATCH /comments/:id/status`
- **Auth**: Required (ADMIN)
- **Body**: `{ "status": "APPROVED" | "REJECTED" }`

#### 6. Delete Comment

- **URL**: `DELETE /comments/:id`
- **Auth**: Required (Owner or ADMIN)

---

## 8. Validation & Error Handling

- **Validation**: Inputs are typically validated using implicit Zod schemas or manual checks in services.
- **Global Error Handler**:
  - Located at `src/middlewares/error-handler.ts`.
  - Catches `PrismaClientValidationError` specifically (Types, Missing Fields).
  - Returns standard error format:
    ```json
    {
      "success": false,
      "message": "Error description",
      "error": "Detailed error info (if any)"
    }
    ```

---

## 9. Frontend Integration Guide (v0 Ready)

### 1. Setup

- Install `better-auth` client on frontend.
- Use `axios` or `fetch` with `credentials: 'include'` (or `withCredentials: true`) to ensure cookies are sent with requests.

### 2. Rendering Comments

- The `GET /posts/:id` endpoint returns nested comments up to 3 levels deep.
- **Frontend Logic**:
  - Map through `post.comments`.
  - For each comment, render generic UI.
  - Check if `comment.replies` exists and render recursively or via a nested component.

### 3. Authentication

- Use generic hooks for "Sign In with Google" or "Sign In with Email".
- Handle `401 Unauthorized` responses by redirecting to login.

### 4. Search & Filter

- Bind input fields directly to the `GET /posts` query parameters.
- Debounce search input to avoid excessive API calls.

---

## 10. Development & Deployment

### Running Locally

1.  Clone repo.
2.  `pnpm install`.
3.  Set up `.env` with DB connection and Auth keys.
4.  `pnpm prisma:migrate` to create tables.
5.  `pnpm admin:seed` to create initial admin.
6.  `pnpm dev` to start server.

### Deployment

- **Database**: Provision a PostgreSQL instance (e.g., Supabase, Neon).
- **Server**: Deploy `dist` folder to Node.js host (Vercel, Railway, DigitalOcean).
- **Build**: Run `pnpm build` before start.
- Ensure strictly `pnpm` is used (`packageManager` key is set).

---
