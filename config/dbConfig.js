import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
//process.loadEnvFile();

const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        host: process.env.PGHOST,
        dialect: process.env.PGDIALECT,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        }
    });


sequelize.authenticate()
    .then(() => console.log('\nConexión con la base de datos establecida.'))
    .catch(err => console.error('Error al conectarse a la base de datos:', err));


export default sequelize;

