# Smart Farming Backend - Complete Setup Guide

## Project Structure

```
backend/
├── apps/
│   ├── auth/           # Authentication with Firebase
│   ├── users/          # User profiles with location and farm data
│   ├── community/      # Community posts, likes, comments
│   ├── payments/       # Stripe integration for premium subscriptions
│   ├── ai_service/     # Gemini chatbot, disease detection, yield prediction
│   ├── farm_data/      # Markets, commodity prices, weather advisory
│   ├── crops/          # Crop management
│   └── dashboard/      # Dashboard data
├── utils/
│   ├── firebase_utils.py    # Firebase token verification
│   ├── auth.py              # Custom authentication
│   └── helpers.py           # Utility functions
├── core/               # Django settings and URLs
├── requirements.txt    # Python dependencies
└── .env.example       # Environment variables template
```

## Installation

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Key variables to set:

- `SECRET_KEY`: Django secret key
- `FIREBASE_CREDENTIALS_PATH`: Path to Firebase service account JSON
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`: Stripe keys
- `GEMINI_API_KEY`: Google Gemini API key
- `HUGGINGFACE_API_KEY`: Hugging Face API key
- `OPENWEATHER_API_KEY`: OpenWeatherMap API key

### 4. Database Setup

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver 0.0.0.0:8000
```

Access admin at: `http://localhost:8000/admin`

## Key Features

### 1. User Registration with Location

- Users register with GPS coordinates
- Automatic address reverse geocoding
- Farm size, primary crops, and soil type data
- Premium subscription tracking

### 2. Premium Subscription

- Monthly ($9.99) or Annual ($99.99) plans
- Stripe payment integration
- Free users: 5 posts/month
- Premium users: Unlimited posts
- Auto-renewal with webhook handling

### 3. Community Features

- Create posts with images
- Like/unlike posts
- Add comments to posts
- Track engagement metrics

### 4. AI Services

- **Gemini Chatbot**: Farming advice based on crop/soil/weather
- **Disease Detection**: Upload crop image, get disease prediction
- **Yield Prediction**: Predict harvest based on weather and soil

### 5. Weather & Markets

- Real-time weather for farm location
- Farming advisory based on weather conditions
- Nearby markets within 50km radius
- Commodity prices tracking
- Crop recommendations based on location and soil type

### 6. Admin Features

- Leaflet/OpenStreetMap admin interface for farmer locations
- Filter farmers by crop, soil type, premium status
- Export farmer data to CSV
- Manage commodity prices
- View payment history

## API Endpoints

### Authentication

- `POST /api/auth/register/` - Register with location
- `POST /api/auth/login/` - Firebase token login
- `GET /api/auth/profile/` - Get current user profile

### Community

- `GET /api/community/posts/` - List all posts
- `POST /api/community/posts/` - Create new post
- `POST /api/community/posts/{id}/like/` - Like/unlike post
- `GET /api/community/posts/{id}/comments/` - Get comments
- `POST /api/community/posts/{id}/comments/` - Add comment

### Payments

- `POST /api/payments/create-payment-intent/` - Create Stripe payment
- `GET /api/payments/subscription-status/` - Check subscription status
- `POST /api/payments/cancel-subscription/` - Cancel subscription
- `POST /api/payments/webhook/` - Stripe webhook (internal)

### AI Services

- `POST /api/ai/chat/` - Chat with farming assistant
- `GET /api/ai/chat-history/` - Get chat history
- `POST /api/ai/detect-disease/` - Upload image for disease detection
- `GET /api/disease-history/` - Get detection history
- `POST /api/ai/predict-yield/` - Predict crop yield
- `GET /api/yield-history/` - Get prediction history

### Farm Data

- `GET /api/farm/commodity-prices/` - Get market prices
- `GET /api/farm/weather-advisory/` - Get weather advisory
- `GET /api/farm/nearby-markets/` - Get nearby markets
- `GET /api/farm/crop-recommendations/` - Get crop recommendations

### Users

- `GET /api/users/profile/` - Get profile details
- `PUT /api/users/profile/` - Update profile
- `GET /api/users/farm-data/` - Get farm history
- `POST /api/users/farm-data/` - Create farm data record

## Environment Variables

### Firebase

Get these from [Firebase Console](https://console.firebase.google.com):

1. Go to Project Settings
2. Click "Service Accounts"
3. Generate new private key
4. Save as JSON and set `FIREBASE_CREDENTIALS_PATH`

### Stripe

Get from [Stripe Dashboard](https://dashboard.stripe.com):

1. Go to API Keys (test mode)
2. Copy Secret Key → `STRIPE_SECRET_KEY`
3. Copy Publishable Key → `STRIPE_PUBLISHABLE_KEY`
4. Set up webhook → `STRIPE_WEBHOOK_SECRET`

### Gemini API

Get from [Google AI Studio](https://makersuite.google.com):

1. Click "Get API Key"
2. Create new API key
3. Set as `GEMINI_API_KEY`

### Hugging Face

Get from [Hugging Face](https://huggingface.co):

1. Go to Settings → Tokens
2. Create read token
3. Set as `HUGGINGFACE_API_KEY`

### OpenWeatherMap

Get from [OpenWeatherMap](https://openweathermap.org):

1. Create account (free tier)
2. Go to API Keys
3. Set as `OPENWEATHER_API_KEY`

## Testing Stripe Webhooks Locally

Use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI from https://stripe.com/docs/stripe-cli

stripe listen --forward-to localhost:8000/api/payments/webhook/
```

This will output a webhook signing secret. Set it as `STRIPE_WEBHOOK_SECRET` in `.env`.

## Production Deployment

### Using Render.com (Free Tier)

1. Connect GitHub repo to Render
2. Create PostgreSQL database
3. Set environment variables in Render dashboard
4. Deploy

```bash
# Build command
pip install -r requirements.txt && python manage.py migrate

# Start command
gunicorn core.wsgi:application
```

### Database Migration (SQLite → PostgreSQL)

```bash
# In production .env, set:
DATABASE_URL=postgresql://user:password@host:5432/db_name

# Run migrations
python manage.py migrate
```

## Maintenance

### Reset Database (Development)

```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Create Sample Data

```bash
python manage.py shell
```

```python
from apps.farm_data.models import Market, CommodityPrice
from datetime import date

# Add sample markets
Market.objects.create(
    name="Delhi Mandi",
    latitude=28.7041,
    longitude=77.1025,
    address="Mandi Road, Delhi",
    city="Delhi",
    state="Delhi",
    commodities=["wheat", "rice", "vegetables"]
)

# Add sample prices
CommodityPrice.objects.create(
    commodity_name="wheat",
    market_name="Delhi Mandi",
    price_per_unit=2500,
    unit="kg"
)
```

## Troubleshooting

### Firebase Token Not Verifying

- Check `FIREBASE_CREDENTIALS_PATH` points to correct JSON file
- Verify credentials haven't expired
- Ensure Firebase project ID matches

### Stripe Webhooks Not Working

- Verify `STRIPE_WEBHOOK_SECRET` is set correctly
- Use Stripe CLI to test locally
- Check webhook logs in Stripe dashboard

### AI APIs Not Responding

- Verify API keys are correct
- Check rate limits haven't been exceeded
- Ensure required Python packages are installed

### Database Connection Issues

- For PostgreSQL: Check connection string format
- Test connection: `psql postgresql://user:pass@host/db`
- Clear migrations if necessary: `python manage.py migrate --zero`

## Performance Optimization

### Caching

- Weather data cached for 3 hours
- API responses cached using Redis (optional)

### Database Indexing

- User profiles indexed by `latitude`, `longitude`
- Posts indexed by `created_at`
- Farm data indexed by `planting_date`

### Rate Limiting

- Implement using django-ratelimit (optional)
- Gemini API: 60 requests/minute
- Hugging Face: 30k requests/month

## Security Checklist

- [ ] Change `SECRET_KEY` in production
- [ ] Set `DEBUG=False` in production
- [ ] Use HTTPS only
- [ ] Validate all user inputs
- [ ] Don't commit API keys to git
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for frontend domain
- [ ] Implement rate limiting
- [ ] Regular security updates

## Support & Documentation

- Django REST Framework: https://www.django-rest-framework.org
- Firebase Admin SDK: https://firebase.google.com/docs/admin
- Stripe API: https://stripe.com/docs/api
- Google Gemini: https://ai.google.dev/docs
- Hugging Face: https://huggingface.co/docs
