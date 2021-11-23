"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DbConnection_1 = __importDefault(require("../config/DbConnection"));
const sequelize_1 = require("sequelize");
const userModel_1 = __importDefault(require("./userModel"));
class Student extends sequelize_1.Model {
}
;
Student.init({
    id: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: userModel_1.default,
            key: 'id',
        }
    }
}, { sequelize: DbConnection_1.default });
exports.default = Student;
