import mongoose from "mongoose";

const dbconnection = async () => {
  try {
    mongoose
      .connect(process.env.MONGODB_URL, {})
      .then(() => {
        console.log("Database is connected");
      })
      .catch((err) => {
        console.log("database error", err.message);
      });
  } catch (error) {
    console.log(error,'dataase');
  }
};

export default dbconnection;
