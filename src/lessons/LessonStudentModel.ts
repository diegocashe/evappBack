import sequelize from '../config/DbConnection';
import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import User from '../people/userModel';
import Teacher from '../people/teacherModel';
import Lesson from './LessonsModel';
import Student from '../people/studentModel';

interface LessonStudentAtributtes {
    id: string,
    lessonId:string,
    studentId:string,
    inscription:Date,
}

interface LessonStudentCreationAttributes extends Optional<LessonStudentAtributtes, "id" | "inscription"> { }


class LessonStudent extends Model<LessonStudentAtributtes, LessonStudentCreationAttributes> implements LessonStudentAtributtes {
    public id!: string; // Note that the `null assertion` `!` is required in strict mode.
    public lessonId!:string;
    public studentId!:string;
    public inscription!:Date;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

LessonStudent.init(
    {
        id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        lessonId: {
            type: DataTypes.STRING, 
            allowNull:false,
            references: {
                model: Lesson,
                key: 'id',
            }
        },
        studentId:{
            type: DataTypes.STRING, 
            allowNull:false,
            references: {
                model: Student,
                key: 'id',
            }},
        inscription:{type: DataTypes.DATE, defaultValue:new Date()},
    },
    { sequelize }
)

export default LessonStudent