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
const sequelize_1 = __importDefault(require("sequelize"));
const teacherModel_1 = __importDefault(require("../people/teacherModel"));
const LessonsModel_1 = __importDefault(require("./LessonsModel"));
const { Op } = sequelize_1.default;
const homeworkApi = express_1.default.Router();
homeworkApi
    .post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, duration, description, userId, code } = req.body;
        const teacherId = ((_a = (yield teacherModel_1.default.findOne({ where: { userId: userId } }))) === null || _a === void 0 ? void 0 : _a.id) || 'f';
        const lesson = yield LessonsModel_1.default.create({
            name: name,
            duration: duration,
            description: description,
            teacherId: teacherId,
            code: code
        });
        res.json(lesson.toJSON());
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}));
exports.default = homeworkApi;
