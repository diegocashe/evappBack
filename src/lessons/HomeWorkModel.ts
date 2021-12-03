import sequelize from '../config/DbConnection';
import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import User from '../people/userModel';
import Teacher from '../people/teacherModel';
import Lesson from './LessonsModel';
import LessonStudent from './LessonStudentModel';
import { type } from 'os';

interface HomeworkAtributtes {
    id: string,
    lessonStudentId:string,
    title:string,
    description:string,
    value:number,
    base:number,
    limitDate:Date,
    percent:number,
    file:string
}

interface HomeworkCreationAttributes extends Optional<HomeworkAtributtes, "id"|"value"|"file"> { }


class Homework extends Model<HomeworkAtributtes, HomeworkCreationAttributes> implements HomeworkAtributtes {
    public id!: string; // Note that the `null assertion` `!` is required in strict mode.
    public title!:string;
    public description!:string;
    public limitDate!:Date;
    public lessonStudentId!: string;
    public percent!:number;
    public base!: number;
    public value!: number;
    public file!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

Homework.init(
    {
        id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        lessonStudentId: {
            type: DataTypes.STRING, 
            allowNull:false,
            references: {
                model: LessonStudent,
                key: 'id',
            }
        },
        title:{type: DataTypes.STRING, allowNull:false},
        description:{type: DataTypes.STRING, allowNull:false},
        limitDate:{type: DataTypes.DATE, defaultValue:null},
        percent:{type:DataTypes.DOUBLE, allowNull:false},
        base:{type:DataTypes.DOUBLE, allowNull:false, defaultValue:20},
        value:{type:DataTypes.DOUBLE, defaultValue:null},
        file:{type:DataTypes.STRING, defaultValue:null}
    },
    { sequelize }
)

export default Homework