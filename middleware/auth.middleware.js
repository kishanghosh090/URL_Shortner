import { validateUserToken } from "../util/token.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.header["authorization"];
  if (!authHeader) {
    return next();
  }

  if (!authHeader.startsWith("Bearer")) {
    return res.status(400).json({
      err: "Authorization must stat with Bearer",
    });
  }

  const [_, token] = authHeader.split(" ");
  const payload = validateUserToken(token);
  if (payload == null) {
    return res.status(400).json({
      err: "Invalid token",
    });
  }

  req.user = payload;
  next();
}
