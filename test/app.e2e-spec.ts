// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Post Flow E2E (Full Circuit)', () => {
    let app: INestApplication;
    let adminToken: string;
    let writerToken: string;
    let readerToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();

        // Login tous les users
        adminToken = (await request(app.getHttpServer())
            .post('/auth/login').send({ username: 'gerald', password: 'gerald' }).expect(201)).body.access_token;

        writerToken = (await request(app.getHttpServer())
            .post('/auth/login').send({ username: 'writer', password: 'writer' }).expect(201)).body.access_token;

        readerToken = (await request(app.getHttpServer())
            .post('/auth/login').send({ username: 'reader', password: 'reader' }).expect(201)).body.access_token;
    });

    it('Should have seed data', async () => {
        const res = await request(app.getHttpServer()).get('/posts').expect(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Writer can create post with tag', async () => {
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'writer', password: 'writer' })
            .expect(201);

        const writerToken = loginRes.body.access_token;

        const res = await request(app.getHttpServer())
            .post('/posts')
            .set('Authorization', `Bearer ${writerToken}`)
            .send({
                title: 'E2E Writer Post',
                content: 'Test content',
                tagIds: ['tag-typescript-1']
            })
            .expect(201);

        expect(res.body).toBeDefined(); 
    });

    it('Reader cannot create post (no permission)', async () => {
        await request(app.getHttpServer())
            .post('/posts')
            .set('Authorization', `Bearer ${readerToken}`)
            .send({
                title: 'Reader post (should fail)',
                content: 'Fail content'
            })
            .expect(403);
    });

    it('Admin can approve post', async () => {
        // 1. Writer crée un post
        const createRes = await request(app.getHttpServer())
            .post('/posts')
            .set('Authorization', `Bearer ${writerToken}`)
            .send({
                title: 'Post to approve',
                content: 'Will be approved',
                tagIds: ['tag-nodejs-2']
            })
            .expect(201);

        const postId = 'post-3';

        // 2. Admin approuve
        await request(app.getHttpServer())
            .patch(`/posts/${postId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send('accepted')
            .expect(200);

        // 3. Writer a une notification
        const notifs = await request(app.getHttpServer())
            .get('/notifications')
            .set('Authorization', `Bearer ${writerToken}`)
            .expect(200);
    });

    it('Writer receives post approval notification', async () => {
        // Writer check notifications
        const notifs = await request(app.getHttpServer())
            .get('/notifications')
            .set('Authorization', `Bearer ${writerToken}`)
            .expect(200);

        expect(notifs.body.notifications.length).toBeGreaterThan(0);
    });

    afterAll(async () => {
        await app.close();
    });
});
