import sequelize from '../config/DbConnection';
import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import User from '../people/userModel';
import Teacher from '../people/teacherModel';
import Lesson from './LessonsModel';

interface PublicationAtributtes {
    id: string,
    name:string,
    title:string,
    type:string,
    content: string
    lessonId: string,
}

interface PublicationCreationAttributes extends Optional<PublicationAtributtes, "id"> { }


class Publication extends Model<PublicationAtributtes, PublicationCreationAttributes> implements PublicationAtributtes {
    public id!: string; // Note that the `null assertion` `!` is required in strict mode.
    public name!:string;
    public title!:string;
    public type!:string;
    public content!:string;
    public lessonId!: string;


    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

Publication.init(
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
        name:{type: DataTypes.STRING, allowNull:false},
        title:{type: DataTypes.STRING, allowNull:false},
        content:{type: DataTypes.TEXT, allowNull:false},
        type:{type: DataTypes.ENUM(), allowNull:false, values:['article', 'publication']},
    },
    { sequelize }
)

export default Publication