"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DbConnection_1 = __importDefault(require("../config/DbConnection"));
const sequelize_1 = require("sequelize");
const LessonStudentModel_1 = __importDefault(require("./LessonStudentModel"));
class Homework extends sequelize_1.Model {
}
;
Homework.init({
    id: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    lessonStudentId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: LessonStudentModel_1.default,
            key: 'id',
        }
    },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    limitDate: { type: sequelize_1.DataTypes.DATE, defaultValue: null },
    percent: { type: sequelize_1.DataTypes.DOUBLE, allowNull: false }
}, { sequelize: DbConnection_1.default });
exports.default = Homework;
