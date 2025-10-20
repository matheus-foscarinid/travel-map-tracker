"""
Modelo de visita
"""
from datetime import datetime
from app.extensions import db

class Visit(db.Model):
    __tablename__ = 'visits'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    country_id = db.Column(db.Integer, db.ForeignKey('countries.id'), nullable=False, index=True)
    visit_date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text)
    rating = db.Column(db.Integer)  # 1-5 estrelas
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # index único para evitar visitas duplicadas do mesmo usuário ao mesmo país
    __table_args__ = (db.UniqueConstraint('user_id', 'country_id', name='unique_user_country_visit'),)

    def __repr__(self):
        return f'<Visit {self.user_id} -> {self.country_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'country_id': self.country_id,
            'country_name': self.country.name if self.country else None,
            'visit_date': self.visit_date.isoformat() if self.visit_date else None,
            'notes': self.notes,
            'rating': self.rating,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    @classmethod
    def get_user_visits(cls, user_id):
        return cls.query.filter_by(user_id=user_id).order_by(cls.visit_date.desc()).all()

    @classmethod
    def get_country_visits(cls, country_id):
        return cls.query.filter_by(country_id=country_id).all()
