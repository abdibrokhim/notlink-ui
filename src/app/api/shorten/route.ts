import { NextResponse } from 'next/server';
import { ShortURLResponse } from '@/components/types';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    const longURL = requestBody.long_url;
    const encrypted = requestBody.encrypted;
    const transactionHash = requestBody.transaction_hash;

    if (!longURL) {
      return NextResponse.json(
        { error: 'Missing required parameter: long_url' },
        { status: 400 }
      );
    };

    // Call the backend API to shorten the URL
    const response = await fetch(`${process.env.NOTLINK_BACKEND_HOST}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        original_url: longURL,
        encrypt: encrypted,
        transaction_hash: transactionHash
      }),
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to shorten URL: ${res.statusText}`);
      }
      return res.json();
    });

    const data: ShortURLResponse = response;

    console.log('Shortened URL Data:', data);
    return NextResponse.json(data);
    
    // for testing purposes, return a sample response
    // const response = await import ('../sample-result.json').then(async (module) => {
    //     return module.default;
    // });
    
    // delay the response by 1 second
    // await new Promise((resolve) => setTimeout(resolve, 2000));

  } catch (error: any) {
    console.error('Error in /api/shorten:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}