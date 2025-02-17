import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    if (!API_URL || !API_KEY) {
      throw new Error('API configuration is missing');
    }

    const { message, conversationId } = await req.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        conversation_id: conversationId || "",
        response_mode: "blocking",
        user: "user"
      }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.answer) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json({
      answer: data.answer,
      conversation_id: data.conversation_id
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Error processing request' }, 
      { status: 500 }
    );
  }
}