import dbConnect from './mongodb';
import Product from '../models/Product';
import User from '../models/User';
import fs from 'fs';
import path from 'path';

export async function seedDatabase() {
  await dbConnect();

  // 1. Migrate Products
  const count = await Product.countDocuments();
  if (count === 0) {
    const filePath = path.join(process.cwd(), 'src/data/products.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      // Remove local IDs and let MongoDB generate them
      const cleanData = data.map(({ id, ...rest }: any) => rest);
      await Product.insertMany(cleanData);
      console.log('✅ Products migrated from JSON to MongoDB');
    }
  }

  // 2. Create SuperAdmin
  const adminEmails = ["solvedmystery610@gmail.com", "ansariparvej0312@gmail.com"];
  const adminPassword = "@Steam0786";
  
  for (const adminEmail of adminEmails) {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: adminEmail === "ansariparvej0312@gmail.com" ? "Parvej Ansari" : "Super Admin",
        email: adminEmail,
        password: adminPassword,
        role: "superadmin"
      });
      console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
      existingAdmin.role = "superadmin";
      await existingAdmin.save();
    }
  }
}
