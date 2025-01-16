import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // Import helmet for security headers
import authRouter from './routes/auth.js';
import connectToDatabase from './db/db.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';

import leaveRouter11  from './routes/leave11.js'

import settingRouter from './routes/setting.js';
import dashboardRouter from './routes/dashboard.js';
// import formTemplateRouter from './routes/formTemplate.js'
import { userRegister } from './userSeed.js'; // Import user registration function

const app = express();

// Use Helmet to set security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"], // Allow resources only from your own domain
            scriptSrc: ["'self'", 'https://vercel.live'], // Allow scripts from your domain and Vercel
            scriptSrcElem: ["'self'", 'https://vercel.live'], // Explicitly allow script elements from Vercel
            styleSrc: ["'self'", 'https://fonts.googleapis.com', 'https://vercel.com'], // Allow styles from your domain and Google Fonts
            styleSrcElem: ["'self'", 'https://vercel.com'], // Explicitly allow style elements from Vercel
            imgSrc: ["'self'", 'data:', 'https://vercel.com'], // Allow images from your domain, data URIs, and Vercel
            connectSrc: ["'self'", 'https://vercel.live', 'https://*.pusher.com', 'wss://*.pusher.com'], // Allow connections to specified domains
            fontSrc: ["'self'", 'https://vercel.live'], // Allow fonts from Vercel
            frameSrc: ["'self'", 'https://vercel.live'], // Allow frames from Vercel
        },
    },
}));

// Configure CORS
app.use(cors({
    origin: 'https://dataanalytics-frontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.static('public/uploads')); // Serve static files

// Define routes
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);


app.use('/api/leave11',leaveRouter11)

app.use('/api/setting', settingRouter);
app.use('/api/dashboard', dashboardRouter);
// app.use('/api/form-templates', formTemplateRouter);

// Connect to the database and create initial admin user
const startServer = async () => {
    try {
        await connectToDatabase();
        await userRegister(); // Ensure initial users are registered if needed
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1); // Exit the process if there's an error
    }
};

startServer();