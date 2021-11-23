"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DbConnection_1 = __importDefault(require("../config/DbConnection"));
const sequelize_1 = require("sequelize");
const LessonsModel_1 = __importDefault(require("./LessonsModel"));
const studentModel_1 = __importDefault(require("../people/studentModel"));
class LessonStudent extends sequelize_1.Model {
}
;
LessonStudent.init({
    id: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    lessonId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: LessonsModel_1.default,
            key: 'id',
        }
    },
    studentId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: studentModel_1.default,
            key: 'id',
        }
    },
    inscription: { type: sequelize_1.DataTypes.DATE, defaultValue: new Date() },
}, { sequelize: DbConnection_1.default });
exports.default = LessonStudent;
