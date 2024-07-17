from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:8081"}})

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password = db.Column(db.String(200), nullable=False)

# class Cat(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(80), nullable=False)
#     breed = db.Column(db.String(80), nullable=False)
#     age = db.Column(db.Integer, nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     user = db.relationship('User', backref=db.backref('cats', lazy=True))

@app.route('/')
def home():
    return 'Hello from Flask!'

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    new_user = User(username=data['username'], email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"id": new_user.id, "username": new_user.username, "email": new_user.email}), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "username": user.username, "email": user.email} for user in users])

@app.route('/api/registerCat', methods=['POST'])
def register_cat():
    data = request.json
    user_id = 1  # You need to replace this with the actual user_id
    new_cat = Cat(name=data['name'], breed=data['breed'], age=data['age'], user_id=user_id)
    db.session.add(new_cat)
    db.session.commit()
    return jsonify({"id": new_cat.id, "name": new_cat.name, "breed": new_cat.breed, "age": new_cat.age}), 201

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
    app.run(debug=True)
