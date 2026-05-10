import 'dotenv/config';
const mongo = await import('./app/lib/mongodb.ts');
const courseMod = await import('./app/lib/models/course.ts');
console.log('mongo keys', Object.keys(mongo));
console.log('mongo.default keys', mongo.default ? Object.keys(mongo.default) : null);
console.log('course keys', Object.keys(courseMod));
console.log('course.default keys', courseMod.default ? Object.keys(courseMod.default) : null);
