import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    debug = os.environ.get('FLASK_ENV') == 'development'
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '127.0.0.1')

    print(f"Starting Travel Map Tracker API on {host}:{port}")
    print(f"Debug mode: {debug}")

    app.run(host=host, port=port, debug=debug)
