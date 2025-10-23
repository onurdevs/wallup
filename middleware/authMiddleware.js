const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    let token;

    // 1️⃣ Header kontrolü
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // 2️⃣ Token'ı al
            token = req.headers.authorization.split(" ")[1];

            // 3️⃣ Token'ı doğrula
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4️⃣ Kullanıcıyı bul
            req.user = await User.findById(decoded.userId).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "Kullanıcı bulunamadı" });
            }

            // 5️⃣ Yetki tamam
            next();
        } catch (error) {
            console.error("JWT doğrulama hatası:", error.message);
            return res.status(401).json({ message: "Yetki başarısız, token geçersiz" });
        }
    } else {
        return res.status(401).json({ message: "Yetki başarısız, token bulunamadı" });
    }
};
