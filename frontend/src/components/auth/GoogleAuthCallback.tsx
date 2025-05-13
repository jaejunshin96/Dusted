import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import i18n from "../../i18n";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        setError('No authorization code found');
        setIsProcessing(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        console.log('Sending auth code to backend:', code.substring(0, 10) + '...');

        const browserLocale = navigator.language;
        const res = await axios.post(`${backendUrl}/api/social_auth/google/`, {
          auth_code: code,
          locale: browserLocale,
          redirect: true,
          redirect_uri: redirectUri
        });

        console.log('Login successful, storing user data');

        localStorage.setItem("email", res.data.email);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("country", res.data.country || '');
        localStorage.setItem("language", res.data.language || '');
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);

        if (res.data.language) {
          i18n.changeLanguage(res.data.language);
        }

        setIsProcessing(false);
        navigate("/");
      } catch (error: any) {
        console.error("Google Login Failed:", error);

        // Display more detailed error info
        if (error.response) {
          console.error("Error response data:", error.response.data);
          setError(`Error: ${JSON.stringify(error.response.data)}`);
        } else {
          setError('Login failed. Please try again.');
        }

        setIsProcessing(false);
        setTimeout(() => navigate("/login"), 5000);
      }
    };

    handleCallback();
  }, [navigate, redirectUri]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl text-red-500 mb-4">Error: {error}</p>
        <p>Redirecting to login page...</p>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl mb-4">Processing your Google login...</p>
        <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return null;
};

export default GoogleAuthCallback;
