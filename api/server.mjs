var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express3 from "express";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.2.0",
  "engineVersion": "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum UserRole {\n  USER\n  ADMIN\n  MODERATOR\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  BANNED\n}\n\nmodel User {\n  id            String     @id\n  name          String\n  email         String\n  emailVerified Boolean    @default(false)\n  image         String?\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  // additional fields\n  role          UserRole   @default(USER)\n  phone         String?\n  status        UserStatus @default(ACTIVE)\n  // relations\n  posts         Post[]\n  comments      Comment[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum CommentStatus {\n  APPROVED\n  REJECTED\n}\n\nmodel Comment {\n  id        String        @id @default(uuid())\n  content   String        @db.Text\n  status    CommentStatus @default(APPROVED)\n  // relations\n  parentId  String?\n  parent    Comment?      @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)\n  replies   Comment[]     @relation("CommentReplies")\n  authorId  String\n  author    User          @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  postId    String\n  post      Post          @relation(fields: [postId], references: [id], onDelete: Cascade)\n  // timestamps\n  createdAt DateTime      @default(now())\n  updatedAt DateTime      @updatedAt\n\n  @@index([postId])\n  @@index([authorId])\n  @@index([parentId])\n  @@map("comments")\n}\n\nenum PostStatus {\n  PUBLISHED\n  ARCHIVED\n  DRAFT\n}\n\nmodel Post {\n  id         String     @id @default(uuid())\n  title      String     @db.VarChar(255)\n  content    String     @db.Text\n  thumbnail  String?\n  isFeatured Boolean    @default(false)\n  status     PostStatus @default(PUBLISHED)\n  tags       String[]\n  views      Int        @default(0)\n  // relations\n  authorId   String\n  author     User       @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  comments   Comment[]\n  // timestamps\n  createdAt  DateTime   @default(now())\n  updatedAt  DateTime   @updatedAt\n\n  @@index([authorId])\n  @@map("posts")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"posts","kind":"object","type":"Post","relationName":"PostToUser"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"CommentStatus"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Comment","relationName":"CommentReplies"},{"name":"replies","kind":"object","type":"Comment","relationName":"CommentReplies"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"author","kind":"object","type":"User","relationName":"CommentToUser"},{"name":"postId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"Post","relationName":"CommentToPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"comments"},"Post":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"thumbnail","kind":"scalar","type":"String"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"status","kind":"enum","type":"PostStatus"},{"name":"tags","kind":"scalar","type":"String"},{"name":"views","kind":"scalar","type":"Int"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"author","kind":"object","type":"User","relationName":"PostToUser"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"posts"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  }
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CommentScalarFieldEnum: () => CommentScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PostScalarFieldEnum: () => PostScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.2.0",
  engine: "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Comment: "Comment",
  Post: "Post"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CommentScalarFieldEnum = {
  id: "id",
  content: "content",
  status: "status",
  parentId: "parentId",
  authorId: "authorId",
  postId: "postId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PostScalarFieldEnum = {
  id: "id",
  title: "title",
  content: "content",
  thumbnail: "thumbnail",
  isFeatured: "isFeatured",
  status: "status",
  tags: "tags",
  views: "views",
  authorId: "authorId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR"
};
var CommentStatus = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/email.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.DEV_APP_ORIGIN, process.env.PROD_APP_ORIGIN],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
    // requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log({ user, url, token });
      const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
      const info = await transporter.sendMail({
        from: '"Prisma Blog App" <prismablog@app.email>',
        to: user.email,
        subject: "Please verify your email!",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Email Verification</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f4f6f8;
              font-family: Arial, Helvetica, sans-serif;
            }
        
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
        
            .header {
              background-color: #0f172a;
              color: #ffffff;
              padding: 20px;
              text-align: center;
            }
        
            .header h1 {
              margin: 0;
              font-size: 22px;
            }
        
            .content {
              padding: 30px;
              color: #334155;
              line-height: 1.6;
            }
        
            .content h2 {
              margin-top: 0;
              font-size: 20px;
              color: #0f172a;
            }
        
            .button-wrapper {
              text-align: center;
              margin: 30px 0;
            }
        
            .verify-button {
              background-color: #2563eb;
              color: #ffffff !important;
              padding: 14px 28px;
              text-decoration: none;
              font-weight: bold;
              border-radius: 6px;
              display: inline-block;
            }
        
            .verify-button:hover {
              background-color: #1d4ed8;
            }
        
            .footer {
              background-color: #f1f5f9;
              padding: 20px;
              text-align: center;
              font-size: 13px;
              color: #64748b;
            }
        
            .link {
              word-break: break-all;
              font-size: 13px;
              color: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>Prisma Blog</h1>
            </div>
        
            <!-- Content -->
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>
                Hello ${user.name} <br /><br />
                Thank you for registering on <strong>Prisma Blog</strong>.
                Please confirm your email address to activate your account.
              </p>
        
              <div class="button-wrapper">
                <a href="${verifyUrl}" class="verify-button">
                  Verify Email
                </a>
              </div>
        
              <p>
                If the button doesn\u2019t work, copy and paste the link below into your browser:
              </p>
        
              <p class="link">
                ${url}
              </p>
        
              <p>
                This verification link will expire soon for security reasons.
                If you did not create an account, you can safely ignore this email.
              </p>
        
              <p>
                Regards, <br />
                <strong>Prisma Blog Team</strong>
              </p>
            </div>
        
            <!-- Footer -->
            <div class="footer">
              \xA9 2025 Prisma Blog. All rights reserved.
            </div>
          </div>
        </body>
        </html>
        `
      });
      console.log("Message sent:", info.messageId);
    }
  },
  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/modules/post/post.route.ts
import express from "express";

// src/modules/post/post.service.ts
var createPost = async (data, userId) => {
  const result = await prisma.post.create({
    data: { ...data, authorId: userId }
  });
  return result;
};
var createManyPosts = async (data, userId) => {
  const result = await prisma.post.createMany({
    data: data.map((post) => ({ ...post, authorId: userId }))
  });
  return result;
};
var getPosts = async ({
  skip,
  take,
  orderBy,
  search,
  tags,
  isFeatured,
  status,
  authorId
}) => {
  const whereFilters = {
    AND: [
      // searching in title, content and tags
      {
        ...search && {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive"
              }
            },
            {
              content: {
                contains: search,
                mode: "insensitive"
              }
            },
            {
              tags: {
                has: search
              }
            }
          ]
        }
      },
      // filtering by tags
      {
        ...tags.length > 0 && {
          tags: {
            hasEvery: tags
          }
        }
      },
      // filtering by isFeatured
      {
        ...typeof isFeatured === "boolean" && {
          isFeatured
        }
      },
      // filtering by status
      {
        ...status && {
          status
        }
      },
      // filtering by authorId
      {
        ...authorId && {
          authorId
        }
      }
    ]
  };
  const result = await prisma.post.findMany({
    include: {
      author: { select: { id: true, name: true, email: true } },
      // counts of comments
      _count: { select: { comments: true } }
    },
    // filtering
    where: whereFilters,
    // pagination
    skip,
    take,
    // sorting
    ...orderBy && { orderBy }
  });
  const total = await prisma.post.count({
    where: whereFilters
  });
  return { data: result, total };
};
var getPostById = async (postId) => {
  const result = await prisma.$transaction(async (ctx) => {
    const post = await ctx.post.findUnique({
      where: { id: postId },
      include: {
        _count: {
          select: { comments: true }
        },
        // 1st level of comments - Parent comments
        comments: {
          orderBy: { createdAt: "desc" },
          where: {
            parentId: null,
            status: "APPROVED"
          },
          // 2nd level of comments - Replies to Parent comments
          include: {
            _count: {
              select: { replies: true }
            },
            replies: {
              orderBy: {
                createdAt: "asc"
              },
              where: {
                status: "APPROVED"
              },
              // 3rd level of comments - Replies to Replies
              include: {
                _count: {
                  select: { replies: true }
                },
                replies: {
                  orderBy: {
                    createdAt: "asc"
                  },
                  where: {
                    status: "APPROVED"
                  }
                },
                author: { select: { id: true, name: true, email: true } }
              }
            },
            author: { select: { id: true, name: true, email: true } }
          }
        },
        author: { select: { id: true, name: true, email: true } }
      }
    });
    if (!post) throw new Error("Post not found");
    await ctx.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } }
    });
    return post;
  });
  return result;
};
var getMyPosts = async ({
  skip,
  take,
  orderBy,
  search,
  tags,
  isFeatured,
  status,
  authorId
}) => {
  const user = await prisma.user.findUnique({
    where: { id: authorId },
    select: { status: true }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user?.status !== "ACTIVE") {
    throw new Error("User is not active");
  }
  const whereFilters = {
    authorId,
    AND: [
      // searching in title, content and tags
      {
        ...search && {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive"
              }
            },
            {
              content: {
                contains: search,
                mode: "insensitive"
              }
            },
            {
              tags: {
                has: search
              }
            }
          ]
        }
      },
      // filtering by tags
      {
        ...tags.length > 0 && {
          tags: {
            hasEvery: tags
          }
        }
      },
      // filtering by isFeatured
      {
        ...typeof isFeatured === "boolean" && {
          isFeatured
        }
      },
      // filtering by status
      {
        ...status && {
          status
        }
      }
    ]
  };
  const result = await prisma.post.findMany({
    // filtering
    where: whereFilters,
    // pagination
    skip,
    take,
    // sorting
    ...orderBy && { orderBy },
    include: { _count: { select: { comments: true } } }
  });
  const total = await prisma.post.count({
    where: whereFilters
  });
  return { data: result, total };
};
var updatePost = async (id, payload, authorId, isAdmin) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("No update data provided!");
  }
  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, authorId: true }
  });
  if (!post) throw new Error("Post not found!");
  if (!isAdmin && payload.isFeatured !== void 0) {
    delete payload.isFeatured;
  }
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post!");
  }
  const result = await prisma.post.update({
    where: { id },
    data: payload
  });
  return result;
};
var deletePost = async (id, authorId, isAdmin) => {
  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, authorId: true }
  });
  if (!post) throw new Error("Post not found!");
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post!");
  }
  const result = await prisma.post.delete({
    where: { id }
  });
  return result;
};
var getPostStats = async () => {
  const result = await prisma.$transaction(async (tx) => {
    const [
      total,
      totalPublished,
      totalDraft,
      totalArchived,
      totalFeatured,
      totalAuthorsAdmin,
      totalAuthorsUser,
      viewsAgg,
      totalComments,
      totalApprovedComments,
      totalRejectedComments
    ] = await Promise.all([
      // total aggregations
      tx.post.count(),
      tx.post.count({
        where: { status: "PUBLISHED" }
      }),
      tx.post.count({
        where: { status: "DRAFT" }
      }),
      tx.post.count({
        where: { status: "ARCHIVED" }
      }),
      tx.post.count({
        where: { isFeatured: true }
      }),
      tx.post.groupBy({
        by: ["authorId"],
        where: {
          author: {
            role: "ADMIN"
          }
        }
      }),
      tx.post.groupBy({
        by: ["authorId"],
        where: {
          author: {
            role: "USER"
          }
        }
      }),
      // views aggregation
      tx.post.aggregate({
        _sum: { views: true },
        _avg: { views: true },
        _min: { views: true },
        _max: { views: true }
      }),
      // comment aggregations
      tx.comment.count(),
      tx.comment.count({
        where: { status: "APPROVED" }
      }),
      tx.comment.count({
        where: { status: "REJECTED" }
      })
    ]);
    const {
      _sum: { views: totalViews },
      _avg: { views: avgViews },
      _min: { views: minViews },
      _max: { views: maxViews }
    } = viewsAgg;
    return {
      totalAgg: {
        total,
        totalPublished,
        totalDraft,
        totalArchived,
        totalFeatured,
        totalAuthorsAdmin: totalAuthorsAdmin.length,
        totalAuthorsUser: totalAuthorsUser.length
      },
      viewsAgg: {
        total: totalViews ?? 0,
        avg: parseFloat(avgViews?.toFixed(2) ?? "0"),
        min: minViews ?? 0,
        max: maxViews ?? 0
      },
      commentAgg: {
        total: totalComments,
        totalApproved: totalApprovedComments,
        totalRejected: totalRejectedComments
      }
    };
  });
  return result;
};
var postServices = {
  createPost,
  createManyPosts,
  getPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getPostStats
};

// src/utils/pagination-sort.ts
var buildPaginationAndSort = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 5;
  const skip = (page - 1) * limit;
  const orderBy = options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : void 0;
  return {
    skip,
    take: limit,
    orderBy
  };
};

// src/modules/post/post.controller.ts
var createPost2 = async (req, res, next) => {
  try {
    const result = await postServices.createPost(req.body, req?.user?.id);
    res.status(201).send({
      success: true,
      message: "Post created successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createManyPosts2 = async (req, res, next) => {
  try {
    const result = await postServices.createManyPosts(req.body, req?.user?.id);
    res.status(201).send({
      success: true,
      message: "Posts created successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getPosts2 = async (req, res, next) => {
  try {
    const { search, tags, isFeatured, status, authorId } = req.query;
    const { skip, take, orderBy } = buildPaginationAndSort(req.query);
    const splittedTags = tags ? tags.split(",") : [];
    const booleanIsFeatured = isFeatured === "true" ? true : isFeatured === "false" ? false : void 0;
    const result = await postServices.getPosts({
      skip,
      take,
      orderBy,
      search,
      tags: splittedTags,
      isFeatured: booleanIsFeatured,
      status,
      authorId
    });
    res.status(200).send({
      success: true,
      message: "Post retrieve successfully!",
      meta: {
        total: result.total,
        page: Math.ceil(skip / take) + 1,
        totalPages: Math.ceil(result.total / take),
        limit: take,
        skip
      },
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};
var getPostById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await postServices.getPostById(id);
    if (!result) {
      return res.status(404).send({
        success: false,
        message: "Post not found!!"
      });
    }
    res.status(200).send({
      success: true,
      message: "Post retrieved successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMyPosts2 = async (req, res, next) => {
  try {
    const authorId = req?.user?.id;
    const { search, tags, isFeatured, status } = req.query;
    const { skip, take, orderBy } = buildPaginationAndSort(req.query);
    const splittedTags = tags ? tags.split(",") : [];
    const booleanIsFeatured = isFeatured === "true" ? true : isFeatured === "false" ? false : void 0;
    const result = await postServices.getMyPosts({
      skip,
      take,
      orderBy,
      search,
      tags: splittedTags,
      isFeatured: booleanIsFeatured,
      status,
      authorId
    });
    res.status(200).send({
      success: true,
      message: "My posts retrieved successfully!",
      meta: {
        total: result.total,
        page: Math.ceil(skip / take) + 1,
        totalPages: Math.ceil(result.total / take),
        limit: take,
        skip
      },
      data: result.data
    });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};
var updatePost2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req?.user?.id;
    const isAdmin = req?.user?.role === "ADMIN";
    const payload = req.body;
    const result = await postServices.updatePost(
      id,
      payload,
      userId,
      isAdmin
    );
    res.status(200).send({
      success: true,
      message: "Post updated successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deletePost2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req?.user?.id;
    const isAdmin = req?.user?.role === "ADMIN";
    const result = await postServices.deletePost(id, userId, isAdmin);
    res.status(200).send({
      success: true,
      message: "Post deleted successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getPostStats2 = async (req, res, next) => {
  try {
    const result = await postServices.getPostStats();
    res.status(200).send({
      success: true,
      message: "Post stats retrieved successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var postControllers = {
  createPost: createPost2,
  createManyPosts: createManyPosts2,
  getPosts: getPosts2,
  getPostById: getPostById2,
  getMyPosts: getMyPosts2,
  updatePost: updatePost2,
  deletePost: deletePost2,
  getPostStats: getPostStats2
};

// src/middlewares/auth.ts
import { fromNodeHeaders } from "better-auth/node";
var auth2 = (...roles) => {
  return async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No session found!"
      });
    }
    const { id, email, name, role, emailVerified } = session.user;
    req.user = { id, email, name, role, emailVerified };
    if (roles.length && !roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't have permissions to access this resource!"
      });
    }
    next();
  };
};
var auth_default = auth2;

// src/modules/post/post.route.ts
var router = express.Router();
router.get("/", postControllers.getPosts);
router.get(
  "/my-posts",
  auth_default("USER" /* USER */, "ADMIN" /* ADMIN */),
  postControllers.getMyPosts
);
router.get("/stats", auth_default("ADMIN" /* ADMIN */, "USER" /* USER */), postControllers.getPostStats);
router.get("/:id", postControllers.getPostById);
router.post("/", auth_default("USER" /* USER */, "ADMIN" /* ADMIN */), postControllers.createPost);
router.post(
  "/create-many",
  auth_default("USER" /* USER */, "ADMIN" /* ADMIN */),
  postControllers.createManyPosts
);
router.patch("/:id", auth_default("USER" /* USER */, "ADMIN" /* ADMIN */), postControllers.updatePost);
router.delete("/:id", auth_default("USER" /* USER */, "ADMIN" /* ADMIN */), postControllers.deletePost);
var postRouter = router;

// src/modules/comment/comment.route.ts
import express2 from "express";

// src/modules/comment/comment.service.ts
var createComment = async (payload) => {
  const post = await prisma.post.findUnique({
    where: {
      id: payload.postId
    }
  });
  if (!post) {
    throw new Error("Post not found!");
  }
  if (payload.parentId) {
    const parent = await prisma.comment.findUnique({
      where: {
        id: payload.parentId
      }
    });
    if (!parent) {
      throw new Error("Parent comment not found!");
    }
    if (parent.postId !== payload.postId) {
      throw new Error("Parent comment does not belong to this post");
    }
  }
  const result = await prisma.comment.create({
    data: payload,
    include: { parent: true }
  });
  return result;
};
var getAllComments = async ({
  skip,
  take,
  orderBy,
  search,
  status,
  authorId,
  postId
}) => {
  const whereFilters = {
    AND: [
      // searching in content
      {
        ...search && {
          OR: [
            {
              content: {
                contains: search,
                mode: "insensitive"
              }
            }
          ]
        }
      },
      // filtering by status
      {
        ...status && {
          status
        }
      },
      // filtering by authorId
      {
        ...authorId && {
          authorId
        }
      },
      // filtering by postId
      {
        ...postId && {
          postId
        }
      }
    ]
  };
  const result = await prisma.comment.findMany({
    include: {
      post: { select: { id: true, title: true } },
      author: { select: { id: true, name: true, email: true } },
      parent: { select: { id: true, content: true, authorId: true } }
    },
    // filtering
    where: whereFilters,
    // pagination
    skip,
    take,
    // sorting
    ...orderBy && { orderBy }
  });
  const total = await prisma.comment.count({
    where: whereFilters
  });
  return { data: result, total };
};
var getCommentById = async (id) => {
  const result = await prisma.comment.findUnique({
    where: { id },
    include: {
      parent: { select: { id: true, content: true, authorId: true } },
      post: { select: { id: true, title: true } },
      author: { select: { id: true, name: true, email: true } }
    }
  });
  return result;
};
var getCommentsByAuthorId = async (authorId) => {
  const result = await prisma.comment.findMany({
    where: { authorId },
    include: {
      parent: { select: { id: true, content: true, authorId: true } },
      replies: { select: { id: true, content: true, authorId: true } },
      post: { select: { id: true, title: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var deleteComment = async (id, authorId, role) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, authorId: true }
  });
  if (!comment) throw new Error("Comment not found!");
  if (comment.authorId !== authorId && role !== UserRole.ADMIN) {
    throw new Error("You are not authorized to delete this comment!");
  }
  const result = await prisma.comment.delete({ where: { id: comment.id } });
  return result;
};
var updateComment = async (id, authorId, role, payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("No update data provided!");
  }
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, authorId: true }
  });
  if (!comment) throw new Error("Comment not found!");
  if (comment.authorId !== authorId && role !== UserRole.ADMIN) {
    throw new Error("You are not authorized to delete this comment!");
  }
  const result = await prisma.comment.update({
    where: { id },
    data: payload
  });
  return result;
};
var changeCommentStatus = async (id, status) => {
  if (!status) {
    throw new Error("Status is required!");
  }
  if (status !== CommentStatus.APPROVED && status !== CommentStatus.REJECTED) {
    throw new Error("Invalid status value provided!");
  }
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, status: true }
  });
  if (!comment) throw new Error("Comment not found!");
  if (status === comment.status) {
    throw new Error(`Comment status is already ${status}!`);
  }
  const result = await prisma.comment.update({
    where: { id },
    data: { status }
  });
  return result;
};
var commentServices = {
  createComment,
  getAllComments,
  getCommentById,
  getCommentsByAuthorId,
  deleteComment,
  updateComment,
  changeCommentStatus
};

// src/modules/comment/comment.controller.ts
var createComment2 = async (req, res, next) => {
  try {
    const result = await commentServices.createComment({
      ...req.body,
      authorId: req.user?.id
    });
    res.status(201).json({
      success: true,
      message: "Comment created successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllComments2 = async (req, res, next) => {
  try {
    const { search, status, authorId } = req.query;
    const { skip, take, orderBy } = buildPaginationAndSort(req.query);
    const result = await commentServices.getAllComments({
      skip,
      take,
      orderBy,
      search,
      status,
      authorId,
      postId: req.query.postId
    });
    res.status(200).json({
      success: true,
      message: "Comments retrieved successfully!",
      meta: {
        total: result.total,
        page: Math.ceil(skip / take) + 1,
        totalPages: Math.ceil(result.total / take),
        limit: take,
        skip
      },
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};
var getCommentById2 = async (req, res, next) => {
  try {
    const result = await commentServices.getCommentById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Comment retrieved successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getCommentsByAuthorId2 = async (req, res, next) => {
  try {
    const result = await commentServices.getCommentsByAuthorId(req.params.id);
    res.status(200).json({
      success: true,
      message: "Comments retrieved successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteComment2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req?.user?.id;
    const userRole = req?.user?.role;
    const result = await commentServices.deleteComment(id, userId, userRole);
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateComment2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req?.user?.id;
    const userRole = req?.user?.role;
    const payload = req.body;
    const result = await commentServices.updateComment(
      id,
      userId,
      userRole,
      payload
    );
    res.status(200).json({
      success: true,
      message: "Comment updated successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var changeCommentStatus2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await commentServices.changeCommentStatus(id, status);
    res.status(200).json({
      success: true,
      message: "Comment status updated successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var commentControllers = {
  createComment: createComment2,
  getAllComments: getAllComments2,
  getCommentById: getCommentById2,
  getCommentsByAuthorId: getCommentsByAuthorId2,
  deleteComment: deleteComment2,
  updateComment: updateComment2,
  changeCommentStatus: changeCommentStatus2
};

// src/modules/comment/comment.route.ts
var router2 = express2.Router();
router2.get("/all", auth_default("ADMIN" /* ADMIN */), commentControllers.getAllComments);
router2.get("/:id", commentControllers.getCommentById);
router2.get("/author/:id", commentControllers.getCommentsByAuthorId);
router2.post("/", auth_default("ADMIN" /* ADMIN */, "USER" /* USER */), commentControllers.createComment);
router2.patch(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "USER" /* USER */),
  commentControllers.updateComment
);
router2.patch(
  "/:id/status",
  auth_default("ADMIN" /* ADMIN */),
  commentControllers.changeCommentStatus
);
router2.delete(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "USER" /* USER */),
  commentControllers.deleteComment
);
var commentRouter = router2;

// src/middlewares/logger.ts
var logger = (req, res, next) => {
  const time = (/* @__PURE__ */ new Date()).toLocaleString();
  const method = req.method.padEnd(6);
  const url = req.originalUrl.padEnd(30);
  const status = `${res.statusCode}`.padEnd(3);
  console.log(`${time} | ${status} - ${method} ${url}`);
  next();
};
var logger_default = logger;

// src/middlewares/error-handler.ts
var errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = null;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Validation Error";
    errorDetails = err.message;
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        errorMessage = "Conflict: Unique constraint failed";
        errorDetails = err.message;
        break;
      case "P2025":
        statusCode = 404;
        errorMessage = "Not Found: Record not found";
        errorDetails = err.message;
        break;
      default:
        statusCode = 400;
        errorMessage = "Bad Request";
        errorDetails = err.message;
        break;
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Internal Server Error";
    errorDetails = err.message;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Bad Request: Validation Error";
    errorDetails = err.message;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 500;
    errorMessage = "Internal Server Error: Initialization Error";
    errorDetails = err.message;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage = "Internal Server Error: Rust Panic";
    errorDetails = err.message;
  } else if (err instanceof Error) {
    errorMessage = err.message || "Internal Server Error";
  }
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: errorDetails
  });
};
var error_handler_default = errorHandler;

// src/middlewares/not-found.ts
var notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "API Not Found!",
    path: req.originalUrl
  });
};
var not_found_default = notFound;

// src/app.ts
var app = express3();
app.use(express3.json());
app.use(logger_default);
app.use(
  cors({
    origin: [process.env.DEV_APP_ORIGIN, process.env.PROD_APP_ORIGIN],
    credentials: true
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use(not_found_default);
app.use(error_handler_default);
app.get("/", (req, res) => {
  res.send("Prisma Blog App Server Is Running!");
});
var app_default = app;

// src/server.ts
var PORT = process.env.PORT;
async function server() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");
    app_default.listen(PORT, () => {
      console.log(`Prisma Blog App server is running at port: ${PORT}`);
    });
  } catch (error) {
    console.log("Error occured", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
server();
