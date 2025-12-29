import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`Prisma Blog App server is running at port: ${PORT}`);
    });
  } catch (error) {
    console.log("Error occured", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
