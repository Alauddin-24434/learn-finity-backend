// prisma/seed.ts

import { PaymentStatus } from "../generated/prisma"
import { prisma } from "./app/lib/prisma"


async function main() {
  console.log("🌱 Starting database seeding...")

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Mr Admin',
      email: 'admin@gmail.com',
      password: '123456',
      isAdmin: true,
    },
  })

  const normalUser = await prisma.user.create({
    data: {
      name: 'Alauddin',
      email: 'user@gmail.com',
      password: '123456',
    },
  })

  // Create Categories
  const category = await prisma.category.create({
    data: {
      name: 'Web Development',
    },
  })

  // Create Course
  const course = await prisma.course.create({
    data: {
      title: 'Complete React Course',
      description: 'Learn React from scratch.',
      thumbnail: 'https://via.placeholder.com/150',
      price: 5000,
      isFree: false,
      authorId: adminUser.id,
      categoryId: category.id,
    },
  })

  // Create Lessons
  // await prisma.lesson.createMany({
  //   data: [
  //     {
  //       title: 'Intro to React',
  //       duration: '10:00',
  //       videoUrl: 'https://example.com/video1',
  //       courseId: course.id,
  //     },
  //     {
  //       title: 'JSX Deep Dive',
  //       duration: '15:00',
  //       videoUrl: 'https://example.com/video2',
  //       courseId: course.id,
  //     },
  //   ],
  // })

  // Create Coupon
  // const coupon = await prisma.coupon.create({
  //   data: {
  //     code: 'DISCOUNT50',
  //     discount: 50,
  //     expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  //     courses: {
  //       connect: { id: course.id },
  //     },
  //   },
  // })

  // User enrolls in course
  // await prisma.enrollment.create({
  //   data: {
  //     userId: normalUser.id,
  //     courseId: course.id,
  //   },
  // })

  // Create a Payment
  // await prisma.payment.create({
  //   data: {
  //     userId: normalUser.id,
  //     courseId: course.id,
  //     amount: 5000,
  //     currency: 'USD',
  //     phone: '1234567890',
  //     provider: 'stripe',
  //     status: PaymentStatus.PAID,
  //     transactionId: 'txn_123ABC',
  //   },
  // })

  // Mark Coupon as used
  // await prisma.couponUsage.create({
  //   data: {
  //     userId: normalUser.id,
  //     couponId: coupon.id,
  //   },
  // })

  console.log("✅ Database seeded successfully")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
