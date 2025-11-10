import re

def validate_email(email):
  if not email:
    return False
  pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  return bool(re.match(pattern, email))

