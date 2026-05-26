import dotenv from 'dotenv';
dotenv.config({ path: '/Users/Shared/Projects/amanoba/.env.local' });
const mongo = await import('./app/lib/mongodb.ts');
const courseMod = await import('./app/lib/models/course.ts');
const connectDB = mongo.default;
const Course = courseMod.default;
await connectDB();
const rows = await Course.aggregate([
  { $match: { isActive: true } },
  { $group: { _id: '$language', count: { $sum: 1 } } },
  { $sort: { count: -1, _id: 1 } },
]);
console.log(JSON.stringify(rows, null, 2));
process.exit(0);
