const Location = require('../models/Location');

// Tüm şehirleri getir
exports.getAllCities = async (req, res) => {
    try {
        const cities = await Location.find({ 
            type: 'city', 
            isActive: true 
        })
        .sort({ sortOrder: 1, name: 1 })
        .select('name slug');

        res.status(200).json({
            success: true,
            count: cities.length,
            data: cities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Şehirler getirilirken hata oluştu',
            error: error.message
        });
    }
};

// Belirli bir şehrin ilçelerini getir
exports.getDistrictsByCity = async (req, res) => {
    try {
        const cityId = req.params.cityId;
        
        // Şehir var mı kontrol et
        const city = await Location.findById(cityId);
        if (!city || city.type !== 'city') {
            return res.status(404).json({
                success: false,
                message: 'Şehir bulunamadı'
            });
        }

        const districts = await Location.find({ 
            type: 'district',
            parent: cityId,
            isActive: true 
        })
        .sort({ sortOrder: 1, name: 1 })
        .select('name slug');

        res.status(200).json({
            success: true,
            count: districts.length,
            city: {
                id: city._id,
                name: city.name,
                slug: city.slug
            },
            data: districts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'İlçeler getirilirken hata oluştu',
            error: error.message
        });
    }
};

// Slug ile konum getir (şehir veya ilçe)
exports.getLocationBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        
        // Önce şehir olarak ara
        let location = await Location.findOne({ 
            slug: slug, 
            type: 'city',
            isActive: true 
        });

        // Şehir bulunamazsa ilçe olarak ara
        if (!location) {
            location = await Location.findOne({ 
                slug: slug, 
                type: 'district',
                isActive: true 
            }).populate('parent', 'name slug');
        }

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Konum bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            data: location
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Konum getirilirken hata oluştu',
            error: error.message
        });
    }
};

// ID ile konum getir
exports.getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id)
            .populate('parent', 'name slug');

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Konum bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            data: location
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Konum getirilirken hata oluştu',
            error: error.message
        });
    }
};

// Yeni şehir oluştur (admin işlemi)
exports.createCity = async (req, res) => {
    try {
        const { name, coordinates, sortOrder } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Şehir adı gereklidir'
            });
        }

        // Aynı isimde şehir var mı kontrol et
        const existingCity = await Location.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            type: 'city'
        });

        if (existingCity) {
            return res.status(400).json({
                success: false,
                message: 'Bu isimde bir şehir zaten mevcut'
            });
        }

        const city = new Location({
            name,
            type: 'city',
            coordinates,
            sortOrder: sortOrder || 0
        });

        await city.save();

        res.status(201).json({
            success: true,
            message: 'Şehir başarıyla oluşturuldu',
            data: city
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Şehir oluşturulurken hata oluştu',
            error: error.message
        });
    }
};

// Yeni ilçe oluştur (admin işlemi)
exports.createDistrict = async (req, res) => {
    try {
        const { name, parentId, sortOrder } = req.body;

        if (!name || !parentId) {
            return res.status(400).json({
                success: false,
                message: 'İlçe adı ve şehir ID gereklidir'
            });
        }

        // Şehir var mı kontrol et
        const parentCity = await Location.findById(parentId);
        if (!parentCity || parentCity.type !== 'city') {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir şehir seçiniz'
            });
        }

        // Aynı isimde ilçe var mı kontrol et
        const existingDistrict = await Location.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            type: 'district',
            parent: parentId
        });

        if (existingDistrict) {
            return res.status(400).json({
                success: false,
                message: 'Bu şehirde bu isimde bir ilçe zaten mevcut'
            });
        }

        const district = new Location({
            name,
            type: 'district',
            parent: parentId,
            sortOrder: sortOrder || 0
        });

        await district.save();

        res.status(201).json({
            success: true,
            message: 'İlçe başarıyla oluşturuldu',
            data: district
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'İlçe oluşturulurken hata oluştu',
            error: error.message
        });
    }
};

// Konum güncelle (admin işlemi)
exports.updateLocation = async (req, res) => {
    try {
        const { name, coordinates, sortOrder, isActive } = req.body;

        const location = await Location.findById(req.params.id);

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Konum bulunamadı'
            });
        }

        // İsim değiştiriliyorsa benzersizlik kontrolü
        if (name && name !== location.name) {
            const query = {
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: req.params.id }
            };

            // İlçe ise aynı şehirde benzersizlik kontrolü
            if (location.type === 'district') {
                query.parent = location.parent;
            }

            const existingLocation = await Location.findOne(query);

            if (existingLocation) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu isimde bir konum zaten mevcut'
                });
            }
        }

        // Güncelleme
        if (name) location.name = name;
        if (coordinates) location.coordinates = coordinates;
        if (sortOrder !== undefined) location.sortOrder = sortOrder;
        if (isActive !== undefined) location.isActive = isActive;

        await location.save();

        res.status(200).json({
            success: true,
            message: 'Konum başarıyla güncellendi',
            data: location
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Konum güncellenirken hata oluştu',
            error: error.message
        });
    }
};

// Konum sil (admin işlemi)
exports.deleteLocation = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Konum bulunamadı'
            });
        }

        // Şehir ise ilçeleri var mı kontrol et
        if (location.type === 'city') {
            const districtsCount = await Location.countDocuments({ 
                parent: req.params.id 
            });

            if (districtsCount > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Bu şehirde ${districtsCount} ilçe bulunuyor. Önce ilçeleri silin.`
                });
            }
        }

        // Bu konumu kullanan ilanlar var mı kontrol et
        const Listing = require('../models/Listing');
        const listingsCount = await Listing.countDocuments({ location: req.params.id });

        if (listingsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Bu konumu kullanan ${listingsCount} ilan bulunuyor. Önce bu ilanları silin veya başka konuma taşıyın.`
            });
        }

        await location.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Konum başarıyla silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Konum silinirken hata oluştu',
            error: error.message
        });
    }
};
