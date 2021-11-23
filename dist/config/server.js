"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const loginApi_1 = __importDefault(require("../auth/loginApi"));
const signinAPI_1 = __importDefault(require("../auth/signinAPI"));
const profileApi_1 = __importDefault(require("../people/profileApi"));
const lessonsApi_1 = __importDefault(require("../lessons/lessonsApi"));
// init
const app = express_1.default();
// settings 
app.set('port', process.env.port || 7000);
// middlewares
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors_1.default());
// routes
app.use('/login', loginApi_1.default);
app.use('/signin', signinAPI_1.default);
app.use('/profile', profileApi_1.default);
app.use('/lessons', lessonsApi_1.default);
exports.default = app;
