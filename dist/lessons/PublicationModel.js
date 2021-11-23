"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DbConnection_1 = __importDefault(require("../config/DbConnection"));
const sequelize_1 = require("sequelize");
const LessonsModel_1 = __importDefault(require("./LessonsModel"));
class Publication extends sequelize_1.Model {
}
;
Publication.init({
    id: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    lessonId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: LessonsModel_1.default,
            key: 'id',
        }
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    type: { type: sequelize_1.DataTypes.ENUM(), allowNull: false, values: ['article', 'publication'] },
}, { sequelize: DbConnection_1.default });
exports.default = Publication;
