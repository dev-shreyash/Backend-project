import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionIns = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB connected! DB host: ${connectionIns.connection.host}`);
    } catch (err) {
        console.error("Error connecting to the database", err);
        process.exit(1);
    }
}

export default connectDB;
