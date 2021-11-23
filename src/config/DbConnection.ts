import { Sequelize } from 'sequelize';

const sequelize: Sequelize = new Sequelize('evapp', 'root', '', {
    host: 'localhost',
    port: 3306 || 33060,
    dialect: 'mysql',
});

export default sequelize;