# AI Chat Assistant Configuration

The AI Chat Assistant uses Google Gemini API to provide blood donation related assistance in Bengali.

## Setup Instructions

1. **Get Google Gemini API Key:**

   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

2. **Configure Environment:**

   - Open `src/environments/environment.ts` (for development)
   - Replace `YOUR_GOOGLE_GEMINI_API_KEY` with your actual API key
   - For production, update `src/environments/environment.prod.ts`

3. **Environment Configuration:**

   ```typescript
   export const environment = {
     production: false,
     apiUrl: "http://localhost:8000/api/v1",
     geminiApiKey: "AIzaSy...", // Your actual API key here
   };
   ```

## Features

- **Blood Donation Focus:** Only answers blood donation related queries
- **Bengali Language:** All responses in Bengali language
- **Smart Filtering:** Politely redirects non-blood-donation queries
- **Bangladesh Context:** Provides information relevant to Bangladesh
- **Mobile Responsive:** Works seamlessly on all devices

## Usage

The AI Assistant will appear as a floating button on the bottom-right of the screen. Users can:

1. Click the AI assistant button to open chat
2. Type questions about blood donation
3. Get instant responses in Bengali
4. Use quick suggestion buttons for common queries

## System Prompt

The AI is configured with a comprehensive system prompt that:

- Limits responses to blood donation topics only
- Ensures all responses are in Bengali
- Provides helpful and polite assistance
- Includes Bangladesh-specific information
- Encourages users to consult doctors for medical advice

## Security Note

⚠️ **Important:** Never commit your actual API key to version control. Always use environment variables for production deployments.

## Troubleshooting

- If AI doesn't respond, check if the API key is correctly configured
- Ensure internet connection for API calls
- Check browser console for any errors
- Verify that the API key has proper permissions
