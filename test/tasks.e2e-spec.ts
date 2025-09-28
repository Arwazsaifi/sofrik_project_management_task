import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let projectId: string;
  let taskId: string;

  const user = {
    email: 'taskuser@example.com',
    password: 'taskpass123',
    name: 'Task User',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Register and login user to get JWT token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(user);
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password });
    token = loginRes.body.access_token;

    // Create a project for tasks
    const projectRes = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task Project', description: 'Project for tasks' });
    projectId = projectRes.body._id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tasks (POST) - create task', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'Task description',
        projectId,
        status: 'todo',
      })
      .expect(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Test Task');
    taskId = res.body._id;
  });

  it('/tasks (GET) - get all tasks for project', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tasks?projectId=${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/tasks/:id (GET) - get task by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('_id', taskId);
  });

  it('/tasks/:id (PATCH) - update task', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' })
      .expect(200);
    expect(res.body.status).toBe('done');
  });

  it('/tasks/:id (DELETE) - delete task', async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/tasks (POST) - fail without token', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'No Token',
        description: 'Should fail',
        projectId,
      })
      .expect(401);
  });
});
