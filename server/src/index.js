import express, { json } from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { connectDB } from "./lib/database.js";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();
const __dirname = path.resolve();
const PORT = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  clerkMiddleware({
    authorizedParties: ["http://localhost:5173"],
  }),
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  }),
);

app.use("/api", routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
  connectDB();
});
