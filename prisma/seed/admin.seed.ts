import { UserRole } from "../../generated/prisma/client";
import { prisma } from "../../src/lib/prisma";

async function seedAdmin() {
  try {
    const admin = {
      name: process.env.APP_ADMIN,
      email: process.env.APP_ADMIN_EMAIL,
      password: process.env.APP_ADMIN_PASS,
      role: UserRole.ADMIN,
    };

    const isExists = await prisma.user.findUnique({
      where: { email: admin.email },
    });

    if (isExists) {
      throw new Error("Admin user already exists!");
    }

    // Sign up admin user via Better Auth API
    const signUpAdmin = await fetch(
      `${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(admin),
      }
    );

    if (!signUpAdmin.ok) {
      throw new Error(
        `Failed to sign up admin user: ${signUpAdmin.statusText}`
      );
    }

    // Verify admin email
    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: { email: admin.email },
        data: { emailVerified: true },
      });
      console.log("Admin user created successfully:", signUpAdmin.status);
    }
  } catch (error) {
    console.error("Admin Seed Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
