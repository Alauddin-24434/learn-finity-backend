import { prisma } from "../app/lib/prisma";
import { userService } from "../app/modules/User/user.service";

jest.mock("../app/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("User Service", () => {
  const user = { id: "1", name: "Test", email: "test@example.com", phone: "123", avatar: "img.jpg", isAdmin: false, createdAt: new Date(), updatedAt: new Date() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getAllUsers should return users", async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([user]);
    const result = await userService.getAllUsers();
    expect(result).toEqual([user]);
  });

  it("getMe should return a user if found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    const result = await userService.getMe("1");
    expect(result).toEqual(user);
  });

  it("updateUser should throw error if user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(userService.updateUser("1", { name: "New" })).rejects.toThrow("User not found");
  });

  it("deleteUser should return success message", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.user.update as jest.Mock).mockResolvedValue({ ...user, isDeleted: true });
    const result = await userService.deleteUser("1");
    expect(result).toEqual({ message: "User deleted successfully" });
  });
});
