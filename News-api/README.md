# News API

Backend API для управления новостными статьями с поддержкой авторизации пользователей, загрузки изображений, отложенной публикации и real-time-уведомлений.
Проект реализован в рамках **демонстрационного backend-проекта**. 

## Основной функционал

### Пользователи
- Регистрация
- Авторизация (JWT)
- Получение профиля

### Новости
- Создание, редактирование, удаление
- Публикация вручную
- Отложенная публикация по дате
- Загрузка изображений
- Пагинация
- Доступ только к своим новостям

### Real-time уведомления (Socket.IO / WebSocket)
| Событие           | Описание                              |
|-------------------|---------------------------------------|
| `news:published`  | Публикация новости                    |
| `news:updated`    | Обновление опубликованной новости     |
| `news:deleted`    | Удаление новости                      |

> **Примечание:** Уведомления отправляются только для опубликованных новостей.

## Архитектура
Проект построен по **слоистой архитектуре**
- **Routes** — HTTP слой
- **Services** — бизнес-логика
- **Models** — Mongoose схемы
- **Middleware** — авторизация, ошибки, валидация
- **Utils** — JWT, пагинация, логгер
- **Config** — окружение, база данных, сокеты
Такой подход упрощает поддержку, тестирование и масштабирование.

### Дополнительно реализованы

- Отложенные публикации через таймеры
- Восстановление задач при перезапуске сервера
- Socket.IO + WebSocket fallback (для Insomnia)
- Централизованная обработка ошибок
- Логирование через `tslog`

## Технологии

- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT**
- **bcrypt**
- **Socket.IO**
- **Docker**
- **Render**

## Быстрый старт

### 1. Клонирование
```bash
git clone https://github.com/AlekseyAlandarenko/NewsProject.git
cd NewsProject/News-api
```

### 2. Установка зависимостей 
```bash
npm install
```

### 3. Файл окружения .env
**Вариант A — запуск без Docker (через MongoDB Atlas)**
> **Примечание:** Требуется аккаунт в MongoDB Atlas, активный кластер, Database User и разрешённый доступ по IP (0.0.0.0/0).
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://<db_user>:<db_password>@cluster0.xxxxx.mongodb.net/news?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Вариант B — запуск через Docker (MongoDB в контейнере)**
> **Примечание:** Требуется установленный Docker и Docker Compose. MongoDB будет запущена автоматически.
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://mongo:27017/news
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Запуск в dev-режиме
```bash
npm run dev
```

### 5. Запуск через Docker
```bash
docker-compose up --build
```

## Деплой
Проект развёрнут на **Render** и доступен по адресу:
`https://news-api-i776.onrender.com`

Используется:
- Используется **Dockerfile**
- База данных — **MongoDB Atlas**
- Переменные окружения задаются через **Render Dashboard**
- Автодеплой из ветки `master`

Пример запроса:
```bash
GET https://news-api-i776.onrender.com/news
```
Ответ:
```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 10
}
```

## Авторизация
JWT передаётся в заголовке запроса:
```http
Authorization: Bearer <token>
```
Токен выдаётся при:
- регистрации
- логине

## Real-time уведомления

### Socket.IO
```javascript
const socket = io('https://your-api-url');

socket.on('news:published', data => console.log(data));
socket.on('news:updated', data => console.log(data));
socket.on('news:deleted', data => console.log(data));
```

### WebSocket (для Insomnia)
```text
ws://localhost:3000/ws
```

## Загрузка изображений

### Поддерживаемые форматы
- JPG
- PNG
- GIF

Максимальный размер файла — **5 МБ**

Файлы сохраняются в `/uploads` и доступны по URL: `/uploads/filename.jpg`

## Структура проекта
```text
src/
├── config/
├── middleware/
├── models/
├── routes/
├── services/
├── types/
├── utils/
├── app.ts
└── main.ts
```

## Примеры API

### Регистрация

**POST** `/users/register`
```json
{
  "email": "test@mail.com",
  "password": "123456",
  "name": "Test User"
}
```

### Логин

**POST** `/users/login`
```json
{
  "email": "test@mail.com",
  "password": "123456"
}
```

### Профиль

**GET** `/users/profile`
```http
Authorization: Bearer <token>
```

### Создание новости

**POST** `/news`
```http
Authorization: Bearer <token>
```
```json
{
  "title": "Новость",
  "content": "Текст",
  "publishDate": "2026-01-20T18:00:00Z"
}
```

### Публикация новости вручную

**POST** `/news/:id/publish`

### Мои новости

**GET** `/news/my?page=1&limit=10`

### Обновление новости

**PATCH** `/news/:id`

### Удаление новости

**DELETE** `/news/:id`

## Ошибки API
| Код               | Описание                              |
|-------------------|---------------------------------------|
| **401**           | Нет или неверный токен                |
| **403**           | Нет прав доступа                      |
| **404**           | Не найдено                            |
| **422**           | Ошибка валидации                      |
| **500**           | Ошибка сервера                        |
