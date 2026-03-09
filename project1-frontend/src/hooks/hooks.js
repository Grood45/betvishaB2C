import { useEffect } from 'react';

const useFavicon = () => {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/setting/get-setting/4u4949u4?site_auth_key=BspAuthKey123`);
        const data = await response.json();
        const faviconUrl = data?.data?.site_fav_icon;
        if (faviconUrl) {
          const favicon = document.getElementById('favicon');
          if (favicon) {
            favicon.href = faviconUrl;
          } else {
            const newFavicon = document.createElement('link');
            newFavicon.id = 'favicon';
            newFavicon.rel = 'icon';
            newFavicon.href = faviconUrl;
            document.head.appendChild(newFavicon);
          }
        }
      } catch (error) {
        console.error('Error fetching the favicon:', error);
      }
    };

    updateFavicon();
  }, []);
};

export default useFavicon;
