import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:3002';

async function createAdminUser() {
  console.log('👤 Creating admin user for business dashboard...\n');
  
  try {
    const adminData = {
      email: 'leedennyps@gmail.com',
      password: '11111111',
      firstName: 'Denny',
      lastName: 'Lee'
    };
    
    console.log('📝 Creating admin user with:');
    console.log(`- Email: ${adminData.email}`);
    console.log(`- Password: ${adminData.password}`);
    console.log(`- Name: ${adminData.firstName} ${adminData.lastName}\n`);
    
    const response = await fetch(`${BASE_URL}/api/business/auth/create-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Admin user created successfully!');
      console.log(`👤 User ID: ${result.user.id}`);
      console.log(`📧 Email: ${result.user.email}`);
      console.log(`🎯 Role: ${result.user.role}`);
      console.log(`📅 Created: ${new Date(result.user.createdAt).toLocaleString()}\n`);
      
      console.log('🌐 You can now login at:');
      console.log('- Local: http://localhost:3002/backend');
      console.log('- Railway: https://brezcode-health-production.up.railway.app/backend');
      console.log('- Production: https://www.brezcode.com/backend\n');
      
      console.log('🔐 Login credentials:');
      console.log(`Email: ${adminData.email}`);
      console.log(`Password: ${adminData.password}`);
      
    } else {
      console.log('❌ Failed to create admin user:');
      console.log(result.error);
      
      if (result.error.includes('already exists')) {
        console.log('\n💡 Admin user already exists. Use these credentials to login:');
        console.log(`Email: ${adminData.email}`);
        console.log(`Password: ${adminData.password}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.log('\n🔧 Make sure the server is running on port 3002');
    console.log('Run: npm run start');
  }
}

console.log('🚀 BrezCode Health - Admin User Setup\n');
await createAdminUser();