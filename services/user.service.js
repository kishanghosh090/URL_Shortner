import { eq } from "drizzle-orm";
import db from "../db/index.js";

import { users } from "../models/schema.js";

export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({
      id: users.id,
      lastName: users.lastName,
      firstName: users.firstName,
      email: users.email,
      salt: users.salt,
      password: users.password,
    })
    .from(users)
    .where(eq(users.email, email));

  return existingUser;
}
