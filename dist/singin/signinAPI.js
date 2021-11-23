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
const userModel_1 = __importDefault(require("../Users/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const teacherModel_1 = __importDefault(require("../teachers/teacherModel"));
const studentModel_1 = __importDefault(require("../students/studentModel"));
const singInApi = express_1.default.Router();
const setUserType = (userType, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (userType == 0)
        return (yield teacherModel_1.default.create(data));
    if (userType == 1)
        return (yield studentModel_1.default.create(data));
    throw new Error("Dont exist that user type");
});
singInApi
    .post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, userType } = req.body;
        if (!firstName || !lastName || !email || !password)
            throw new Error('Faltan datos importantes');
        if (isNaN(userType) || userType === undefined)
            throw new Error('No selecciono su tipo de usuario');
        console.log(req.body);
        const user = yield userModel_1.default.create(Object.assign(Object.assign({}, req.body), { state: true, lastAccess: new Date(), password: bcryptjs_1.default.hashSync(password, bcryptjs_1.default.genSaltSync(10)) }));
        const type = yield setUserType(user.userType, { userId: user.id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            user: Object.assign({}, user.toJSON()),
            type: Object.assign({}, type.toJSON()),
            message: 'Usuario registrado exitosamente'
        });
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}));
exports.default = singInApi;
