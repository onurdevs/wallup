const { uploadFromBuffer: uploadToCloudinary, deleteImage: deleteFromCloudinary } = require("./cloudinaryService")
const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'cloudinary'

// HATA BURADA: 'uplaodFile' -> 'uploadFile' olmalı
const uploadFile = async (fileBuffer) => {
    if (STORAGE_PROVIDER === 'cloudinary') {
        const result = await uploadToCloudinary(fileBuffer);
        return {
            url: result.secure_url,
            id: result.public_id
        }
    } else if (STORAGE_PROVIDER === 's3') {
        throw new Error('S3 servisi henüz yapılandırılmadı')
    } else {
        throw new Error('Geçerli bir depolama sağlayıcısı bulunamadı')
    }
}

// Resim silme fonksiyonu
const deleteFile = async (publicId) => {
    if (STORAGE_PROVIDER === 'cloudinary') {
        return await deleteFromCloudinary(publicId);
    } else if (STORAGE_PROVIDER === 's3') {
        throw new Error('S3 servisi henüz yapılandırılmadı')
    } else {
        throw new Error('Geçerli bir depolama sağlayıcısı bulunamadı')
    }
}

module.exports = { uploadFile, deleteFile }