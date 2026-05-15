# Smart Farming Frontend - Complete Setup Guide

## Project Structure

```
frontend/
├── app/
│   ├── (tabs)/              # Tab navigation screens
│   ├── _layout.tsx          # Root layout
│   ├── LoginScreen.tsx      # Login screen
│   ├── RegistrationScreen.tsx # Registration with location
│   ├── SmsScreen.tsx        # AI chatbot
│   ├── AdminDashboard.tsx   # Admin map view
│   └── ...other screens
├── components/              # Reusable components
├── contexts/
│   ├── AuthContext.tsx      # Auth state management
│   └── SubscriptionContext.tsx # Premium subscription state
├── services/
│   ├── api.ts              # API client with all endpoints
│   └── location.ts         # Location services
├── constants/              # App constants
├── hooks/                  # Custom React hooks
├── assets/                 # Images and fonts
├── package.json            # Dependencies
└── .env.example           # Environment variables
```

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Setup Environment Variables

Create `.env.local` with:

```
EXPO_PUBLIC_API_BASE_URL=http://192.168.100.81:8000/api
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Install EAS CLI (For Building)

```bash
npm install -g eas-cli
eas login
```

### 4. Run Development Server

```bash
npm start
```

For Android:

```bash
npm run android
```

For iOS:

```bash
npm run ios
```

For Web:

```bash
npm run web
```

## Key Features

### 1. Location-Based Registration

**File**: `app/RegistrationScreen.tsx`

Updates include:

- Request location permissions
- Get current GPS coordinates
- Manual pin adjustment on map
- Farm size input
- Primary crops multi-select
- Soil type dropdown

```typescript
import { LocationService } from "@/services/location";

// Get location
const location = await LocationService.getCurrentLocation();
// Coordinates automatically populated
```

### 2. Community Features

**Files**:

- `app/(tabs)/CommunityScreen.tsx`
- Uses API endpoints for posts, likes, comments

Features:

- Create posts with images
- View community posts with engagement
- Like/unlike functionality
- Add comments to posts
- Image upload to backend

### 3. AI Chatbot (Farming Assistant)

**File**: `app/SmsScreen.tsx`

Features:

- Chat interface with farming assistant
- Context-aware responses based on crops/location
- Chat history
- Offline message queuing

### 4. Premium Subscription

**File**: `contexts/SubscriptionContext.tsx`

Features:

- Integration with Stripe PaymentSheet
- 7-day free trial
- Premium benefits:
  - Unlimited community posts
  - Priority support
  - Advanced analytics
- Cancel anytime

### 5. Disease Detection

**File**: `app/(tabs)/CommunityScreen.tsx` (or new screen)

Features:

- Camera integration for crop photos
- Upload to backend for AI analysis
- Display disease prediction with confidence
- Treatment suggestions

### 6. Weather & Market Data

**Files**:

- `app/(tabs)/DashboardScreen.tsx` - Weather display
- `app/(tabs)/MarketScreen.tsx` - Prices and nearby markets

Features:

- Real-time weather for farm location
- Farming advisories based on conditions
- Commodity prices
- Nearby markets (auto-calculated distance)

## Updated Components

### RegistrationScreen

Now includes:

- Location permission handling
- GPS coordinate collection
- Map preview with pin adjustment
- Farm details input
- Crop and soil type selection

```typescript
const handleLocationFetch = async () => {
  const location = await LocationService.getCurrentLocation();
  // Handle location
};
```

### ProfileScreen

Updated with:

- Premium subscription status
- Upgrade button and pricing
- Farm details editing
- Location updates

### DashboardScreen

Enhanced with:

- Weather advisory from backend
- Crop recommendations
- Farm statistics
- Yield predictions

## API Integration Examples

### Register with Location

```typescript
import { apiService } from "@/services/api";

const handleRegister = async (formData) => {
  const result = await apiService.register({
    email: formData.email,
    password: formData.password,
    latitude: location.latitude,
    longitude: location.longitude,
    location_address: location.address,
    farm_size: formData.farmSize,
    primary_crops: formData.crops,
    soil_type: formData.soilType,
  });

  // Save tokens and redirect
};
```

### Create Community Post

```typescript
const handleCreatePost = async (title, content, image) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("image", image);

  const post = await apiService.createPost(formData);
};
```

### Chat with AI Assistant

```typescript
const handleChat = async (message) => {
  const response = await apiService.chatWithAssistant(message);
  // response.assistant_message contains the reply
};
```

### Detect Disease

```typescript
const handleDisease = async (imageUri) => {
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: "disease_image.jpg",
  });

  const result = await apiService.detectDisease(formData);
  // result contains disease name, confidence, treatment
};
```

### Get Weather Advisory

```typescript
const handleWeather = async () => {
  const advisory = await apiService.getWeatherAdvisory();
  // Shows weather and farming recommendations
};
```

### Upgrade to Premium

```typescript
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

const handleUpgradePremium = async (plan) => {
  // Create payment intent
  const { client_secret } = await apiService.createPaymentIntent(plan);

  // Initialize Stripe payment sheet
  const { error: payError } = await initPaymentSheet({
    paymentIntentClientSecret: client_secret,
  });

  // Present payment sheet
  const { error } = await presentPaymentSheet();
};
```

## State Management

### AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (firebaseToken: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}
```

### SubscriptionContext

```typescript
interface SubscriptionContextType {
  isPremium: boolean;
  premiumExpiry: Date | null;
  postsThisMonth: number;
  canCreatePost: boolean;
  upgradePremium: (plan: "monthly" | "annual") => Promise<void>;
  checkStatus: () => Promise<void>;
}
```

## Permissions

The app requires:

- **Location**: GPS coordinates for farm location
- **Camera**: For disease detection and image uploads
- **Photos**: For selecting images from gallery
- **Microphone** (optional): For voice features

Request all permissions on first launch in `_layout.tsx`.

## Offline Support

The app automatically:

- Caches weather data (3 hours)
- Stores recent market prices
- Queues community posts when offline
- Syncs when connection returns

## Performance Optimization

### Image Optimization

```typescript
// Compress images before upload
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const compressImage = async (uri) => {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: 800, height: 800 } }],
    {
      compress: 0.7,
      format: SaveFormat.JPEG,
    },
  );
  return result.uri;
};
```

### API Caching

The API client automatically:

- Caches GET requests for 5 minutes
- Invalidates cache on mutations
- Handles token refresh

### Lazy Loading

Implement lazy loading for:

- Community posts (pagination)
- Market prices (on demand)
- Chat history (infinite scroll)

## Testing

### Test User Account

```typescript
const testUser = {
  email: "farmer@test.com",
  password: "Test@1234",
  latitude: 28.7041,
  longitude: 77.1025,
  farmSize: 5,
  crops: ["wheat", "rice"],
  soilType: "loam",
};
```

### Test Stripe Payment

Use Stripe test card: `4242 4242 4242 4242`

- Expiry: Any future date
- CVC: Any 3 digits

## Troubleshooting

### Location Permission Issues

```typescript
// Check permission status
const { status } = await Location.getForegroundPermissionsAsync();
if (status !== "granted") {
  // Request permission
}
```

### API Connection Issues

- Verify `EXPO_PUBLIC_API_BASE_URL` matches backend URL
- Check network connectivity
- Clear AsyncStorage cache: `await AsyncStorage.clear()`

### Firebase Authentication Issues

- Verify Firebase config is correct
- Check Firebase project allows authentication
- Ensure Firebase credentials are properly imported

### Image Upload Issues

- Compress images to < 5MB
- Use JPEG format for better compatibility
- Ensure proper FormData formatting

## Building for Production

### Android

```bash
eas build --platform android
```

Then submit to Google Play Store.

### iOS

```bash
eas build --platform ios
```

Then submit to Apple App Store.

### Environmental Configuration

Update `.env.production` with:

- Production backend URL
- Production Firebase config
- Production Stripe keys

## Security Best Practices

- [ ] Never commit API keys to git
- [ ] Use environment variables for secrets
- [ ] Validate input on both client and server
- [ ] Implement HTTPS only
- [ ] Refresh tokens regularly
- [ ] Clear sensitive data on logout
- [ ] Implement certificate pinning (optional)
- [ ] Use secure storage for tokens

## Documentation

- Expo: https://docs.expo.dev
- React Native: https://reactnative.dev
- React Navigation: https://reactnavigation.org
- Firebase: https://firebase.google.com/docs
- Stripe React Native: https://stripe.com/docs/stripe-js/react/stripe-react-native

## Support

For issues or questions, check:

1. Console logs (npm start output)
2. Error messages in the app
3. Backend API responses
4. Firebase console for auth issues
