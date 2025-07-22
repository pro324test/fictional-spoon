import axios from 'axios';

/**
 * TikTok API Client
 * 
 * This is a basic implementation to interact with the TikTok API.
 * You'll need to register your app and get credentials at: https://developers.tiktok.com/
 */
class TikTokAPI {
  private accessToken: string;
  private apiBaseUrl = 'https://open-api.tiktok.com/';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Get user info
   */
  async getUserInfo(fields: string[] = ['open_id', 'union_id', 'avatar_url', 'display_name']) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}user/info/`, {
        params: {
          fields: fields.join(','),
          access_token: this.accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  /**
   * Get user videos
   */
  async getUserVideos(openId: string, cursor: number = 0, maxCount: number = 10) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}video/list/`, {
        params: {
          open_id: openId,
          cursor,
          max_count: maxCount,
          access_token: this.accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user videos:', error);
      throw error;
    }
  }

  /**
   * Search videos
   */
  async searchVideos(query: string, cursor: number = 0, maxCount: number = 10) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}video/search/`, {
        params: {
          query,
          cursor,
          max_count: maxCount,
          access_token: this.accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  }
}

// Example usage
const main = async () => {
  // Replace with your actual access token from TikTok developer portal
  const accessToken = 'YOUR_TIKTOK_ACCESS_TOKEN';
  const tiktokClient = new TikTokAPI(accessToken);
  
  try {
    // Get user information
    const userInfo = await tiktokClient.getUserInfo();
    console.log('User info:', userInfo);
    
    // Get user videos (requires the user's open_id)
    if (userInfo.data.open_id) {
      const videos = await tiktokClient.getUserVideos(userInfo.data.open_id);
      console.log('User videos:', videos);
    }
    
    // Search for videos
    const searchResults = await tiktokClient.searchVideos('coding');
    console.log('Search results:', searchResults);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();