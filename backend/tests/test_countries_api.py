class TestGetCountries:
    def test_get_all_countries(self, client):
        response = client.get('/api/countries')
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_get_countries_by_continent(self, client):
        response = client.get('/api/countries?continent=North America')
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        if len(data) > 0:
            assert data[0]['continent'] == 'North America'

    def test_get_countries_by_search(self, client):
        response = client.get('/api/countries?search=United')
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        if len(data) > 0:
            assert 'United' in data[0]['name']


class TestGetCountry:
    def test_get_country_by_id(self, client, sample_country):
        response = client.get(f'/api/countries/{sample_country.id}')
        assert response.status_code == 200
        data = response.get_json()
        assert data['id'] == sample_country.id
        assert data['name'] == sample_country.name

    def test_get_nonexistent_country(self, client):
        response = client.get('/api/countries/123456')
        assert response.status_code == 404

