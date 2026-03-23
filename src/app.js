// setting up express app with right middleware
import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet'; //helps secure expres js apps with various http headers
import morgan from 'morgan'; //logging middleware - show details like url, status code,method and response time when someone makes a request - i.e debug requests and monitor traffic
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import { timestamp } from 'drizzle-orm/gel-core';
import authRoutes from '#routes/auth.route.js';
import userRoutes from '#routes/users.routes.js';
import securityMiddleware from '#middlewares/security.middleware.js';

const app = express();

app.use(helmet()); //helps secure express js with varius http headers

app.use(cors()); // lets bakend decide which external domains can make requests

app.use(express.json()); // parses json data into req body

app.use(express.urlencoded({ extended: true })); // allows to parse incoming requests w/ url encoded payloads based on body parser

app.use(cookieParser()); // reads incoming requests' cookies and parses them through req.cookies

// passing morgans msgs into our logger
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
); // combined - both in dev and production // combining both our logging library through winston and morgan by passing morgans msgs into our logger

app.use(securityMiddleware); // arcjet middleware for ratelimiting, bot identification

app.get('/', (req, res) => {
  logger.info('Hello From Acquisition');
  res.status(200).send('Hello from Acquisitions');
});

// health check
// app,get exposes just another endpoint - giving status, timestamp and uptime (time server ahs been up)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// exposing /api
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisitions API is running' });
});

// exposing the auth routes on /api/auth
app.use('/api/auth', authRoutes); // all routes within this router api will start with /auth/api

app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'route not found',
  });
});

export default app;
