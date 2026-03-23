import request from 'supertest';
import app from '#src/app.js';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      // we set the ip because of arcjet
      const response = await request(app)
        .get('/health')
        .set('x-forwarded-for', '127.0.0.1')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('should return API message', async () => {
      const response = await request(app).get('/api').expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Acquisitions API is running'
      );
    });
  });

  describe('GET /nonexistant', () => {
    it('should return API message', async () => {
      const response = await request(app).get('/nonexistant').expect(404);

      expect(response.body).toHaveProperty('error', 'route not found');
    });
  });
});
