# from flask import Flask, request, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
# from werkzeug.security import generate_password_hash, check_password_hash

# app = Flask(__name__)
# CORS(app)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
# db = SQLAlchemy(app)

# # User Model
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     password = db.Column(db.String(200), nullable=False)

# # Cat Model
# class Cat(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(80), nullable=False)
#     owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# db.create_all()

# @app.route('/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     hashed_password = generate_password_hash(data['password'], method='sha256')
#     new_user = User(username=data['username'], password=hashed_password)
#     db.session.add(new_user)
#     db.session.commit()
#     return jsonify({'message': 'registered successfully'})

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     user = User.query.filter_by(username=data['username']).first()
#     if user and check_password_hash(user.password, data['password']):
#         return jsonify({'message': 'login successful'})
#     return jsonify({'message': 'invalid credentials'})

# if __name__ == '__main__':
#     app.run(debug=True)


# ===================================


# from flask import Flask, request, jsonify
# from flask_sqlalchemy import SQLAlchemy

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
# db = SQLAlchemy(app)

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(50), nullable=False)

# @app.route('/api/users', methods=['POST'])
# def create_user():
#     data = request.json
#     name = data.get('name')

#     if not name:
#         return jsonify({'error': 'Name is required'}), 400

#     new_user = User(name=name)
#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({'message': 'User created successfully'}), 201

# @app.route('/api/users', methods=['GET'])
# def get_users():
#     users = User.query.all()
#     users_list = [{'id': user.id, 'name': user.name} for user in users]
#     return jsonify(users_list)

# if __name__ == '__main__':
#     with app.app_context():
#         db.create_all()
#     app.run(debug=True)
# ========================================

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from flask import session
from datetime import datetime
from flask_login import UserMixin


from flask import render_template, url_for, flash, redirect, request, jsonify, abort
from app import app, db, bcrypt
from app.forms import RegistrationForm, LoginForm, CatForm
# from app.models import User, Cat, Diary, Analysis
from flask_login import login_user, current_user, logout_user, login_required
import secrets
from werkzeug.utils import secure_filename
import os
from datetime import datetime, timedelta
from flask_login import LoginManager
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test4.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.secret_key = os.urandom(24)  # Generate a random secret key

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# CORS(app)
# CORS 설정
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:8081"}}, supports_credentials=True)

UPLOAD_FOLDER = 'D:\연세대\2024-1\강원혁신 의료소프트웨어 실험\app_test_0711\cat_test\backend\app\static'  # Specify your upload folder path
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}  # Specify allowed file extensions

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Example function to generate JWT token
def generate_jwt_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)  # Token expiration time
    }
    jwt_token = jwt.encode(payload, 'your_secret_key', algorithm='HS256')
    return jwt_token.decode('utf-8')

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password = db.Column(db.String(128), nullable=False)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    cats = db.relationship('Cat', backref='owner', lazy=True)
    # diaries = db.relationship('Diary', backref='owner', lazy=True)
    # analyses = db.relationship('Analysis', backref='owner', lazy=True)


class Cat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    breed = db.Column(db.String(20), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    # image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    # diaries = db.relationship('Diary', backref='cat', lazy=True)
    # analyses = db.relationship('Analysis', backref='cat', lazy=True)


def create_app():
    with app.app_context():
        db.create_all()

create_app()


@app.route('/')
def index():
    return 'Hello, World!'

# @app.route('/api/users', methods=['POST'])
# def add_user():
#     data = request.get_json()
#     username = data.get('username')
#     email = data.get('email')
#     password = data.get('password')
#     hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
#     user = User(username=username, email=email, password=hashed_password)
#     db.session.add(user)
#     db.session.commit()
#     return jsonify({'message': 'User added successfully'}), 201

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 200
    else:
        return jsonify({'message': 'File type not allowed'}), 400
    
# @app.route('/api/registerCat', methods=['POST'])
# def register_cat():
#     data = request.get_json()

#     name = data.get('name')
#     breed = data.get('breed')
#     age = data.get('age')
#     weight = data.get('weight')

#     if not name or not breed or not age:
#         return jsonify({'message': 'All fields are required'}), 400

#     # Assuming Cat is your SQLAlchemy model
#     new_cat = Cat(name=name, breed=breed, age=age, weight=weight)

#     try:
#         db.session.add(new_cat)
#         db.session.commit()
#         return jsonify({'message': 'Cat registered successfully!'})
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': 'Internal Server Error', 'error': str(e)}), 500
@app.route('/api/registerCat', methods=['POST'])
@jwt_required()  # Requires JWT token for this route
def register_cat():
    try:
        current_user_id = 1
        # current_user_id = get_jwt_identity()  # Retrieve user_id from JWT token
        
        # Example: Retrieve cat registration data from request JSON
        data = request.get_json()
        name = data.get('name')
        breed = data.get('breed')
        age = data.get('age')
        weight = data.get('weight')

        # Basic validation: Check if required fields are present
        if not name or not breed or not age or not weight:
            return jsonify({'message': 'All fields (name, breed, age, weight) are required.'}), 422

        # Additional validation: Check data types and values
        if not isinstance(age, int) or not isinstance(weight, float):
            return jsonify({'message': 'Invalid data types for age or weight.'}), 422
        
        # Example: Create a new Cat object linked to the current user
        new_cat = Cat(name=name, breed=breed, age=age, weight=weight, owner_id=current_user_id)
        db.session.add(new_cat)
        db.session.commit()

        return jsonify({'message': 'Cat registered successfully!'})

    except ExpiredSignatureError:
        return jsonify({'message': 'Token has expired!'}), 401
    except InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 401
    except Exception as e:
        return jsonify({'message': 'Error', 'error': str(e)}), 500

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/api/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     username = data.get('username')
#     password = data.get('password')
#     user = User.query.filter_by(username=username).first()
#     if user and bcrypt.check_password_hash(user.password, password):
#         session['user_id'] = user.id  # 세션에 사용자 ID 저장
#         session['username'] = user.username
#         session['email'] = user.email
#         return jsonify({'message': 'Login successful'}), 200
#     else:
#         return jsonify({'message': 'Invalid credentials'}), 401
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    login_user(user)

    return jsonify({'message': 'Login successful', 'username': user.username, 'email': user.email}), 200


@app.route('/api/user_info', methods=['GET'])
# def get_user_info():
#     if 'user_id' in session:
#         user_id = session['user_id']
#         user = User.query.get(user_id)
#         # return jsonify(), 11111
#         if user:
#             return jsonify({
#                 'username': user.username,
#                 'email': user.email,
#                 # Add more fields as needed
#             }), 200
#         else:
#             return jsonify({'message': 'User not found'}), 404
#     else:
#         return jsonify({'message': 'Unauthorized'}), 401
@login_required
def get_user_info():
    user = User.query.get(current_user.id)
    if user:
        return jsonify({
            'username': user.username,
            'email': user.email,
            # Add more fields as needed
        }), 200
    else:
        return jsonify({'message': 'User not found'}), 404

@app.route('/api/logout', methods=['POST'])
# def logout():
#     session.pop('user_id', None)
#     return jsonify({'message': 'Logged out successfully'}), 200
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# @app.route('/api/register', methods=['POST'])
# def register_user():
#     data = request.get_json()
#     username = data.get('username')
#     email = data.get('email')
#     password = data.get('password')
#     hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
#     user = User(username=username, email=email, password=hashed_password)
#     db.session.add(user)
#     db.session.commit()
#     return jsonify({'message': 'User added successfully'}), 201

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'All fields are required'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(username=username, email=email, password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Internal Server Error', 'error': str(e)}), 500

# @app.route('/api/register', methods=['POST'])
# def register_user():
#     try:
#         data = request.json
#         new_user = User(username=data['username'], email=data['email'])
#         new_user.set_password(data['password'])  # Assuming User model has set_password method

#         db.session.add(new_user)
#         db.session.commit()

#         return jsonify({"id": new_user.id, "username": new_user.username, "email": new_user.email}), 201

#     except KeyError as e:
#         return jsonify({"error": f"Missing key in JSON data: {str(e)}"}), 400

#     except SQLAlchemyError as e:
#         db.session.rollback()
#         return jsonify({"error": "Database error"}), 500

#     except Exception as e:
#         return jsonify({"error": "An unexpected error occurred"}), 500

# if __name__ == '__main__':
#     app.run(debug=True)
# @app.route('/api/register', methods=['POST'])
# def register_user():
#     data = request.json
#     hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
#     new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)
#     db.session.add(new_user)
#     db.session.commit()
#     return jsonify({"id": new_user.id, "username": new_user.username, "email": new_user.email}), 201

@app.route('/api/analyzeImage', methods=['POST'])
def analyze_image():
    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    # Use your PyTorch model here to analyze the image
    result = "Analysis result here"  # Replace with actual analysis result
    
    return jsonify({"result": result}), 200

if __name__ == '__main__':
    create_app()
    app.run()
