import * as bcrypt from "bcryptjs"
import * as jose from "jose"
import { cookies } from "next/headers"
import { z } from "zod"
import { prisma } from "./prisma"

const COOKIE_NAME = "auth-token"

// Environment variable validation
const getEnvVar = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

interface JWTPayload {
  id: string
  role: string
  iat?: number
  exp?: number
  isImpersonating?: boolean
  adminId?: string
  adminRole?: string
}

// JWT utilities
export async function generateToken(user: {
  id: string
  role: string
}): Promise<string> {
  const payload: Omit<JWTPayload, "iat" | "exp"> = {
    id: user.id,
    role: user.role,
  }

  const secret = getEnvVar("JWT_SECRET")
  const expiresIn = getEnvVar("JWT_EXPIRES_IN")

  // Convert string secret to Uint8Array for jose
  const secretKey = new TextEncoder().encode(secret)

  // Create JWT with jose
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey)
}

export async function verifyToken(
  token?: string | null
): Promise<JWTPayload | null> {
  if (!token) {
    return null
  }

  try {
    const secret = getEnvVar("JWT_SECRET")
    const secretKey = new TextEncoder().encode(secret)

    const { payload } = await jose.jwtVerify(token, secretKey)

    // Validate and transform the payload
    if (typeof payload.id === "string" && typeof payload.role === "string") {
      // Include impersonation data if present
      if (payload.isImpersonating === true) {
        return {
          id: payload.id,
          role: payload.role,
          iat: payload.iat,
          exp: payload.exp,
          isImpersonating: true,
          adminId: payload.adminId as string,
          adminRole: payload.adminRole as string,
        }
      }

      // Regular token
      return {
        id: payload.id,
        role: payload.role,
        iat: payload.iat,
        exp: payload.exp,
      }
    }
    return null
  } catch (error) {
    if (
      error instanceof jose.errors.JWTExpired ||
      error instanceof jose.errors.JWTInvalid
    ) {
      return null
    }
    throw error
  }
}

// Authentication functions
export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    throw new Error("Invalid credentials")
  }

  const token = await generateToken(user)

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  }
}

/**
 * Register a new user for Robotedge portfolio website
 * @param input The user registration data
 */
export async function register(input: RegisterInput) {
  try {
    // Validate user email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    })
    if (existingUser) {
      throw new Error("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: hashedPassword,
        role: "USER", // Default role for new users
        isActive: true,
        registrationTime: new Date(),
      },
    })

    const token = await generateToken(user)

    // Set auth cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    }
  } catch (error) {
    console.error("Error during registration:", error)
    throw error
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// Get current user from cookies
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

// Middleware helper to check if user is authenticated
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

// Middleware helper to check if user is admin
export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    throw new Error("Admin access required")
  }
  return user
}
