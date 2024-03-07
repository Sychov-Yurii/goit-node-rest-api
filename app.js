import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import dotenv from "dotenv";
import HttpError from "./helpers/HttpError.js";

dotenv.config();

const app = express();

const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/db-contacts?retryWrites=true&w=majority`;

mongoose
  .connect(url)
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  });

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/users", usersRouter);

app.use((_, res, next) => {
  next(HttpError(404, "Route not found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
