import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import styles from './GoogleLoginButton.module.css';

const GoogleLoginButton = () => {
  const { t } = useTranslation();
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;

  useEffect(() => {
    // Load the Google Identity Services SDK
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  const handleGoogleLogin = () => {
    // @ts-ignore (google is added to window by the script)
    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "profile email openid",
      redirect_uri: redirectUri,
      ux_mode: "redirect",
    });

    // Redirect to Google's OAuth 2.0 server
    client.requestCode();
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className={styles.googleButton}
    >
      <FcGoogle className={styles.googleIcon} />
      {t("Continue with Google")}
    </button>
  );
};

export default GoogleLoginButton;
