import 'dotenv/config';
import express from 'express';
import { corsOptions } from './config/corsConfig.js';
import { appConfig } from './config/appConfig.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.routes.js';
import { userRouter } from './routes/user.routes.js';
import { scanRouter } from './routes/scan.routes.js';
import { alertRouter } from './routes/alert.routes.js';
import { mandiRouter } from './routes/mandi.routes.js';
import marketRatesRouter from './routes/marketRates.routes.js';
import weatherRouter from './routes/weather.routes.js';
import diseaseRouter from './routes/disease.routes.js';

const app = express();

app.use(corsOptions);
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: appConfig.appName,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/scans', scanRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/mandi', mandiRouter);
app.use('/api/market-rates', marketRatesRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/disease-scan', diseaseRouter);

// Centralized Error Handler
app.use(errorHandler);

// Start HTTP Server & Connect MongoDB
app.listen(appConfig.port, async () => {
  console.log(`🚀 ${appConfig.appName} running at http://localhost:${appConfig.port}`);
  await connectDB();
});
