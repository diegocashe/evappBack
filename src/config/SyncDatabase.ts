import sequelize from "../config/DbConnection";
import Teacher from "../people/teacherModel";
import User from "../people/userModel";
import bcrypt from "bcryptjs"
import Student from "../people/studentModel";
import LessonStudent from "../lessons/LessonStudentModel";
import Lesson from "../lessons/LessonsModel";
import Publication from "../lessons/PublicationModel";
import Homework from "../lessons/HomeWorkModel";

interface UserData {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    state: boolean,
    lastAccess: Date,
    userType: number
}

const AdminUser: UserData = {
    firstName: 'admin',
    lastName: 'admin',
    email: 'admin@admin.com',
    password: bcrypt.hashSync('admin', bcrypt.genSaltSync(10)),
    state: true,
    lastAccess: new Date(),
    userType: 0,
}

const lesson = {
    name: 'ASP Learning',
    duration: '2 meses',
    description: 'aprender asp. net de la manera mas sencilla e interactiva posible',
    teacherId: null,
}

const studensMock = [
    {
        firstName: 'dach',
        lastName: 'dach',
        email: 'dach@dach.com',
        password: bcrypt.hashSync('dach', bcrypt.genSaltSync(10)),
        state: true,
        lastAccess: new Date(),
        userType: 1,
    },
    {
        firstName: 'Lina',
        lastName: 'Lina',
        email: 'Lina@Lina.com',
        password: bcrypt.hashSync('Lina', bcrypt.genSaltSync(10)),
        state: true,
        lastAccess: new Date(),
        userType: 1,
    },

]

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

]

const homeworkMock = [
    {
        lessonStudentId: null,
        title: 'Evaluacion I',
        description: 'Suba un ejercicio utilizando los tipos de datos',
        limitDate: new Date('11/25/2021'),
        percent: 10
    },
    {
        lessonStudentId: null,
        title: 'Evaluacion II',
        description: 'Suba un ejercicio utilizando las estructuras condicionales',
        limitDate: new Date('11/29/2021'),
        percent: 10
    },
]

// sincronizo la base de datos.
const syncDataBase = async () => {

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        throw new Error('Unable to connect to the database');
    }

    try {
        await sequelize.sync({ force: true });
        const admin = await User.create(AdminUser);
        const teacher = await Teacher.create({ userId: admin.id });
        const lessonCreated = await Lesson.create({ ...lesson, teacherId: teacher.id });
        const BulkUser = await User.bulkCreate(studensMock);
        const studens = await Student.bulkCreate(BulkUser.map(e => ({ userId: e.id })))
        const LessonStudens = await LessonStudent.bulkCreate(studens.map((e) => ({
            lessonId: lessonCreated.id,
            studentId: e.id
        })))
        const publications = await Publication.bulkCreate(publicationMock.map(e => ({ ...e, lessonId: lessonCreated.id })));

        const homework1 = await Homework.bulkCreate(homeworkMock.map(e => ({ ...e, lessonStudentId: LessonStudens[0].id })));
        const homework2 = await Homework.bulkCreate(homeworkMock.map(e => ({ ...e, lessonStudentId: LessonStudens[1].id })));
        
        await Student.findAll();
        await Lesson.findAll();
        await Publication.findAll();
        await LessonStudent.findAll();
        await Homework.findAll()
        console.log('completed');
    } catch (e) {
        throw new Error('Unable to sync the database');
    }

};

export default syncDataBase;