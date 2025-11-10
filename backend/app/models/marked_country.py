from datetime import datetime, timezone
from app.extensions import db

class MarkedCountry(db.Model):
  __tablename__ = 'marked_countries'

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
  country_id = db.Column(db.Integer, db.ForeignKey('countries.id'), nullable=False, index=True)
  status = db.Column(db.String(20), nullable=False)
  visit_start_date = db.Column(db.Date, nullable=True)
  visit_end_date = db.Column(db.Date, nullable=True)
  created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
  updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

  __table_args__ = (
    db.UniqueConstraint('user_id', 'country_id', name='unique_user_country_mark'),
    db.CheckConstraint("status IN ('visited', 'wishlist')", name='check_status')
  )

  user = db.relationship('User', backref='marked_countries')
  country = db.relationship('Country', backref='marked_countries')

  def __repr__(self):
    return f'<MarkedCountry {self.user_id} -> {self.country_id} ({self.status})>'

  def to_dict(self):
    return {
      'id': self.id,
      'user_id': self.user_id,
      'country_id': self.country_id,
      'country_name': self.country.name if self.country else None,
      'country_code': self.country.code if self.country else None,
      'status': self.status,
      'visit_start_date': self.visit_start_date.isoformat() if self.visit_start_date else None,
      'visit_end_date': self.visit_end_date.isoformat() if self.visit_end_date else None,
      'created_at': self.created_at.isoformat(),
      'updated_at': self.updated_at.isoformat()
    }

  @classmethod
  def get_user_marked_countries(cls, user_id, status=None):
    query = cls.query.filter_by(user_id=user_id)
    if status:
      query = query.filter_by(status=status)
    return query.all()

  @classmethod
  def get_by_user_and_country(cls, user_id, country_id):
    return cls.query.filter_by(user_id=user_id, country_id=country_id).first()

