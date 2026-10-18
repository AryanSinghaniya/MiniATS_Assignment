/**
 * seed.js - Inserts 20 realistic candidates spread across all hiring stages.
 * Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');

const candidates = [
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1-555-0101',
    position: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'CSS', 'Webpack'],
    experience: 3,
    notes: 'Strong portfolio with e-commerce projects.',
    stage: 'Hired',
  },
  {
    name: 'Bob Martinez',
    email: 'bob.martinez@example.com',
    phone: '+1-555-0102',
    position: 'Backend Engineer',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
    experience: 5,
    notes: 'Previously at a Series B startup.',
    stage: 'Offer',
  },
  {
    name: 'Carol White',
    email: 'carol.white@example.com',
    phone: '+1-555-0103',
    position: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    experience: 4,
    notes: 'Excellent system design knowledge.',
    stage: 'Interview',
  },
  {
    name: 'David Lee',
    email: 'david.lee@example.com',
    phone: '+1-555-0104',
    position: 'DevOps Engineer',
    skills: ['Kubernetes', 'Terraform', 'CI/CD', 'GCP'],
    experience: 6,
    notes: 'Managed infra for 50+ microservices.',
    stage: 'Screening',
  },
  {
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    phone: '+1-555-0105',
    position: 'UI/UX Designer',
    skills: ['Figma', 'User Research', 'Prototyping'],
    experience: 2,
    notes: 'Beautiful portfolio, great eye for detail.',
    stage: 'Applied',
  },
  {
    name: 'Frank Brown',
    email: 'frank.brown@example.com',
    phone: '+1-555-0106',
    position: 'Mobile Developer',
    skills: ['React Native', 'iOS', 'Android', 'Expo'],
    experience: 4,
    notes: 'Published 3 apps on the App Store.',
    stage: 'Rejected',
  },
  {
    name: 'Grace Taylor',
    email: 'grace.taylor@example.com',
    phone: '+1-555-0107',
    position: 'Data Engineer',
    skills: ['Python', 'Spark', 'Airflow', 'Snowflake'],
    experience: 5,
    notes: 'Built ETL pipelines for petabyte-scale data.',
    stage: 'Hired',
  },
  {
    name: 'Henry Davis',
    email: 'henry.davis@example.com',
    phone: '+1-555-0108',
    position: 'Machine Learning Engineer',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLflow'],
    experience: 3,
    notes: 'PhD in Computer Science from MIT.',
    stage: 'Interview',
  },
  {
    name: 'Isabella Garcia',
    email: 'isabella.garcia@example.com',
    phone: '+1-555-0109',
    position: 'Product Manager',
    skills: ['Roadmapping', 'Agile', 'JIRA', 'Analytics'],
    experience: 7,
    notes: 'Launched 2 successful SaaS products.',
    stage: 'Offer',
  },
  {
    name: 'James Anderson',
    email: 'james.anderson@example.com',
    phone: '+1-555-0110',
    position: 'QA Engineer',
    skills: ['Selenium', 'Jest', 'Cypress', 'Postman'],
    experience: 2,
    notes: 'Strong automation testing background.',
    stage: 'Screening',
  },
  {
    name: 'Karen Thomas',
    email: 'karen.thomas@example.com',
    phone: '+1-555-0111',
    position: 'Security Engineer',
    skills: ['Penetration Testing', 'SIEM', 'Zero Trust', 'Python'],
    experience: 8,
    notes: 'CISSP certified.',
    stage: 'Applied',
  },
  {
    name: 'Liam Jackson',
    email: 'liam.jackson@example.com',
    phone: '+1-555-0112',
    position: 'Frontend Developer',
    skills: ['Vue.js', 'Nuxt', 'GraphQL', 'Tailwind CSS'],
    experience: 1,
    notes: 'Recent bootcamp grad, impressive projects.',
    stage: 'Applied',
  },
  {
    name: 'Mia Harris',
    email: 'mia.harris@example.com',
    phone: '+1-555-0113',
    position: 'Backend Developer',
    skills: ['Go', 'gRPC', 'Kafka', 'Redis'],
    experience: 4,
    notes: 'Expertise in high-throughput systems.',
    stage: 'Interview',
  },
  {
    name: 'Noah Martin',
    email: 'noah.martin@example.com',
    phone: '+1-555-0114',
    position: 'Cloud Architect',
    skills: ['AWS', 'Azure', 'Serverless', 'Cost Optimization'],
    experience: 9,
    notes: 'AWS Solutions Architect Professional.',
    stage: 'Hired',
  },
  {
    name: 'Olivia Thompson',
    email: 'olivia.thompson@example.com',
    phone: '+1-555-0115',
    position: 'Data Analyst',
    skills: ['SQL', 'Tableau', 'Power BI', 'Python'],
    experience: 2,
    notes: 'Created dashboards used by C-suite.',
    stage: 'Screening',
  },
  {
    name: 'Patrick White',
    email: 'patrick.white@example.com',
    phone: '+1-555-0116',
    position: 'Site Reliability Engineer',
    skills: ['Linux', 'Prometheus', 'Grafana', 'Ansible'],
    experience: 6,
    notes: 'Maintained 99.99% uptime for critical services.',
    stage: 'Rejected',
  },
  {
    name: 'Quinn Moore',
    email: 'quinn.moore@example.com',
    phone: '+1-555-0117',
    position: 'Full Stack Developer',
    skills: ['Next.js', 'Prisma', 'PostgreSQL', 'tRPC'],
    experience: 3,
    notes: 'Active open source contributor.',
    stage: 'Interview',
  },
  {
    name: 'Rachel Jackson',
    email: 'rachel.jackson@example.com',
    phone: '+1-555-0118',
    position: 'Engineering Manager',
    skills: ['Leadership', 'System Design', 'OKRs', 'Java'],
    experience: 10,
    notes: 'Led teams of 12+ engineers.',
    stage: 'Offer',
  },
  {
    name: 'Samuel Clark',
    email: 'samuel.clark@example.com',
    phone: '+1-555-0119',
    position: 'Blockchain Developer',
    skills: ['Solidity', 'Ethereum', 'Web3.js', 'Hardhat'],
    experience: 3,
    notes: 'Built multiple DeFi protocols.',
    stage: 'Applied',
  },
  {
    name: 'Tina Lewis',
    email: 'tina.lewis@example.com',
    phone: '+1-555-0120',
    position: 'Technical Writer',
    skills: ['Documentation', 'Markdown', 'API Docs', 'Swagger'],
    experience: 5,
    notes: 'Improved dev onboarding time by 40%.',
    stage: 'Screening',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data
    await Candidate.deleteMany({});
    console.log('Cleared existing candidates.');

    // Insert seed data
    const inserted = await Candidate.insertMany(candidates);
    console.log(`✅ Seeded ${inserted.length} candidates successfully.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
