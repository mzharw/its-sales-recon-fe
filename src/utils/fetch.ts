import { invoke, isTauri } from '@tauri-apps/api/core';

export async function fetchWithProxy(path: string, init?: RequestInit) {
  if (await isTauri()) {
    try {
      const method = init?.method || 'GET';
      const body = init?.body ? JSON.stringify(init.body) : undefined;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

      const tauriResponse = await invoke('proxy_request', {
        apiUrl,
        method,
        path,
        body,
      });

      // Parse the response
      const parsedResponse = JSON.parse(tauriResponse as string);

      // Create a new Response object
      return new Response(JSON.stringify(parsedResponse), { status: 200 });
    } catch (error: any) {
      console.error('Error with Tauri request:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  } else {
    // For Next.js environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = `${apiUrl}/api/proxy?path=${encodeURIComponent(path)}`;
    return fetch(url, init);
  }
}