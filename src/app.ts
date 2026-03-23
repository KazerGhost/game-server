import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser'; // accept json body in POST / PUT requests
import swaggerJsDoc from 'swagger-jsdoc'; // api doc generator
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';  // mongodb access lib
import passport from 'passport'; // authentication middleware
import { Strategy, ExtractJwt } from 'passport-jwt'; // jwt strategy for passport
import cookieParser from 'cookie-parser'; // parse cookies in http requests

// controllers
import gamesRouter from './routes/gamesRoutes';
import usersRouter from './routes/usersRoutes';
//models 
import { User } from './models/user';

const app: Application = express();

// configure app globally to parse http request bodies as json
app.use(bodyParser.json());
app.use(cookieParser());

// db connection
const dbUri = process.env.DB!;

mongoose.connect(dbUri)
.then(() => { console.log('Connected to MongoDB') })
.catch((err: Error) => { console.log(`Connection Failed: ${err.message}`) });

app.use(passport.initialize()); // initialize passport for authentication

passport.use(User.createStrategy()); // use passport-local-mongoose strategy for authentication

passport.serializeUser(User.serializeUser()); // serialize user for session management
passport.deserializeUser(User.deserializeUser()); // deserialize user for session management

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extract jwt from Authorization header
    secretOrKey: process.env.PASSPORT_SECRET! // secret key for signing and verifying jwt
};

const strategy = new Strategy(jwtOptions, async (jwtPayload, done) => {
    try
    {
        const user = await User.findById(jwtPayload.id); // find user by id in jwt payload

        if (!user) throw new Error('Invalid User Token');

        return done(null, user); // authentication successful
        
    }
    catch (error) {
        return done(error, null); // error occurred during authentication
    }
});

passport.use(strategy); // use jwt strategy for authentication

// url dispatching
app.use('/api/v1/games', gamesRouter);
app.use('/api/v1/users', usersRouter);

// swagger api doc config
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Games API',
            version: '1.0.0'
        }
    },
    apis: ['./dist/controllers/*.js'] // location of api methods
}

const openApiSpecs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve);

// hard-code swagger css & js links using public Content Delivery Network (CDN)
app.get('/api-docs', (req: Request, res: Response) => {
    const html: string = swaggerUi.generateHTML(openApiSpecs, {
        customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
        ]
    });

    res.send(html);
});

app.listen(4000, () => { console.log('Server running on port 4000') });