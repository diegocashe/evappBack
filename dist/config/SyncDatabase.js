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
const DbConnection_1 = __importDefault(require("../config/DbConnection"));
const teacherModel_1 = __importDefault(require("../people/teacherModel"));
const userModel_1 = __importDefault(require("../people/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const studentModel_1 = __importDefault(require("../people/studentModel"));
const LessonStudentModel_1 = __importDefault(require("../lessons/LessonStudentModel"));
const LessonsModel_1 = __importDefault(require("../lessons/LessonsModel"));
const PublicationModel_1 = __importDefault(require("../lessons/PublicationModel"));
const HomeWorkModel_1 = __importDefault(require("../lessons/HomeWorkModel"));
const AdminUser = {
    firstName: 'admin',
    lastName: 'admin',
    email: 'admin@admin.com',
    password: bcryptjs_1.default.hashSync('admin', bcryptjs_1.default.genSaltSync(10)),
    state: true,
    lastAccess: new Date(),
    userType: 0,
};
const lesson = {
    id: "f04c2b28-da12-4fe0-83c5-df8f51633af9",
    name: 'ASP Learning',
    duration: '2 meses',
    description: 'aprender asp. net de la manera mas sencilla e interactiva posible',
    teacherId: null,
    code: '00000'
};
const studensMock = [
    {
        firstName: 'dach',
        lastName: 'dach',
        email: 'dach@dach.com',
        password: bcryptjs_1.default.hashSync('dach', bcryptjs_1.default.genSaltSync(10)),
        state: true,
        lastAccess: new Date(),
        userType: 1,
    },
    {
        firstName: 'Lina',
        lastName: 'Lina',
        email: 'Lina@Lina.com',
        password: bcryptjs_1.default.hashSync('Lina', bcryptjs_1.default.genSaltSync(10)),
        state: true,
        lastAccess: new Date(),
        userType: 1,
    },
];
const publicationMock = [
    {
        name: 'Módulo I',
        title: 'Tipos de datos',
        type: 'article',
        content: 'Los tipos de datos son: string, number, undefined',
        lessonId: null
    },
    {
        name: 'Módulo II',
        title: 'Estructuras de control',
        type: 'publication',
        content: 'las estructuras de control se determinan como condicionales',
        lessonId: null
    }
];
const homeworkMock = [
    {
        lessonStudentId: null,
        title: 'Evaluacion I',
        description: 'Suba un ejercicio utilizando los tipos de datos',
        limitDate: new Date('11/25/2021'),
        percent: 10,
        base: 20
    },
    {
        lessonStudentId: null,
        title: 'Evaluacion II',
        description: 'Suba un ejercicio utilizando las estructuras condicionales',
        limitDate: new Date('11/29/2021'),
        percent: 10,
        base: 20
    },
];
// sincronizo la base de datos.
const syncDataBase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield DbConnection_1.default.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        throw new Error('Unable to connect to the database');
    }
    try {
        yield DbConnection_1.default.sync({ force: true });
        const admin = yield userModel_1.default.create(AdminUser);
        const teacher = yield teacherModel_1.default.create({ userId: admin.id, id: "e0e38270-2757-409b-b6c0-3cad6213b0b1" });
        const lessonCreated = yield LessonsModel_1.default.create(Object.assign(Object.assign({}, lesson), { teacherId: teacher.id }));
        const BulkUser = yield userModel_1.default.bulkCreate(studensMock);
        const studens = yield studentModel_1.default.bulkCreate(BulkUser.map(e => ({ userId: e.id })));
        const LessonStudens = yield LessonStudentModel_1.default.bulkCreate(studens.map((e) => ({
            lessonId: lessonCreated.id,
            studentId: e.id
        })));
        const publications = yield PublicationModel_1.default.bulkCreate(publicationMock.map(e => (Object.assign(Object.assign({}, e), { lessonId: lessonCreated.id }))));
        const homework1 = yield HomeWorkModel_1.default.bulkCreate(homeworkMock.map(e => (Object.assign(Object.assign({}, e), { lessonStudentId: LessonStudens[0].id }))));
        const homework2 = yield HomeWorkModel_1.default.bulkCreate(homeworkMock.map(e => (Object.assign(Object.assign({}, e), { lessonStudentId: LessonStudens[1].id }))));
        yield studentModel_1.default.findAll();
        yield LessonsModel_1.default.findAll();
        yield PublicationModel_1.default.findAll();
        yield LessonStudentModel_1.default.findAll();
        yield HomeWorkModel_1.default.findAll();
        console.log('completed');
    }
    catch (e) {
        throw new Error('Unable to sync the database');
    }
});
exports.default = syncDataBase;
