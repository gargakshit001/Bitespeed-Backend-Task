# Bitespeed Backend Task - Akshit Garg

This is a Node.js + TypeScript backend service for identifying user contacts based on email and phone number.

## 📦 Tech Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL

## 🚀 Live Endpoint

**POST** [`/identify`](https://bitespeed-backend-task-l4kl.onrender.com/identify)  
🔗 `https://bitespeed-backend-task-l4kl.onrender.com/identify`

## 🧪 Sample Request

```json
POST /identify
Content-Type: application/json

{
  "email": "george@hillvalley.edu",
  "phoneNumber": "919191"
}
