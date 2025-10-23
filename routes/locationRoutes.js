const express = require('express');
const router = express.Router();

const {
    getAllCities,
    getDistrictsByCity,
    getLocationBySlug,
    getLocationById,
    createCity,
    createDistrict,
    updateLocation,
    deleteLocation
} = require('../controllers/locationController');

const { requireLocationManagement } = require('../middleware/adminMiddleware');

// Public routes - herkes erişebilir
router.route('/cities')
    .get(getAllCities); // Tüm şehirleri getir

router.route('/cities/:cityId/districts')
    .get(getDistrictsByCity); // Şehrin ilçelerini getir

router.route('/slug/:slug')
    .get(getLocationBySlug); // Slug ile konum getir

router.route('/:id')
    .get(getLocationById); // ID ile konum getir

// Admin routes - authentication ve admin kontrolü gerekli
router.route('/cities')
    .post(requireLocationManagement, createCity); // Yeni şehir oluştur

router.route('/districts')
    .post(requireLocationManagement, createDistrict); // Yeni ilçe oluştur

router.route('/:id')
    .put(requireLocationManagement, updateLocation) // Konum güncelle
    .delete(requireLocationManagement, deleteLocation); // Konum sil

module.exports = router;
