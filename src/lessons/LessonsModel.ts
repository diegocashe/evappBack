import sequelize from '../config/DbConnection';
import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import User from '../people/userModel';
import Teacher from '../people/teacherModel';

interface LessonAtributtes {
    id: string,
    name: string,
    duration: string,
    description: string
    teacherId: string,
    code: string
}

interface LessonCreationAttributes extends Optional<LessonAtributtes, "id" | "code"> { }


class Lesson extends Model<LessonAtributtes, LessonCreationAttributes> implements LessonAtributtes {
    public id!: string; // Note that the `null assertion` `!` is required in strict mode.
    public name!: string;
    public duration!: string;
    public description!: string;
    public teacherId!: string;
    public code!: string;


    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

Lesson.init(
    {
        id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        teacherId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Teacher,
                key: 'id',
            }
        },
        name: { type: DataTypes.STRING, allowNull: false },
        duration: { type: DataTypes.STRING, defaultValue: '2 weeks' },
        description: { type: DataTypes.STRING, defaultValue: null },
        code: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4 },
    },
    { sequelize }
)

export default Lesson