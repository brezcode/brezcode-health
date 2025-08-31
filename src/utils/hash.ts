/**
 * Generate SHA256 hash of payload for idempotency (client-side)
 * @param obj - Object to hash
 * @returns Promise<string> - SHA256 hash string
 */
export async function hashPayload(obj: any): Promise<string> {
  // Create stable JSON string by sorting keys
  const stableJson = JSON.stringify(obj, Object.keys(obj).sort());
  
  // Use Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(stableJson);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}