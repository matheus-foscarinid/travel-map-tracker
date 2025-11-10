import jwt
from datetime import datetime, timedelta, timezone
from app.utils.auth import generate_token, verify_token


class TestGenerateToken:
    def test_generate_token_returns_string(self, app):
        with app.app_context():
            token = generate_token(user_id=1)
            assert isinstance(token, str)
            assert len(token) > 0

    def test_generate_token_contains_user_id(self, app):
        with app.app_context():
            user_id = 123
            token = generate_token(user_id)
            payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            assert payload['user_id'] == user_id

    def test_generate_token_has_expiration(self, app):
        with app.app_context():
            token = generate_token(user_id=1)
            payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            assert 'exp' in payload
            assert 'iat' in payload


class TestVerifyToken:
    def test_verify_valid_token(self, app):
        with app.app_context():
            user_id = 42
            token = generate_token(user_id)
            verified_user_id = verify_token(token)
            assert verified_user_id == user_id

    def test_verify_invalid_token(self, app):
        with app.app_context():
            invalid_token = 'invalid.token.here'
            result = verify_token(invalid_token)
            assert result is None

    def test_verify_expired_token(self, app):
        with app.app_context():
            # Create an expired token
            payload = {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) - timedelta(days=1),
                'iat': datetime.now(timezone.utc) - timedelta(days=2)
            }
            expired_token = jwt.encode(payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')
            result = verify_token(expired_token)
            assert result is None

