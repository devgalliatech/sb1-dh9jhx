const axios = require('axios');

const TIKTOK_CLIENT_KEY = 'awkihgtxhs0u9g22';
const TIKTOK_CLIENT_SECRET = '5SQd4DlguR7SsPIAuIohftAaydlrVzmf';
const REDIRECT_URI = 'https://api.galliatech.com/api/tiktok/callback';

const tiktokConfig = {
  clientKey: TIKTOK_CLIENT_KEY,
  clientSecret: TIKTOK_CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
  
  getAuthUrl: () => {
    const scope = 'user.info.basic,video.list,video.upload';
    return `https://www.tiktok.com/auth/authorize?client_key=${TIKTOK_CLIENT_KEY}&response_type=code&scope=${scope}&redirect_uri=${REDIRECT_URI}`;
  },

  getAccessToken: async (code) => {
    try {
      const response = await axios.post('https://open-api.tiktok.com/oauth/access_token/', {
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur TikTok getAccessToken:', error);
      throw error;
    }
  }
};

module.exports = tiktokConfig;