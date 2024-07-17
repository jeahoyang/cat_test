from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, FloatField, IntegerField, FileField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
# from cat_test.backend.app.models import User

class RegistrationForm(FlaskForm):
    username = StringField('아이디', validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('이메일', validators=[DataRequired(), Email()])
    password = PasswordField('비밀번호', validators=[DataRequired()])
    confirm_password = PasswordField('비밀번호 확인', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('가입하기')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('이미 사용 중인 아이디입니다.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('이미 사용 중인 이메일입니다.')

class LoginForm(FlaskForm):
    username = StringField('아이디', validators=[DataRequired()])  # 이메일 대신 아이디 사용
    password = PasswordField('비밀번호', validators=[DataRequired()])
    remember = BooleanField('아이디 저장하기')
    submit = SubmitField('로그인')

class CatForm(FlaskForm):
    name = StringField('고양이 이름', validators=[DataRequired()])
    breed = StringField('종', validators=[DataRequired()])
    age = IntegerField('나이', validators=[DataRequired()])
    weight = FloatField('몸무게', validators=[DataRequired()])
    image_file = FileField('사진 업로드', validators=[DataRequired()])
    submit = SubmitField('고양이 등록')