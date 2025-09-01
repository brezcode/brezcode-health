import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Root health check for Railway
router.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'BrezCode Health',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Standard health check
router.get('/health', (req, res) => {
  try {
    const packageJson = JSON.parse(readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    
    res.json({
      ok: true,
      uptime: process.uptime(),
      version: packageJson.version,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      ok: true,
      uptime: process.uptime(),
      version: 'unknown',
      timestamp: new Date().toISOString()
    });
  }
});

// Alternative health paths for Railway compatibility
router.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'BrezCode Health API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router;