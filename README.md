# DataWOW Screen test within first round

## Authentication dependencies (backend)

### dependencies (runtime)

| Package | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| `@nestjs/jwt` | `^11.0.2` | sign/verify JWT token |
| `@nestjs/passport` | `^11.0.5` | เชื่อม Passport strategy เข้ากับ NestJS guard system |
| `passport` | `^0.7.0` | core auth middleware ที่ `@nestjs/passport` ใช้ข้างใน |
| `passport-jwt` | `^4.0.1` | strategy สำหรับดึง/verify JWT จาก header (ใช้ใน `jwt.strategy.ts`) |
| `class-validator` | `^0.15.1` | decorator `@IsEmail()`, `@MinLength()` ใน `LoginDto` |
| `class-transformer` | `^0.5.1` | แปลง plain JSON → class instance ให้ `ValidationPipe` ตรวจได้ |

### devDependencies

| Package | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| `@types/passport-jwt` | `^4.0.1` | type definitions ของ `passport-jwt` |


# How to run test and report
```npm --prefix backend run test:dashboard```
