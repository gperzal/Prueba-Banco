import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbConfig.js';

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



await User.sync();
export default User;