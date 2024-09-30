import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';
import {Logger} from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
    logger = app.get(WINSTON_MODULE_PROVIDER)
  });

  describe('User Register POST /user/register', () => {
    beforeEach(async () => {
      await testService.deleteUser()
    })

    it('should be able to register user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send({
          email: "test@example.com",
          password: "pass1234",
          name: "test",
          phone: "12345678",
          role: "student",
        });

        logger.info(response.body)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("successfully create user")
        expect(response.body.data).toBeDefined()
    })
  });

  describe('User Login POST /user/login', () => {
    beforeEach(async () => {
      await testService.deleteUser()
      await testService.createUser()
    })

    it('should be able to login user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: "test@example.com",
          password: "pass1234"
        });

        logger.info(response.body)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("successfully login user")
        expect(response.body.data).toBeDefined()
    });

    it('should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: "test@example.com",
          password: "pass12345"
        });

        logger.info(response.body)

        expect(response.status).toBe(401)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe("email or password wrong")
        expect(response.body.data).toBeUndefined()
    });
  })
});
