from flask import Blueprint, request, jsonify
from app.models import MarkedCountry, Country
from app.extensions import db
from app.utils.auth import get_user_from_request
from datetime import datetime, timezone

marked_countries_bp = Blueprint('marked_countries', __name__)

@marked_countries_bp.route('/mark', methods=['POST'])
def mark_country():
  try:
    user, error_response, status_code = get_user_from_request()
    if error_response:
      return error_response, status_code

    data = request.get_json()
    country_id = data.get('country_id')
    status = data.get('status')

    if not country_id:
      return jsonify({'error': 'country_id is required'}), 400

    if status not in ['visited', 'wishlist']:
      return jsonify({'error': 'status must be "visited" or "wishlist"'}), 400

    country = Country.query.get(country_id)
    if not country:
      return jsonify({'error': 'Country not found'}), 404

    existing_mark = MarkedCountry.get_by_user_and_country(user.id, country_id)

    if existing_mark:
      if existing_mark.status == status:
        return jsonify({'message': 'Country already marked with this status', 'marked_country': existing_mark.to_dict()}), 200

      existing_mark.status = status
      existing_mark.updated_at = datetime.now(timezone.utc)
      db.session.commit()
      return jsonify({'message': 'Country status updated', 'marked_country': existing_mark.to_dict()}), 200

    marked_country = MarkedCountry(
      user_id=user.id,
      country_id=country_id,
      status=status
    )
    db.session.add(marked_country)
    db.session.commit()

    return jsonify({'message': 'Country marked successfully', 'marked_country': marked_country.to_dict()}), 201

  except Exception as e:
    print(f"Error marking country: {e}")
    db.session.rollback()
    return jsonify({'error': 'Failed to mark country'}), 500

@marked_countries_bp.route('/unmark', methods=['POST'])
def unmark_country():
  try:
    user, error_response, status_code = get_user_from_request()
    if error_response:
      return error_response, status_code

    data = request.get_json()
    country_id = data.get('country_id')
    status = data.get('status')

    if not country_id:
      return jsonify({'error': 'country_id is required'}), 400

    if status and status not in ['visited', 'wishlist']:
      return jsonify({'error': 'status must be "visited" or "wishlist"'}), 400

    existing_mark = MarkedCountry.get_by_user_and_country(user.id, country_id)

    if not existing_mark:
      return jsonify({'error': 'Country is not marked'}), 404

    if status and existing_mark.status != status:
      return jsonify({'error': f'Country is not marked as {status}'}), 400

    db.session.delete(existing_mark)
    db.session.commit()

    return jsonify({'message': 'Country unmarked successfully'}), 200

  except Exception as e:
    print(f"Error unmarking country: {e}")
    db.session.rollback()
    return jsonify({'error': 'Failed to unmark country'}), 500

@marked_countries_bp.route('/my', methods=['GET'])
def get_my_marked_countries():
  try:
    user, error_response, status_code = get_user_from_request()
    if error_response:
      return error_response, status_code

    status = request.args.get('status')

    marked_countries = MarkedCountry.get_user_marked_countries(user.id, status)

    return jsonify([mc.to_dict() for mc in marked_countries]), 200

  except Exception as e:
    print(f"Error getting marked countries: {e}")
    return jsonify({'error': 'Failed to get marked countries'}), 500

@marked_countries_bp.route('/my/visited', methods=['GET'])
def get_my_visited_countries():
  try:
    user, error_response, status_code = get_user_from_request()
    if error_response:
      return error_response, status_code

    marked_countries = MarkedCountry.get_user_marked_countries(user.id, 'visited')

    return jsonify([mc.to_dict() for mc in marked_countries]), 200

  except Exception as e:
    print(f"Error getting visited countries: {e}")
    return jsonify({'error': 'Failed to get visited countries'}), 500

@marked_countries_bp.route('/my/wishlist', methods=['GET'])
def get_my_wishlist_countries():
  try:
    user, error_response, status_code = get_user_from_request()
    if error_response:
      return error_response, status_code

    marked_countries = MarkedCountry.get_user_marked_countries(user.id, 'wishlist')

    return jsonify([mc.to_dict() for mc in marked_countries]), 200

  except Exception as e:
    print(f"Error getting wishlist countries: {e}")
    return jsonify({'error': 'Failed to get wishlist countries'}), 500

