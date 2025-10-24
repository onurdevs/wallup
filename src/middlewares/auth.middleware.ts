import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ message: "Erişim reddedildi. Token bulunamadı" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        console.error("Auth doğrulama hatası", error);
        return res.status(403).json({
            message: "Geçersiz veya süresi dolmuş token"
        })
    }
}