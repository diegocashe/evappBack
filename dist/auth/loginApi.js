"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userModel_1 = __importDefault(require("../people/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logInApi = express_1.default.Router();
logInApi
    .post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({
            where: {
                email: req.body.email
            }
        });
        // if(user) console.log(bcrypt.compareSync(req.body.password, user.password));
        if (!user || !bcryptjs_1.default.compareSync(req.body.password, user.password)) {
            throw new Error("Usuario no existe");
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user.toJSON());
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}));
exports.default = logInApi;
