import express from 'express';
import { Express } from 'express';
import morgan from 'morgan'
import cors from 'cors'
import logInApi from '../auth/loginApi';
import singInApi from '../auth/signinAPI';
import profileApi from '../people/profileApi';
import lessonApi from '../lessons/lessonsApi';
import homeworkApi from '../lessons/homeworkApi';
import resumeApi from '../people/resumeApi'

// init
const app: Express = express()

// settings 
app.set('port', process.env.port || 7000)
 
// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use('/login', logInApi);
app.use('/signin', singInApi);
app.use('/profile', profileApi)
app.use('/lessons', lessonApi)
app.use('/homework', homeworkApi)
app.use('/resume', resumeApi)

export default app;
