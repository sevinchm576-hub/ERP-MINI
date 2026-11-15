# ERP Mini — Kichik korxona ombor qoldiqlari hisobi

## Loyiha haqida

ERP Mini — kichik korxonalarda ombordagi mahsulotlarni hisobga olish va boshqarish uchun ishlab chiqilgan veb-dastur.

Dastur yordamida mahsulotlarni qo‘shish, tahrirlash, o‘chirish, qidirish, kirim va chiqim operatsiyalarini amalga oshirish mumkin.

## Loyihaning asosiy imkoniyatlari

- Yangi mahsulot qo‘shish.
- Mahsulot ma’lumotlarini tahrirlash.
- Mahsulotlarni o‘chirish.
- Mahsulotlarni nomi yoki kodi bo‘yicha qidirish.
- Omborga mahsulot kirimini qayd etish.
- Ombordan mahsulot chiqimini qayd etish.
- Kirim-chiqim tarixini ko‘rish.
- Ombordagi mahsulotlar soni va qoldig‘ini ko‘rish.

## Foydalanilgan texnologiyalar

- React (Vite)
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JavaScript
- CSS

## Loyiha tuzilishi

```text
ERP-MINI/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

## O‘rnatish va ishga tushirish

### 1. Loyihani yuklab olish

```bash
git clone GITHUB_REPOSITORY_URL
cd ERP-MINI
```

### 2. Backendni sozlash

```bash
cd backend
npm install
```

`.env` faylini yarating va PostgreSQL ulanish ma’lumotlarini kiriting:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/erp_mini?schema=public"
```

Prisma migratsiyasini bajarish:

```bash
npx prisma migrate deploy
npx prisma generate
```

Backend serverni ishga tushirish:

```bash
node server.js
```

Backend: `http://localhost:5000`

### 3. Frontendni ishga tushirish

Yangi terminal oching:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Ma’lumotlar bazasi

Loyihada PostgreSQL ma’lumotlar bazasidan foydalanilgan.

Asosiy jadvallar:
- Product — mahsulotlar ma’lumotlari.
- StockMovement — mahsulot kirimi va chiqimi tarixi.

## Xavfsizlik

Maxfiy ma’lumotlar `.env` faylida saqlanadi. Ushbu fayl GitHub omboriga yuklanmaydi.

## Muallif

ERP Mini loyihasi kichik korxonalarda ombor hisobini yuritishni avtomatlashtirish maqsadida ishlab chiqilgan.