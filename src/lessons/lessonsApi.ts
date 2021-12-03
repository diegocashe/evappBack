import express from "express";
import sequelize, { where } from "sequelize";
import cors from 'cors';


import Student from "../people/studentModel";
import Teacher from "../people/teacherModel";
import User from "../people/userModel";
import Homework from "./HomeWorkModel";
import Lesson from "./LessonsModel";
import LessonStudent from "./LessonStudentModel";
import { Console } from "console";

const { Op } = sequelize;
const lessonApi = express.Router();


lessonApi
    .post('/', async (req: express.Request, res: express.Response) => {
        try {
            const { name, duration, description, userId, code } = req.body

            const teacherId = (await Teacher.findOne({ where: { userId: userId } }))?.id || 'f'

            const lesson = await Lesson.create({
                name: name,
                duration: duration,
                description: description,
                teacherId: teacherId,
                code: code
            });

            res.json(lesson.toJSON())
        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
        }
    })
    .post('/teacher', async (req: express.Request, res: express.Response) => {
        try {
            const { userId } = req.body;
            const teacher = await Teacher.findOne({ where: { userId: userId } })
            const Lessons = await Lesson.findAll({ where: { teacherId: teacher?.id } })
            const teacherInfo = await User.findOne({
                attributes: [`firstName`, `lastName`, `email`, `phone`, `mobile`, `address`, `city`, `country`, `zip`, `code`],
                where: { id: teacher?.userId }
            });

            const LessonsJson = Lessons.map(e => e.toJSON())
            res.json({
                teacher: teacherInfo?.toJSON(),
                lessons: LessonsJson
            })

        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
        }
    })
    .get('/teacher/:lessonId', async (req: express.Request, res: express.Response) => {
        try {
            const { lessonId } = req.params

            const lessonStudent = await LessonStudent.findAll({ where: { lessonId: lessonId } })

            const lSConditionObject = lessonStudent.map(e => {
                return { id: e.studentId }
            })

            if (lessonStudent.length === 0) {
                res.json({ message: 'no existen alumnos en la clase' });
            }

            if (lessonStudent.length !== 0) {

                const Students = await Student.findAll({
                    where: { [Op.or]: lSConditionObject }
                })

                const alumnData = await User.findAll({
                    attributes: [`id`, `firstName`, `lastName`, `email`, `lastAccess`, `phone`, `mobile`, `address`, `city`, `country`, `zip`, `code`],
                    where: {
                        id: {
                            [Op.or]: Students.map(e => e.userId)
                        }
                    }
                })

                // const responce = { students: alumnData }
                const responce = alumnData;

                res.json(responce);
            }
        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
        }
    })
    .put('/student/:userId/:code', async (req: express.Request, res: express.Response) => {
        const { userId, code } = req.params;
        try {
            const user = await User.findByPk(userId)
            if (!user) throw new Error("User dosn´t exist");

            const student = await Student.findOne({ where: { userId: user.id } })
            if (!student) throw new Error("Not is an student");

            const lessonSelected = await Lesson.findOne({ where: { code: code } })
            if (!lessonSelected) throw new Error("Class doesn´t exist");

            // //usar find or create cuando se tenga acceso a la documentacion de sequelice
            // let lessonStudent = await LessonStudent.findOne({
            //     where: {
            //         studentId: student.id,
            //         lessonId: lessonSelected.id
            //     }
            // })

            const [lessonStudent, f] = await LessonStudent.findOrCreate({
                where: {
                    studentId: student.id,
                    lessonId: lessonSelected.id
                }
            })

            if (!f) {
                res.json({ message: 'Already regitered in the class' })
                return
            }

            if (f) {
                // busco la clase en otro alumno ya asignado para obtener las tareas existentes
                const oldLessonStudent = await LessonStudent.findOne({
                    where: {
                        lessonId: lessonSelected.id,
                        studentId: { [Op.not]: student.id }
                    }
                })

                if (oldLessonStudent) {
                    const oldHW = await Homework.findAll({ where: { lessonStudentId: oldLessonStudent.id } })
                    const oldAssignedHW = await Homework.bulkCreate(oldHW.map(e => {
                        return {
                            title: e.title,
                            description: e.description,
                            limitDate: e.limitDate,
                            lessonStudentId: lessonStudent.id,
                            percent: e.percent,
                            base: e.base,
                        }
                    }))
                }
            }

            res.json({ message: 'Sussefully register in the class' })
        } catch (error) {
            if (error instanceof Error) {
                res.statusCode = 404;
                res.json({ message: 'Cannot add the class', error: error.message })
            }
        }
    })
    .get('/student/:userId', async (req: express.Request, res: express.Response) => {
        const { userId } = req.params
        try {
            const student = await Student.findOne({ where: { userId } });
            if (!student) throw new Error("Student doesn´t exist");

            const lessonStudent = await LessonStudent.findAll({ where: { studentId: student.id } })

            const lessons = await Lesson.findAll({
                where: {
                    [Op.or]: lessonStudent.map(e => ({ id: e.lessonId }))
                }
            })
            const jsonLessons = lessons.map(e => e.toJSON())
            res.statusCode = 200
            res.json({  lessons: jsonLessons})

        } catch (error) {

            if (error instanceof Error) {
                res.statusCode = 400;
                res.send({ error: error.message })
            }
        }

    })

    ;

export default lessonApi;