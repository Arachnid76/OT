import { NextResponse } from 'next/server';

// Store credentials in environment variables or use a more secure method
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'akuaadepa';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'djormor2022';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // In a production app, you'd want to use proper session management
      // For now, we'll return a success response
      return NextResponse.json({ 
        success: true, 
        message: 'Authentication successful' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Authentication failed' 
    }, { status: 500 });
  }
} 