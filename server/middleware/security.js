import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

function applySecurity(app, config) {
  app.use(helmet());
  
  const corsOptions = {
    origin: config.CLIENT_ORIGIN || true,
    credentials: true
  };
  app.use(cors(corsOptions));
  
  const authLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
    message: {
      ok: false,
      error: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
  
  app.use('/auth', authLimiter);
  app.use('/api/login', authLimiter);
}

export { applySecurity };