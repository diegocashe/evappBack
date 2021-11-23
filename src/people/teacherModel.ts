import sequelize from '../config/DbConnection';
import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import User from './userModel';

interface TeacherAtributtes {
    id: string,
    userId: string,
}

interface TeacherCreationAttributes extends Optional<TeacherAtributtes, "id"> { }


class Teacher extends Model<TeacherAtributtes, TeacherCreationAttributes> implements TeacherAtributtes {
    public id!: string; // Note that the `null assertion` `!` is required in strict mode.
    public userId!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

Teacher.init(
    {
        id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: {
            type: DataTypes.STRING, 
            allowNull:false,
            references: {
                model: User,
                key: 'id',
            }
        }
    },
    { sequelize }
)

export default Teacher;