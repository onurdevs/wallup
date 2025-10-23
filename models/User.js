const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Lütfen bir e-posta adresi giriniz'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Lütfen bir şifre giriniz'],
            minlength: [6, 'Şifre en az 6 karakter giriniz...']
        },
        username: {
            type: String,
            trim: true
        },
        profilePhoto: {
            type: String
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'moderator'],
            default: 'user'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)

        next()
    } catch (error) {
        next(error)
    }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Rol kontrolü method'ları
UserSchema.methods.isAdmin = function () {
    return this.role === 'admin'
}

UserSchema.methods.isModerator = function () {
    return this.role === 'moderator' || this.role === 'admin'
}

UserSchema.methods.canManageCategories = function () {
    return this.role === 'admin'
}

UserSchema.methods.canManageLocations = function () {
    return this.role === 'admin'
}

UserSchema.methods.canDeleteAnyListing = function () {
    return this.role === 'admin' || this.role === 'moderator'
}

// Index'ler - performans için
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ isActive: 1 })

const User = mongoose.model('User', UserSchema)
module.exports = User;