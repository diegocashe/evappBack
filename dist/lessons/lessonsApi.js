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
const teacherModel_1 = __importDefault(require("../people/teacherModel"));
const userModel_1 = __importDefault(require("../people/userModel"));
const HomeWorkModel_1 = __importDefault(require("./HomeWorkModel"));
const LessonsModel_1 = __importDefault(require("./LessonsModel"));
const LessonStudentModel_1 = __importDefault(require("./LessonStudentModel"));
const { Op } = sequelize_1.default;
const lessonApi = express_1.default.Router();
lessonApi
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
}))
    .post('/teacher', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const teacher = yield teacherModel_1.default.findOne({ where: { userId: userId } });
        const Lessons = yield LessonsModel_1.default.findAll({ where: { teacherId: teacher === null || teacher === void 0 ? void 0 : teacher.id } });
        const teacherInfo = yield userModel_1.default.findOne({
            attributes: [`firstName`, `lastName`, `email`, `phone`, `mobile`, `address`, `city`, `country`, `zip`, `code`],
            where: { id: teacher === null || teacher === void 0 ? void 0 : teacher.userId }
        });
        const LessonsJson = Lessons.map(e => e.toJSON());
        res.json({
            teacher: teacherInfo === null || teacherInfo === void 0 ? void 0 : teacherInfo.toJSON(),
            lessons: LessonsJson
        });
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}))
    .get('/teacher/:lessonId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonId } = req.params;
        const lessonStudent = yield LessonStudentModel_1.default.findAll({ where: { lessonId: lessonId } });
        const lSConditionObject = lessonStudent.map(e => {
            return { id: e.studentId };
        });
        if (lessonStudent.length === 0) {
            res.json({ message: 'no existen alumnos en la clase' });
        }
        if (lessonStudent.length !== 0) {
            const Students = yield studentModel_1.default.findAll({
                where: { [Op.or]: lSConditionObject }
            });
            const alumnData = yield userModel_1.default.findAll({
                attributes: [`id`, `firstName`, `lastName`, `email`, `lastAccess`, `phone`, `mobile`, `address`, `city`, `country`, `zip`, `code`],
                where: {
                    id: {
                        [Op.or]: Students.map(e => e.userId)
                    }
                }
            });
            // const responce = { students: alumnData }
            const responce = alumnData;
            res.json(responce);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}))
    .put('/student/:userId/:code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, code } = req.params;
    try {
        const user = yield userModel_1.default.findByPk(userId);
        if (!user)
            throw new Error("User dosn´t exist");
        const student = yield studentModel_1.default.findOne({ where: { userId: user.id } });
        if (!student)
            throw new Error("Not is an student");
        const lessonSelected = yield LessonsModel_1.default.findOne({ where: { code: code } });
        if (!lessonSelected)
            throw new Error("Class doesn´t exist");
        // //usar find or create cuando se tenga acceso a la documentacion de sequelice
        // let lessonStudent = await LessonStudent.findOne({
        //     where: {
        //         studentId: student.id,
        //         lessonId: lessonSelected.id
        //     }
        // })
        const [lessonStudent, f] = yield LessonStudentModel_1.default.findOrCreate({
            where: {
                studentId: student.id,
                lessonId: lessonSelected.id
            }
        });
        if (!f) {
            res.json({ message: 'Already regitered in the class' });
            return;
        }
        if (f) {
            // busco la clase en otro alumno ya asignado para obtener las tareas existentes
            const oldLessonStudent = yield LessonStudentModel_1.default.findOne({
                where: {
                    lessonId: lessonSelected.id,
                    studentId: { [Op.not]: student.id }
                }
            });
            if (oldLessonStudent) {
                const oldHW = yield HomeWorkModel_1.default.findAll({ where: { lessonStudentId: oldLessonStudent.id } });
                const oldAssignedHW = yield HomeWorkModel_1.default.bulkCreate(oldHW.map(e => {
                    return {
                        title: e.title,
                        description: e.description,
                        limitDate: e.limitDate,
                        lessonStudentId: lessonStudent.id,
                        percent: e.percent,
                        base: e.base,
                    };
                }));
            }
        }
        res.json({ message: 'Sussefully register in the class' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.statusCode = 404;
            res.json({ message: 'Cannot add the class', error: error.message });
        }
    }
}))
    .get('/student/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const student = yield studentModel_1.default.findOne({ where: { userId } });
        if (!student)
            throw new Error("Student doesn´t exist");
        const lessonStudent = yield LessonStudentModel_1.default.findAll({ where: { studentId: student.id } });
        const lessons = yield LessonsModel_1.default.findAll({
            where: {
                [Op.or]: lessonStudent.map(e => ({ id: e.lessonId }))
            }
        });
        const jsonLessons = lessons.map(e => e.toJSON());
        res.statusCode = 200;
        res.json({ lessons: jsonLessons });
    }
    catch (error) {
        if (error instanceof Error) {
            res.statusCode = 400;
            res.send({ error: error.message });
        }
    }
}));
exports.default = lessonApi;
