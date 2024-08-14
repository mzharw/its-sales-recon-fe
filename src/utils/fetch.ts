import { invoke, isTauri } from '@tauri-apps/api/core';
import { fetch as fetchTauri } from '@tauri-apps/plugin-http';

export async function fetchWithProxy(path: string, init?: RequestInit) {
  if (isTauri()) {
    try {
      const method = init?.method || 'GET';
      const body = init?.body ? init.body : undefined;
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
    const url = `api/proxy?path=${encodeURIComponent(path)}`;
    return fetch(url, init);
  }
}