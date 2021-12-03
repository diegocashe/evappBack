import express from "express";
import Lesson from "../lessons/LessonsModel";
import LessonStudent from "../lessons/LessonStudentModel";
import Teacher from "./teacherModel";
import User from "./userModel";
import Homework from "../lessons/HomeWorkModel"

import sequelize from "sequelize";
const { Op } = sequelize;


const resumeApi = express.Router();

resumeApi
    .get('/teacher/:userId', async (req: express.Request, res: express.Response) => {
        const { userId, teacherId } = req.params
        try {
            const user = await User.findOne({ where: { id: userId } });
            if (user === null) throw new Error("Usuario no existe");
            const teacher = await Teacher.findOne({ where: { userId: userId } });
            if (teacher === null) throw new Error("profesor no existe");
            const lesson = await Lesson.findAll({ where: { teacherId: teacher.id } })
            const lSConditionObject = lesson.map(e => ({ lessonId: e.id }))
            const lessonStudents = await LessonStudent.findAll({ where: { [Op.or]: lSConditionObject } })
            const homeworksByTeacher = await Homework.findAll({
                where: {
                    [Op.or]: lessonStudents.map(e => ({ lessonStudentId:e.id}))
                }
            })

            res.json({
                dictedLessons: lesson.map(e => e.toJSON()),
                homeworksByTeacher: homeworksByTeacher.map(e => e.toJSON()),
                homeworkState: {
                    aprobed: homeworksByTeacher.filter(e => { if (e.value >= 10 && e.value) return e.toJSON() }),
                    reprobed: homeworksByTeacher.filter(e => { if (e.value < 10 && e.value) return e.toJSON() }),
                    pending: homeworksByTeacher.filter(e => { if (e.value===null) return e.toJSON() })
                }
            })
        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
        }
    })
export default resumeApi