import User from '../models/UserModel.js';
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
};


export const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id; // Obtener el ID del usuario desde los parámetros de la ruta
        const user = await User.findByPk(id);

        if (user) {
            res.json(user); // Si el usuario existe, devolver los datos del usuario
        } else {
            res.status(404).send('Usuario no encontrado'); // Si no se encuentra el usuario, devolver un error 404
        }
    } catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores
    }
};



export const createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { nombre, balance } = req.body;

    try {
        const user = await User.findByPk(id);

        if (user) {
            user.nombre = nombre;
            user.balance = balance;
            await user.save();
            res.json(user);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (user) {
            await user.destroy();
            res.send('Usuario eliminado con éxito');
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        next(error);
    }
};
