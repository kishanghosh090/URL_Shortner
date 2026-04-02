import express from "express";

const app = express();
const PORT = process.env.PORT || 6002;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({});
});

import userRoute from "./routes/user.routes.js";

app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
  console.log(`server is listning at PORT ${PORT}`);
});
