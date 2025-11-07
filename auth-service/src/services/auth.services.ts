import bcrypt from "bcryptjs";
import User from "../model/auth.model"; // MongoDB model (Mongoose)
import { AppError } from "../errors/appError";
import { ILoginUser, IRegisterUser } from "../interfaces/auth.interfaces";

/**
 * @desc Register a new user
 * @param userData - User input (name, email, password, phone, avatar)
 * @returns Created user (excluding password)
 */
const registerUser = async (userData: IRegisterUser) => {
  // Check if email already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) throw new AppError(400, "User already exists with this email");

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  // Create new user (exclude password in return)
  const newUser = new User({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  });

  await newUser.save();

  // Return user data without password
  const { password, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword;
};

/**
 * @desc Authenticate user with email & password
 * @param loginData - Email & password
 * @returns Authenticated user (excluding password)
 */
const loginUser = async (loginData: ILoginUser) => {
  // Find user by email (include password for comparison)
  const user = await User.findOne({ email: loginData.email });
  if (!user) throw new AppError(400, "Invalid email or password");

  // Verify password
  const isPasswordMatched = await bcrypt.compare(loginData.password, user.password);
  if (!isPasswordMatched) throw new AppError(400, "Invalid email or password");

  // Exclude password before returning
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

export const AuthService = {
  registerUser,
  loginUser,
};
