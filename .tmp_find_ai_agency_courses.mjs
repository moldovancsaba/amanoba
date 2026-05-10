const mongo = await import('/Users/moldovancsaba/Projects/amanoba/app/lib/mongodb.ts');
const courseMod = await import('/Users/moldovancsaba/Projects/amanoba/app/lib/models/course.ts');
const connectDB = mongo.default || mongo;
const Course = courseMod.default || courseMod;
await connectDB();
const query = [
  { name: /AI Agency/i },
  { courseId: /AI_AGENCY/i },
  { courseId: /BUILD_AN_AI_AGENCY/i },
];
const filter = {};
filter['$or'] = query;
const courses = await Course.find(filter).lean();
console.log(JSON.stringify(courses.map(c => ({courseId:c.courseId,name:c.name,isDraft:c.isDraft,isActive:c.isActive,_id:String(c._id)})), null, 2));
process.exit(0);
