from app.utils.validators import validate_email


class TestValidateEmail:
    def test_valid_email(self):
        assert validate_email('test@example.com') == True
        assert validate_email('user.name@domain.com') == True
        assert validate_email('user+tag@example.co.uk') == True

    def test_invalid_email(self):
        assert validate_email('') == False
        assert validate_email(None) == False
        assert validate_email('invalid') == False
        assert validate_email('invalid@') == False
        assert validate_email('@example.com') == False
        assert validate_email('test@.com') == False

