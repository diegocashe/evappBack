"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('evapp', 'root', '', {
    host: 'localhost',
    port: 3306 || 33060,
    dialect: 'mysql',
});
exports.default = sequelize;
