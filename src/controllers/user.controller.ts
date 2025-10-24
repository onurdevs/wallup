import bcrypt from "bcryptjs";
import { User } from "../models/user.model.ts"
import { UserRole } from "../enums/userRole.enum.js";

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

export const saveUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(500).json({
                message: "Lütfen tüm alanları doldurunuz"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Bu e-posta adresi zaten kayıtlı"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });
        return res.status(201).json({
            message: "Başarılı"
        })

    } catch (error) {
        res.status(500).json({
            message: "Sunucu Hatası",
            error
        })
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            message: "İşlem başarılı",
            result: users
        })
    } catch (error) {
        res.status(500).json({
            message: "Hatalı işlem",
            error
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
            return res.status(403).json({ message: "Yalnızca kendi hesabınızı silebilirsiniz" });
        }

        const existingUser = await User.find({ _id: id })

        if (!existingUser) {
            return res.status(404).json({
                message: "Böyle bir kullanıcı yok"
            });
        }

        const deleting = await User.findByIdAndDelete(id)

        if (!deleting) {
            return res.status(404).json({
                message: "Kullanıcı bulunamadı"
            })
        }

        res.status(200).json({
            message: "İşlem başarılı"
        })
    } catch (error) {
        res.status(500).json({
            message: "Hatalı işlem",
            error
        })
    }
}

export const updateUser = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "Böyle bir kullanıcı bulunamadı"
            });
        }

        if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
            return res.status(403).json({ message: "Yalnızca kendi hesabınızı silebilirsiniz" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            user.password = hashed;
        }

        if (role && req.user.role === UserRole.ADMIN) {
            user.role = role;
        }

        if (req.user.role !== UserRole.ADMIN) {
            return res.status(403).json({
                message: "Bu işlemi yapmaya yetkiniz yok."
            })
        }

        await user.save();

        res.status(200).json({
            message: "Kullanıcı başarıyla oluşturuldu"
        })

    } catch (error) {
        console.error("Hata alındı", error);
        res.status(500).json({
            message: "Hatalı işlem",
            error
        })
    }
}