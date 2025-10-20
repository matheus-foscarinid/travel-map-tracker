from app.extensions import db

class Country(db.Model):
    __tablename__ = 'countries'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, index=True)
    code = db.Column(db.String(3), unique=True, nullable=False, index=True)
    continent = db.Column(db.String(50), nullable=False, index=True)
    capital = db.Column(db.String(100))
    population = db.Column(db.BigInteger)
    area = db.Column(db.Float)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    visits = db.relationship('Visit', backref='country', lazy='dynamic')

    def __repr__(self):
        return f'<Country {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'continent': self.continent,
            'capital': self.capital,
            'population': self.population,
            'area': self.area,
            'latitude': self.latitude,
            'longitude': self.longitude
        }

    @classmethod
    def get_by_continent(cls, continent):
        return cls.query.filter_by(continent=continent).all()

    @classmethod
    def search_by_name(cls, name):
        return cls.query.filter(cls.name.ilike(f'%{name}%')).all()
