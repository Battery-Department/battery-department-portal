import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@batterydepartment.com' },
    update: {},
    create: {
      email: 'test@batterydepartment.com',
      password: hashedPassword,
      name: 'Test User',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created test user:', testUser.email);

  // Create sample products
  const products = [
    {
      name: 'Premium Car Battery 12V 75Ah',
      description: 'High-performance car battery with extended warranty',
      brand: 'BatteryPro',
      voltage: 12,
      capacity: 75,
      price: 149.99,
      images: ['/images/car-battery-1.jpg'],
      category: 'car-batteries',
      specifications: {
        cca: '750A',
        dimensions: '278mm x 175mm x 190mm',
        weight: '17.5kg',
        warranty: '3 years',
      },
      sku: 'CB-PRE-75',
    },
    {
      name: 'Heavy Duty Truck Battery 12V 120Ah',
      description: 'Commercial grade battery for trucks and heavy vehicles',
      brand: 'PowerMax',
      voltage: 12,
      capacity: 120,
      price: 249.99,
      images: ['/images/truck-battery-1.jpg'],
      category: 'truck-batteries',
      specifications: {
        cca: '1000A',
        dimensions: '513mm x 189mm x 223mm',
        weight: '32kg',
        warranty: '2 years',
      },
      sku: 'TB-HD-120',
    },
    {
      name: 'Marine Deep Cycle Battery 12V 100Ah',
      description: 'Dual-purpose marine battery for starting and deep cycle use',
      brand: 'SeaPower',
      voltage: 12,
      capacity: 100,
      price: 199.99,
      images: ['/images/marine-battery-1.jpg'],
      category: 'marine-batteries',
      specifications: {
        mca: '800A',
        dimensions: '330mm x 173mm x 240mm',
        weight: '26kg',
        warranty: '18 months',
      },
      sku: 'MB-DC-100',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }

  console.log('✅ Created', products.length, 'products');

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });