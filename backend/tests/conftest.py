import pytest
from app import create_app
from app.extensions import db
from app.models import User, Country, MarkedCountry
from datetime import datetime, timezone


@pytest.fixture(scope='function')
def app():
    test_app = create_app()
    test_app.config.update({
        'TESTING': True,
        # Usa um banco de dados em memória para testes :)
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'JWT_SECRET_KEY': 'test-secret-key',
        'GOOGLE_CLIENT_ID': 'test-google-client-id',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'SQLALCHEMY_ECHO': False
    })

    with test_app.app_context():
        db.session.expire_on_commit = False
        db.create_all()
        yield test_app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()


@pytest.fixture
def sample_user(app):
    user = User(
        email='test@example.com',
        name='Test User'
    )
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def sample_country(app):
    country = Country.query.filter_by(code='US').first()

    if not country:
        country = Country(
            name='United States',
            code='US',
            continent='North America'
        )
        db.session.add(country)
        db.session.commit()

    return country


@pytest.fixture
def auth_token(sample_user):
    from app.utils.auth import generate_token
    return generate_token(sample_user.id)
