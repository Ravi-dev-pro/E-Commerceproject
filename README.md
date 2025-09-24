Ravi (Ravi-dev-pro)  (github profile)

E-Commerceproject/
│
├── Django/
│   └── djangobackend/      # Django backend code
│
├── martservices/           # React frontend code
│
└── README.md               # Project setup & docs


E-Commerce Project

This is a full-stack E-commerce application built with:

Frontend: React (Vite)

Backend: Django + Django REST Framework

Database: SQLite (can be extended to PostgreSQL/MySQL)

1. Clone the Repository
git clone https://github.com/Ravi-dev-pro/E-Commerceproject.git 
cd e-commerceproject

2. Backend (Django Setup)
Create & Activate Virtual Environment
python -m venv venv
source venv/bin/activate   # Linux / Mac
venv\Scripts\activate      # Windows (PowerShell)


cd martservices (for frontend)
install npm 
npm run dev

Frontend will be running on http://localhost:5173/
 (default Vite port).


cd Django  (for backend)
cd djangobackend 


python manage.py runserver -----(this command is use for running the server )
you will get some errors like module not found --- (pil) 
pip install pillow (pil)
pip install Django  (django)
pip install django-environ (environ)
pip install djangorestframework   (restframework)
pip install django-cors-headers   (cors header )
pip install twilio   (twilio error )
pip install ultralytics   (ultralytics)

python manage.py migrate  (what you have installed this command will help you to setup or apply)
python manage.py runserver

Backend will be running on http://127.0.0.1:8000/




