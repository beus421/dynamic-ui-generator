import { NextRequest, NextResponse } from 'next/server';

// Simplified version to test basic API functionality
export async function GET() {
  try {
    console.log('GET request received');
    return NextResponse.json({ 
      success: true,
      message: 'API endpoint working'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Basic POST handler for testing
export async function POST(request: NextRequest) {
  try {
    console.log('POST request received');
    return NextResponse.json({ 
      success: true,
      message: 'POST endpoint working'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 