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
const LessonsModel_1 = __importDefault(require("../lessons/LessonsModel"));
const LessonStudentModel_1 = __importDefault(require("../lessons/LessonStudentModel"));
const teacherModel_1 = __importDefault(require("./teacherModel"));
const userModel_1 = __importDefault(require("./userModel"));
const HomeWorkModel_1 = __importDefault(require("../lessons/HomeWorkModel"));
const sequelize_1 = __importDefault(require("sequelize"));
const { Op } = sequelize_1.default;
const resumeApi = express_1.default.Router();
resumeApi
    .get('/teacher/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, teacherId } = req.params;
    try {
        const user = yield userModel_1.default.findOne({ where: { id: userId } });
        if (user === null)
            throw new Error("Usuario no existe");
        const teacher = yield teacherModel_1.default.findOne({ where: { userId: userId } });
        if (teacher === null)
            throw new Error("profesor no existe");
        const lesson = yield LessonsModel_1.default.findAll({ where: { teacherId: teacher.id } });
        const lSConditionObject = lesson.map(e => ({ lessonId: e.id }));
        const lessonStudents = yield LessonStudentModel_1.default.findAll({ where: { [Op.or]: lSConditionObject } });
        const homeworksByTeacher = yield HomeWorkModel_1.default.findAll({
            where: {
                [Op.or]: lessonStudents.map(e => ({ lessonStudentId: e.id }))
            }
        });
        res.json({
            dictedLessons: lesson.map(e => e.toJSON()),
            homeworksByTeacher: homeworksByTeacher.map(e => e.toJSON()),
            homeworkState: {
                aprobed: homeworksByTeacher.filter(e => { if (e.value >= 10 && e.value)
                    return e.toJSON(); }),
                reprobed: homeworksByTeacher.filter(e => { if (e.value < 10 && e.value)
                    return e.toJSON(); }),
                pending: homeworksByTeacher.filter(e => { if (e.value === null)
                    return e.toJSON(); })
            }
        });
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}));
exports.default = resumeApi;
