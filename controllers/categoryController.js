const Category = require('../models/Category');

// Tüm kategorileri getir (aktif olanlar)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .sort({ sortOrder: 1, name: 1 })
            .select('name slug description icon');

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategoriler getirilirken hata oluştu',
            error: error.message
        });
    }
};

// Slug ile kategori getir
exports.getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ 
            slug: req.params.slug, 
            isActive: true 
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategori getirilirken hata oluştu',
            error: error.message
        });
    }
};

// ID ile kategori getir
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategori getirilirken hata oluştu',
            error: error.message
        });
    }
};

// Yeni kategori oluştur (admin işlemi)
exports.createCategory = async (req, res) => {
    try {
        const { name, description, icon, sortOrder } = req.body;

        // Kategori adı kontrolü
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Kategori adı gereklidir'
            });
        }

        // Aynı isimde kategori var mı kontrol et
        const existingCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Bu isimde bir kategori zaten mevcut'
            });
        }

        const category = new Category({
            name,
            description,
            icon: icon || 'default',
            sortOrder: sortOrder || 0
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: 'Kategori başarıyla oluşturuldu',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategori oluşturulurken hata oluştu',
            error: error.message
        });
    }
};

// Kategori güncelle (admin işlemi)
exports.updateCategory = async (req, res) => {
    try {
        const { name, description, icon, sortOrder, isActive } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori bulunamadı'
            });
        }

        // İsim değiştiriliyorsa benzersizlik kontrolü
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: req.params.id }
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu isimde bir kategori zaten mevcut'
                });
            }
        }

        // Güncelleme
        if (name) category.name = name;
        if (description !== undefined) category.description = description;
        if (icon) category.icon = icon;
        if (sortOrder !== undefined) category.sortOrder = sortOrder;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Kategori başarıyla güncellendi',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategori güncellenirken hata oluştu',
            error: error.message
        });
    }
};

// Kategori sil (admin işlemi)
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori bulunamadı'
            });
        }

        // Bu kategoriyi kullanan ilanlar var mı kontrol et
        const Listing = require('../models/Listing');
        const listingsCount = await Listing.countDocuments({ category: req.params.id });

        if (listingsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Bu kategoriyi kullanan ${listingsCount} ilan bulunuyor. Önce bu ilanları silin veya başka kategoriye taşıyın.`
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Kategori başarıyla silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategori silinirken hata oluştu',
            error: error.message
        });
    }
};
