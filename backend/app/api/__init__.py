"""
API Blueprints
"""
from flask import Blueprint

api_bp = Blueprint('api', __name__)

from .auth import auth_bp
from .countries import countries_bp
from .visits import visits_bp
from .statistics import statistics_bp

api_bp.register_blueprint(auth_bp, url_prefix='/auth')
api_bp.register_blueprint(countries_bp, url_prefix='/countries')
api_bp.register_blueprint(visits_bp, url_prefix='/visits')
api_bp.register_blueprint(statistics_bp, url_prefix='/statistics')
