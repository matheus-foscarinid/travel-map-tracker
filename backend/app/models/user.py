from datetime import datetime, timezone
from app.extensions import db

class User(db.Model):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=True, index=True)
  email = db.Column(db.String(120), unique=True, nullable=False, index=True)
  name = db.Column(db.String(120), nullable=True)
  google_id = db.Column(db.String(255), unique=True, nullable=True, index=True)
  created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
  updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

  def __repr__(self):
    return f'<User {self.email}>'

  def to_dict(self):
    return {
      'id': self.id,
      'username': self.username,
      'email': self.email,
      'name': self.name,
      'created_at': self.created_at.isoformat(),
      'updated_at': self.updated_at.isoformat()
    }
