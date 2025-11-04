"""
API Blueprints
"""
from flask import Blueprint

api_bp = Blueprint('api', __name__)

from .routes import auth_bp
from .countries import countries_bp
from .marked_countries import marked_countries_bp

api_bp.register_blueprint(auth_bp, url_prefix='/auth')
api_bp.register_blueprint(countries_bp, url_prefix='/countries')
api_bp.register_blueprint(marked_countries_bp, url_prefix='/marked-countries')
