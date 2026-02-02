import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser'; // accept json body in POST / PUT requests
import swaggerJsDoc from 'swagger-jsdoc'; // api doc generator
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';  // mongodb access lib

// controllers
import gamesRouter from './routes/gamesRoutes';

const app: Application = express();

// configure app globally to parse http request bodies as json
app.use(bodyParser.json());

// db connection
const dbUri = process.env.DB!;

mongoose.connect(dbUri)
.then(() => { console.log('Connected to MongoDB') })
.catch((err: Error) => { console.log(`Connection Failed: ${err.message}`) });

// url dispatching
app.use('/api/v1/games', gamesRouter);

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