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
const studentModel_1 = __importDefault(require("../people/studentModel"));
const LessonsModel_1 = __importDefault(require("./LessonsModel"));
const LessonStudentModel_1 = __importDefault(require("./LessonStudentModel"));
const { Op } = sequelize_1.default;
const lessonApi = express_1.default.Router();
lessonApi
    .get('/teacher', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teacherId } = req.body;
        const Lessons = yield LessonsModel_1.default.findAll({ where: { teacherId: teacherId } });
        const LessonsJson = Lessons.map(e => e.toJSON());
        res.json(LessonsJson);
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}))
    .get('/teacher/:lessonId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lessonId } = req.params;
    try {
        const lessonStuden = yield LessonStudentModel_1.default.findAll({
            attributes: ['studentId'],
            where: { lessonId: lessonId }
        });
        const Students = yield studentModel_1.default.findAll({
            where: {
                id: {
                    [Op.or]: lessonStuden.map(e => e.studentId)
                }
            }
        });
        const alumnData;
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}));
exports.default = lessonApi;
