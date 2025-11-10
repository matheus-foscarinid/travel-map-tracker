
class TestMarkCountry:
    def test_mark_country_as_visited(self, client, auth_token, sample_country):
        response = client.post('/api/marked-countries/mark',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={
                'country_id': sample_country.id,
                'status': 'visited'
            }
        )
        assert response.status_code == 201
        data = response.get_json()
        assert 'marked_country' in data
        assert data['marked_country']['status'] == 'visited'

    def test_mark_country_as_wishlist(self, client, auth_token, sample_country):
        response = client.post('/api/marked-countries/mark',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={
                'country_id': sample_country.id,
                'status': 'wishlist'
            }
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data['marked_country']['status'] == 'wishlist'

    def test_mark_country_with_dates(self, client, auth_token, sample_country):
        response = client.post('/api/marked-countries/mark',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={
                'country_id': sample_country.id,
                'status': 'visited',
                'visit_start_date': '2024-01-01',
                'visit_end_date': '2024-01-10'
            }
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data['marked_country']['visit_start_date'] == '2024-01-01'

    def test_mark_country_missing_country_id(self, client, auth_token):
        response = client.post('/api/marked-countries/mark',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={'status': 'visited'}
        )
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data

    def test_mark_country_invalid_status(self, client, auth_token, sample_country):
        response = client.post('/api/marked-countries/mark',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={
                'country_id': sample_country.id,
                'status': 'invalid_status'
            }
        )
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data

    def test_mark_country_no_auth(self, client, sample_country):
        response = client.post('/api/marked-countries/mark',
            json={
                'country_id': sample_country.id,
                'status': 'visited'
            }
        )
        assert response.status_code == 401


class TestUnmarkCountry:
    def test_unmark_country(self, client, auth_token, sample_country, app):
        client.post('/api/marked-countries/mark',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={
                'country_id': sample_country.id,
                'status': 'visited'
            }
        )

        response = client.post('/api/marked-countries/unmark',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={'country_id': sample_country.id}
        )
        assert response.status_code == 200
        data = response.get_json()
        assert 'message' in data

    def test_unmark_not_marked_country(self, client, auth_token, sample_country):
        response = client.post('/api/marked-countries/unmark',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={'country_id': sample_country.id}
        )
        assert response.status_code == 404


class TestGetMarkedCountries:
    def test_get_my_marked_countries(self, client, auth_token, sample_country):
        client.post('/api/marked-countries/mark',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={
                'country_id': sample_country.id,
                'status': 'visited'
            }
        )

        response = client.get('/api/marked-countries/my',
            headers={'Authorization': f'Bearer {auth_token}'}
        )
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_get_my_visited_countries(self, client, auth_token, sample_country):
        client.post('/api/marked-countries/mark',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={
                'country_id': sample_country.id,
                'status': 'visited'
            }
        )

        response = client.get('/api/marked-countries/my/visited',
            headers={'Authorization': f'Bearer {auth_token}'}
        )
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        if len(data) > 0:
            assert data[0]['status'] == 'visited'

    def test_get_my_wishlist_countries(self, client, auth_token, sample_country):
        response = client.get('/api/marked-countries/my/wishlist',
            headers={'Authorization': f'Bearer {auth_token}'}
        )
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

