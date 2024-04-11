// TransferController.js
import Transfer from '../models/TransferModel.js';
import User from '../models/UserModel.js';
import sequelize from '../../config/dbConfig.js';

export const createTransfer = async (req, res, next) => {
    const { emisorId, receptorId, monto } = req.body;
    const t = await sequelize.transaction();

    try {
        // Verificar que el emisor y el receptor existen
        const emisor = await User.findByPk(emisorId, { transaction: t });
        const receptor = await User.findByPk(receptorId, { transaction: t });

        if (!emisor || !receptor) {
            throw new Error('Emisor o receptor no encontrado');
        }

        // Verificar saldo del emisor
        if (emisor.balance < monto) {
            throw new Error('Saldo insuficiente');
        }

        // Realizar transferencia
        emisor.balance -= monto;
        receptor.balance += monto;

        await emisor.save({ transaction: t });
        await receptor.save({ transaction: t });

        // Crear registro de transferencia sin especificar la fecha
        const transfer = await Transfer.create({
            emisorId,
            receptorId,
            monto
        }, { transaction: t });

        // Comprometer la transacción
        await t.commit();

        res.status(201).json(transfer);
    } catch (error) {
        // Si hay un error, revertir la transacción
        await t.rollback();
        next(error);
    }
};


// En tu TransferController.js o un archivo similar
export const getTransfers = async (req, res, next) => {
    try {
        const transfers = await Transfer.findAll();
        res.json(transfers);
    } catch (error) {
        next(error); // Asegúrate de pasar el error al middleware de manejo de errores
    }
};


export const getTransfersByUserId = async (req, res, next) => {
    const userId = req.params.id; // Obtiene el ID del usuario desde el parámetro de ruta

    try {
        const transfers = await Transfer.findAll({
            where: {
                [Op.or]: [
                    { emisorId: userId },
                    { receptorId: userId }
                ]
            },
            // Opcional: Incluir detalles del emisor y receptor si es necesario
        });

        res.json(transfers);
    } catch (error) {
        next(error);
    }
};

export const getSentTransfersByUserId = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const sentTransfers = await Transfer.findAll({
            where: { emisorId: userId },
            // Opcional: Incluir detalles del receptor si es necesario
        });

        res.json(sentTransfers);
    } catch (error) {
        next(error);
    }
};

export const getReceivedTransfersByUserId = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const receivedTransfers = await Transfer.findAll({
            where: { receptorId: userId },
            // Opcional: Incluir detalles del emisor si es necesario
        });

        res.json(receivedTransfers);
    } catch (error) {
        next(error);
    }
};
