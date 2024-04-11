import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbConfig.js';


export const Transfer = sequelize.define('Transfer', {
    emisorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // nombre de la tabla
            key: 'id',
        },
    },
    receptorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // nombre de la tabla
            key: 'id',
        },
    },
    monto: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: false
});


// Sincronizar con la base de datos
await Transfer.sync();
export default Transfer;