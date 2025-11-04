from flask import Blueprint, request, jsonify
from app.models import Country
from app.extensions import db

countries_bp = Blueprint('countries', __name__)

@countries_bp.route('', methods=['GET'])
def get_countries():
  try:
    continent = request.args.get('continent')
    search = request.args.get('search')

    query = Country.query

    if continent:
      query = query.filter_by(continent=continent)

    if search:
      query = query.filter(Country.name.ilike(f'%{search}%'))

    countries = query.all()
    return jsonify([country.to_dict() for country in countries]), 200
  except Exception as e:
    print(f"Error getting countries: {e}")
    return jsonify({'error': 'Failed to get countries'}), 500

@countries_bp.route('/<int:country_id>', methods=['GET'])
def get_country(country_id):
  try:
    country = Country.query.get_or_404(country_id)
    return jsonify(country.to_dict()), 200
  except Exception as e:
    print(f"Error getting country: {e}")
    return jsonify({'error': 'Country not found'}), 404

