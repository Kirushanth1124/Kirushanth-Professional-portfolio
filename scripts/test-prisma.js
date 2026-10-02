require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

console.log("PrismaClient:", PrismaClient);

try {
  const prisma = new PrismaClient();
  console.log("✅ Prisma instance created");
} catch (err) {
  console.error("❌ Error creating Prisma:", err);
}