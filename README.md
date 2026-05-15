# Shamba Smart Monorepo

This repository contains both the frontend and backend for Shamba Smart.

## Structure

- `frontend/` – Expo React Native application
- `backend/` – Django REST API backend

## Frontend setup

```bash
cd frontend
npm install
npx expo start
```

## Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

## Notes

- The backend expects requests under `http://localhost:8000/api`.
- Authentication now uses JWT tokens issued by `rest_framework_simplejwt`.
- The frontend and backend are split into distinct directories for clarity.
