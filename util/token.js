import jwt from "jsonwebtoken";
import { userTokenSchema } from "./validation/token.validation.js";
const JWT_SECRET = process.env.JWT_SECRET;

export async function createUserToken(payload) {
  const result = await userTokenSchema.safeParseAsync(payload);
  if (result.error) {
    throw new Error(result.error.message);
  }
  const payloadValidatedData = result.data;
  const token = await jwt.sign(payloadValidatedData, JWT_SECRET);
  return token;
}
export async function validateUserToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}
