const mongoose = require('mongoose')

// Kategori şeması - veri bütünlüğü için standart kategoriler
const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Kategori adı gereklidir'],
            trim: true,
            unique: true, // Benzersiz kategori adları
            maxlength: [50, 'Kategori adı 50 karakterden fazla olamaz']
        },
        slug: {
            type: String,
            required: false, // Pre-save middleware ile otomatik oluşturulacak
            unique: true, // URL-friendly slug
            lowercase: true, // Küçük harf
            trim: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [200, 'Açıklama 200 karakterden fazla olamaz']
        },
        icon: {
            type: String, // İkon adı (örn: "electronics", "furniture")
            default: 'default'
        },
        isActive: {
            type: Boolean,
            default: true // Kategori aktif mi?
        },
        sortOrder: {
            type: Number,
            default: 0 // Sıralama için
        }
    },
    {
        timestamps: true
    }
)

// Slug otomatik oluşturma middleware'i
CategorySchema.pre('save', function(next) {
    if (this.isModified('name') || !this.slug) {
        // Türkçe karakterleri dönüştür ve slug oluştur
        this.slug = this.name
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '') // Sadece harf, rakam, boşluk ve tire
            .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
            .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
            .replace(/^-+|-+$/g, '') // Başta ve sonda tire varsa kaldır
    }
    next()
})

// Index'ler - performans için
CategorySchema.index({ slug: 1 })
CategorySchema.index({ isActive: 1, sortOrder: 1 })

const Category = mongoose.model('Category', CategorySchema)
module.exports = Category
