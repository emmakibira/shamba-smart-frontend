# Quick Start Guide - Smart Farming App

## 5-Minute Backend Setup

### 1. Clone and Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with:

- Firebase credentials path
- Stripe API keys
- AI service keys (Gemini, Hugging Face, OpenWeather)

### 3. Initialize Database

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Admin: http://localhost:8000/admin

---

## 5-Minute Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cat > .env.local << EOF
EXPO_PUBLIC_API_BASE_URL=http://192.168.100.81:8000/api
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EOF
```

### 3. Run App

```bash
npm start

# Android: press 'a'
# iOS: press 'i'
# Web: press 'w'
```

---

## Key Services Setup

### Firebase (Free Tier)

1. Go to https://console.firebase.google.com
2. Create new project
3. Enable Authentication (Email/Password and Anonymous)
4. Get service account key:
   - Project Settings → Service Accounts → Generate new key
   - Save as `serviceAccountKey.json`
5. Enable Firestore Database

### Stripe (Free Integration)

1. Sign up at https://stripe.com
2. Get test keys from https://dashboard.stripe.com/apikeys
3. Create webhook:
   - Developers → Webhooks → Add endpoint
   - URL: `https://your-domain/api/payments/webhook/`
   - Events: `payment_intent.*`, `customer.subscription.*`

### Google Gemini (Free - 60 req/min)

1. Go to https://makersuite.google.com
2. Click "Get API Key"
3. Create new key or use existing

### Hugging Face (Free - 30k req/month)

1. Sign up at https://huggingface.co
2. Settings → Tokens → Create token
3. Use read token

### OpenWeatherMap (Free - 1000 calls/day)

1. Sign up at https://openweathermap.org
2. My API Keys → Copy key

---

## Test the App

### Test Registration

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@farm.com",
    "password": "Test123",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "farm_size": 5,
    "primary_crops": ["wheat"],
    "soil_type": "loam"
  }'
```

### Test Community Post

```bash
curl -X POST http://localhost:8000/api/community/posts/ \
  -H "Authorization: Bearer <token>" \
  -F "title=Great harvest!" \
  -F "content=This season was amazing" \
  -F "image=@path/to/image.jpg"
```

### Test AI Chat

```bash
curl -X POST http://localhost:8000/api/ai/chat/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message": "How to prevent pest infestation?"}'
```

---

## Database Seeding (Optional)

Create sample markets:

```bash
python manage.py shell
```

```python
from apps.farm_data.models import Market

markets = [
    Market(name="Delhi Mandi", latitude=28.7041, longitude=77.1025,
           city="Delhi", state="Delhi", commodities=["wheat", "rice"]),
    Market(name="Pune Mandi", latitude=18.5204, longitude=73.8567,
           city="Pune", state="Maharashtra", commodities=["sugarcane", "jowar"]),
    # Add more...
]
Market.objects.bulk_create(markets)
```

---

## Deploy to Production

### Backend on Render.com

1. Create account at https://render.com
2. Connect GitHub repo
3. Create PostgreSQL database
4. Create Web Service:
   - Build: `pip install -r requirements.txt && python manage.py migrate`
   - Start: `gunicorn core.wsgi:application`

### Frontend on Expo

```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
eas submit --platform android  # To Google Play
eas submit --platform ios      # To App Store
```

---

## Troubleshooting

### Backend won't start

```bash
# Clear migrations
python manage.py migrate --zero
# Recreate
python manage.py makemigrations
python manage.py migrate
```

### API endpoint 404

- Check URL matches in `core/urls.py`
- Verify app is in `INSTALLED_APPS`
- Run `python manage.py help` to debug

### Location permission issues

```typescript
import * as Location from "expo-location";
const { status } = await Location.requestForegroundPermissionsAsync();
```

### Stripe webhook not working

```bash
# Use Stripe CLI to test
stripe listen --forward-to localhost:8000/api/payments/webhook/
```

### Firebase authentication failing

- Verify Firebase credentials path in `.env`
- Check `FIREBASE_CREDENTIALS_PATH` is absolute path
- Ensure Firebase project allows authentication method

---

## Next Steps

1. **Customize UI**: Update colors in `constants/theme.ts`
2. **Add Crops**: Seed database with your region's crops
3. **Market Data**: Integrate government agricultural APIs
4. **Push Notifications**: Set up Firebase Cloud Messaging
5. **Analytics**: Add Firebase Analytics
6. **Maps**: Integrate OpenStreetMap for admin dashboard

---

## Resources

- **Docs**: Check `BACKEND_COMPLETE_SETUP.md` and `FRONTEND_COMPLETE_SETUP.md`
- **API**: See `API_REFERENCE_COMPLETE.md`
- **Issues**: Check app logs and Django debug output
- **Support**: Visit https://github.com/your-repo/issues

---

## Key API Endpoints

| Method | Endpoint                           | Purpose                |
| ------ | ---------------------------------- | ---------------------- |
| POST   | `/auth/register/`                  | Register with location |
| POST   | `/auth/login/`                     | Firebase login         |
| GET    | `/community/posts/`                | List posts             |
| POST   | `/ai/chat/`                        | Chat with AI           |
| POST   | `/ai/detect-disease/`              | Detect diseases        |
| GET    | `/farm/nearby-markets/`            | Find markets           |
| GET    | `/farm/weather-advisory/`          | Weather info           |
| POST   | `/payments/create-payment-intent/` | Premium subscription   |

---

For detailed information, refer to the complete setup guides and API reference.
