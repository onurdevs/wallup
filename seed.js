const mongoose = require('mongoose');
const Category = require('./models/Category');
const Location = require('./models/Location');

// Başlangıç kategorileri
const categories = [
    { name: 'Elektronik', description: 'Telefon, bilgisayar, tablet ve diğer elektronik cihazlar', icon: 'electronics', sortOrder: 1 },
    { name: 'Ev ve Bahçe', description: 'Mobilya, dekorasyon, bahçe malzemeleri', icon: 'home', sortOrder: 2 },
    { name: 'Araç ve Gereçler', description: 'Otomobil, motosiklet, bisiklet ve yedek parçalar', icon: 'vehicle', sortOrder: 3 },
    { name: 'Moda ve Giyim', description: 'Kadın, erkek ve çocuk giyim, ayakkabı, aksesuar', icon: 'fashion', sortOrder: 4 },
    { name: 'Spor ve Outdoor', description: 'Spor malzemeleri, outdoor ekipmanları', icon: 'sports', sortOrder: 5 },
    { name: 'Müzik ve Enstrümanlar', description: 'Müzik aletleri, ses sistemleri', icon: 'music', sortOrder: 6 },
    { name: 'Kitap ve Hobi', description: 'Kitaplar, dergiler, hobi malzemeleri', icon: 'books', sortOrder: 7 },
    { name: 'Bebek ve Çocuk', description: 'Bebek bakım ürünleri, oyuncaklar', icon: 'baby', sortOrder: 8 },
    { name: 'Petshop', description: 'Evcil hayvan bakım ürünleri', icon: 'pets', sortOrder: 9 },
    { name: 'İş ve Ofis', description: 'Ofis malzemeleri, iş ekipmanları', icon: 'office', sortOrder: 10 },
    { name: 'Sanat ve Antika', description: 'Sanat eserleri, antika eşyalar', icon: 'art', sortOrder: 11 },
    { name: 'Diğer', description: 'Diğer kategoriler', icon: 'other', sortOrder: 12 }
];

// Başlangıç şehirleri (Türkiye'nin büyük şehirleri)
const cities = [
    { name: 'İstanbul', coordinates: { latitude: 41.0082, longitude: 28.9784 }, sortOrder: 1 },
    { name: 'Ankara', coordinates: { latitude: 39.9334, longitude: 32.8597 }, sortOrder: 2 },
    { name: 'İzmir', coordinates: { latitude: 38.4192, longitude: 27.1287 }, sortOrder: 3 },
    { name: 'Bursa', coordinates: { latitude: 40.1826, longitude: 29.0665 }, sortOrder: 4 },
    { name: 'Antalya', coordinates: { latitude: 36.8969, longitude: 30.7133 }, sortOrder: 5 },
    { name: 'Adana', coordinates: { latitude: 37.0000, longitude: 35.3213 }, sortOrder: 6 },
    { name: 'Konya', coordinates: { latitude: 37.8746, longitude: 32.4932 }, sortOrder: 7 },
    { name: 'Gaziantep', coordinates: { latitude: 37.0662, longitude: 37.3833 }, sortOrder: 8 },
    { name: 'Şanlıurfa', coordinates: { latitude: 37.1674, longitude: 38.7955 }, sortOrder: 9 },
    { name: 'Kocaeli', coordinates: { latitude: 40.8533, longitude: 29.8815 }, sortOrder: 10 },
    { name: 'Mersin', coordinates: { latitude: 36.8000, longitude: 34.6333 }, sortOrder: 11 },
    { name: 'Diyarbakır', coordinates: { latitude: 37.9144, longitude: 40.2306 }, sortOrder: 12 },
    { name: 'Hatay', coordinates: { latitude: 36.4018, longitude: 36.3498 }, sortOrder: 13 },
    { name: 'Manisa', coordinates: { latitude: 38.6191, longitude: 27.4289 }, sortOrder: 14 },
    { name: 'Kayseri', coordinates: { latitude: 38.7312, longitude: 35.4787 }, sortOrder: 15 },
    { name: 'Samsun', coordinates: { latitude: 41.2928, longitude: 36.3313 }, sortOrder: 16 },
    { name: 'Balıkesir', coordinates: { latitude: 39.6484, longitude: 27.8826 }, sortOrder: 17 },
    { name: 'Kahramanmaraş', coordinates: { latitude: 37.5858, longitude: 36.9371 }, sortOrder: 18 },
    { name: 'Van', coordinates: { latitude: 38.4891, longitude: 43.4089 }, sortOrder: 19 },
    { name: 'Aydın', coordinates: { latitude: 37.8560, longitude: 27.8416 }, sortOrder: 20 }
];

// İstanbul'un bazı ilçeleri
const istanbulDistricts = [
    { name: 'Kadıköy', sortOrder: 1 },
    { name: 'Beşiktaş', sortOrder: 2 },
    { name: 'Şişli', sortOrder: 3 },
    { name: 'Beyoğlu', sortOrder: 4 },
    { name: 'Fatih', sortOrder: 5 },
    { name: 'Üsküdar', sortOrder: 6 },
    { name: 'Maltepe', sortOrder: 7 },
    { name: 'Kartal', sortOrder: 8 },
    { name: 'Pendik', sortOrder: 9 },
    { name: 'Tuzla', sortOrder: 10 },
    { name: 'Sultanbeyli', sortOrder: 11 },
    { name: 'Sancaktepe', sortOrder: 12 },
    { name: 'Çekmeköy', sortOrder: 13 },
    { name: 'Ümraniye', sortOrder: 14 },
    { name: 'Ataşehir', sortOrder: 15 },
    { name: 'Sarıyer', sortOrder: 16 },
    { name: 'Eyüpsultan', sortOrder: 17 },
    { name: 'Bayrampaşa', sortOrder: 18 },
    { name: 'Zeytinburnu', sortOrder: 19 },
    { name: 'Bakırköy', sortOrder: 20 },
    { name: 'Bahçelievler', sortOrder: 21 },
    { name: 'Bağcılar', sortOrder: 22 },
    { name: 'Güngören', sortOrder: 23 },
    { name: 'Küçükçekmece', sortOrder: 24 },
    { name: 'Büyükçekmece', sortOrder: 25 },
    { name: 'Avcılar', sortOrder: 26 },
    { name: 'Esenyurt', sortOrder: 27 },
    { name: 'Beylikdüzü', sortOrder: 28 },
    { name: 'Silivri', sortOrder: 29 },
    { name: 'Çatalca', sortOrder: 30 },
    { name: 'Arnavutköy', sortOrder: 31 },
    { name: 'Sultangazi', sortOrder: 32 },
    { name: 'Gaziosmanpaşa', sortOrder: 33 },
    { name: 'Esenler', sortOrder: 34 },
    { name: 'Güngören', sortOrder: 35 },
    { name: 'Kağıthane', sortOrder: 36 },
    { name: 'Beşiktaş', sortOrder: 37 }
];

// Ankara'nın bazı ilçeleri
const ankaraDistricts = [
    { name: 'Çankaya', sortOrder: 1 },
    { name: 'Keçiören', sortOrder: 2 },
    { name: 'Yenimahalle', sortOrder: 3 },
    { name: 'Mamak', sortOrder: 4 },
    { name: 'Sincan', sortOrder: 5 },
    { name: 'Etimesgut', sortOrder: 6 },
    { name: 'Altındağ', sortOrder: 7 },
    { name: 'Pursaklar', sortOrder: 8 },
    { name: 'Gölbaşı', sortOrder: 9 },
    { name: 'Elmadağ', sortOrder: 10 },
    { name: 'Kalecik', sortOrder: 11 },
    { name: 'Akyurt', sortOrder: 12 },
    { name: 'Bala', sortOrder: 13 },
    { name: 'Evren', sortOrder: 14 },
    { name: 'Haymana', sortOrder: 15 },
    { name: 'Kızılcahamam', sortOrder: 16 },
    { name: 'Nallıhan', sortOrder: 17 },
    { name: 'Polatlı', sortOrder: 18 },
    { name: 'Şereflikoçhisar', sortOrder: 19 },
    { name: 'Ayaş', sortOrder: 20 },
    { name: 'Beypazarı', sortOrder: 21 },
    { name: 'Çamlıdere', sortOrder: 22 },
    { name: 'Çubuk', sortOrder: 23 },
    { name: 'Dudley', sortOrder: 24 },
    { name: 'Kazan', sortOrder: 25 }
];

// İzmir'in bazı ilçeleri
const izmirDistricts = [
    { name: 'Konak', sortOrder: 1 },
    { name: 'Bornova', sortOrder: 2 },
    { name: 'Karşıyaka', sortOrder: 3 },
    { name: 'Buca', sortOrder: 4 },
    { name: 'Çiğli', sortOrder: 5 },
    { name: 'Gaziemir', sortOrder: 6 },
    { name: 'Güzelbahçe', sortOrder: 7 },
    { name: 'Narlıdere', sortOrder: 8 },
    { name: 'Balçova', sortOrder: 9 },
    { name: 'Bayraklı', sortOrder: 10 },
    { name: 'Bergama', sortOrder: 11 },
    { name: 'Beydağ', sortOrder: 12 },
    { name: 'Çeşme', sortOrder: 13 },
    { name: 'Dikili', sortOrder: 14 },
    { name: 'Foça', sortOrder: 15 },
    { name: 'Karaburun', sortOrder: 16 },
    { name: 'Kemalpaşa', sortOrder: 17 },
    { name: 'Kınık', sortOrder: 18 },
    { name: 'Kiraz', sortOrder: 19 },
    { name: 'Menderes', sortOrder: 20 },
    { name: 'Menemen', sortOrder: 21 },
    { name: 'Narlıdere', sortOrder: 22 },
    { name: 'Ödemiş', sortOrder: 23 },
    { name: 'Seferihisar', sortOrder: 24 },
    { name: 'Selçuk', sortOrder: 25 },
    { name: 'Tire', sortOrder: 26 },
    { name: 'Torbalı', sortOrder: 27 },
    { name: 'Urla', sortOrder: 28 }
];

// Veritabanını seed etme fonksiyonu
const seedDatabase = async () => {
    try {
        console.log('Veritabanı seed işlemi başlatılıyor...');

        // Kategorileri ekle
        console.log('Kategoriler ekleniyor...');
        for (const categoryData of categories) {
            const existingCategory = await Category.findOne({ name: categoryData.name });
            if (!existingCategory) {
                const category = new Category(categoryData);
                await category.save();
                console.log(`✓ Kategori eklendi: ${categoryData.name}`);
            } else {
                console.log(`- Kategori zaten mevcut: ${categoryData.name}`);
            }
        }

        // Şehirleri ekle
        console.log('Şehirler ekleniyor...');
        const cityMap = new Map();
        for (const cityData of cities) {
            const existingCity = await Location.findOne({ 
                name: cityData.name, 
                type: 'city' 
            });
            if (!existingCity) {
                const city = new Location({
                    ...cityData,
                    type: 'city'
                });
                await city.save();
                cityMap.set(cityData.name, city._id);
                console.log(`✓ Şehir eklendi: ${cityData.name}`);
            } else {
                cityMap.set(cityData.name, existingCity._id);
                console.log(`- Şehir zaten mevcut: ${cityData.name}`);
            }
        }

        // İstanbul ilçelerini ekle
        console.log('İstanbul ilçeleri ekleniyor...');
        const istanbulId = cityMap.get('İstanbul');
        if (istanbulId) {
            for (const districtData of istanbulDistricts) {
                const existingDistrict = await Location.findOne({ 
                    name: districtData.name, 
                    type: 'district',
                    parent: istanbulId
                });
                if (!existingDistrict) {
                    const district = new Location({
                        ...districtData,
                        type: 'district',
                        parent: istanbulId
                    });
                    await district.save();
                    console.log(`✓ İstanbul ilçesi eklendi: ${districtData.name}`);
                } else {
                    console.log(`- İstanbul ilçesi zaten mevcut: ${districtData.name}`);
                }
            }
        }

        // Ankara ilçelerini ekle
        console.log('Ankara ilçeleri ekleniyor...');
        const ankaraId = cityMap.get('Ankara');
        if (ankaraId) {
            for (const districtData of ankaraDistricts) {
                const existingDistrict = await Location.findOne({ 
                    name: districtData.name, 
                    type: 'district',
                    parent: ankaraId
                });
                if (!existingDistrict) {
                    const district = new Location({
                        ...districtData,
                        type: 'district',
                        parent: ankaraId
                    });
                    await district.save();
                    console.log(`✓ Ankara ilçesi eklendi: ${districtData.name}`);
                } else {
                    console.log(`- Ankara ilçesi zaten mevcut: ${districtData.name}`);
                }
            }
        }

        // İzmir ilçelerini ekle
        console.log('İzmir ilçeleri ekleniyor...');
        const izmirId = cityMap.get('İzmir');
        if (izmirId) {
            for (const districtData of izmirDistricts) {
                const existingDistrict = await Location.findOne({ 
                    name: districtData.name, 
                    type: 'district',
                    parent: izmirId
                });
                if (!existingDistrict) {
                    const district = new Location({
                        ...districtData,
                        type: 'district',
                        parent: izmirId
                    });
                    await district.save();
                    console.log(`✓ İzmir ilçesi eklendi: ${districtData.name}`);
                } else {
                    console.log(`- İzmir ilçesi zaten mevcut: ${districtData.name}`);
                }
            }
        }

        console.log('✅ Veritabanı seed işlemi tamamlandı!');
        
        // İstatistikleri göster
        const categoryCount = await Category.countDocuments();
        const cityCount = await Location.countDocuments({ type: 'city' });
        const districtCount = await Location.countDocuments({ type: 'district' });
        
        console.log(`📊 İstatistikler:`);
        console.log(`   - Kategoriler: ${categoryCount}`);
        console.log(`   - Şehirler: ${cityCount}`);
        console.log(`   - İlçeler: ${districtCount}`);

    } catch (error) {
        console.error('❌ Seed işlemi sırasında hata:', error);
    }
};

module.exports = { seedDatabase };
