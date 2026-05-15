# Shamba Smart - Quick Reference

## 🚀 Start Backend

```bash
cd shamba-smart-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

## 🚀 Start Frontend

```bash
cd shamba-smart-frontend
npm install  # (if needed)
npm start
```

## 📍 Important URLs

| Service       | URL                         |
| ------------- | --------------------------- |
| Backend API   | http://localhost:8000/api   |
| Django Admin  | http://localhost:8000/admin |
| Frontend Expo | http://localhost:8082       |

## 🔑 API Base Endpoints

| Endpoint                      | Method   | Purpose                |
| ----------------------------- | -------- | ---------------------- |
| `/auth/register/`             | POST     | Register new user      |
| `/auth/login/`                | POST     | Login user             |
| `/auth/logout/`               | POST     | Logout user            |
| `/dashboard/overview/`        | GET      | Get all dashboard data |
| `/dashboard/weather/current/` | GET      | Get weather            |
| `/dashboard/alerts/unread/`   | GET      | Get alerts             |
| `/crops/crops/`               | GET/POST | List/create crops      |
| `/crops/recommendations/`     | GET      | Get recommendations    |
| `/users/profile/`             | GET/PUT  | Get/update profile     |

## 📁 Key Files

### Backend

- `core/settings.py` - Django configuration
- `apps/auth/views.py` - Authentication logic
- `apps/crops/models.py` - Crop data models
- `apps/dashboard/views.py` - Dashboard data

### Frontend

- `services/api.ts` - API client
- `app/LoginScreen.tsx` - Login page
- `app/(tabs)/DashboardScreen.tsx` - Dashboard
- `app/contexts/AuthContext.tsx` - Auth state

## 🔐 Login Flow

1. Enter username & password
2. API validates at `/auth/login/`
3. Token stored in AsyncStorage
4. Logged in state persists
5. All requests include token

## 💾 AsyncStorage Keys

```
@onboarding_completed    - Onboarding state
@user_logged_in          - Login state
@user_token              - API token
@user_data               - Cached user data
```

## 🌐 Environment Variables

### Backend (.env)

```
DEBUG=True
SECRET_KEY=your-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:8000,http://localhost:8082
```

### Frontend (services/api.ts)

```typescript
const API_BASE_URL = "http://localhost:8000/api";
```

## 📦 Dependencies

### Backend

- Django 4.2.7
- djangorestframework 3.14.0
- django-cors-headers 4.3.1
- Pillow (images)
- psycopg2-binary (PostgreSQL)

### Frontend

- axios (API requests)
- react-native-gesture-handler
- expo-linear-gradient
- lucide-react-native (icons)
- @react-native-async-storage/async-storage

## 🗂️ Database Models

```
User (Django built-in)
├── UserProfile (phone, location, farm_size)
├── Crop (name, type, health, dates)
├── CropRecommendation (crop_name, profit, season)
├── WeatherData (temp, humidity, wind, rainfall)
└── AlertNotification (title, message, type)
```

## ✅ Checklist

- [ ] Backend running on localhost:8000
- [ ] Database migrated
- [ ] Superuser created
- [ ] Frontend dependencies installed
- [ ] API_BASE_URL configured
- [ ] Test user created
- [ ] Login working
- [ ] Dashboard loading data
- [ ] Onboarding complete

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check port
lsof -i :8000

# Delete and recreate db
rm db.sqlite3
python manage.py migrate

# Check migrations
python manage.py makemigrations
```

### Frontend can't connect

```bash
# Update API URL in services/api.ts
# Verify backend CORS settings
# Check firewall
```

### AsyncStorage issues

```bash
# Clear app data
# Rebuild app
# Check permissions
```

## 🎯 Next Steps

1. Add JWT tokens
2. Integrate real weather API
3. Add image uploads
4. Deploy to production
5. Add push notifications
6. Implement real-time features

## 📖 Documentation

- [Backend Setup Guide](../BACKEND_SETUP_GUIDE.md)
- [API Documentation](../shamba-smart-backend/API_DOCUMENTATION.md)
- [Integration Guide](../FRONTEND_BACKEND_INTEGRATION.md)
- [Full Summary](../IMPLEMENTATION_SUMMARY.md)

---

**Version:** 1.0.0  
**Last Updated:** May 14, 2026  
**Status:** Ready for Development
