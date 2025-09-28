import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ProjectsController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let projectId: string;

  const user = {
    email: 'projectuser@example.com',
    password: 'projectpass123',
    name: 'Project User',
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('/projects (POST) - create project', async () => {
    const res = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Project', description: 'Project description' })
      .expect(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Test Project');
    projectId = res.body._id;
  });


  it('/projects/:id (GET) - get project by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('_id', projectId);
  });

  it('/projects/:id (PATCH) - update project', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Project' })
      .expect(200);
    expect(res.body.title).toBe('Updated Project');
  });

  it('/projects/:id (DELETE) - delete project', async () => {
    await request(app.getHttpServer())
      .delete(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/projects (POST) - fail without token', async () => {
    await request(app.getHttpServer())
      .post('/projects')
      .send({ title: 'No Token', description: 'Should fail' })
      .expect(401);
  });
});
