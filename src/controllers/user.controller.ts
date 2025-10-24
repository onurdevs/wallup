import { User } from "../models/user.model.ts"

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.status(200).json({
            message: "İşlem başarılı",
            user
        })
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası" })
    }
}