import express from "express";
import { shortenPostRequestBodySchema } from "../util/validation/request.validation.js";
import db from "../db/index.js";
import { urlsTable } from "../models/index.js";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/shorten", authMiddleware, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      error: "you must be logged in to access this resource",
    });
  }

  console.log(req.body);

  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.message,
    });
  }

  const { url, code } = validationResult.data;

  const shortCode = code ?? nanoid(6);
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode: shortCode,
      targetURL: url,
      userId: userId,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });

  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetURL: result.targetURL,
  });
});

router.get("/:shortCode", async (req, res) => {
  const code = req.params.shortCode;

  const [result] = await db
    .select({
      targetURL: urlsTable.targetURL,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  if (!result) {
    return res.status(404).json({
      error: "Invalid url",
    });
  }

  return res.redirect("https://" + result.targetURL);
});

export default router;
