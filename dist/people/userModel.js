"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DbConnection_1 = __importDefault(require("../config/DbConnection"));
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
;
User.init({
    id: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    firstName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    lastName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    state: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    lastAccess: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    userType: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    // optional values
    phone: { type: sequelize_1.DataTypes.STRING, defaultValue: null, unique: true },
    mobile: { type: sequelize_1.DataTypes.STRING, defaultValue: null, unique: true },
    address: { type: sequelize_1.DataTypes.STRING, defaultValue: null },
    city: { type: sequelize_1.DataTypes.STRING, defaultValue: null },
    country: { type: sequelize_1.DataTypes.STRING, defaultValue: null },
    zip: { type: sequelize_1.DataTypes.STRING, defaultValue: null },
    code: { type: sequelize_1.DataTypes.STRING, defaultValue: null },
    birthday: { type: sequelize_1.DataTypes.DATE, defaultValue: null },
    passport: { type: sequelize_1.DataTypes.STRING, defaultValue: null },
    photo: { type: sequelize_1.DataTypes.STRING, defaultValue: null },
    ci: { type: sequelize_1.DataTypes.STRING, defaultValue: null, unique: true },
    rate: { type: sequelize_1.DataTypes.DOUBLE, defaultValue: null },
}, { sequelize: DbConnection_1.default });
exports.default = User;
