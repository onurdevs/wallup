# 🏠 Wallup İlan Panosu API

Profesyonel veri bütünlüğü sistemi ve rol tabanlı yetkilendirme ile güçlendirilmiş İlan Panosu API'si.

## 🚀 Özellikler

- ✅ **Profesyonel Veri Bütünlüğü** - Standart kategoriler ve konumlar
- ✅ **Rol Tabanlı Yetkilendirme** - User, Moderator, Admin rolleri
- ✅ **Resim Yükleme** - Cloudinary entegrasyonu
- ✅ **Gelişmiş Filtreleme** - Kategori, konum, fiyat, arama
- ✅ **MongoDB Entegrasyonu** - Mongoose ODM ile
- ✅ **JWT Authentication** - Güvenli token tabanlı kimlik doğrulama
- ✅ **Docker Desteği** - Kolay deployment

## 📋 Teknolojiler

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT
- **File Upload:** Cloudinary, Multer
- **Containerization:** Docker, Docker Compose

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB
- npm veya yarn

### Adımlar

```bash
# Repository'yi klonlayın
git clone <repository-url>
cd wallup

# Dependencies'leri yükleyin
npm install

# Environment dosyasını oluşturun
cp .env.example .env

# Environment variables'ları düzenleyin
nano .env

# MongoDB'yi başlatın
# (MongoDB'nin çalışır durumda olduğundan emin olun)

# Uygulamayı başlatın
npm run dev
```

## 🔧 Konfigürasyon

### Environment Variables

```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/wallup
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📚 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### 📂 Categories
- `GET /api/categories` - Tüm kategoriler
- `GET /api/categories/slug/:slug` - Slug ile kategori
- `GET /api/categories/:id` - ID ile kategori
- `POST /api/categories` - Yeni kategori (Admin)
- `PUT /api/categories/:id` - Kategori güncelle (Admin)
- `DELETE /api/categories/:id` - Kategori sil (Admin)

### 📍 Locations
- `GET /api/locations/cities` - Tüm şehirler
- `GET /api/locations/cities/:id/districts` - Şehir ilçeleri
- `GET /api/locations/slug/:slug` - Slug ile konum
- `GET /api/locations/:id` - ID ile konum
- `POST /api/locations/cities` - Yeni şehir (Admin)
- `POST /api/locations/districts` - Yeni ilçe (Admin)
- `PUT /api/locations/:id` - Konum güncelle (Admin)
- `DELETE /api/locations/:id` - Konum sil (Admin)

### 📝 Listings
- `GET /api/listings` - Tüm ilanlar
- `GET /api/listings?category=xxx&location=yyy&minPrice=100&maxPrice=500&search=telefon` - Filtreli arama
- `GET /api/listings/:id` - ID ile ilan
- `POST /api/listings` - Yeni ilan (resim ile)
- `PUT /api/listings/:id` - İlan güncelle
- `DELETE /api/listings/:id` - İlan sil

## 🔒 Rol Sistemi

### 👥 Kullanıcı Rolleri

**User (Normal Kullanıcı):**
- ✅ Kendi ilanlarını oluşturma/güncelleme/silme
- ✅ Tüm ilanları görüntüleme
- ✅ Filtreleme yapma

**Moderator:**
- ✅ User yetkileri +
- ✅ Herhangi bir ilanı silme/güncelleme
- ✅ İçerik moderasyonu

**Admin:**
- ✅ Moderator yetkileri +
- ✅ Kategori yönetimi (CRUD)
- ✅ Konum yönetimi (CRUD)
- ✅ Sistem yönetimi

## 🧪 Test

### API Test

```bash
# API health check
curl http://localhost:5001/

# Kullanıcı kaydı
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "123456"}'

# Kullanıcı girişi
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "123456"}'
```

## 📊 Veri Yapısı

### Kullanıcı Modeli
```javascript
{
  email: String (unique),
  password: String (hashed),
  username: String,
  role: String (user|moderator|admin),
  isActive: Boolean,
  lastLogin: Date
}
```

### Kategori Modeli
```javascript
{
  name: String (unique),
  slug: String (auto-generated),
  description: String,
  icon: String,
  isActive: Boolean,
  sortOrder: Number
}
```

### Konum Modeli
```javascript
{
  name: String,
  slug: String (auto-generated),
  type: String (city|district),
  parent: ObjectId (for districts),
  coordinates: GeoJSON Point,
  isActive: Boolean
}
```

### İlan Modeli
```javascript
{
  title: String,
  description: String,
  price: Number,
  images: [String],
  category: ObjectId (ref: Category),
  location: ObjectId (ref: Location),
  owner: ObjectId (ref: User)
}
```

## 🚀 Production Deployment

### Docker ile

```bash
# Docker ile başlatın
docker-compose up -d

# Test edin
curl http://localhost:5001/
```

### Manuel

```bash
# PM2 ile process management
npm install -g pm2
pm2 start index.js --name "wallup-api"
```

## 📄 Lisans

ISC License

---

**Wallup İlan Panosu** - Profesyonel veri bütünlüğü sistemi ile güçlendirilmiş! 🚀
