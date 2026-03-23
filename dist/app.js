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
const passport_1 = __importDefault(require("passport")); // authentication middleware
const passport_jwt_1 = require("passport-jwt"); // jwt strategy for passport
// controllers
const gamesRoutes_1 = __importDefault(require("./routes/gamesRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
//models 
const user_1 = require("./models/user");
const app = (0, express_1.default)();
// configure app globally to parse http request bodies as json
app.use(body_parser_1.default.json());
// db connection
const dbUri = process.env.DB;
mongoose_1.default.connect(dbUri)
    .then(() => { console.log('Connected to MongoDB'); })
    .catch((err) => { console.log(`Connection Failed: ${err.message}`); });
app.use(passport_1.default.initialize()); // initialize passport for authentication
passport_1.default.use(user_1.User.createStrategy()); // use passport-local-mongoose strategy for authentication
passport_1.default.serializeUser(user_1.User.serializeUser()); // serialize user for session management
passport_1.default.deserializeUser(user_1.User.deserializeUser()); // deserialize user for session management
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(), // extract jwt from Authorization header
    secretOrKey: process.env.PASSPORT_SECRET // secret key for signing and verifying jwt
};
const strategy = new passport_jwt_1.Strategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await user_1.User.findById(jwtPayload.id); // find user by id in jwt payload
        if (!user)
            throw new Error('Invalid User Token');
        return done(null, user); // authentication successful
    }
    catch (error) {
        return done(error, null); // error occurred during authentication
    }
});
passport_1.default.use(strategy); // use jwt strategy for authentication
// url dispatching
app.use('/api/v1/games', gamesRoutes_1.default);
app.use('/api/v1/users', usersRoutes_1.default);
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
