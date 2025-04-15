# Sigorta Teklifi API

Bu proje, araç plakasına göre farklı sigorta şirketlerinden eş zamanlı olarak teklif almayı sağlayan bir NestJS uygulamasıdır. Event-driven mimari ile asenkron işlem yaparak hızlı ve ölçeklenebilir bir yapı sunmaktadır.

## Teknolojiler

- **NestJS**: Ana framework
- **MongoDB**: Veri tabanı
- **Bull**: Redis tabanlı kuyruk yönetimi
- **Mongoose**: MongoDB ODM (Object Document Mapper)
- **Swagger**: API dokümantasyonu
- **Event Emitter**: Event-driven yapı için

## Proje Yapısı

Proje, aşağıdaki bileşenlerden oluşmaktadır:

- **Controller**: HTTP isteklerini karşılar
- **Service**: İş mantığını yönetir
- **Processor**: Asenkron işlemleri yürütür
- **Event Listener**: Event'leri dinler ve işler
- **Schemas**: MongoDB için veri modelleri
- **DTOs**: Veri Transfer Objeleri
- **Models**: Tip tanımlamaları

## Kurulum

### Gereksinimler

- Node.js
- MongoDB
- Redis

### Adımlar

1. Repoyu klonlayın:

```bash
git clone <repo-url>
cd sigorta-teklifi-api
```

2. Bağımlılıkları yükleyin:

NPM kullanarak:

```bash
npm install
```

Yarn kullanarak:

```bash
yarn install
```

3. `.env` dosyasını oluşturun:

```env
MONGODB_URI=
REDIS_HOST=
REDIS_PORT=
PORT=
```

4. Uygulamayı geliştirme modunda başlatın:

NPM kullanarak:

```bash
npm run start:dev
```

Yarn kullanarak:

```bash
yarn start:dev
```

5. Tarayıcıdan Swagger dokümanına erişin:

```
http://localhost:5000/swagger
```

## API Endpointleri

### 1. Teklif Oluşturma

```
GET /quote?plate=34ABC123
```

Bu endpoint, belirtilen plaka için tüm sigorta şirketlerinden teklif alma işlemini başlatır.

**Query Parametreleri:**

- `plate`: Araç plakası

**Yanıt:**

```json
{
  "_id": "614a5f3b9d8f7e001c123456",
  "requestId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "plate": "34ABC123",
  "quotes": [
    { "provider": "Sigorta Şirketi A", "status": "pending" },
    { "provider": "Sigorta Şirketi B", "status": "pending" },
    { "provider": "Sigorta Şirketi C", "status": "pending" }
  ],
  "status": "processing",
  "successCount": 0,
  "failureCount": 0,
  "createdAt": "2023-06-15T10:23:45.678Z",
  "updatedAt": "2023-06-15T10:23:45.678Z"
}
```

### 2. Teklif Durumu Sorgulama (RequestID ile)

```
GET /quote/status/:requestId
```

**Path Parametreleri:**

- `requestId`: Teklif isteği ID'si

### 3. Teklif Durumu Sorgulama (Plaka ile)

```
GET /quote/statusByPlate/:plate
```

**Path Parametreleri:**

- `plate`: Araç plakası

## Mimari Özellikleri

### Asenkron İşlem Akışı

1. Kullanıcı teklif isteği gönderir
2. Sistem MongoDB'ye istek kaydeder ve hemen yanıt döner
3. Bull kuyruğuna işlem eklenir
4. Processor her sigorta şirketi için asenkron sorgu başlatır
5. Sonuçlar geldikçe Event Emitter ile bildirim yapılır
6. Listener sonuçları alıp MongoDB'deki kaydı günceller
7. Kullanıcı durumu sorguladığında en güncel bilgileri görür

### Performans ve Ölçeklenebilirlik

- Her sigorta şirketi sorgusu birbirinden bağımsız çalışır
- Redis tabanlı kuyruk sayesinde yük dengesi sağlanır
- Event-driven mimari sayesinde sistem genişletilebilir
- Horizontal scaling için uygun mimari tasarım

## Geliştirme

### Test

NPM kullanarak:

```bash
# Unit testleri çalıştırma
npm run test

# E2E testleri çalıştırma
npm run test:e2e

# Test coverage raporu
npm run test:cov
```

Yarn kullanarak:

```bash
# Unit testleri çalıştırma
yarn test

# E2E testleri çalıştırma
yarn test:e2e

# Test coverage raporu
yarn test:cov
```

### Lint

NPM kullanarak:

```bash
npm run lint
```

Yarn kullanarak:

```bash
yarn lint
```

### Build

NPM kullanarak:

```bash
npm run build
```

Yarn kullanarak:

```bash
yarn build
```

## Docker ile Çalıştırma

```bash
# Docker compose ile tüm servisleri başlatma
docker-compose up -d

# Sadece uygulamayı build etme
docker build -t sigorta-teklifi-api .
```

## Lisans

[MIT](LICENSE)
