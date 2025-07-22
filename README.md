# fictional-spoon

A TikTok API Client with working status verification.

## Are you working?

To check if the TikTok API client is working, simply run:

```bash
npm start
```

This will:
1. Check if the client is properly configured
2. Verify access token setup
3. Test basic connectivity (if token is provided)
4. Display clear status messages

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the client:
```bash
npm start
```

3. For real API testing, set your TikTok access token:
```bash
export TIKTOK_ACCESS_TOKEN="your_real_token_here"
npm start
```

## Features

- **Status Check**: `isWorking()` method to verify client functionality
- **User Info**: Get TikTok user information
- **User Videos**: Retrieve user's video list
- **Video Search**: Search for videos by query
- **Error Handling**: Graceful handling of missing tokens and API errors

## Build

To compile TypeScript to JavaScript:
```bash
npm run build
```