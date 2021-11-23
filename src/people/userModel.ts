import sequelize from '../config/DbConnection';
import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import { type } from 'os';

export interface UserAtributtes {
    id: string,
    firstName: string,
    lastName:string,
    email: string,
    password: string,
    state: boolean,
    lastAccess: Date,
    userType:number,
    //optional values
    phone:string,
    mobile:string,
    address:string,
    city:string,
    country:string,
    zip:string,
    code:string,
    birthday:Date,
    passport:string,
    photo:string,
    ci:string,
    rate:number,
}

interface UserCreationAttributes extends Optional<UserAtributtes, "id"|"phone"|"mobile"|"address"|"city"|"country"|"zip"|"code"|"birthday"|"passport"|"photo"|"ci"|"rate"> { }


class User extends Model<UserAtributtes, UserCreationAttributes> implements UserAtributtes {
    public id!: string; // Note that the `null assertion` `!` is required in strict mode.
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public state!: boolean;
    public lastAccess!: Date;
    public userType!: number;
    
    public phone!: string;
    public mobile!: string;
    public address!: string;
    public city!: string;
    public country!: string;
    public zip!: string;
    public code!: string;
    public birthday!: Date;
    public passport!: string;
    public photo!: string;
    public ci!: string;
    public rate!:number;


    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

User.init(
    {
        id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        firstName: {type: DataTypes.STRING, allowNull:false},
        lastName: {type: DataTypes.STRING, allowNull:false},
        email: {type: DataTypes.STRING, allowNull:false, unique:true},
        password: {type: DataTypes.STRING, allowNull:false},
        state: {type: DataTypes.BOOLEAN, allowNull:false},
        lastAccess: {type: DataTypes.DATE, allowNull:false},
        userType: {type: DataTypes.INTEGER, allowNull:false},
        // optional values
        phone: {type: DataTypes.STRING, defaultValue:null, unique:true},
        mobile: {type: DataTypes.STRING, defaultValue:null, unique:true},
        address: {type: DataTypes.STRING, defaultValue:null},
        city: {type: DataTypes.STRING, defaultValue:null},
        country: {type: DataTypes.STRING, defaultValue:null},
        zip: {type: DataTypes.STRING, defaultValue:null},
        code: {type: DataTypes.STRING, defaultValue:null},
        birthday: {type: DataTypes.DATE, defaultValue:null},
        passport: {type: DataTypes.STRING, defaultValue:null},
        photo: {type: DataTypes.STRING, defaultValue:null},
        ci: {type: DataTypes.STRING, defaultValue:null, unique:true},
        rate: {type: DataTypes.DOUBLE, defaultValue:null},

    },
    { sequelize }
)

export default User;
