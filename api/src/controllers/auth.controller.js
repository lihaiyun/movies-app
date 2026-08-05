import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { signToken } from "../lib/jwt.js";
import { AUTH_COOKIE_NAME, authCookieOptions } from "../lib/cookies.js";
import { AppError } from "../lib/errors.js";

const SALT_ROUNDS = 10;

function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    throw new AppError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning();

  const token = signToken({ id: user.id, role: user.role });
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);
  res.status(201).json(toSafeUser(user));
}

export async function login(req, res) {
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signToken({ id: user.id, role: user.role });
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);
  res.json(toSafeUser(user));
}

export async function logout(req, res) {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
  res.status(204).send();
}

export async function me(req, res) {
  const [user] = await db.select().from(users).where(eq(users.id, req.user.id));

  if (!user) {
    throw new AppError(401, "Session user no longer exists");
  }

  res.json(toSafeUser(user));
}
