const mongoose = require('mongoose')

// Konum şeması - şehir/ilçe hiyerarşisi
const LocationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Konum adı gereklidir'],
            trim: true,
            maxlength: [100, 'Konum adı 100 karakterden fazla olamaz']
        },
        slug: {
            type: String,
            required: false, // Pre-save middleware ile otomatik oluşturulacak
            lowercase: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['city', 'district'], // Şehir veya ilçe
            required: true
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            required: function() {
                return this.type === 'district' // İlçeler için şehir referansı zorunlu
            }
        },
        coordinates: {
            latitude: {
                type: Number,
                min: -90,
                max: 90
            },
            longitude: {
                type: Number,
                min: -180,
                max: 180
            }
        },
        isActive: {
            type: Boolean,
            default: true
        },
        sortOrder: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

// Slug otomatik oluşturma middleware'i
LocationSchema.pre('save', function(next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
    }
    next()
})

// Index'ler - performans için
LocationSchema.index({ slug: 1 })
LocationSchema.index({ type: 1, isActive: 1 })
LocationSchema.index({ parent: 1 })
LocationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 })

// Virtual: Tam konum adı (şehir + ilçe)
LocationSchema.virtual('fullName').get(function() {
    if (this.type === 'district' && this.parent) {
        return `${this.name}, ${this.parent.name}`
    }
    return this.name
})

// Virtual: Tam slug (şehir-ilce formatında)
LocationSchema.virtual('fullSlug').get(function() {
    if (this.type === 'district' && this.parent) {
        return `${this.parent.slug}-${this.slug}`
    }
    return this.slug
})

const Location = mongoose.model('Location', LocationSchema)
module.exports = Location
