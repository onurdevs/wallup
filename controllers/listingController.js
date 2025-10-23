const Listing = require("../models/Listing")
const { uploadFile, deleteFile } = require('../services/fileUploader');
exports.getListings = async (req, res) => {
    try {
        // Query parametrelerini al
        const { category, location, minPrice, maxPrice, search } = req.query;
        
        // Filtre objesi oluştur
        let filter = {};
        
        if (category) {
            filter.category = category;
        }
        
        if (location) {
            filter.location = location;
        }
        
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const listings = await Listing.find(filter)
            .populate('category', 'name slug icon')
            .populate('location', 'name slug type')
            .populate('owner', 'username email')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            count: listings.length,
            data: listings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Sunucu hatası",
            error: error.message
        })
    }
}

exports.getListingsById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('category', 'name slug icon description')
            .populate('location', 'name slug type')
            .populate('owner', 'username email')
            
        if (listing) {
            res.status(200).json({
                success: true,
                data: listing
            })
        } else {
            res.status(404).json({ 
                success: false,
                message: "İlan bulunamadı" 
            })
        }

    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ 
                success: false,
                message: 'İlan bulunamadı: (geçersiz id)' 
            })
        }
        return res.status(500).json({ 
            success: false,
            message: "Sunucu hatası", 
            error: error.message 
        })
    }
}

exports.createListing = async (req, res) => {
    try {
        // 1. Metin alanları 'req.body'den
        const { title, description, price, category, location } = req.body;

        // 2. Zorunlu alan kontrolü
        if (!title || !description || !price || !category || !location) {
            return res.status(400).json({ 
                success: false,
                message: 'Tüm zorunlu alanlar doldurulmalıdır' 
            });
        }

        // 3. Kategori ve konum ID'lerinin geçerli olup olmadığını kontrol et
        const Category = require('../models/Category');
        const Location = require('../models/Location');
        
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz kategori ID'
            });
        }

        const locationExists = await Location.findById(location);
        if (!locationExists) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz konum ID'
            });
        }

        // 4. Dosya kontrolü 'req.file'dan
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: 'Lütfen bir ilan resmi yükleyin' 
            });
        }

        // 5. Dosyayı 'uploadFile' servisimize gönder
        const uploadResult = await uploadFile(req.file.buffer);

        // 6. İlanı oluştur
        const listing = new Listing({
            title,
            description,
            price,
            category,
            location,
            images: [uploadResult.url], // Buluttan gelen URL
            owner: req.user._id,        // 'protect'ten gelen kullanıcı ID'si
        });

        // 7. Kaydet ve populate ile geri döndür
        const createdListing = await listing.save();
        await createdListing.populate([
            { path: 'category', select: 'name slug icon' },
            { path: 'location', select: 'name slug type' },
            { path: 'owner', select: 'username email' }
        ]);
        
        res.status(201).json({
            success: true,
            message: 'İlan başarıyla oluşturuldu',
            data: createdListing
        });

    } catch (error) {
        console.error('createListing hata:', error.message);
        console.error('createListing hata detayı:', error);
        if (error.message.includes('resim dosyası')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'İlan oluşturulurken bir hata oluştu', error: error.message });
    }
};


exports.deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        // DÜZELTME: 404 kullan ve 'return' ekle
        if (!listing) {
            return res.status(404).json({ message: "İlan bulunamadı" })
        }

        // Sahiplik kontrolü - admin/moderator herhangi bir ilanı silebilir
        if (listing.owner.toString() !== req.user._id.toString() && !req.user.canDeleteAnyListing()) {
            return res.status(401).json({ 
                success: false,
                message: "Bu işlemi yapmaya yetkiniz yok" 
            })
        }

        // Cloudinary'deki resimleri sil
        if (listing.images && listing.images.length > 0) {
            for (const imageUrl of listing.images) {
                try {
                    // URL'den public_id'yi çıkar (Cloudinary URL formatından)
                    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
                    await deleteFile(publicId);
                    console.log(`Resim silindi: ${publicId}`);
                } catch (deleteError) {
                    console.error('Resim silme hatası:', deleteError.message);
                    // Resim silme hatası ilan silme işlemini durdurmasın
                }
            }
        }

        // Veritabanından ilanı sil
        await listing.deleteOne()
        res.status(200).json({ message: "İlan ve resimleri başarıyla silindi" })
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası", error: error.message })
    }
}

exports.updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: "İlan bulunamadı" });
        }

        // Sahiplik kontrolü - admin/moderator herhangi bir ilanı güncelleyebilir
        if (listing.owner.toString() !== req.user._id.toString() && !req.user.canDeleteAnyListing()) {
            return res.status(401).json({ 
                success: false,
                message: "Bu işlem için yetkiniz yok" 
            });
        }

        const { title, description, price, category, location } = req.body;

        // Metin alanlarını güncelle
        listing.title = title || listing.title;
        listing.description = description || listing.description;
        listing.price = (price === undefined) ? listing.price : price;
        listing.category = category || listing.category;
        listing.location = location || listing.location;

        // Resim güncelleme işlemi
        if (req.file) {
            // Yeni resim yüklendi, eski resimleri sil
            if (listing.images && listing.images.length > 0) {
                for (const imageUrl of listing.images) {
                    try {
                        // URL'den public_id'yi çıkar
                        const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
                        await deleteFile(publicId);
                        console.log(`Eski resim silindi: ${publicId}`);
                    } catch (deleteError) {
                        console.error('Eski resim silme hatası:', deleteError.message);
                    }
                }
            }

            // Yeni resmi yükle
            const uploadResult = await uploadFile(req.file.buffer);
            listing.images = [uploadResult.url];
            console.log(`Yeni resim yüklendi: ${uploadResult.url}`);
        }

        const updatedListing = await listing.save();
        await updatedListing.populate([
            { path: 'category', select: 'name slug icon' },
            { path: 'location', select: 'name slug type' },
            { path: 'owner', select: 'username email' }
        ]);
        
        res.status(200).json({
            success: true,
            message: 'İlan başarıyla güncellendi',
            data: updatedListing
        });

    } catch (error) {
        console.error("PUT isteği hatası:", error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
};
