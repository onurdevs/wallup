const express = require('express');
const router = express.Router();

const {
    getAllCategories,
    getCategoryBySlug,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

const { requireCategoryManagement } = require('../middleware/adminMiddleware');

// Public routes - herkes erişebilir
router.route('/')
    .get(getAllCategories); // Tüm kategorileri getir

router.route('/slug/:slug')
    .get(getCategoryBySlug); // Slug ile kategori getir

router.route('/:id')
    .get(getCategoryById); // ID ile kategori getir

// Admin routes - authentication ve admin kontrolü gerekli
router.route('/')
    .post(requireCategoryManagement, createCategory); // Yeni kategori oluştur

router.route('/:id')
    .put(requireCategoryManagement, updateCategory) // Kategori güncelle
    .delete(requireCategoryManagement, deleteCategory); // Kategori sil

module.exports = router;
