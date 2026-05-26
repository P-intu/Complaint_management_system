# Smart Complaint System

A full-stack complaint management application with a Django REST backend and a React + Vite frontend.

## Project structure

- `backend/` - Django API backend
- `frontend/` - React frontend built with Vite
- `backend/media/` - Uploaded complaint images

## Backend

### Requirements

- Python 3.11+ (or compatible Python 3.x)
- pip
- virtual environment (recommended)

### Setup

1. Open a terminal in `backend/`.
2. Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install dependencies:

```powershell
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
```

4. Run migrations:

```powershell
python manage.py migrate
```

5. Start the backend server:

```powershell
python manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000/`.

## Frontend

### Requirements

- Node.js 18+ (or compatible)
- npm

### Setup

1. Open a terminal in `frontend/`.
2. Install dependencies:

```powershell
npm install
```

3. Start the frontend development server:

```powershell
npm run dev
```

The frontend will usually run at `http://localhost:5173/`.

## Notes

- Backend uses SQLite at `backend/db.sqlite3`.
- Media uploads are stored in `backend/media/complaint_images/`.
- CORS is enabled for all origins in development (`CORS_ALLOW_ALL_ORIGINS = True`).
- JWT authentication is configured using `djangorestframework-simplejwt`.

## Recommended workflow

1. Run the backend server from `backend/`.
2. Run the frontend development server from `frontend/`.
3. Open the frontend URL in your browser and use the app.

## Troubleshooting

- If the frontend cannot reach the backend, verify the backend is running and adjust the frontend API base URL if needed.
- If Python dependencies are missing, install them in the activated virtual environment.
- If you want to reset the database in development, delete `backend/db.sqlite3` and re-run `python manage.py migrate`.
