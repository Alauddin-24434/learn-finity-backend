"use strict";
// prisma/seed.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./app/lib/prisma");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🌱 Starting database seeding...");
        // Create Users
        const adminUser = yield prisma_1.prisma.user.create({
            data: {
                name: 'Mr Admin',
                email: 'admin@gmail.com',
                password: '123456',
                isAdmin: true,
            },
        });
        const normalUser = yield prisma_1.prisma.user.create({
            data: {
                name: 'Alauddin',
                email: 'user@gmail.com',
                password: '123456',
            },
        });
        // Create Categories
        const category = yield prisma_1.prisma.category.create({
            data: {
                name: 'Web Development',
            },
        });
        // Create Course
        const course = yield prisma_1.prisma.course.create({
            data: {
                title: 'Complete React Course',
                description: 'Learn React from scratch.',
                thumbnail: 'https://via.placeholder.com/150',
                price: 5000,
                isFree: false,
                authorId: adminUser.id,
                categoryId: category.id,
            },
        });
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
        console.log("✅ Database seeded successfully");
    });
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(() => {
    prisma_1.prisma.$disconnect();
});
