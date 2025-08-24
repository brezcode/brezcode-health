import bcrypt from 'bcryptjs';

async function generateHash() {
  const password = '11111111';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('Hash validation:', isValid ? '✅ Valid' : '❌ Invalid');
}

await generateHash();