from flask import render_template, url_for, flash, redirect, request, jsonify, abort
from app import app, db, bcrypt
from app.forms import RegistrationForm, LoginForm, CatForm
from cat_test.backend.app.models import User, Cat, Diary, Analysis
from flask_login import login_user, current_user, logout_user, login_required
import secrets
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from flask_jwt_extended import JWTManager, create_access_token

# CORS configuration
CORS(app, resources={r"/api/*": {"origins": "http://localhost:8081"}})

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # Store hashed passwords

    def __repr__(self):
        return f'<User {self.username}>'

@app.route('/')
def home():
    return 'Hello from Flask!'

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "username": user.username, "email": user.email} for user in users])


@app.route('/api/users', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        user = User(username=username, email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'User added successfully'}), 201

    except Exception as e:
        app.logger.error(f"Error adding user: {str(e)}")
        db.session.rollback()  # Rollback the session on error
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing username or password in request'}), 400

    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={'username': user.username, 'email': user.email})
        return jsonify(access_token=access_token), 200
    return jsonify({'error': 'Invalid credentials'}), 401

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)

# def save_picture(form_picture):
#     random_hex = secrets.token_hex(8)
#     _, f_ext = os.path.splitext(form_picture.filename)
#     picture_fn = random_hex + f_ext
#     picture_path = os.path.join(app.config['UPLOAD_FOLDER'], picture_fn)
#     form_picture.save(picture_path)
#     return picture_fn

# @app.route('/')
# @login_required
# def home():
#     return redirect(url_for('account'))

# @app.route('/register', methods=['GET', 'POST'])
# def register():
#     if current_user.is_authenticated:
#         return redirect(url_for('home'))
#     form = RegistrationForm()
#     if form.validate_on_submit():
#         hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
#         user = User(username=form.username.data, email=form.email.data, password=hashed_password)
#         db.session.add(user)
#         db.session.commit()
#         flash('회원가입이 완료되었습니다! 이제 로그인할 수 있습니다.', 'success')
#         return redirect(url_for('login'))
#     return render_template('register.html', title='회원가입', form=form)

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if current_user.is_authenticated:
#         return redirect(url_for('home'))
#     form = LoginForm()
#     if form.validate_on_submit():
#         user = User.query.filter_by(username=form.username.data).first()
#         if user and bcrypt.check_password_hash(user.password, form.password.data):
#             login_user(user, remember=form.remember.data)
#             next_page = request.args.get('next')
#             return redirect(next_page) if next_page else redirect(url_for('account'))
#         else:
#             flash('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.', 'danger')
#     return render_template('login.html', title='로그인', form=form)

# @app.route('/logout')
# @login_required
# def logout():
#     logout_user()
#     flash('로그아웃 되었습니다.', 'success')
#     return redirect(url_for('login'))

# @app.route('/account', methods=['GET', 'POST'])
# @login_required
# def account():
#     form = CatForm()
#     if form.validate_on_submit():
#         if form.image_file.data:
#             picture_file = save_picture(form.image_file.data)
#             cat = Cat(name=form.name.data, breed=form.breed.data, age=form.age.data, weight=form.weight.data, image_file=picture_file, owner=current_user)
#             db.session.add(cat)
#             db.session.commit()
#             flash('고양이가 등록되었습니다.', 'success')
#             return redirect(url_for('account'))
#     cats = Cat.query.filter_by(owner=current_user).all()
#     return render_template('account.html', title='마이페이지', form=form, cats=cats)

# @app.route('/account/edit_cat/<int:cat_id>', methods=['GET', 'POST'])
# @login_required
# def edit_cat(cat_id):
#     cat = Cat.query.get_or_404(cat_id)
#     if cat.owner != current_user:
#         abort(403)
#     form = CatForm()
#     if form.validate_on_submit():
#         if form.image_file.data:
#             picture_file = save_picture(form.image_file.data)
#             cat.image_file = picture_file
#         cat.name = form.name.data
#         cat.breed = form.breed.data
#         cat.age = form.age.data
#         cat.weight = form.weight.data
#         db.session.commit()
#         flash('고양이 정보가 수정되었습니다.', 'success')
#         return redirect(url_for('account'))
#     elif request.method == 'GET':
#         form.name.data = cat.name
#         form.breed.data = cat.breed
#         form.age.data = cat.age
#         form.weight.data = cat.weight
#     return render_template('edit_cat.html', title='고양이 정보 수정', form=form, cat=cat)

# @app.route('/account/delete_cat/<int:cat_id>', methods=['POST'])
# @login_required
# def delete_cat(cat_id):
#     cat = Cat.query.get_or_404(cat_id)
#     if cat.owner != current_user:
#         abort(403)
#     db.session.delete(cat)
#     db.session.commit()
#     flash('고양이 정보가 삭제되었습니다.', 'success')
#     return redirect(url_for('account'))

# @app.route('/ai_analysis', methods=['GET', 'POST'])
# @login_required
# def ai_analysis():
#     if request.method == 'POST':
#         cat_id = request.form.get('cat_id')
#         analysis_image = request.files['analysis_image']
#         if analysis_image and cat_id:
#             picture_file = save_picture(analysis_image)
#             analysis = Analysis(image_file=picture_file, cat_id=cat_id, owner_id=current_user.id)
#             db.session.add(analysis)
#             db.session.commit()
#             response = {
#                 'success': True,
#                 'image_file': picture_file,
#                 'date_uploaded': datetime.utcnow().strftime('%Y-%m-%d')
#             }
#             return jsonify(response)
#     cats = Cat.query.filter_by(owner=current_user).all()
#     return render_template('ai_analysis.html', title='AI 사진 분석', cats=cats)

# @app.route('/nearby_vets')
# @login_required
# def nearby_vets():
#     return render_template('nearby_vets.html', title='내 주변 동물병원')

# @app.route('/diary', methods=['GET', 'POST'])
# @login_required
# def diary():
#     cats = Cat.query.filter_by(owner=current_user).all()
#     return render_template('diary.html', title='냥만일기', cats=cats)

# @app.route('/get_events/<int:cat_id>')
# @login_required
# def get_events(cat_id):
#     events = Diary.query.filter_by(cat_id=cat_id).all()
#     return jsonify([{
#         'id': event.id,
#         'title': event.title,
#         'start': event.start.strftime("%Y-%m-%d"),
#         'allDay': True
#     } for event in events])

# @app.route('/add_event', methods=['POST'])
# @login_required
# def add_event():
#     data = request.get_json()
#     title = data.get('title')
#     start = datetime.strptime(data.get('start'), '%Y-%m-%d').date()
#     cat_id = data.get('cat_id')
#     event = Diary(title=title, start=start, cat_id=cat_id, owner_id=current_user.id)
#     db.session.add(event)
#     db.session.commit()
#     return jsonify({'success': True})

# @app.route('/delete_event/<int:event_id>', methods=['POST'])
# @login_required
# def delete_event(event_id):
#     event = Diary.query.get(event_id)
#     if event.owner_id != current_user.id:
#         abort(403)
#     db.session.delete(event)
#     db.session.commit()
#     return jsonify({'success': True})