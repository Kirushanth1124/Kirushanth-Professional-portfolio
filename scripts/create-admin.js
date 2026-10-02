const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.create({
    data: {
      email: "admin@portfolio.com",
      password: hashedPassword,
    },
  });

  console.log("Admin created:", admin);
}

main();