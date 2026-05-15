# Smart Farming App - Getting Started in 10 Minutes

## Prerequisites

- Python 3.9+ installed
- Node.js 18+ and npm installed
- Git installed
- A text editor (VS Code recommended)

## Step 1: Backend Setup (2 minutes)

### 1.1 Navigate to backend folder

```bash
cd backend
```

### 1.2 Create and activate virtual environment

```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 1.3 Install dependencies

```bash
pip install -r requirements.txt
```

### Expected Output

```
Successfully installed Django-5.0 djangorestframework-3.14.0 ...
```

---

## Step 2: Configure Backend (2 minutes)

### 2.1 Create environment file

```bash
# Copy template
cp .env.example .env
```

### 2.2 Edit `.env` with your API keys

**Minimum required:**

```bash
DEBUG=True
SECRET_KEY=django-insecure-your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Get from Firebase Console
FIREBASE_CREDENTIALS_PATH=path/to/serviceAccountKey.json

# Get from Stripe Dashboard
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

# Get from AI services (free tiers)
GEMINI_API_KEY=YOUR_GEMINI_KEY
HUGGINGFACE_API_KEY=hf_YOUR_TOKEN
OPENWEATHER_API_KEY=YOUR_WEATHER_KEY
```

### 2.3 Initialize database

```bash
python manage.py migrate
```

### Expected Output

```
Running migrations:
  Applying auth.0001_initial... OK
  Applying users.0001_initial... OK
  ... (multiple migrations)
```

### 2.4 Create admin user

```bash
python manage.py createsuperuser
```

Follow prompts:

- Username: `admin`
- Email: `admin@example.com`
- Password: `YourSecurePassword123`

---

## Step 3: Start Backend Server (1 minute)

```bash
python manage.py runserver
```

### Expected Output

```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### Test it

Open browser: http://localhost:8000/admin

- Username: `admin`
- Password: Your password from step 2.4

---

## Step 4: Frontend Setup (3 minutes)

### 4.1 Open new terminal window and navigate to frontend

```bash
cd frontend
```

### 4.2 Install dependencies

```bash
npm install
```

### Expected Output (takes 2-3 minutes)

```
added 500+ packages in 2m 30s
```

### 4.3 Create environment file

```bash
# Create .env.local
cat > .env.local << EOF
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EOF
```

### 4.4 Start Expo development server

```bash
npm start
```

### Expected Output

```
› Metro waiting on exp://192.168.x.x:19000
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

---

## Step 5: Test the App

### 5.1 Install Expo Go (if not already installed)

- iOS: Search "Expo Go" in App Store
- Android: Search "Expo Go" in Google Play Store

### 5.2 Scan QR code from terminal

- iOS: Use Camera app
- Android: Use Expo Go app

### 5.3 Wait for app to load (2-3 minutes)

---

## Step 6: Test Basic Features

### 6.1 Test Registration

**Data to use:**

```
Email: test@farm.com
Password: Test@123456
First Name: John
Last Name: Farmer
Phone: +1234567890
Latitude: 28.7041
Longitude: 77.1025
Address: Delhi, India
Farm Size: 5.5
Crops: wheat, rice
Soil Type: loam
```

### 6.2 Test API Endpoint

Open new terminal:

```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Common Issues & Solutions

### Issue: Port 8000 already in use

**Solution:**

```bash
# Use different port
python manage.py runserver 8001
```

### Issue: Migrations failed

**Solution:**

```bash
# Reset database
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Issue: "Module not found" error

**Solution:**

```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Frontend won't connect to backend

**Solution:**

1. Check backend is running: http://localhost:8000/admin
2. Verify API URL in `.env.local`: `http://localhost:8000/api`
3. Check network connectivity

### Issue: Firebase not working

**Solution:**

1. Download service account JSON from Firebase Console
2. Save to `backend/serviceAccountKey.json`
3. Update `.env`: `FIREBASE_CREDENTIALS_PATH=backend/serviceAccountKey.json`

---

## What to Try Next

### 1. Create a Community Post

1. Login with test account
2. Go to Community tab
3. Click "New Post"
4. Add title, content, and image
5. Submit

### 2. Test AI Features

1. Go to SMS/Chat screen
2. Ask: "How to prevent pest infestation?"
3. Get AI response (requires Gemini API key)

### 3. Check Weather

1. Go to Dashboard
2. View weather for your location
3. See farming advisory

### 4. View Admin Interface

1. Open http://localhost:8000/admin
2. Login with admin credentials
3. View farmers, posts, payments

---

## 🎯 Success Indicators

✅ Backend running at http://localhost:8000
✅ Admin panel accessible at http://localhost:8000/admin
✅ Frontend app running on mobile/emulator
✅ Can see QR code in terminal
✅ App loads successfully after scanning QR
✅ Can navigate through screens

---

## 📚 Next Resources

- **Full Setup Guide**: See `BACKEND_COMPLETE_SETUP.md`
- **Frontend Guide**: See `FRONTEND_COMPLETE_SETUP.md`
- **API Reference**: See `API_REFERENCE_COMPLETE.md`
- **Implementation Status**: See `IMPLEMENTATION_COMPLETE.md`

---

## 🆘 Need Help?

1. **Check Django logs**: Look at terminal where backend is running
2. **Check Expo logs**: Look at terminal where frontend is running
3. **Review setup guides**: All common issues documented
4. **Test API directly**: Use cURL to test endpoints
5. **Check environment variables**: Verify all keys are correct

---

## 🚀 You're Ready!

You now have a fully functional Smart Farming app running locally. Next step:

- Deploy to production (see deployment guides)
- Customize UI to match your branding
- Add more data and test at scale

**Total Setup Time: ~10 minutes** ⏱️
