from flask import Flask, jsonify, request, redirect, url_for, flash, render_template, abort, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import secrets
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy.exc import SQLAlchemyError
from flask import current_app

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site3.db'
# app.config['UPLOAD_FOLDER'] = 'D:\연세대\2024-1\강원혁신 의료소프트웨어 실험\app_test_0711\cat_test\backend\app\static'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
# login_manager.login_view = 'login'
jwt = JWTManager(app)
CORS(app, origins=['http://localhost:8081'])

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    cats = db.relationship('Cat', backref='owner', lazy=True)
    diary_entries = db.relationship('Diary', backref='owner', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Cat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    breed = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, default=1)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'breed': self.breed,
            'age': self.age,
            'weight': self.weight,
            'image_file': self.image_file,
            'owner_id': self.owner_id
        }

class Diary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    start = db.Column(db.Date, nullable=False)
    cat_id = db.Column(db.Integer, db.ForeignKey('cat.id'), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Analysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_file = db.Column(db.String(20), nullable=False)
    cat_id = db.Column(db.Integer, db.ForeignKey('cat.id'), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


# def create_app():
#     with app.app_context():
#         db.create_all()

# create_app()

def save_picture(image):
    # Generate a unique filename or use existing filename logic
    picture_fn = secure_filename(image.filename)
    picture_path = os.path.join(current_app.root_path, 'static/images', picture_fn)
    
    # Save the image file
    image.save(picture_path)
    
    return picture_fn  # Return the filename to store in the database

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/cats', methods=['POST'])
def register_cat():
    try:
        # Ensure all required fields are present
        required_fields = ['name', 'breed', 'age', 'weight']
        for field in required_fields:
            if field not in request.form:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Parse form data
        name = request.form['name']
        breed = request.form['breed']
        age = int(request.form['age'])
        weight = float(request.form['weight'])

        # Check if image file is included in the request
        if 'image' in request.files:
            image = request.files['image']
            
            # Check if a file was selected
            if image.filename != '':
                # Validate file type
                if not allowed_file(image.filename):
                    return jsonify({'error': 'Invalid file type. Allowed types: png, jpg, jpeg, gif'}), 400

                # Securely save the file to upload folder
                filename = secure_filename(image.filename)
                image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            else:
                filename = None  # No image uploaded

        else:
            filename = None  # No image uploaded
        
        # Save cat information to database
        new_cat = Cat(name=name, breed=breed, age=age, weight=weight, image_file=filename)
        db.session.add(new_cat)
        db.session.commit()
        
        return jsonify({'message': 'Cat registered successfully'}), 201
    
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/user', methods=['GET'])
def get_user():
    if 'user_id' not in session:
        return jsonify({'message': 'User not logged in'}), 401

    user_id = session['user_id']
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'username': user.username,
        'email': user.email,
        # Add other relevant user data as needed
    }), 200

# Example route to fetch user by ID
@app.route('/user/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = User.query.get_or_404(user_id)
    # Example: Return user data as JSON response
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        # Add other fields as needed
    })

@app.route('/user/<int:user_id>/cats', methods=['GET'])
def get_user_cats(user_id):
    user = User.query.get_or_404(user_id)
    cats = user.cats  # Assuming User has a relationship to Cat model
    cats_data = [{'id': cat.id, 'name': cat.name, 'breed': cat.breed} for cat in cats]
    return jsonify(cats_data)


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity=user.id)
    return jsonify({'message': 'Registration successful', 'access_token': access_token}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
    return jsonify({'error': 'Login failed'}), 401

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    session.clear()
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/account', methods=['GET', 'POST'])
@jwt_required()
def account():
    if request.method == 'POST':
        data = request.get_json()
        cat = Cat(name=data['name'], breed=data['breed'], age=data['age'], weight=data['weight'], owner=current_user)
        db.session.add(cat)
        db.session.commit()
        return jsonify({'message': 'Cat registered successfully'}), 201
    cats = Cat.query.filter_by(owner=current_user).all()
    return jsonify([cat.to_dict() for cat in cats]), 200

@app.route('/account/edit_cat/<int:cat_id>', methods=['PUT'])
@jwt_required()
def edit_cat(cat_id):
    cat = Cat.query.get_or_404(cat_id)
    if cat.owner != current_user:
        abort(403)
    data = request.get_json()
    cat.name = data['name']
    cat.breed = data['breed']
    cat.age = data['age']
    cat.weight = data['weight']
    db.session.commit()
    return jsonify({'message': 'Cat details updated successfully'}), 200

@app.route('/account/delete_cat/<int:cat_id>', methods=['DELETE'])
@jwt_required()
def delete_cat(cat_id):
    cat = Cat.query.get_or_404(cat_id)
    if cat.owner != current_user:
        abort(403)
    db.session.delete(cat)
    db.session.commit()
    return jsonify({'message': 'Cat deleted successfully'}), 200

@app.route('/ai_analysis', methods=['POST'])
@jwt_required()
def ai_analysis():
    data = request.get_json()
    cat_id = data['cat_id']
    analysis_image = request.files['analysis_image']
    if analysis_image and cat_id:
        picture_file = save_picture(analysis_image)
        analysis = Analysis(image_file=picture_file, cat_id=cat_id, owner_id=current_user.id)
        db.session.add(analysis)
        db.session.commit()
        response = {
            'success': True,
            'image_file': picture_file,
            'date_uploaded': datetime.utcnow().strftime('%Y-%m-%d')
        }
        return jsonify(response), 201
    return jsonify({'error': 'Invalid request'}), 400

@app.route('/nearby_vets', methods=['GET'])
@jwt_required()
def nearby_vets():
    return jsonify({'message': 'List of nearby vets'}), 200

@app.route('/diary', methods=['GET'])
@jwt_required()
def diary():
    cats = Cat.query.filter_by(owner=current_user).all()
    return jsonify([cat.to_dict() for cat in cats]), 200

# @app.route('/get_events/<int:cat_id>', methods=['GET'])
# @jwt_required()
# def get_events(cat_id):
#     events = Diary.query.filter_by(cat_id=cat_id).all()
#     return jsonify([{
#         'id': event.id,
#         'title': event.title,
#         'start': event.start.strftime("%Y-%m-%d"),
#         'allDay': True
#     } for event in events]), 200

# @app.route('/add_event', methods=['POST'])
# @jwt_required()
# def add_event():
#     data = request.get_json()
#     title = data.get('title')
#     start = datetime.strptime(data.get('start'), '%Y-%m-%d').date()
#     cat_id = data.get('cat_id')
#     event = Diary(title=title, start=start, cat_id=cat_id, owner_id=current_user.id)
#     db.session.add(event)
#     db.session.commit()
#     return jsonify({'success': True}), 201

# @app.route('/delete_event/<int:event_id>', methods=['DELETE'])
# @jwt_required()
# def delete_event(event_id):
#     event = Diary.query.get(event_id)
#     if event.owner_id != current_user.id:
#         abort(403)
#     db.session.delete(event)
#     db.session.commit()
#     return jsonify({'success': True}), 200
# Mock data store

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    start_date = db.Column(db.String(10))  # Assuming date is stored as a string
    owner_id = db.Column(db.Integer)
    cat_id = db.Column(db.Integer)
    note = db.Column(db.String(255))  # Make sure this field is included

def create_app():
    with app.app_context():
        db.create_all()
        
create_app()

# # Route to add an event
# @app.route('/add_event', methods=['POST'])
# def add_event():
#     try:
#         data = request.json
#         title = data.get('title')
#         start_date = data.get('start_date')
#         end_date = data.get('end_date')
#         owner_id = data.get('owner_id', 1)  # Default owner_id if not provided
#         cat_id = data.get('cat_id', 1)      # Default cat_id if not provided

#         # Validate required fields
#         if not title or not start_date or not end_date:
#             return jsonify({'message': 'Missing required fields'}), 400

#         # Create new event
#         new_event = Event(title=title, start_date=start_date, end_date=end_date, owner_id=owner_id, cat_id=cat_id)
#         db.session.add(new_event)
#         db.session.commit()

#         return jsonify({'message': 'Event added successfully'}), 201

#     except Exception as e:
#         print(f"Error adding event: {str(e)}")
#         return jsonify({'message': 'Error adding event'}), 500

# @app.route('/get_events', methods=['GET'])
# @jwt_required()
# def get_events():
#     owner_id = get_jwt_identity()
#     events = Diary.query.filter_by(owner_id=owner_id).all()
#     return jsonify([event.to_dict() for event in events]), 200

# @app.route('/delete_event/<int:event_id>', methods=['DELETE'])
# @jwt_required()
# def delete_event(event_id):
#     event = Diary.query.get(event_id)
#     if not event:
#         return jsonify({'error': 'Event not found'}), 404
#     if event.owner_id != get_jwt_identity():
#         return jsonify({'error': 'Unauthorized'}), 403
#     db.session.delete(event)
#     db.session.commit()
#     return jsonify({'success': True}), 200


def event_to_dict(event):
    return {
        'id': event.id,
        'title': event.title,
        'start_date': event.start_date,
        'owner_id': event.owner_id,
        'cat_id': event.cat_id,
        'note': event.note
    }

@app.route('/events', methods=['GET'])
def get_events():
    try:
        events = Event.query.all()
        return jsonify([event_to_dict(event) for event in events])
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/events', methods=['POST'])
def add_event():
    try:
        data = request.get_json()
        new_event = Event(
            title=data['title'],
            start_date=data['start_date'],
            owner_id=data.get('owner_id', 1),
            cat_id=data.get('cat_id', 1),
            note=data.get('note', '')
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify(event_to_dict(new_event)), 201
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=8081)