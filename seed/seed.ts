import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { ProjectsService } from '../src/projects/projects.service';
import { TasksService } from '../src/tasks/tasks.service';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const projectsService = app.get(ProjectsService);
  const tasksService = app.get(TasksService);

  try {
    console.log('Starting database seeding...');

    // Create test user
    const testUser = await usersService.create({
      email: 'test@example.com',
      password: 'Test@123',
      name: 'Test User',
    });

    console.log('Test user created:', testUser.email);

    // Create projects
    const project1 = await projectsService.create({
      title: 'E-commerce Website',
      description: 'Build a modern e-commerce platform with React and Node.js',
      status: 'active',
    }, (testUser as any)._id.toString());

    const project2 = await projectsService.create({
      title: 'Mobile App Development',
      description: 'Create a cross-platform mobile app using React Native',
      status: 'active',
    }, (testUser as any)._id.toString());

    console.log('✅ Projects created:', project1.title, 'and', project2.title);

    // Create tasks for project 1
    const tasks1 = [
      {
        title: 'Design UI/UX mockups',
        description: 'Create wireframes and design mockups for the e-commerce website',
        status: 'done',
        dueDate: '2024-01-15',
        projectId: (project1 as any)._id.toString(),
      },
      {
        title: 'Set up backend API',
        description: 'Create REST API endpoints for product management and user authentication',
        status: 'in-progress',
        dueDate: '2024-01-25',
        projectId: (project1 as any)._id.toString(),
      },
      {
        title: 'Implement payment integration',
        description: 'Integrate Stripe payment gateway for secure transactions',
        status: 'todo',
        dueDate: '2024-02-01',
        projectId: (project1 as any)._id.toString(),
      },
    ];

    // Create tasks for project 2
    const tasks2 = [
      {
        title: 'Setup React Native environment',
        description: 'Install and configure React Native development environment',
        status: 'done',
        dueDate: '2024-01-10',
        projectId: (project2 as any)._id.toString(),
      },
      {
        title: 'Create navigation structure',
        description: 'Implement navigation between different screens using React Navigation',
        status: 'in-progress',
        dueDate: '2024-01-20',
        projectId: (project2 as any)._id.toString(),
      },
      {
        title: 'Implement user authentication',
        description: 'Add login and registration functionality with JWT tokens',
        status: 'todo',
        dueDate: '2024-01-30',
        projectId: (project2 as any)._id.toString(),
      },
    ];

    // Create all tasks
    for (const taskData of [...tasks1, ...tasks2]) {
      await tasksService.create(taskData, (testUser as any)._id.toString());
    }

    console.log('Tasks created: 6 tasks total');

    console.log('\n Database seeding completed successfully!');
    console.log('\nTest credentials:');
    console.log('Email: test@example.com');
    console.log('Password: Test@123');
    console.log('\nYou can now start the application and login with these credentials.');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seed();
