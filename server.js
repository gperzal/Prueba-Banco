import express from 'express';
import sequelize from './config/dbConfig.js';
import userRoutes from './src/routes/userRoutes.js';
import transferRoutes from './src/routes/transferRoutes.js';

import { ErrorHandler } from './src/middlewares/ErrorHandler.js';

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/transfers', transferRoutes);

app.use(ErrorHandler);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`\nServidor corriendo en http://localhost:${PORT}`);
    });
});