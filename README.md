# AI Doctor Symptom Checker

An AI-powered medical consultation application that can understand and respond to symptoms in both Thai and English languages.

## Features

- Real-time chat interface with AI doctor
- Bilingual support (Thai and English)
- Persistent conversation history
- Auto-scrolling chat interface
- Beautiful and responsive UI with shadcn/ui components
- Error handling with clear user feedback
- Mobile-friendly design

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (version 16.x or higher)
- npm (usually comes with Node.js)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
NEXT_PUBLIC_API_URL=https://ever-ai-api.his-nonprod.everapp.io/v1/chat-messages
NEXT_PUBLIC_API_KEY=app-V8KBVCg1knGAzCfFecPibRZY
```

4. Start the development server:
```bash
npm run dev
```

The application will start running at `http://localhost:3000`

## Key Features

### Chat Interface
- Real-time messaging with AI doctor
- Automatic scrolling to latest messages
- Loading states with visual feedback
- Error handling with user-friendly messages
- Support for new chat sessions
- Persistent conversation history

### Bilingual Support
- Seamlessly handles both Thai and English input
- Natural language processing for medical terminology
- Culturally appropriate responses

## API Usage

The application provides a chat API endpoint at `/api/chat`. You can interact with it using HTTP requests.

### Endpoint Details

- **URL**: `/api/chat`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Format

```json
{
  "message": "Your message here",
  "conversationId": "optional-conversation-id"
}
```

### Response Format

```json
{
  "answer": "AI doctor's response message",
  "conversation_id": "unique-conversation-id"
}
```

### Testing with curl

Start a new conversation:
```bash
# English
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have a headache and fever"
  }'

# Thai
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ฉันมีไข้และปวดหัว"
  }'
```

Continue a conversation:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How long will these symptoms last?",
    "conversationId": "paste-conversation-id-here"
  }'
```

## Development

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm start` - Runs the built application in production mode
- `npm run lint` - Runs the linter to check for code style issues

## Technology Stack

- Next.js 13 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React Icons
- Edge Runtime for API routes

## Project Structure

```
├── app/
│   ├── api/           # API routes
│   │   └── chat/     # Chat API endpoint
│   ├── globals.css    # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/
│   ├── ui/           # UI components from shadcn/ui
│   └── ChatInterface.tsx  # Main chat component
├── lib/              # Utility functions
└── public/           # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details