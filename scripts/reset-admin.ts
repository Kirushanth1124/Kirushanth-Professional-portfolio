import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const newPassword = "Admin@123";

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const admin = await prisma.admin.upsert({
    where: {
      email,
    },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  console.log("Admin ready:");
  console.log("Email:", admin.email);
  console.log("Password: Admin@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });