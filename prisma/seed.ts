import {
  PrismaClient,
  UserRole,
  VerticalType,
  AssignmentType,
  AssignmentStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password untuk semua user dummy
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Data dummy untuk STUDENT (5 users)
  const students = [
    {
      email: 'student1@revou.co',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Johnson',
      role: UserRole.STUDENT,
    },
    {
      email: 'student2@revou.co',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Smith',
      role: UserRole.STUDENT,
    },
    {
      email: 'student3@revou.co',
      password: hashedPassword,
      firstName: 'Charlie',
      lastName: 'Brown',
      role: UserRole.STUDENT,
    },
    {
      email: 'student4@revou.co',
      password: hashedPassword,
      firstName: 'Diana',
      lastName: 'Wilson',
      role: UserRole.STUDENT,
    },
    {
      email: 'student5@revou.co',
      password: hashedPassword,
      firstName: 'Edward',
      lastName: 'Davis',
      role: UserRole.STUDENT,
    },
  ];

  // Data dummy untuk TEAM_LEAD (5 users)
  const teamLeads = [
    {
      email: 'teamlead1@revou.co',
      password: hashedPassword,
      firstName: 'Frank',
      lastName: 'Miller',
      role: UserRole.TEAM_LEAD,
    },
    {
      email: 'teamlead2@revou.co',
      password: hashedPassword,
      firstName: 'Grace',
      lastName: 'Taylor',
      role: UserRole.TEAM_LEAD,
    },
    {
      email: 'teamlead3@revou.co',
      password: hashedPassword,
      firstName: 'Henry',
      lastName: 'Anderson',
      role: UserRole.TEAM_LEAD,
    },
    {
      email: 'teamlead4@revou.co',
      password: hashedPassword,
      firstName: 'Ivy',
      lastName: 'Thomas',
      role: UserRole.TEAM_LEAD,
    },
    {
      email: 'teamlead5@revou.co',
      password: hashedPassword,
      firstName: 'Jack',
      lastName: 'Jackson',
      role: UserRole.TEAM_LEAD,
    },
  ];

  // Data dummy untuk ADMIN (5 users)
  const admins = [
    {
      email: 'admin1@revou.co',
      password: hashedPassword,
      firstName: 'Karen',
      lastName: 'White',
      role: UserRole.ADMIN,
    },
    {
      email: 'admin2@revou.co',
      password: hashedPassword,
      firstName: 'Leo',
      lastName: 'Harris',
      role: UserRole.ADMIN,
    },
    {
      email: 'admin3@revou.co',
      password: hashedPassword,
      firstName: 'Mia',
      lastName: 'Martin',
      role: UserRole.ADMIN,
    },
    {
      email: 'admin4@revou.co',
      password: hashedPassword,
      firstName: 'Noah',
      lastName: 'Garcia',
      role: UserRole.ADMIN,
    },
    {
      email: 'admin5@revou.co',
      password: hashedPassword,
      firstName: 'Olivia',
      lastName: 'Rodriguez',
      role: UserRole.ADMIN,
    },
  ];

  // Gabungkan semua data
  const allUsers = [...students, ...teamLeads, ...admins];

  // Insert data ke database
  console.log('📝 Creating users...');

  for (const userData of allUsers) {
    try {
      const user = await prisma.user.create({
        data: userData,
      });
      console.log(
        `✅ Created ${user.role}: ${user.firstName} ${user.lastName} (${user.email})`,
      );
    } catch (error) {
      console.log(
        `❌ Failed to create user ${userData.email}:`,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  // Create LMS data
  console.log('📚 Creating LMS data...');

  // Create Verticals - 3 verticals with FULLSTACK type
  const verticals = [
    {
      name: 'Full Stack Digital Marketing',
      description:
        'Comprehensive digital marketing strategy from content creation to analytics',
      type: VerticalType.FULLSTACK,
      isActive: true,
    },
    {
      name: 'Full Stack Data Analytics',
      description:
        'End-to-end data analytics from collection to visualization and insights',
      type: VerticalType?.FULLSTACK,
      isActive: true,
    },
    {
      name: 'Full Stack Software Engineering',
      description:
        'End-to-end software development from frontend to backend and deployment',
      type: VerticalType?.FULLSTACK,
      isActive: true,
    },
  ];

  const createdVerticals: any[] = [];
  for (const verticalData of verticals) {
    try {
      const vertical = await prisma.vertical.create({
        data: verticalData,
      });
      createdVerticals.push(vertical);
      console.log(`✅ Created vertical: ${vertical.name}`);
    } catch (error) {
      console.log(
        `❌ Failed to create vertical ${verticalData.name}:`,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  // Create Batches - 3 batches per vertical (9 total)
  const batches = [
    // Digital Marketing batches
    {
      name: 'Feb25',
      description: 'February 2025 Full Stack Digital Marketing batch',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-08-01'),
      verticalId: createdVerticals[0]?.id,
      isActive: true,
    },
    {
      name: 'Jun25',
      description: 'June 2025 Full Stack Digital Marketing batch',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-01'),
      verticalId: createdVerticals?.[0]?.id,
      isActive: true,
    },
    {
      name: 'Oct25',
      description: 'October 2025 Full Stack Digital Marketing batch',
      startDate: new Date('2025-10-01'),
      endDate: new Date('2026-04-01'),
      verticalId: createdVerticals?.[0]?.id,
      isActive: true,
    },
    // Data Analytics batches
    {
      name: 'Feb25',
      description: 'February 2025 Full Stack Data Analytics batch',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-08-01'),
      verticalId: createdVerticals[1]?.id,
      isActive: true,
    },
    {
      name: 'Jun25',
      description: 'June 2025 Full Stack Data Analytics batch',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-01'),
      verticalId: createdVerticals?.[1]?.id,
      isActive: true,
    },
    {
      name: 'Oct25',
      description: 'October 2025 Full Stack Data Analytics batch',
      startDate: new Date('2025-10-01'),
      endDate: new Date('2026-04-01'),
      verticalId: createdVerticals?.[1]?.id,
      isActive: true,
    },
    // Software Engineering batches
    {
      name: 'Feb25',
      description: 'February 2025 Full Stack Software Engineering batch',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-08-01'),
      verticalId: createdVerticals[2]?.id,
      isActive: true,
    },
    {
      name: 'Jun25',
      description: 'June 2025 Full Stack Software Engineering batch',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-01'),
      verticalId: createdVerticals?.[2]?.id,
      isActive: true,
    },
    {
      name: 'Oct25',
      description: 'October 2025 Full Stack Software Engineering batch',
      startDate: new Date('2025-10-01'),
      endDate: new Date('2026-04-01'),
      verticalId: createdVerticals?.[2]?.id,
      isActive: true,
    },
  ];

  const createdBatches: any[] = [];
  for (const batchData of batches) {
    if (batchData.verticalId) {
      try {
        const batch = await prisma.batch.create({
          data: batchData,
        });
        createdBatches.push(batch);
        console.log(`✅ Created batch: ${batch.name}`);
      } catch (error) {
        console.log(
          `❌ Failed to create batch ${batchData.name}:`,
          error instanceof Error ? error.message : 'Unknown error',
        );
      }
    }
  }

  // Create Modules - Only for Oct25 batches (3 verticals)
  const modules = [
    // Digital Marketing Oct25 modules
    {
      name: 'Content Strategy & Creation',
      description: 'Comprehensive content planning and creation strategies',
      moduleOrder: 1,
      batchId: createdBatches[2]?.id, // Digital Marketing Oct25
      isActive: true,
    },
    {
      name: 'Analytics & Performance',
      description: 'Digital marketing analytics and performance optimization',
      moduleOrder: 2,
      batchId: createdBatches?.[2]?.id, // Digital Marketing Oct25
      isActive: true,
    },
    // Data Analytics Oct25 modules
    {
      name: 'Data Collection & Processing',
      description: 'Data gathering, cleaning, and preprocessing techniques',
      moduleOrder: 1,
      batchId: createdBatches[5]?.id, // Data Analytics Oct25
      isActive: true,
    },
    {
      name: 'Visualization & Insights',
      description: 'Data visualization and business intelligence insights',
      moduleOrder: 2,
      batchId: createdBatches?.[5]?.id, // Data Analytics Oct25
      isActive: true,
    },
    // Software Engineering Oct25 modules
    {
      name: 'Frontend Development',
      description: 'Modern web development with React and TypeScript',
      moduleOrder: 1,
      batchId: createdBatches[8]?.id, // Software Engineering Oct25
      isActive: true,
    },
    {
      name: 'Backend Development',
      description: 'Server-side development with Node.js and databases',
      moduleOrder: 2,
      batchId: createdBatches?.[8]?.id, // Software Engineering Oct25
      isActive: true,
    },
  ];

  const createdModules: any[] = [];
  for (const moduleData of modules) {
    if (moduleData.batchId) {
      try {
        const module = await prisma.module.create({
          data: moduleData,
        });
        createdModules.push(module);
        console.log(`✅ Created module: ${module.name}`);
      } catch (error) {
        console.log(
          `❌ Failed to create module ${moduleData.name}:`,
          error instanceof Error ? error.message : 'Unknown error',
        );
      }
    }
  }

  // Create Weeks - Only for Oct25 batches modules
  const weeks = [
    // Digital Marketing Oct25 - Content Strategy Module
    {
      name: 'Content Planning & Strategy',
      description: 'Strategic content planning and brand storytelling',
      weekNumber: 1,
      moduleId: createdModules[0]?.id,
      isActive: true,
    },
    {
      name: 'Content Creation & Design',
      description: 'Creating engaging content across multiple platforms',
      weekNumber: 2,
      moduleId: createdModules?.[0]?.id,
      isActive: true,
    },
    // Digital Marketing Oct25 - Analytics Module
    {
      name: 'Marketing Analytics Setup',
      description: 'Setting up tracking and measurement systems',
      weekNumber: 1,
      moduleId: createdModules[1]?.id,
      isActive: true,
    },
    {
      name: 'Performance Optimization',
      description: 'Analyzing and optimizing marketing performance',
      weekNumber: 2,
      moduleId: createdModules?.[1]?.id,
      isActive: true,
    },
    // Data Analytics Oct25 - Data Collection Module
    {
      name: 'Data Sources & Collection',
      description: 'Identifying and collecting data from various sources',
      weekNumber: 1,
      moduleId: createdModules[2]?.id,
      isActive: true,
    },
    {
      name: 'Data Cleaning & Processing',
      description: 'Cleaning and preprocessing data for analysis',
      weekNumber: 2,
      moduleId: createdModules?.[2]?.id,
      isActive: true,
    },
    // Data Analytics Oct25 - Visualization Module
    {
      name: 'Data Visualization Tools',
      description: 'Creating effective data visualizations',
      weekNumber: 1,
      moduleId: createdModules[3]?.id,
      isActive: true,
    },
    {
      name: 'Business Intelligence & Insights',
      description: 'Generating actionable business insights from data',
      weekNumber: 2,
      moduleId: createdModules?.[3]?.id,
      isActive: true,
    },
    // Software Engineering Oct25 - Frontend Module
    {
      name: 'HTML, CSS & JavaScript',
      description: 'Fundamentals of web development technologies',
      weekNumber: 1,
      moduleId: createdModules[4]?.id,
      isActive: true,
    },
    {
      name: 'React & TypeScript',
      description: 'Modern frontend development with React and TypeScript',
      weekNumber: 2,
      moduleId: createdModules?.[4]?.id,
      isActive: true,
    },
    // Software Engineering Oct25 - Backend Module
    {
      name: 'Node.js & Express',
      description: 'Server-side development with Node.js and Express framework',
      weekNumber: 1,
      moduleId: createdModules[5]?.id,
      isActive: true,
    },
    {
      name: 'Database & APIs',
      description: 'Working with databases and building RESTful APIs',
      weekNumber: 2,
      moduleId: createdModules?.[5]?.id,
      isActive: true,
    },
  ];

  const createdWeeks: any[] = [];
  for (const weekData of weeks) {
    if (weekData.moduleId) {
      try {
        const week = await prisma.week.create({
          data: weekData,
        });
        createdWeeks.push(week);
        console.log(`✅ Created week: ${week.name}`);
      } catch (error) {
        console.log(
          `❌ Failed to create week ${weekData.name}:`,
          error instanceof Error ? error.message : 'Unknown error',
        );
      }
    }
  }

  // Create Lectures - Only for Oct25 batches
  const lectures = [
    // Digital Marketing Oct25 Lectures
    {
      title: 'Content Strategy Fundamentals',
      description:
        'Building effective content strategies for digital marketing',
      lectureNumber: 1,
      duration: 120,
      scheduledAt: new Date('2025-10-06T09:00:00Z'),
      weekId: createdWeeks[0]?.id,
      zoomLink: 'https://zoom.us/j/123456789',
      deckLink: 'https://slides.com/content-strategy',
      isActive: true,
    },
    {
      title: 'Brand Storytelling Techniques',
      description: 'Creating compelling brand narratives',
      lectureNumber: 2,
      duration: 90,
      scheduledAt: new Date('2025-10-08T09:00:00Z'),
      weekId: createdWeeks?.[0]?.id,
      zoomLink: 'https://zoom.us/j/123456790',
      deckLink: 'https://slides.com/brand-storytelling',
      isActive: true,
    },
    {
      title: 'Google Analytics & Tracking',
      description: 'Setting up comprehensive analytics tracking',
      lectureNumber: 1,
      duration: 120,
      scheduledAt: new Date('2025-10-13T09:00:00Z'),
      weekId: createdWeeks[2]?.id,
      zoomLink: 'https://zoom.us/j/123456791',
      deckLink: 'https://slides.com/google-analytics',
      isActive: true,
    },
    {
      title: 'Campaign Performance Optimization',
      description: 'Analyzing and optimizing marketing campaigns',
      lectureNumber: 2,
      duration: 150,
      scheduledAt: new Date('2025-10-15T09:00:00Z'),
      weekId: createdWeeks[3]?.id,
      zoomLink: 'https://zoom.us/j/123456792',
      deckLink: 'https://slides.com/campaign-optimization',
      isActive: true,
    },
    // Data Analytics Oct25 Lectures
    {
      title: 'Data Collection Strategies',
      description: 'Effective methods for gathering quality data',
      lectureNumber: 1,
      duration: 120,
      scheduledAt: new Date('2025-10-06T14:00:00Z'),
      weekId: createdWeeks[4]?.id,
      zoomLink: 'https://zoom.us/j/123456793',
      deckLink: 'https://slides.com/data-collection',
      isActive: true,
    },
    {
      title: 'Data Cleaning with Python',
      description: 'Preprocessing and cleaning data using Python',
      lectureNumber: 2,
      duration: 120,
      scheduledAt: new Date('2025-10-08T14:00:00Z'),
      weekId: createdWeeks[5]?.id,
      zoomLink: 'https://zoom.us/j/123456794',
      deckLink: 'https://slides.com/data-cleaning',
      isActive: true,
    },
    {
      title: 'Tableau & Power BI Fundamentals',
      description: 'Creating effective data visualizations',
      lectureNumber: 1,
      duration: 120,
      scheduledAt: new Date('2025-10-13T14:00:00Z'),
      weekId: createdWeeks[6]?.id,
      zoomLink: 'https://zoom.us/j/123456795',
      deckLink: 'https://slides.com/tableau-powerbi',
      isActive: true,
    },
    {
      title: 'Business Intelligence Dashboard',
      description: 'Building comprehensive BI dashboards',
      lectureNumber: 2,
      duration: 150,
      scheduledAt: new Date('2025-10-15T14:00:00Z'),
      weekId: createdWeeks[7]?.id,
      zoomLink: 'https://zoom.us/j/123456796',
      deckLink: 'https://slides.com/bi-dashboard',
      isActive: true,
    },
    // Software Engineering Oct25 Lectures
    {
      title: 'HTML, CSS & JavaScript Fundamentals',
      description: 'Core web development technologies',
      lectureNumber: 1,
      duration: 120,
      scheduledAt: new Date('2025-10-06T19:00:00Z'),
      weekId: createdWeeks[8]?.id,
      zoomLink: 'https://zoom.us/j/123456797',
      deckLink: 'https://slides.com/web-fundamentals',
      isActive: true,
    },
    {
      title: 'React & TypeScript Development',
      description: 'Modern frontend development with React and TypeScript',
      lectureNumber: 2,
      duration: 150,
      scheduledAt: new Date('2025-10-08T19:00:00Z'),
      weekId: createdWeeks[9]?.id,
      zoomLink: 'https://zoom.us/j/123456798',
      deckLink: 'https://slides.com/react-typescript',
      isActive: true,
    },
    {
      title: 'Node.js & Express Server',
      description: 'Building backend applications with Node.js',
      lectureNumber: 1,
      duration: 120,
      scheduledAt: new Date('2025-10-13T19:00:00Z'),
      weekId: createdWeeks[10]?.id,
      zoomLink: 'https://zoom.us/j/123456799',
      deckLink: 'https://slides.com/nodejs-express',
      isActive: true,
    },
    {
      title: 'Database & RESTful APIs',
      description: 'Database integration and API development',
      lectureNumber: 2,
      duration: 150,
      scheduledAt: new Date('2025-10-15T19:00:00Z'),
      weekId: createdWeeks[11]?.id,
      zoomLink: 'https://zoom.us/j/123456800',
      deckLink: 'https://slides.com/database-apis',
      isActive: true,
    },
  ];

  for (const lectureData of lectures) {
    if (lectureData.weekId) {
      try {
        const lecture = await prisma.lecture.create({
          data: lectureData,
        });
        console.log(`✅ Created lecture: ${lecture.title}`);
      } catch (error) {
        console.log(
          `❌ Failed to create lecture ${lectureData.title}:`,
          error instanceof Error ? error.message : 'Unknown error',
        );
      }
    }
  }

  // Create Assignments - Only for Oct25 batches
  const assignments = [
    // Digital Marketing Oct25 assignments
    {
      title: 'Content Strategy Plan',
      description:
        'Create a comprehensive content strategy for a fictional brand including target audience analysis, content pillars, and publishing calendar.',
      type: AssignmentType.PROJECT,
      status: AssignmentStatus.PUBLISHED,
      maxScore: 100,
      dueDate: new Date('2025-10-15T23:59:59Z'),
      publishedAt: new Date('2025-10-01T09:00:00Z'),
      batchId: createdBatches[2]?.id, // Digital Marketing Oct25
    },
    {
      title: 'Social Media Campaign Analysis',
      description:
        'Analyze a successful social media campaign and present findings on strategy, execution, and results.',
      type: AssignmentType.PROJECT,
      status: AssignmentStatus.PUBLISHED,
      maxScore: 80,
      dueDate: new Date('2025-10-22T23:59:59Z'),
      publishedAt: new Date('2025-10-08T09:00:00Z'),
      batchId: createdBatches[2]?.id, // Digital Marketing Oct25
    },
    // Data Analytics Oct25 assignments
    {
      title: 'Data Visualization Dashboard',
      description:
        'Build an interactive dashboard using Python/R to visualize sales data and identify key trends.',
      type: AssignmentType.PROJECT,
      status: AssignmentStatus.PUBLISHED,
      maxScore: 100,
      dueDate: new Date('2025-10-20T23:59:59Z'),
      publishedAt: new Date('2025-10-05T09:00:00Z'),
      batchId: createdBatches[5]?.id, // Data Analytics Oct25
    },
    {
      title: 'Statistical Analysis Report',
      description:
        'Perform statistical analysis on provided dataset and write a comprehensive report with findings and recommendations.',
      type: AssignmentType.PROJECT,
      status: AssignmentStatus.PUBLISHED,
      maxScore: 90,
      dueDate: new Date('2025-10-25T23:59:59Z'),
      publishedAt: new Date('2025-10-10T09:00:00Z'),
      batchId: createdBatches[5]?.id, // Data Analytics Oct25
    },
    // Software Engineering Oct25 assignments
    {
      title: 'Full Stack Web Application',
      description:
        'Build a complete web application with React frontend, Node.js backend, and PostgreSQL database.',
      type: AssignmentType.PROJECT,
      status: AssignmentStatus.PUBLISHED,
      maxScore: 120,
      dueDate: new Date('2025-11-01T23:59:59Z'),
      publishedAt: new Date('2025-10-01T09:00:00Z'),
      batchId: createdBatches[8]?.id, // Software Engineering Oct25
    },
    {
      title: 'Code Review & Refactoring',
      description:
        'Review provided legacy code, identify issues, and refactor following best practices and design patterns.',
      type: AssignmentType.INDIVIDUAL,
      status: AssignmentStatus.PUBLISHED,
      maxScore: 75,
      dueDate: new Date('2025-10-18T23:59:59Z'),
      publishedAt: new Date('2025-10-03T09:00:00Z'),
      batchId: createdBatches[8]?.id, // Software Engineering Oct25
    },
    // Draft assignment example
    {
      title: 'Advanced Algorithm Challenge',
      description:
        'Solve complex algorithmic problems focusing on optimization and time complexity.',
      type: AssignmentType.INDIVIDUAL,
      status: AssignmentStatus.DRAFT,
      maxScore: 100,
      dueDate: new Date('2025-11-15T23:59:59Z'),
      publishedAt: null,
      batchId: createdBatches[8]?.id, // Software Engineering Oct25
    },
  ];

  for (const assignmentData of assignments) {
    if (assignmentData.batchId) {
      try {
        const assignment = await prisma.assignment.create({
          data: assignmentData,
        });
        console.log(`✅ Created assignment: ${assignment.title}`);
      } catch (error) {
        console.log(
          `❌ Failed to create assignment ${assignmentData.title}:`,
          error instanceof Error ? error.message : 'Unknown error',
        );
      }
    }
  }

  console.log('🎉 Database seeding completed!');

  console.log('📊 Summary:');
  console.log('   - Users: 15 total');
  console.log(
    '   - Verticals: 3 created (Digital Marketing, Data Analytics, Software Engineering)',
  );
  console.log('   - Batches: 9 created (3 per vertical: Feb25, Jun25, Oct25)');
  console.log('   - Modules: 6 created (only for Oct25 batches)');
  console.log('   - Weeks: 12 created (only for Oct25 modules)');
  console.log('   - Lectures: 12 created (only for Oct25 weeks)');
  console.log('   - Assignments: 7 created (only for Oct25 batches)');
  console.log('   - Students: 5 users');
  console.log('   - Team Leads: 5 users');
  console.log('   - Admins: 5 users');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
