export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Kimlik doğrulaması başarısız"
                })
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Erişim reddedildi"
                })
            }

            next();
        } catch (error) {
            console.error("Yetkilendirme hatası", error);
            return res.status(500).json({
                message: "Sunucu hatası (yetkilendirme sırasında)"
            })
        }
    }
}