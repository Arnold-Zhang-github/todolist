// @ts-ignore
import mongoose from "mongoose";

const connectMongoDB = async () => {
   try {
      const mongodbUri = process.env.MONGODB_URI;
      if (!mongodbUri) {
         throw new Error("MONGODB_URI is not defined.");
      }
      await mongoose.connect(mongodbUri);
      console.log("connect to MongoDB");
   } catch (err) {
      console.log(err);
   }
};

export default connectMongoDB;
