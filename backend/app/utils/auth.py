from flask import request, jsonify, current_app
from functools import wraps
import jwt
from app.models import User

def verify_token(token):
  try:
    payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
    return payload.get('user_id'), None
  except jwt.ExpiredSignatureError:
    return None, 'expired'
  except jwt.InvalidTokenError:
    return None, 'invalid'

def generate_token(user_id):
  from datetime import datetime, timedelta, timezone
  payload = {
    'user_id': user_id,
    'exp': datetime.now(timezone.utc) + timedelta(days=7),
    'iat': datetime.now(timezone.utc)
  }
  token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
  if isinstance(token, bytes):
    return token.decode('utf-8')
  return token

def get_user_from_request():
  auth_header = request.headers.get('Authorization')

  if not auth_header:
    return None, jsonify({'error': 'Authorization header is required'}), 401

  try:
    token = auth_header.split(' ')[1]
  except IndexError:
    return None, jsonify({'error': 'Invalid authorization header format'}), 401

  user_id, token_error = verify_token(token)
  if not user_id:
    if token_error == 'expired':
      return None, jsonify({'error': 'Token has expired'}), 401
    return None, jsonify({'error': 'Invalid token'}), 401

  user = User.query.get(user_id)
  if not user:
    return None, jsonify({'error': 'User not found'}), 404

  return user, None, None

def require_auth(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
    user, error_response, status_code = get_user_from_request()
    if error_response:
      return error_response, status_code
    return f(user, *args, **kwargs)
  return decorated_function

