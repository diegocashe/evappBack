import sequelize from '../config/DbConnection';
import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import User from './userModel';

interface StudentAtributtes {
    id: string,
    userId: string,
}

interface StudentCreationAttributes extends Optional<StudentAtributtes, "id"> { }


class Student extends Model<StudentAtributtes, StudentCreationAttributes> implements StudentAtributtes {
    public id!: string; // Note that the `null assertion` `!` is required in strict mode.
    public userId!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

Student.init(
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

export default Student