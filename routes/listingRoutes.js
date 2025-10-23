const express = require("express")
const router = express.Router();

const {
    getListings,
    getListingsById,
    createListing,
    deleteListing,
    updateListing
} = require("../controllers/listingController")

const { protect } = require('../middleware/authMiddleware');

// 1. ADIM: uploadMiddleware'i import et
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getListings)
    // 2. ADIM: 'upload.single('image')' middleware'ini zincire ekle
    .post(protect, upload.single('image'), createListing);


router.route('/:id')
    .get(getListingsById)
    .delete(protect, deleteListing)
    .put(protect, upload.single('image'), updateListing);

module.exports = router;