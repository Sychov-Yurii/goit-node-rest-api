import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();
const DB_URI = process.env.DB_URI;

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(8080, () => {
      console.log(`Server is running. Use our API on port:8080`);
      console.log(`Database connection successful.`);
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/contacts", authMiddleware, contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
