const User = require('../models/User');
const { protect } = require('./authMiddleware');

// Admin kontrolü middleware'i
const requireAdmin = async (req, res, next) => {
    try {
        // Önce auth kontrolü yap
        await new Promise((resolve, reject) => {
            protect(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Kullanıcının admin olup olmadığını kontrol et
        if (!req.user.isAdmin()) {
            return res.status(403).json({
                success: false,
                message: 'Bu işlem için admin yetkisi gereklidir'
            });
        }

        // Kullanıcının aktif olup olmadığını kontrol et
        if (!req.user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Hesabınız deaktif durumda'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Yetki kontrolü sırasında hata oluştu',
            error: error.message
        });
    }
};

// Moderator veya Admin kontrolü middleware'i
const requireModerator = async (req, res, next) => {
    try {
        // Önce auth kontrolü yap
        await new Promise((resolve, reject) => {
            protect(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        if (!req.user.isModerator()) {
            return res.status(403).json({
                success: false,
                message: 'Bu işlem için moderator veya admin yetkisi gereklidir'
            });
        }

        if (!req.user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Hesabınız deaktif durumda'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Yetki kontrolü sırasında hata oluştu',
            error: error.message
        });
    }
};

// Kategori yönetimi yetkisi kontrolü
const requireCategoryManagement = async (req, res, next) => {
    try {
        // Önce auth kontrolü yap
        await new Promise((resolve, reject) => {
            protect(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        if (!req.user.canManageCategories()) {
            return res.status(403).json({
                success: false,
                message: 'Kategori yönetimi için admin yetkisi gereklidir'
            });
        }

        if (!req.user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Hesabınız deaktif durumda'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Yetki kontrolü sırasında hata oluştu',
            error: error.message
        });
    }
};

// Konum yönetimi yetkisi kontrolü
const requireLocationManagement = async (req, res, next) => {
    try {
        // Önce auth kontrolü yap
        await new Promise((resolve, reject) => {
            protect(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        if (!req.user.canManageLocations()) {
            return res.status(403).json({
                success: false,
                message: 'Konum yönetimi için admin yetkisi gereklidir'
            });
        }

        if (!req.user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Hesabınız deaktif durumda'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Yetki kontrolü sırasında hata oluştu',
            error: error.message
        });
    }
};

module.exports = {
    requireAdmin,
    requireModerator,
    requireCategoryManagement,
    requireLocationManagement
};
