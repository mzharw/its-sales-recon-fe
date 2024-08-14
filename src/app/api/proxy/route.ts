import { NextRequest, NextResponse } from 'next/server';

async function handleRequest(req: NextRequest, method: string) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path') || '';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const url = new URL(path, apiUrl).toString();

  console.log(`Attempting to proxy ${method} request to: ${url}`);

  try {
    const headers = new Headers(req.headers);
    headers.delete('host'); // Remove the original host header

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
    console.log(`Response status: ${response.status}`);

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      if (response.status === 204) {
        return new NextResponse(null, { status: 204 });
      } else {
        const text = await response.text();
        return new NextResponse(text, { status: response.status });
      }
    }
  } catch (error: any) {
    console.error(`Error proxying ${method} request:`, error);
    return NextResponse.json({ error: `Error proxying ${method} request: ${error.message}` }, { status: 500 });
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