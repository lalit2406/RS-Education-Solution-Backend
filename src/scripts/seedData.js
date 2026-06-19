import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import University from '../models/University.js';

dotenv.config();

const universitiesData = [
  {
    name: 'Amity University Online',
    shortName: 'AMITY',
    mode: 'Online',
    coursesListSummary: 'MBA • MCA • BCA • BBA • B.Com • M.Com • BA • MSc',
    approvedBadges: ['UGC Approved', 'WES Accredited', 'NAAC A+ Grade'],
    registrationNote: 'Fee Structure — Online Courses | All amounts in INR',
    courses: [
      { courseName: 'BCA', specialization: 'General', academicFeesPerSem: 25000, academicFeesYearly: 50000 },
      { courseName: 'BBA', specialization: 'General', academicFeesPerSem: 27500, academicFeesYearly: 55000 },
      { courseName: 'BBA', specialization: 'HCL Tech - Data Analytics', academicFeesPerSem: 37500, academicFeesYearly: 75000 },
      { courseName: 'B.Com', specialization: 'General', academicFeesPerSem: 16500, academicFeesYearly: 33000 },
      { courseName: 'BA', specialization: 'JMC', academicFeesPerSem: 29000, academicFeesYearly: 58000 },
      { courseName: 'BA', specialization: 'General', academicFeesPerSem: 16500, academicFeesYearly: 33000 },
      { courseName: 'BA', specialization: 'Hindi', academicFeesPerSem: 60000, academicFeesYearly: 120000 },
      { courseName: 'B.Com', specialization: 'Hons.', academicFeesPerSem: 27500, academicFeesYearly: 55000 },
      { courseName: 'M.Com', specialization: 'Financial Management', academicFeesPerSem: 30000, academicFeesYearly: 60000 },
      { courseName: 'M.Com', specialization: 'Financial Technology', academicFeesPerSem: 30000, academicFeesYearly: 60000 },
      { courseName: 'MA', specialization: 'JMC', academicFeesPerSem: 42500, academicFeesYearly: 85000 },
      { courseName: 'MCA', specialization: 'General', academicFeesPerSem: 42500, academicFeesYearly: 85000 },
      { courseName: 'MBA', specialization: 'Data Science', academicFeesPerSem: 49750, academicFeesYearly: 99500 },
      { courseName: 'MBA', specialization: 'Business Analytics', academicFeesPerSem: 49750, academicFeesYearly: 99500 },
      { courseName: 'MBA', specialization: 'Software Engineering', academicFeesPerSem: 74750, academicFeesYearly: 149500 },
      { courseName: 'MBA', specialization: 'Human Resource Analytics', academicFeesPerSem: 49750, academicFeesYearly: 99500 },
      { courseName: 'MBA', specialization: 'Digital Entrepreneurship', academicFeesPerSem: 49750, academicFeesYearly: 99500 },
      { courseName: 'MBA', specialization: 'Digital Marketing Management', academicFeesPerSem: 49750, academicFeesYearly: 99500 },
      { courseName: 'MBA', specialization: 'General', academicFeesPerSem: 49750, academicFeesYearly: 99500 },
      { courseName: 'B.Com', specialization: 'International Finance & Accounting', academicFeesPerSem: 42500, academicFeesYearly: 85000 },
      { courseName: 'BCA', specialization: 'TCSION - Data Analytics', academicFeesPerSem: 37500, academicFeesYearly: 75000 },
      { courseName: 'BCA', specialization: 'TCSION - Cloud Security', academicFeesPerSem: 37500, academicFeesYearly: 75000 },
      { courseName: 'BCA', specialization: 'HCL Tech - Data Engineering', academicFeesPerSem: 37500, academicFeesYearly: 75000 },
      { courseName: 'BCA', specialization: 'HCL Tech - Software Engineering', academicFeesPerSem: 37500, academicFeesYearly: 75000 },
      { courseName: 'MA', specialization: 'Public Policy & Governance', academicFeesPerSem: 32500, academicFeesYearly: 65000 },
      { courseName: 'MA', specialization: 'Psychology', academicFeesPerSem: 62500, academicFeesYearly: 125000 },
      { courseName: 'MCA', specialization: 'Blockchain Technology and Management', academicFeesPerSem: 42500, academicFeesYearly: 85000 },
      { courseName: 'MCA', specialization: 'Machine Learning and Artificial Intelligence', academicFeesPerSem: 42500, academicFeesYearly: 85000 },
      { courseName: 'MCA', specialization: 'Machine Learning & AI (Advanced)', academicFeesPerSem: 62500, academicFeesYearly: 125000 },
      { courseName: 'MCA', specialization: 'Augmented Reality and Virtual Reality', academicFeesPerSem: 62500, academicFeesYearly: 125000 },
      { courseName: 'MCA', specialization: 'HCL Tech - Software Engineering', academicFeesPerSem: 62500, academicFeesYearly: 125000 },
      { courseName: 'MCA', specialization: 'HCL Tech - Cyber Security', academicFeesPerSem: 62500, academicFeesYearly: 125000 },
      { courseName: 'MSc', specialization: 'Data Science', academicFeesPerSem: 62500, academicFeesYearly: 125000 }
    ]
  },
  {
    name: 'LPU Online',
    shortName: 'LPU',
    mode: 'Online',
    coursesListSummary: 'MBA • MCA • BCA • BBA • B.Com • MA • MSc • M.Com • Diploma',
    approvedBadges: ['UGC Approved', 'AICTE Approved', 'WES Accredited'],
    registrationNote: '★ Rs. 1,000 Registration Fee — Non Refundable',
    courses: [
      { courseName: 'BA', specialization: 'General', academicFeesPerSem: 18000, examFeesPerSem: 2000, totalPerSem: 20000 },
      { courseName: 'BBA', specialization: 'General', academicFeesPerSem: 23000, examFeesPerSem: 2000, totalPerSem: 25000 },
      { courseName: 'MA', specialization: 'English', academicFeesPerSem: 18000, examFeesPerSem: 2000, totalPerSem: 20000 },
      { courseName: 'MA', specialization: 'History', academicFeesPerSem: 18000, examFeesPerSem: 2000, totalPerSem: 20000 },
      { courseName: 'MA', specialization: 'Sociology', academicFeesPerSem: 18000, examFeesPerSem: 2000, totalPerSem: 20000 },
      { courseName: 'MA', specialization: 'Political Science', academicFeesPerSem: 18000, examFeesPerSem: 2000, totalPerSem: 20000 },
      { courseName: 'MSc', specialization: 'Mathematics', academicFeesPerSem: 23000, examFeesPerSem: 2000, totalPerSem: 25000 },
      { courseName: 'MSc', specialization: 'Economics', academicFeesPerSem: 23000, examFeesPerSem: 2000, totalPerSem: 25000 },
      { courseName: 'MCom', specialization: 'General', academicFeesPerSem: 23000, examFeesPerSem: 2000, totalPerSem: 25000 },
      { courseName: 'MCA', specialization: 'General', academicFeesPerSem: 38000, examFeesPerSem: 2000, totalPerSem: 40000 },
      { courseName: 'BCA', specialization: 'General', academicFeesPerSem: 23000, examFeesPerSem: 2000, totalPerSem: 25000 },
      { courseName: 'MBA', specialization: 'Finance', academicFeesPerSem: 48000, examFeesPerSem: 2000, totalPerSem: 50000 },
      { courseName: 'MBA', specialization: 'Marketing', academicFeesPerSem: 48000, examFeesPerSem: 2000, totalPerSem: 50000 },
      { courseName: 'MBA', specialization: 'Human Resource Management', academicFeesPerSem: 48000, examFeesPerSem: 2000, totalPerSem: 50000 },
      { courseName: 'MBA', specialization: 'Data Science', academicFeesPerSem: 48000, examFeesPerSem: 2000, totalPerSem: 50000 },
      { courseName: 'MBA', specialization: 'Digital Marketing', academicFeesPerSem: 48000, examFeesPerSem: 2000, totalPerSem: 50000 },
      { courseName: 'MBA', specialization: 'Business Analytics', academicFeesPerSem: 48000, examFeesPerSem: 2000, totalPerSem: 50000 },
      { courseName: 'MBA', specialization: 'International Business', academicFeesPerSem: 48000, examFeesPerSem: 2000, totalPerSem: 50000 },
      { courseName: 'MBA', specialization: 'Information Technology', academicFeesPerSem: 48000, examFeesPerSem: 2000, totalPerSem: 50000 },
      { courseName: 'MBA', specialization: 'Operations Management', academicFeesPerSem: 48000, examFeesPerSem: 2000, totalPerSem: 50000 },
      { courseName: 'Diploma', specialization: 'Business Administration', academicFeesPerSem: 23000, examFeesPerSem: 2000, totalPerSem: 25000 },
      { courseName: 'Diploma', specialization: 'Computer Applications', academicFeesPerSem: 23000, examFeesPerSem: 2000, totalPerSem: 25000 }
    ]
  },
  {
    name: 'Mangalayatan University (Distance)',
    shortName: 'Mangalayatan Distance',
    mode: 'Distance',
    coursesListSummary: 'BA • B.Com • B.Sc • MA • MBA • M.Sc • MLib • BLib',
    approvedBadges: ['UGC Approved', 'DEB Approved', 'NAAC A+ Grade'],
    registrationNote: 'Reg. Fee (One Time) | Exam Fees (Yearly) | Course Fees (Per Year)',
    courses: [
      { courseName: 'BA', specialization: 'General', semesters: 6, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 8000 },
      { courseName: 'BCOM', specialization: 'General', semesters: 6, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 8000 },
      { courseName: 'BLib', specialization: 'General', semesters: 2, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 18000 },
      { courseName: 'BSc (PCB / PCM / ZBC)', specialization: 'General', semesters: 6, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 20000 },
      { courseName: 'BA (JMC)', specialization: 'General', semesters: 6, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 14000 },
      { courseName: 'MA (Sociology)', specialization: 'General', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 14000 },
      { courseName: 'MA (History)', specialization: 'General', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 14000 },
      { courseName: 'MA (Economics)', specialization: 'General', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 14000 },
      { courseName: 'MBA', specialization: 'Marketing / HR / Finance / Operations', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 28000 },
      { courseName: 'MSc (Physics / Chemistry)', specialization: 'General', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 24000 },
      { courseName: 'MLib', specialization: 'General', semesters: 2, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 20000 },
      { courseName: 'MBA', specialization: 'Tourism & Hospitality Management', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 36000 }
    ]
  },
  {
    name: 'Mangalayatan University (Online)',
    shortName: 'Mangalayatan Online',
    mode: 'Online',
    coursesListSummary: 'BBA • BCA • BA • MA • M.Com • MBA • MCA • M.Sc',
    approvedBadges: ['UGC Approved', 'DEB Approved', 'AICTE Approved'],
    registrationNote: 'Reg. Fee (One Time) | Exam Fees (Yearly) | Course Fees (Per Year)',
    courses: [
      { courseName: 'BBA', specialization: 'General', semesters: 6, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 18000 },
      { courseName: 'BCA', specialization: 'General', semesters: 6, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 20000 },
      { courseName: 'BA', specialization: 'General', semesters: 6, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 10000 },
      { courseName: 'MA (English / Political Science)', specialization: 'General', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 14000 },
      { courseName: 'MA (Education)', specialization: 'General', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 14000 },
      { courseName: 'MA (Public Administration)', specialization: 'General', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 14000 },
      { courseName: 'MA (JMC)', specialization: 'General', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 14000 },
      { courseName: 'MCOM', specialization: 'General', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 14000 },
      { courseName: 'MBA', specialization: 'Marketing / HR / Finance / Operations Management', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 30000 },
      { courseName: 'MBA Plus', specialization: 'Business Analytics / Digital Marketing / IT / Supply Chain Management', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 36000 },
      { courseName: 'MCA', specialization: 'General', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 30000 },
      { courseName: 'MSc (Mathematics)', specialization: 'General', semesters: 4, registrationFee: 1000, examFeesYearly: 3000, courseFeesPerYear: 24000 }
    ]
  }
];

const seedDatabase = async () => {
  await connectDB();
  try {
    await University.deleteMany({});
    console.log('Cleared existing university records.');

    const created = await University.insertMany(universitiesData);
    console.log(`Successfully seeded ${created.length} universities.`);
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
