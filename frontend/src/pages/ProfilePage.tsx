import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import authAxios from '../utils/authentications/authFetch';
import styles from './ProfilePage.module.css';
import { UserProfile } from '../types/types';

const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backendUrl = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL_PROD;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authAxios(`${backendUrl}/api/auth/profile/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setProfile(response.data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError(t('Failed to load profile'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [backendUrl, t]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(
      i18n.language === 'ko' ? 'ko-KR' : 'en-US',
      options
    );
  };

  if (loading) {
    return <div className={styles.container}>{t('Loading...')}</div>;
  }

  if (error) {
    return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h1 className={styles.heading}>{t('Profile')}</h1>

        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {profile?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2 className={styles.username}>{profile?.username}</h2>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <span className={styles.label}>{t('Email')}</span>
            <span className={styles.value}>{profile?.email}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>{t('Reviews')}</span>
            <span className={styles.value}>{profile?.review_count || 0}</span>
          </div>


          <div className={styles.infoItem}>
            <span className={styles.label}>{t('Language')}</span>
            <span className={styles.value}>
              {profile?.language === 'ko' ? t('Korean') : t('English')}
            </span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>{t('Country')}</span>
            <span className={styles.value}>
              {profile?.country}
            </span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>{t('Joined')}</span>
            <span className={styles.value}>{profile && formatDate(profile.date_joined)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
