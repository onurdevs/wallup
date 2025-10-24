import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'wallup',
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("DB Bağlantısı başarılı")
    } catch (error) {
        console.error("MongoDB Bağlantı hatası", error);
        process.exit(1);
    }
}