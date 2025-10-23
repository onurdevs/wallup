const mongoose = require('mongoose')

const ListingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Lütfen bir başlık giriniz'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Lütfen bir açıklama giriniz'],
            trim: true
        },
        price: {
            type: Number,
            required: false
        },
        images: [
            {
                type: String,
                required: false
            }
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Lütfen bir kategori seçiniz']
        },
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            required: [true, 'Lütfen bir konum seçiniz']
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)

// Index'ler - performans için
ListingSchema.index({ category: 1 })
ListingSchema.index({ location: 1 })
ListingSchema.index({ owner: 1 })
ListingSchema.index({ createdAt: -1 })
ListingSchema.index({ price: 1 })
ListingSchema.index({ category: 1, location: 1 }) // Kategori ve konum kombinasyonu

const Listing = mongoose.model('Listing', ListingSchema)
module.exports = Listing