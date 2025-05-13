import requests
import os
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

class Google:
    """Google class to fetch the user info and return it"""

    @staticmethod
    def validate(auth_token):
        """
        Validate method for ID token flow (no longer used in redirect flow)
        """
        try:
            idinfo = id_token.verify_oauth2_token(
                auth_token, google_requests.Request()
            )
            if 'accounts.google.com' in idinfo['iss']:
                return idinfo
        except:
            return "The token is either invalid or has expired"

    @staticmethod
    def exchange_auth_code(auth_code, redirect_uri):
        """
        Exchange authorization code for tokens and user info
        """
        try:
            # Exchange auth code for access token and ID token
            token_endpoint = "https://oauth2.googleapis.com/token"
            data = {
                'code': auth_code,
                'client_id': os.environ.get('VITE_GOOGLE_CLIENT_ID'),
                'client_secret': os.environ.get('GOOGLE_CLIENT_SECRET'),
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            }

            response = requests.post(token_endpoint, data=data)
            token_data = response.json()

            if 'error' in token_data:
                return f"Error exchanging code: {token_data['error']}"

            # Get user info using the ID token
            id_info = id_token.verify_oauth2_token(
                token_data['id_token'],
                google_requests.Request(),
                os.environ.get('VITE_GOOGLE_CLIENT_ID')
            )

            return id_info

        except Exception as e:
            return f"Error during code exchange: {str(e)}"
