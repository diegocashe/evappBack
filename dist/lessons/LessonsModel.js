"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DbConnection_1 = __importDefault(require("../config/DbConnection"));
const sequelize_1 = require("sequelize");
const teacherModel_1 = __importDefault(require("../people/teacherModel"));
class Lesson extends sequelize_1.Model {
}
;
Lesson.init({
    id: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    teacherId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: teacherModel_1.default,
            key: 'id',
        }
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    duration: { type: sequelize_1.DataTypes.STRING, defaultValue: '2 weeks' },
    description: { type: sequelize_1.DataTypes.STRING, defaultValue: null },
    code: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV4 },
}, { sequelize: DbConnection_1.default });
exports.default = Lesson;
