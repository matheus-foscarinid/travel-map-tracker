from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta, timezone
import jwt
import requests
from app.models import User
from app.extensions import db
from app.utils.validators import validate_email, validate_username

auth_bp = Blueprint('auth', __name__)

def generate_token(user_id):
  payload = {
    'user_id': user_id,
    'exp': datetime.now(timezone.utc) + timedelta(days=7),
    'iat': datetime.now(timezone.utc)
  }
  token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
  if isinstance(token, bytes):
    return token.decode('utf-8')
  return token

def verify_token(token):
  try:
    payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
    return payload.get('user_id')
  except jwt.ExpiredSignatureError:
    return None
  except jwt.InvalidTokenError:
    return None

def verify_google_token(id_token):
  try:
    response = requests.get(
      f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={id_token}'
    )
    if response.status_code == 200:
      return response.json()
    return None
  except Exception as e:
    print(f"Error verifying Google token: {e}")
    return None

def get_or_create_user_from_google(google_info):
  email = google_info.get('email')
  google_id = google_info.get('sub')
  name = google_info.get('name', '')

  if not email:
    return None

  user = User.query.filter_by(google_id=google_id).first()

  if user:
    if user.email != email:
      user.email = email
    if name and user.name != name:
      user.name = name
    user.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    return user

  user = User.query.filter_by(email=email).first()

  if user:
    user.google_id = google_id
    if name and not user.name:
      user.name = name
    user.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    return user

  user = User(
    email=email,
    name=name,
    google_id=google_id,
    username=None
  )
  db.session.add(user)
  db.session.commit()
  return user

@auth_bp.route('/google/verify', methods=['POST'])
def google_verify():
  try:
    data = request.get_json()
    id_token = data.get('id_token')

    if not id_token:
      return jsonify({'error': 'ID token is required'}), 400

    google_info = verify_google_token(id_token)

    if not google_info:
      return jsonify({'error': 'Invalid Google token'}), 401

    if current_app.config.get('GOOGLE_CLIENT_ID') and \
       google_info.get('aud') != current_app.config['GOOGLE_CLIENT_ID']:
      return jsonify({'error': 'Token audience mismatch'}), 401

    user = get_or_create_user_from_google(google_info)

    if not user:
      return jsonify({'error': 'Failed to create user'}), 500

    token = generate_token(user.id)

    return jsonify({
      'token': token,
      'user': user.to_dict()
    }), 200

  except Exception as e:
    print(f"Error in google_verify: {e}")
    return jsonify({'error': 'Authentication failed'}), 500

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
  try:
    auth_header = request.headers.get('Authorization')

    if not auth_header:
      return jsonify({'error': 'Authorization header is required'}), 401

    try:
      token = auth_header.split(' ')[1]
    except IndexError:
      return jsonify({'error': 'Invalid authorization header format'}), 401

    user_id = verify_token(token)

    if not user_id:
      return jsonify({'error': 'Invalid or expired token'}), 401

    user = User.query.get(user_id)

    if not user:
      return jsonify({'error': 'User not found'}), 404

    return jsonify(user.to_dict()), 200

  except Exception as e:
    print(f"Error in get_current_user: {e}")
    return jsonify({'error': 'Failed to get user'}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
  try:
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    name = data.get('name')

    if not email:
      return jsonify({'error': 'Email is required'}), 400

    if not validate_email(email):
      return jsonify({'error': 'Invalid email format'}), 400

    if username and not validate_username(username):
      return jsonify({'error': 'Invalid username format'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
      return jsonify({'error': 'User with this email already exists'}), 400

    if username:
      existing_username = User.query.filter_by(username=username).first()
      if existing_username:
        return jsonify({'error': 'Username already taken'}), 400

    user = User(
      email=email,
      username=username,
      name=name
    )
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id)

    return jsonify({
      'token': token,
      'user': user.to_dict()
    }), 201

  except Exception as e:
    print(f"Error in register: {e}")
    db.session.rollback()
    return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/users', methods=['GET'])
def get_users():
  users = User.query.all()
  return jsonify([user.to_dict() for user in users]), 200

@auth_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
  user = User.query.get_or_404(user_id)
  return jsonify(user.to_dict()), 200

@auth_bp.route('/users/me', methods=['PUT'])
def update_current_user():
  try:
    auth_header = request.headers.get('Authorization')

    if not auth_header:
      return jsonify({'error': 'Authorization header is required'}), 401

    try:
      token = auth_header.split(' ')[1]
    except IndexError:
      return jsonify({'error': 'Invalid authorization header format'}), 401

    user_id = verify_token(token)

    if not user_id:
      return jsonify({'error': 'Invalid or expired token'}), 401

    user = User.query.get(user_id)

    if not user:
      return jsonify({'error': 'User not found'}), 404

    data = request.get_json()

    if 'name' in data:
      user.name = data['name']

    if 'email' in data:
      new_email = data['email']
      if not validate_email(new_email):
        return jsonify({'error': 'Invalid email format'}), 400

      existing_user = User.query.filter_by(email=new_email).first()
      if existing_user and existing_user.id != user.id:
        return jsonify({'error': 'Email already taken'}), 400

      user.email = new_email

    user.updated_at = datetime.now(timezone.utc)
    db.session.commit()

    return jsonify(user.to_dict()), 200

  except Exception as e:
    print(f"Error in update_current_user: {e}")
    db.session.rollback()
    return jsonify({'error': 'Failed to update user'}), 500
