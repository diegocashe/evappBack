import express from "express";
import sequelize from "sequelize";

import Student from "../people/studentModel";
import User from "../people/userModel";
import Lesson from "./LessonsModel";
import LessonStudent from "./LessonStudentModel";

const { Op } = sequelize;
const lessonApi = express.Router();

lessonApi
    .get('/teacher', async (req: express.Request, res: express.Response) => {
        try {
            const { teacherId } = req.body
            const Lessons = await Lesson.findAll({ where: { teacherId: teacherId } })
            const LessonsJson = Lessons.map(e => e.toJSON())
            res.json(LessonsJson)

        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
        }
    })
    .get('/teacher/:lessonId', async (req: express.Request, res: express.Response) => {
        const { lessonId } = req.params
        try {

            const lessonStuden = await LessonStudent.findAll({
                attributes:['studentId'],
                where: { lessonId: lessonId }
            })

            const Students = await Student.findAll({
                where: {
                    id: {
                        [Op.or]: lessonStuden.map(e => e.studentId)
                    }
                }
            })

            const alumnData = User.findAll({
                attributes:[`id`,`firstName`,`lastName`,`email`,`lastAccess`,`phone`,`mobile`,`address`,`city`,`country`,`zip`,`code`],
                where:{
                    
                }
            })


        } catch (e) {
            if (e instanceof Error) {
                res.statusCode = 400;
                res.send({ error: e.message })
            }
        }
    })
    ;

export default lessonApi;