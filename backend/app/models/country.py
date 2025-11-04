from app.extensions import db

class Country(db.Model):
  __tablename__ = 'countries'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(100), unique=True, nullable=False, index=True)
  code = db.Column(db.String(3), unique=True, nullable=False, index=True)
  flag = db.Column(db.String(10), nullable=True)
  continent = db.Column(db.String(50), nullable=False, index=True)

  def __repr__(self):
    return f'<Country {self.name}>'

  def to_dict(self):
    return {
      'id': self.id,
      'name': self.name,
      'code': self.code,
      'flag': self.flag,
      'continent': self.continent
    }

  @classmethod
  def get_by_continent(cls, continent):
    return cls.query.filter_by(continent=continent).all()

  @classmethod
  def search_by_name(cls, name):
    return cls.query.filter(cls.name.ilike(f'%{name}%')).all()

  @classmethod
  def get_by_code(cls, code):
    return cls.query.filter_by(code=code).first()
