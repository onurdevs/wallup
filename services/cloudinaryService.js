const cloudinary = require('cloudinary').v2; // .v2'yi eklemek iyi bir alışkanlıktır
const streamifier = require('streamifier');

// 1. .env dosyasındaki ayarları kullanarak Cloudinary'yi yapılandır
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Dosya yükleme fonksiyonu
const uploadFromBuffer = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        // Hata ayıklama için Cloudinary konfigürasyonunu kontrol et
        console.log('Cloudinary config:', {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
            api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
        });

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'ilan-panosu', // Cloudinary'de 'ilan-panosu' adında bir klasöre at
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else {
                    console.log('Cloudinary upload success:', result.secure_url);
                    resolve(result);
                }
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

// 3. Resim silme fonksiyonu
const deleteImage = async (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error('Cloudinary delete error:', error);
                reject(error);
            } else {
                console.log('Cloudinary delete success:', publicId);
                resolve(result);
            }
        });
    });
};

module.exports = { uploadFromBuffer, deleteImage };