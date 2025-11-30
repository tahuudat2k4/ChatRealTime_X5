import mongoose from 'mongoose';
import chalk from 'chalk';
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION);
       console.log(chalk.black.bgGreen("✅ Database connected successfully !"));
    } catch (error) {
        console.error(chalk.black.bgRed("⛔ Database connection failed: "), error);
        process.exit(1);// Exit process with failure 
    }
}