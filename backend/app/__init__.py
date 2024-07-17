from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
import os  # os 모듈 import 추가

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test2.db'
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static/cat_pics')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# from cat_test.backend.app import routes_origin

def create_tables():
    with app.app_context():
        db.create_all()

# 애플리케이션 초기화 시 테이블 생성
create_tables()