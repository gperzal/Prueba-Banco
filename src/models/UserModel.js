import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbConfig.js'; // Importa la instancia de conexión

const User = sequelize.define('User', {
    // Atributos del modelo
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
    },

}, {
    timestamps: false
});

// No olvides sincronizar el modelo con la base de datos
await User.sync();
export default User;