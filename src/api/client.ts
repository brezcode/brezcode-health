import { hashPayload } from '../utils/hash';

interface PostOptions {
  signal?: AbortSignal;
  idempotencyKey?: string;
  timeout?: number;
}

interface ApiResponse<T = any> {
  ok: boolean;
  session_id?: string;
  cached?: boolean;
  code?: string;
  message?: string;
  data?: T;
}

/**
 * Post JSON data to API with idempotency support
 */
export async function postJSON<T = any>(
  url: string, 
  body: any, 
  options: PostOptions = {}
): Promise<ApiResponse<T>> {
  const {
    signal,
    idempotencyKey,
    timeout = 15000
  } = options;

  // Create timeout controller if no signal provided
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  const finalSignal = signal || controller.signal;
  
  // Generate idempotency key if not provided
  const idempotency = idempotencyKey || await hashPayload(body);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotency
      },
      body: JSON.stringify(body),
      signal: finalSignal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Try to parse error response
      try {
        const errorData = await response.json();
        return errorData;
      } catch {
        return {
          ok: false,
          code: 'SERVER_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          ok: false,
          code: 'TIMEOUT',
          message: 'Request timed out'
        };
      }
      
      return {
        ok: false,
        code: 'NETWORK_ERROR',
        message: error.message
      };
    }
    
    return {
      ok: false,
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred'
    };
  }
}