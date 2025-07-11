import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import dbConnection from "./config/dbConnection.js";
import authRoutes from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
dotenv.config();
const app = express();
app.use(cors({
    origin:[process.env.BASE_URL],
    methods:['POST','GET','PUT','DELETE'],
    credentials:true
}))
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/blogs',postRoute);
dbConnection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB error.");
  });
