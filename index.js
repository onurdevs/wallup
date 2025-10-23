require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose")

const app = express()
app.use(express.json())

const authRoutes = require("./routes/authRoutes")
const listingRoutes = require("./routes/listingRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const locationRoutes = require("./routes/locationRoutes")

app.get("/", (req, res) => {
    res.send("İlan Panosu API V1.0 Yayında!")
})

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/locations", locationRoutes);

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("MongoDB veritabanına başarıyla bağlandı")
        
        // Veritabanını seed et (kategoriler ve konumlar)
        const { seedDatabase } = require('./seed');
        await seedDatabase();
        
        app.listen(PORT, () => {
            console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor.`)
        })
    })
    .catch((err) => {
        console.error("Veritabanı bağlantı hatası: ", err)
        process.exit(1)
    });
