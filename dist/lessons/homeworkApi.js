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
const studentModel_1 = __importDefault(require("../people/studentModel"));
const userModel_1 = __importDefault(require("../people/userModel"));
const HomeWorkModel_1 = __importDefault(require("./HomeWorkModel"));
const LessonsModel_1 = __importDefault(require("./LessonsModel"));
const LessonStudentModel_1 = __importDefault(require("./LessonStudentModel"));
const homeworkApi = express_1.default.Router();
homeworkApi
    .post('/:lessonId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonId } = req.params;
        const { title, description, limitDate, percent, base } = req.body;
        const lessonStudent = yield LessonStudentModel_1.default.findAll({
            where: { lessonId: lessonId }
        });
        if (lessonStudent === null)
            throw new Error("Lesson students its nulll");
        const homeworks = yield HomeWorkModel_1.default.bulkCreate(lessonStudent.map(e => ({ title, description, limitDate: new Date(limitDate), percent, base, lessonStudentId: e.id })));
        res.json({ message: "Tarea agregada con éxito" });
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}))
    .get('/:lessonId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let message;
    try {
        const { lessonId } = req.params;
        const lessonStudent = yield LessonStudentModel_1.default.findAll({
            where: { lessonId: lessonId }
        });
        if (lessonStudent === null)
            throw new Error("Lesson students its nulll");
        if (lessonStudent.length === 0)
            message = 'No hay estudiantes en la clase';
        const homeworks = lessonStudent.map((e) => __awaiter(void 0, void 0, void 0, function* () {
            const student = yield studentModel_1.default.findOne({ where: { id: e.studentId } });
            const studentData = yield userModel_1.default.findOne({ where: { id: student === null || student === void 0 ? void 0 : student.userId } });
            const hw = yield HomeWorkModel_1.default.findAll({ where: { lessonStudentId: e.id } });
            const result = { user: studentData === null || studentData === void 0 ? void 0 : studentData.toJSON(), homeworks: hw.map(v => v.toJSON()) };
            return result;
        }));
        const lesson = (_a = (yield LessonsModel_1.default.findOne({ where: { id: lessonId } }))) === null || _a === void 0 ? void 0 : _a.toJSON();
        // AQUI ABAJO SE DEBE QUITAR LA PROPIEDAD HOMEWORKS[0].USER.PASSWORD POR SEGURIDAD 
        Promise.all(homeworks).then(values => {
            // console.log(values)
            res.json({ lesson: lesson, studentHomeworks: values });
        }).catch(error => res.json({ error: 'error' }));
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}))
    .post('/:lessonId/:studentId/:homeworkId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonId, studentId, homeworkId } = req.params;
        // console.log(homeworkId)
        const homework = yield HomeWorkModel_1.default.findOne({ where: { id: homeworkId } });
        if (homework === null)
            throw new Error("No existe la tarea");
        homework.value = Number.parseInt(req.body.value);
        yield homework.save();
        res.statusCode = 200;
        res.json({ message: 'Homework value saved' });
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.json({ error: e.message });
        }
    }
}))
    .post('/:lessonId/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lessonId } = req.params;
    try {
        const { title, description, base, limitDate, percent, } = req.body;
        const lessonStudents = yield LessonStudentModel_1.default.findAll({
            where: { lessonId }
        });
        const hWCreationObjects = lessonStudents.map(lS => ({
            lessonStudentId: lS.id,
            title,
            description,
            base,
            limitDate,
            percent,
        }));
        const homeworks = yield HomeWorkModel_1.default.bulkCreate(hWCreationObjects);
        Promise.all(homeworks)
            .then(hW => {
            res.json({
                message: 'Created sussesfully',
                homeworks: hW
            });
        })
            .catch(error => res.json({ message: 'Cannot create the homeworks' }));
    }
    catch (e) {
        if (e instanceof Error) {
            res.statusCode = 400;
            res.send({ error: e.message });
        }
    }
}))
    .put('/student/:homeworkId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { homeworkId } = req.params;
    try {
        const homework = yield HomeWorkModel_1.default.findByPk(homeworkId);
        if (!homework)
            throw new Error("No existe la tarea");
        homework.file = req.body.file;
        yield homework.save();
        res.json({ message: 'homework succesfully delivered' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.statusCode = 400;
            res.send({ error: error.message });
        }
    }
}));
exports.default = homeworkApi;
