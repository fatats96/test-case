# 🚗 Sigorta Teklifi Uygulaması

Bu proje, kullanıcıların araç plakası girerek sigorta teklifleri almasını, mevcut tekliflerin durumunu sorgulamasını ve teklif sonuçlarını görüntülemesini sağlayan bir React tabanlı web uygulamasıdır.

## 🔧 Kullanılan Teknolojiler

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design](https://ant.design/)
- [Axios](https://axios-http.com/)
- .env üzerinden yapılandırılabilir API URL desteği

## 📦 Kurulum

Projeyi yerel ortamda çalıştırmak için aşağıdaki adımları takip edebilirsin:

### 1. Depoyu Klonla

```bash
git clone https://github.com/kullanici-adi/proje-adi.git
cd proje-adi
```

### 2. Bağımlılıkları Yükle

```bash
npm install
# veya
yarn install
```

### 3. Ortam Değişkenlerini Ayarla

Projenin kök dizinine `.env` dosyası ekle ve şu satırı yaz:

```env
VITE_API_URL=http://localhost:5000/api
```

> `VITE_API_URL`, teklif oluşturma ve sorgulama işlemlerinde kullanılan backend API adresidir.

### 4. Projeyi Başlat

```bash
npm run dev
# veya
yarn dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

## 🚀 Özellikler

- ✅ Plaka girerek sigorta teklifi oluşturma
- 🔍 Mevcut teklifleri plakaya göre sorgulama
- 📦 Request ID ile teklif durumunu görüntüleme
- 📊 Tekliflerin listesi, fiyat, sigorta şirketi ve durum bilgileri
- 🔁 Teklifleri yenileme
- 🛠 Kullanıcı dostu bildirim ve hata yönetimi

## 🖼 Ekran Görüntüsü

> COMING SOON.

## 📁 Proje Yapısı

```bash
src/
│
├── App.tsx              
├── models/
│   └── insurance-quote.model.ts  
│   └── quote.model.ts  
├── ...
```

## 🧪 Test

> COMING SOON
