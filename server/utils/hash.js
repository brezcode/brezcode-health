import crypto from 'crypto';

/**
 * Generate SHA256 hash of payload for idempotency
 * @param {object} obj - Object to hash
 * @returns {string} - SHA256 hash string
 */
export function hashPayload(obj) {
  // Create stable JSON string by sorting keys
  const stableJson = JSON.stringify(obj, Object.keys(obj).sort());
  return crypto.createHash('sha256').update(stableJson, 'utf8').digest('hex');
}

/**
 * Generate user key for anonymous/authenticated users
 * @param {object} req - Express request object
 * @returns {string} - User identifier
 */
export function getUserKey(req) {
  return req.user?.id || req.sessionID || 'anonymous';
}