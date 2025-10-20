"""
Modelo de estatísticas
"""
from app.extensions import db

class Statistics(db.Model):
    __tablename__ = 'statistics'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True, index=True)
    total_countries_visited = db.Column(db.Integer, default=0)
    total_continents_visited = db.Column(db.Integer, default=0)
    countries_by_continent = db.Column(db.JSON)  # {"Europe": 5, "Asia": 3, ...}
    average_rating = db.Column(db.Float)
    total_visits = db.Column(db.Integer, default=0)
    last_visit_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self):
        return f'<Statistics for user {self.user_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_countries_visited': self.total_countries_visited,
            'total_continents_visited': self.total_continents_visited,
            'countries_by_continent': self.countries_by_continent or {},
            'average_rating': self.average_rating,
            'total_visits': self.total_visits,
            'last_visit_date': self.last_visit_date.isoformat() if self.last_visit_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    @classmethod
    def get_user_statistics(cls, user_id):
        return cls.query.filter_by(user_id=user_id).first()

    @classmethod
    def create_or_update(cls, user_id, **kwargs):
        stats = cls.query.filter_by(user_id=user_id).first()
        if not stats:
            stats = cls(user_id=user_id)
            db.session.add(stats)

        for key, value in kwargs.items():
            if hasattr(stats, key):
                setattr(stats, key, value)

        db.session.commit()
        return stats
