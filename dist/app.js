"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser")); // accept json body in POST / PUT requests
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc")); // api doc generator
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const mongoose_1 = __importDefault(require("mongoose")); // mongodb access lib
// controllers
const gamesRoutes_1 = __importDefault(require("./routes/gamesRoutes"));
const app = (0, express_1.default)();
// configure app globally to parse http request bodies as json
app.use(body_parser_1.default.json());
// db connection
const dbUri = process.env.DB;
mongoose_1.default.connect(dbUri)
    .then(() => { console.log('Connected to MongoDB'); })
    .catch((err) => { console.log(`Connection Failed: ${err.message}`); });
// url dispatching
app.use('/api/v1/games', gamesRoutes_1.default);
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
};
const openApiSpecs = (0, swagger_jsdoc_1.default)(options);
app.use('/api-docs', swagger_ui_express_1.default.serve);
// hard-code swagger css & js links using public Content Delivery Network (CDN)
app.get('/api-docs', (req, res) => {
    const html = swagger_ui_express_1.default.generateHTML(openApiSpecs, {
        customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
        ]
    });
    res.send(html);
});
app.listen(4000, () => { console.log('Server running on port 4000'); });
