from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timezone
import requests
from app.models import User
from app.extensions import db
from app.utils.validators import validate_email
from app.utils.auth import generate_token, verify_token, get_user_from_request

auth_bp = Blueprint('auth', __name__)

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
    google_id=google_id
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
    user, error_response, status_code = get_user_from_request()
    if error_response:
      return error_response, status_code

    return jsonify(user.to_dict()), 200

  except Exception as e:
    print(f"Error in get_current_user: {e}")
    return jsonify({'error': 'Failed to get user'}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
  try:
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')

    if not email:
      return jsonify({'error': 'Email is required'}), 400

    if not validate_email(email):
      return jsonify({'error': 'Invalid email format'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
      return jsonify({'error': 'User with this email already exists'}), 400

    user = User(
      email=email,
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
    user, error_response, status_code = get_user_from_request()
    if error_response:
      return error_response, status_code

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
