const multer = require('multer');

const storage = multer.memoryStorage();

// DÜZELTME BURADA: Fonksiyonun (req, file, cb) parametrelerini alması gerekiyor
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Dosyayı kabul et
    } else {
        // Hata fırlat (bu bir resim dosyası değil)
        cb(new Error('Lütfen sadece bir resim dosyası yükleyin'), false);
    }
};
// --- DÜZELTME SONU ---

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB ile sınırla
    }
});

module.exports = upload;