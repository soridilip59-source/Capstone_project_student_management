import mongoose from "mongoose";

async function connectDatabase() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
}

export default connectDatabase;
