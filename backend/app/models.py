# from app import db

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     password = db.Column(db.String(200), nullable=False)

# class Cat(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(80), nullable=False)
#     owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)



# =====================

from datetime import datetime
from app import db, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# class User(db.Model, UserMixin):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(20), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password = db.Column(db.String(60), nullable=False)
#     cats = db.relationship('Cat', backref='owner', lazy=True)
#     diaries = db.relationship('Diary', backref='owner', lazy=True)
#     analyses = db.relationship('Analysis', backref='owner', lazy=True)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)


class Cat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    breed = db.Column(db.String(20), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    diaries = db.relationship('Diary', backref='cat', lazy=True)
    analyses = db.relationship('Analysis', backref='cat', lazy=True)

class Diary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    start = db.Column(db.Date, nullable=False)
    cat_id = db.Column(db.Integer, db.ForeignKey('cat.id'), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Analysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_file = db.Column(db.String(20), nullable=False)
    date_uploaded = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    cat_id = db.Column(db.Integer, db.ForeignKey('cat.id'), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)