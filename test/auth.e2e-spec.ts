import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const user = {
    email: 'testuser@example.com',
    password: 'testpass123',
    name: 'Test User',
  };

  it('/auth/register (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201);
  });

  it('/auth/register (POST) - fail (duplicate)', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(401);
  });

  it('/auth/login (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(201);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body.user.email).toBe(user.email);
  });

  it('/auth/login (POST) - fail (wrong password)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: 'wrongpass' })
      .expect(401);
  });

  it('/auth/profile (GET) - success', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(201);
    const token = loginRes.body.access_token;
    const res = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.email).toBe(user.email);
  });

  it('/auth/profile (GET) - fail (no token)', async () => {
    await request(app.getHttpServer())
      .get('/auth/profile')
      .expect(401);
  });
});
