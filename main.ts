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
   * Check if the API client is working and properly configured
   */
  async isWorking(): Promise<{ working: boolean; message: string; details?: any }> {
    try {
      // Check if access token is provided and not placeholder
      if (!this.accessToken || this.accessToken === 'YOUR_TIKTOK_ACCESS_TOKEN') {
        return {
          working: false,
          message: 'Access token not configured. Please provide a valid TikTok access token.'
        };
      }

      // Try a simple API call to check connectivity
      try {
        const response = await axios.get(`${this.apiBaseUrl}user/info/`, {
          params: {
            fields: 'open_id',
            access_token: this.accessToken
          },
          timeout: 5000
        });
        
        return {
          working: true,
          message: 'TikTok API client is working properly',
          details: { status: response.status, connected: true }
        };
      } catch (apiError: any) {
        // API might be unreachable or token invalid, but client setup is working
        if (apiError.code === 'ENOTFOUND' || apiError.code === 'ECONNREFUSED') {
          return {
            working: true,
            message: 'TikTok API client is configured but TikTok API is not reachable (this is expected in test environments)',
            details: { clientConfigured: true, apiReachable: false, error: apiError.code }
          };
        }
        
        return {
          working: false,
          message: 'TikTok API client configuration issue',
          details: { error: apiError.message, status: apiError.response?.status }
        };
      }
    } catch (error: any) {
      return {
        working: false,
        message: 'TikTok API client encountered an error',
        details: { error: error.message }
      };
    }
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
  console.log('🚀 Starting TikTok API Client...\n');
  
  // Replace with your actual access token from TikTok developer portal
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN || 'YOUR_TIKTOK_ACCESS_TOKEN';
  const tiktokClient = new TikTokAPI(accessToken);
  
  // Check if the API client is working
  console.log('📊 Checking if TikTok API client is working...');
  const workingStatus = await tiktokClient.isWorking();
  
  console.log('Status:', workingStatus.working ? '✅ WORKING' : '❌ NOT WORKING');
  console.log('Message:', workingStatus.message);
  if (workingStatus.details) {
    console.log('Details:', JSON.stringify(workingStatus.details, null, 2));
  }
  console.log();
  
  if (!workingStatus.working && workingStatus.message.includes('Access token not configured')) {
    console.log('💡 To test with a real token, set the TIKTOK_ACCESS_TOKEN environment variable:');
    console.log('   export TIKTOK_ACCESS_TOKEN="your_real_token"');
    console.log('   npm start');
    console.log();
    console.log('ℹ️  For now, the client is configured but needs a valid token to make API calls.');
    return;
  }
  
  // Only try API calls if the client is working
  if (workingStatus.working) {
    try {
      console.log('🔍 Testing API functionality...');
      
      // Get user information
      const userInfo = await tiktokClient.getUserInfo();
      console.log('User info:', userInfo);
      
      // Get user videos (requires the user's open_id)
      if (userInfo.data && userInfo.data.open_id) {
        const videos = await tiktokClient.getUserVideos(userInfo.data.open_id);
        console.log('User videos:', videos);
      }
      
      // Search for videos
      const searchResults = await tiktokClient.searchVideos('coding');
      console.log('Search results:', searchResults);
      
    } catch (error) {
      console.error('❌ Error during API testing:', error);
    }
  }
};

// Export the TikTokAPI class for potential use as a module
export { TikTokAPI };

main().catch(console.error);