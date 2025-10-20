from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()

def create_app(config_name=None):
    app = Flask(__name__)

    if config_name:
        app.config.from_object(f'app.config.{config_name}')
    else:
        app.config.from_object('app.config.DevelopmentConfig')

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    from app.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Travel Map Tracker API'}, 200

    return app
