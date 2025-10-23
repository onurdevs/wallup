const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

exports.registerUser = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const userExist = await User.findOne({ email })

        if (userExist) {
            return res.status(400).json({
                message: "Bu e-posta zaten kullanılıyor"
            })
        }

        const user = new User({
            email,
            username,
            password
        })

        await user.save()

        const token = generateToken(user._id)

        res.status(201).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            token: token
        })
    } catch (error) {
        res.status(500).json({
            message: "Sunucu hatası",
            error: error.message
        })
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                message: "Geçersiz e-posta veya şifre"
            })
        }

        // Hesap aktif mi kontrol et
        if (!user.isActive) {
            return res.status(403).json({
                message: "Hesabınız deaktif durumda"
            })
        }

        // Last login güncelle
        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            token: token,
        });
    } catch (error) {
        res.status(500).json({
            message: "Sunucu Hatası",
            error: error.message
        })
    }
}