import express from 'express';
import sequelize from './config/dbConfig.js';
import userRoutes from './src/routes/userRoutes.js';
import transferRoutes from './src/routes/transferRoutes.js';
import setupStaticFiles from './src/middlewares/staticFile.js';
import { ErrorHandler } from './src/middlewares/ErrorHandler.js';

const app = express();
const PORT = 3000;

setupStaticFiles(app)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ErrorHandler);

app.use(userRoutes);
app.use(transferRoutes);





sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`\nServidor corriendo en http://localhost:${PORT}`);
    });
});