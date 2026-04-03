import express from "express";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 6002;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({});
});

import userRoute from "./routes/user.routes.js";
import urlRoute from "./routes/url.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

app.use("/api/v1/user", userRoute);
app.use(authMiddleware);
app.use("/api/v1/url", urlRoute);

app.listen(PORT, () => {
  console.log(`server is listning at PORT ${PORT}`);
});
