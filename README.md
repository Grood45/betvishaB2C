# Project Name (Casino & Sports Betting Platform)

Ye ek comprehensive project hai jismein ek **Backend (Node.js/Express)**, ek **Frontend**, aur ek **Admin Panel (React.js/Vite)** shamil hai.

## 🚀 Local System par Kaise Run Karein?

Apne Mac/Windows system par is project ko local chalane ke liye in steps ko follow karein:

### 1. Requirements:
- **Node.js**: (Version 18+ recommended)
- **MongoDB**: Aapke paas apna MongoDB cluster (URL) hona chahiye.

### 2. Environment Setup (Hamesha Khud Banayein):
Security ke karan `.env` files GitHub par upload nahi ki gayi hain. Aapko teeno folders (`project1-backened`, `project1-frontend`, `project1-admin`) ke andar apni khud ki `.env` file banani padegi.
Example (`project1-backened/.env`):
```env
PORT=8098
MONGO_URL=mongodb+srv://<aapka-user>:<aapka-password>@clusterxyz.mongodb.net/project_01
MONGO_URL_DB_02=...
```

### 3. Server Start (Terminal mein):
Project run karne ke liye apna terminal open karein aur in folders mein jaakar dependencies install karein aur start karein:

**Backend ke liye:**
```bash
cd project1-backened
npm install
npm start
```
(Ye by default `http://localhost:8098` par backend start karta hai.)

**Frontend ke liye:**
```bash
cd project1-frontend
npm install
npm run dev
```

**Admin Panel ke liye:**
```bash
cd project1-admin
npm install
npm run dev
```

---

## 🌍 AWS / Live Server par Deploy Kaise Karein?

Is project ko live VPS ya AWS EC2 (Ubuntu) par deploy karne ke liye ye basic steps yad rakhein:

1. **Server Setup**: AWS par ek `Ubuntu 24.04/22.04` instance banayein. Server ke Security Group me `Port 80 (HTTP)`, `Port 443 (HTTPS)`, aur `Port 22 (SSH)` allow karein.
2. **Installations**: Server terminal login karke Nginx, Node.js, aur PM2 install karein (PM2 backend ko background me live rakhta hai).
3. **Download Code**: Server par is repository ko clone karein:
   ```bash
   git clone https://github.com/Grood45/betvishaB2C.git
   ```
4. **Build Frontend/Admin**: Apne Frontend aur Admin folders mein jaakar `.env` banayein, `npm install` chalayein aur `npm run build` chalayein jisse aapko ek `dist` ya `build` folder mil jayeinga.
5. **Nginx Configure (Hosting)**: `/etc/nginx/sites-available/default` file me Nginx Configure karein, jisse `80` port par dist folder host ho jaye, aur `/api` path par PM2 backend.
6. **SSL Secure**: `certbot` use karke free SSL certificate apply kar lein taaki site HTTPS ban jaye.

Enjoy! 🎉
