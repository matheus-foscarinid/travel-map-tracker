class TestRegister:
    def test_register_success(self, client):
        response = client.post('/api/auth/register', json={
            'email': 'newuser@example.com',
            'name': 'New User'
        })
        assert response.status_code == 201
        data = response.get_json()
        assert 'token' in data
        assert 'user' in data
        assert data['user']['email'] == 'newuser@example.com'

    def test_register_missing_email(self, client):
        response = client.post('/api/auth/register', json={
            'name': 'Test User'
        })
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data

    def test_register_invalid_email(self, client):
        response = client.post('/api/auth/register', json={
            'email': 'invalid-email',
            'name': 'Test User'
        })
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert 'email' in data['error'].lower()

    def test_register_duplicate_email(self, client, sample_user):
        response = client.post('/api/auth/register', json={
            'email': 'test@example.com',  # same as sample_user
            'name': 'Another User'
        })
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data


class TestGetCurrentUser:
    def test_get_current_user_success(self, client, auth_token):
        response = client.get('/api/auth/me', headers={
            'Authorization': f'Bearer {auth_token}'
        })
        assert response.status_code == 200
        data = response.get_json()
        assert 'email' in data
        assert data['email'] == 'test@example.com'

    def test_get_current_user_no_token(self, client):
        response = client.get('/api/auth/me')
        assert response.status_code == 401
        data = response.get_json()
        assert 'error' in data

    def test_get_current_user_invalid_token(self, client):
        response = client.get('/api/auth/me', headers={
            'Authorization': 'Bearer invalid.token.here'
        })
        assert response.status_code == 401
        data = response.get_json()
        assert 'error' in data


class TestGetUsers:
    def test_get_users(self, client, sample_user):
        response = client.get('/api/auth/users')
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_get_user_by_id(self, client, sample_user):
        response = client.get(f'/api/auth/users/{sample_user.id}')
        assert response.status_code == 200
        data = response.get_json()
        assert data['id'] == sample_user.id
        assert data['email'] == sample_user.email


class TestUpdateCurrentUser:
    def test_update_user_name(self, client, auth_token):
        response = client.put('/api/auth/users/me',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={'name': 'Updated Name'}
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data['name'] == 'Updated Name'

    def test_update_user_email(self, client, auth_token):
        response = client.put('/api/auth/users/me',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={'email': 'newemail@example.com'}
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data['email'] == 'newemail@example.com'

    def test_update_user_invalid_email(self, client, auth_token):
        response = client.put('/api/auth/users/me',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={'email': 'invalid-email'}
        )
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data

