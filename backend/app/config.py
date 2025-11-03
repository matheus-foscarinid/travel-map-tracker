import os
from dotenv import load_dotenv

load_dotenv()

class Config:
  SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  JSON_SORT_KEYS = False
  GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
  GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
  JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or SECRET_KEY

class DevelopmentConfig(Config):
  DEBUG = True
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///travel_map_tracker.db'
  CORS_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

class ProductionConfig(Config):
  DEBUG = False
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
  CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '').split(',')

config = {
  'development': DevelopmentConfig,
  'production': ProductionConfig,
  'default': DevelopmentConfig
}
