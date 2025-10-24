import bcrypt from "bcryptjs";
import { User } from "../models/user.model.ts";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "1h" }
    )

    return { accessToken, refreshToken };
}

export const refreshToken = async (req, res) => {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
        return res.status(401).json({ message: "Refresh token bulunamadı" });
    }

    try {
        const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET)

        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Token yenilendi"
        });
    } catch (error) {
        return res.status(403).json({
            message: "Refresh token geçersiz veya süresi dolmuş"
        })
    }
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Bu e-posta zaten kayıtlı",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            message: "Kayıt başarılı"
        })
    } catch (error) {
        console.error("Hata", error)
        res.status(500).json({
            message: "Sunucu Hatası",
            error: error
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "Böyle bir e-posta bulunamadı"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                message: "Şifre hatalı"
            })
        }

        const { accessToken, refreshToken } = generateToken(user);

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 saat
        })

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
        })

        res.status(200).json({
            message: "Giriş başarılı",
        })

    } catch (error) {
        console.error("Hata", error);
        res.status(500).json({
            message: "Sunucu Hatası",
            error: error
        })
    }
}

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: "strict"
    });
    res.clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "strict"
    });

    res.status(200).json({ message: "Çıkış yapıldı" });
};
