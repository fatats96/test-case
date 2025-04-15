# Sigorta Teklifi Sistemi

Bu proje, araç plakası ile sigorta teklifleri almak için tasarlanmış fullstack bir web uygulamasıdır. Backend için NestJS, frontend için React+Vite kullanılmıştır. Tüm sistem Docker kullanılarak konteynerize edilmiştir.

## Proje Yapısı

Proje iki ana bileşenden oluşur:

- **client**: React ve Ant Design kullanan frontend uygulaması
- **server**: NestJS tabanlı API backend uygulaması

## Gereksinimler

Uygulamayı çalıştırmak için aşağıdaki yazılımların kurulu olması gerekir:

- Docker
- Docker Compose

## Kurulum ve Çalıştırma

1. Projeyi yerel makinenize klonlayın:

```bash
git clone <repo-url>
cd <proje-klasörü>
```

2. Docker Compose ile tüm servisleri başlatın:

```bash
docker-compose up -d
```

Bu komut şunları yapacaktır:
- Frontend uygulamasını oluşturup 80 portunda çalıştıracak
- Backend API'yi oluşturup 5000 portunda çalıştıracak
- MongoDB veritabanını 27017 portunda çalıştıracak
- Redis önbellek sistemini 6379 portunda çalıştıracak

3. Uygulamaya erişim:

Frontend uygulamasına tarayıcınızdan şu adresten erişebilirsiniz:
```
http://localhost
```

API doğrudan şu adresten erişilebilir:
```
http://localhost:5000/api
```

## Servislerin Durumunu Kontrol Etme

Çalışan servisleri kontrol etmek için:

```bash
docker-compose ps
```

## Logları Görüntüleme

Bir servisin loglarını görüntülemek için:

```bash
docker-compose logs -f [service-name]
```

Örnek: `docker-compose logs -f api`

## Servisleri Durdurma

Tüm servisleri durdurmak için:

```bash
docker-compose down
```

Veritabanı verilerini de kaldırmak için:

```bash
docker-compose down -v
```

## API Endpointleri

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/quote?plate={plate}` | GET | Araç plakası ile sigorta teklifleri başlatır |
| `/quote/status/{requestId}` | GET | Teklif durumunu sorgular |
| `/quote/status/{palte}` | GET | Plakaya Göre Teklif durumunu sorgular |

## Geliştirme

### Frontend Geliştirme

Frontend klasöründe çalışmak için:

```bash
cd client
npm install
npm run dev
```

Geliştirme sırasında API adresini `.env` dosyasında ayarlayabilirsiniz:
```
VITE_API_URL=http://localhost:3000/api
```

### Backend Geliştirme

Backend klasöründe çalışmak için:

```bash
cd server
npm install
npm run start:dev
```

## Sorun Giderme

### Konteyner Başlatma Sorunları

Eğer konteynerlerden biri başlatılamazsa, hata günlüklerini kontrol edin:

```bash
docker-compose logs [service-name]
```

### MongoDB Bağlantı Sorunları

Eğer API, MongoDB'ye bağlanamazsa, MongoDB servisinin çalıştığından emin olun:

```bash
docker-compose ps mongodb
```

### Redis Bağlantı Sorunları

Redis bağlantı sorunları için Redis servisinin durumunu kontrol edin:

```bash
docker-compose ps redis
```

### Port Çakışmaları

Eğer belirtilen portlardan birisi zaten kullanımdaysa, `docker-compose.yml` dosyasında port eşleştirmelerini değiştirebilirsiniz.
