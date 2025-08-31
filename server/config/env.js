import Joi from 'joi';

const envSchema = Joi.object({
  MONGODB_URI: Joi.string().uri().required()
    .messages({
      'string.uri': 'MONGODB_URI must be a valid URI',
      'any.required': 'MONGODB_URI is required'
    }),
  
  DB_NAME: Joi.string().required()
    .messages({
      'any.required': 'DB_NAME is required'
    }),
  
  PORT: Joi.number().integer().min(1).max(65535).default(4015),
  
  CLIENT_ORIGIN: Joi.string().uri().optional(),
  
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().min(1000).default(60000),
  
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(60)
});

function validateEnvironment() {
  const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME,
    PORT: process.env.PORT ? parseInt(process.env.PORT) : undefined,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS) : undefined,
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : undefined
  };

  const { error, value } = envSchema.validate(env, { 
    allowUnknown: false, 
    stripUnknown: true 
  });

  if (error) {
    console.error('❌ Environment validation failed:');
    error.details.forEach(detail => {
      console.error(`  - ${detail.message}`);
    });
    console.error('\nPlease check your environment variables and try again.');
    process.exit(1);
  }

  console.log('✅ Environment validation passed');
  return Object.freeze(value);
}

export default validateEnvironment();
