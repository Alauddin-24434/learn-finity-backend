
import bcrypt from "bcryptjs";
import { prisma } from "../app/lib/prisma";
import { AuthService } from "../app/modules/Auth/auth.service";

jest.mock("../app/lib/prisma", () => ({
  prisma: { user: { findUnique: jest.fn(), create: jest.fn() } },
}));

jest.mock("bcryptjs");

describe("Auth Service", () => {
  const userData = { name: "Test", email: "test@example.com", password: "123456", phone: "0123", avatar: "img.jpg" };
  const hashedPassword = "hashed123";

  beforeEach(() => jest.clearAllMocks());

  it("registerUser should create new user", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    (prisma.user.create as jest.Mock).mockResolvedValue({ ...userData, id: "1", password: hashedPassword });

    const result = await AuthService.registerUser(userData);

    expect(prisma.user.create).toHaveBeenCalled();
    expect(result.email).toBe(userData.email);
  });

  it("loginUser should throw error for invalid email", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(AuthService.loginUser({ email: "test@example.com",   password: hashedPassword  })).rejects.toThrow("Invalid email or password");
  });
});
