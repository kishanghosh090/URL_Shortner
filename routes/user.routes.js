import express from "express";
import db from "../db/index.js";
import { users } from "../models/index.js";
import {
  signInPostRequestBodySchema,
  signUpPostRequestBodySchema,
} from "../util/validation/request.validation.js";
import z from "zod";
import { generateHashWithSalt } from "../util/hash.js";
import { getUserByEmail } from "../services/user.service.js";
import { createUserToken } from "../util/token.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const validationResult = await signUpPostRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res
      .status(400)
      .json({ err: z.treeifyError(validationResult.error) });
  }
  const { firstName, lastName, email, password } = validationResult.data;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ error: `user with email ${email} already exists` });
    }

    const generateHash = generateHashWithSalt(password);

    const user = await db.insert(users).values({
      firstName: firstName,
      lastName: lastName != undefined ? lastName : null,
      email: email,
      password: (await generateHash).hashedPassword,
      salt: (await generateHash).salt,
    });

    return res.status(201).json({
      data: {
        userEmail: user.email,
        msg: "user created",
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      err: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const validationResult = await signInPostRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res
      .status(400)
      .json({ err: z.treeifyError(validationResult.error) });
  }
  const { email, password } = validationResult.data;
  const user = await getUserByEmail(email);

  if (!user) {
    return res
      .status(400)
      .json({ err: `user with email ${email} does not exist` });
  }

  const { password: hashedPassword } = await generateHashWithSalt(
    password,
    user.salt,
  );
  if (user.password != hashedPassword) {
    return res.status(400).json({ err: `Invalid password` });
  }

  const token = createUserToken({ id: user.id });
  return res
    .cookie(token)
    .status(200)
    .json({ msg: "user logged is successfully" });
});
export default router;
