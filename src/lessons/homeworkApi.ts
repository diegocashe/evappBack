import express from "express";
import sequelize, { Op } from "sequelize";
import cors from 'cors';


import Student from "../people/studentModel";
import Teacher from "../people/teacherModel";
import User from "../people/userModel";
import Homework from "./HomeWorkModel";
import Lesson from "./LessonsModel";
import LessonStudent from "./LessonStudentModel";

const homeworkApi = express.Router();

homeworkApi
    .post('/:lessonId', async (req: express.Request, res: express.Response) => {
        try {

            const { lessonId } = req.params
            const { title, description, limitDate, percent, base } = req.body

            const lessonStudent = await LessonStudent.findAll({
                where: { lessonId: lessonId }
            })

            if (lessonStudent === null) throw new Error("Lesson students its nulll");

            const homeworks = await Homework.bulkCreate(
                lessonStudent.map(e => ({ title, description, limitDate: new Date(limitDate), percent, base, lessonStudentId: e.id }))
            )

            res.json({ message: "Tarea agregada con éxito" })
        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
        }
    })
    .get('/:lessonId', async (req: express.Request, res: express.Response) => {

        let message: String;

        try {
            const { lessonId } = req.params
            const lessonStudent = await LessonStudent.findAll({
                where: { lessonId: lessonId }
            })

            if (lessonStudent === null) throw new Error("Lesson students its nulll");
            if (lessonStudent.length === 0) message = 'No hay estudiantes en la clase';

            const homeworks = lessonStudent.map(async (e) => {
                const student = await Student.findOne({ where: { id: e.studentId } })
                const studentData = await User.findOne({ where: { id: student?.userId } })
                const hw = await Homework.findAll({ where: { lessonStudentId: e.id } })
                const result = { user: studentData?.toJSON(), homeworks: hw.map(v => v.toJSON()) }
                return result
            })

            const lesson = (await Lesson.findOne({ where: { id: lessonId } }))?.toJSON();


            // AQUI ABAJO SE DEBE QUITAR LA PROPIEDAD HOMEWORKS[0].USER.PASSWORD POR SEGURIDAD 

            Promise.all(homeworks).then(values => {
                // console.log(values)
                res.json({ lesson: lesson, studentHomeworks: values })
            }).catch(error => res.json({ error: 'error' }))

        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
        }
    })
    .post('/:lessonId/:studentId/:homeworkId', async (req: express.Request, res: express.Response) => {
        try {
            const { lessonId, studentId, homeworkId } = req.params
            // console.log(homeworkId)
            const homework = await Homework.findOne({ where: { id: homeworkId } })

            if (homework === null) throw new Error("No existe la tarea");
            homework.value = Number.parseInt(req.body.value);
            await homework.save();
            res.statusCode = 200
            res.json({ message: 'Homework value saved' })

        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.json({ error: e.message })
            }
        }
    })
    .post('/:lessonId/add', async (req: express.Request, res: express.Response) => {

        const { lessonId } = req.params
        try {
            const {
                title,
                description,
                base,
                limitDate,
                percent,
            } = req.body

            const lessonStudents = await LessonStudent.findAll({
                where: { lessonId }
            })

            const hWCreationObjects = lessonStudents.map(lS => ({
                lessonStudentId: lS.id,
                title,
                description,
                base,
                limitDate,
                percent,
            }))

            const homeworks = await Homework.bulkCreate(hWCreationObjects)

            Promise.all(homeworks)
                .then(hW => {
                    res.json({
                        message: 'Created sussesfully',
                        homeworks: hW
                    })
                })
                .catch(error => res.json({ message: 'Cannot create the homeworks' }))

        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
        }
    })
    .put('/student/:homeworkId', async (req: express.Request, res: express.Response) => {
        const { homeworkId } = req.params;
        try {
            const homework = await Homework.findByPk(homeworkId)
            if(!homework) throw new Error("No existe la tarea");
            homework.file = req.body.file;
            await homework.save();
            res.json({message:'homework succesfully delivered'})
        } catch (error) {
            if (error instanceof Error) {
                res.statusCode = 400;
                res.send({ error: error.message })
            }
        }
    })


export default homeworkApi;