# Database Seeding

Skrip seeding ini digunakan untuk mengisi database dengan data dummy untuk testing dan development.

## Data yang Dibuat

Skrip ini akan membuat 15 user dengan pembagian sebagai berikut:

### Students (5 users)
- student1@revou.co - Alice Johnson
- student2@revou.co - Bob Smith
- student3@revou.co - Charlie Brown
- student4@revou.co - Diana Wilson
- student5@revou.co - Edward Davis

### Team Leads (5 users)
- teamlead1@revou.co - Frank Miller
- teamlead2@revou.co - Grace Taylor
- teamlead3@revou.co - Henry Anderson
- teamlead4@revou.co - Ivy Thomas
- teamlead5@revou.co - Jack Jackson

### Admins (5 users)
- admin1@revou.co - Karen White
- admin2@revou.co - Leo Harris
- admin3@revou.co - Mia Martin
- admin4@revou.co - Noah Garcia
- admin5@revou.co - Olivia Rodriguez

## Password Default

Semua user dummy menggunakan password yang sama: `password123`

## Cara Menjalankan

```bash
# Menjalankan seeding
npm run db:seed
```

## Catatan

- Pastikan database sudah running dan terhubung
- Jika user dengan email yang sama sudah ada, seeding akan skip user tersebut
- Password di-hash menggunakan bcrypt dengan salt rounds 10
- Semua user dibuat dengan timestamp createdAt dan updatedAt otomatis

## Testing Login

Setelah seeding berhasil, Anda dapat testing login dengan salah satu user:

```bash
# Contoh login sebagai student
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@revou.co",
    "password": "password123"
  }'

# Contoh login sebagai team lead
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teamlead1@revou.co",
    "password": "password123"
  }'

# Contoh login sebagai admin
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin1@revou.co",
    "password": "password123"
  }'
```