import dbConnect from './src/lib/mongodb';
import { seedDatabase } from './src/lib/seed';

async function runSeed() {
  try {
    await dbConnect();
    await seedDatabase();
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeed();
