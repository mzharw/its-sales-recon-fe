import { NextRequest, NextResponse } from 'next/server';

async function handleRequest(req: NextRequest, method: string) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  try {
    const headers = new Headers(req.headers);
    headers.set('host', new URL(process.env.NEXT_PUBLIC_API_URL!).host);

    if (method === 'PATCH' || method === 'POST') {
      headers.set('Content-Type', 'application/json');
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (method === 'PATCH' || method === 'POST') {
      requestOptions.body = await req.text();
    }

    const response = await fetch(url, requestOptions);

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      // For non-JSON responses (like 204 No Content)
      if (response.status === 204) {
        return new NextResponse(null, { status: 204 });
      } else {
        const text = await response.text();
        return new NextResponse(text, { status: response.status });
      }
    }
  } catch (error) {
    console.error(`Error proxying ${method} request:`, error);
    return NextResponse.json({ error: `Error proxying ${method} request` }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleRequest(req, 'GET');
}

export async function POST(req: NextRequest) {
  return handleRequest(req, 'POST');
}

export async function PATCH(req: NextRequest) {
  return handleRequest(req, 'PATCH');
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req, 'DELETE');
}