


export function eliminarUsuario(userId) {
    const deleteUserForm = document.getElementById('deleteUserForm');
    const deleteUserModal = document.getElementById('deleteUserModal');

    deleteUserForm.dataset.userId = userId;

    deleteUserModal.showModal();

    deleteUserForm.addEventListener('submit', manejarEliminacionUsuario);
}


function manejarEliminacionUsuario(event) {
    event.preventDefault();
    console.log(event.target.dataset.userId);
    const userId = event.target.dataset.userId;

    fetch(`/api/users/${userId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }

            return response.text();
        })
        .then(() => {
            document.getElementById('deleteUserModal').close(); // Cierra el modal
            cargarContenidoUsuarios(); // Actualiza la lista de usuarios
        })
        .catch(error => {
            console.error('Error al eliminar el usuario:', error);
        });
}

function attachUserEventListeners() {
    document.querySelectorAll('.editar-usuario').forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.getAttribute('data-user-id');
            editarUsuario(userId);
        });
    });

    document.querySelectorAll('.eliminar-usuario').forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.getAttribute('data-user-id');
            eliminarUsuario(userId);
        });
    });
}


export function editarUsuario(userId) {
    // Aquí haces una llamada a tu API para obtener los datos del usuario por su ID
    fetch(`/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            // Rellena los campos del formulario con los datos del usuario
            document.getElementById('editUserName').value = user.nombre;
            document.getElementById('editUserBalance').value = user.balance;

            // Guarda el ID del usuario en el formulario para saber qué usuario actualizar
            const form = document.getElementById('editUserForm');
            form.dataset.userId = userId;

            // Muestra el modal
            const modal = document.getElementById('editUserModal');
            modal.showModal();

            // Asegúrate de que este código se ejecute después de que el modal sea visible.
            // Añade el event listener aquí.
            form.addEventListener('submit', manejarEnvioFormulario);
        })
        .catch(error => console.error('Error al obtener los datos del usuario:', error));
}

function manejarEnvioFormulario(event) {
    event.preventDefault();
    const form = event.target;
    const userId = form.dataset.userId;
    const nombre = document.getElementById('editUserName').value;
    const balance = document.getElementById('editUserBalance').value;

    // Llamada a la API para actualizar los datos del usuario
    fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, balance }),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }
        return response.json();
    }).then(data => {
        // Actualiza la tabla de usuarios directamente en el DOM.
        actualizarTablaUsuariosDOM(userId, nombre, balance);
        document.getElementById('editUserModal').close(); // Cierra el modal
    }).catch(error => {
        console.error('Error al actualizar el usuario:', error);

    });

}

function actualizarTablaUsuariosDOM(userId, nombre, balance) {
    // Encuentra la fila de la tabla con el ID de usuario correspondiente y actualiza sus valores.
    const filaUsuario = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (filaUsuario) {
        filaUsuario.querySelector(".nombre-usuario").textContent = nombre;
        filaUsuario.querySelector(".balance-usuario").textContent = balance;
    } else {

        cargarContenidoUsuarios();
    }
}

export function closeEditModal() {
    const modal = document.getElementById('editUserModal');
    const form = document.getElementById('editUserForm');
    modal.close();
    // Remueve el event listener para limpiar
    form.removeEventListener('submit', manejarEnvioFormulario);
}


export function cargarContenidoUsuarios() {
    fetch('/table/users.html')
        .then(response => response.text())
        .then(html => {
            // Reemplaza el contenido de dynamicContent con la tabla de usuarios
            const dynamicContent = document.getElementById('dynamicContent');
            dynamicContent.innerHTML = html;
            return fetch('/api/users'); // Encadena la siguiente petición fetch aquí
        })
        .then(response => response.json())
        .then(users => {
            // Inserta los usuarios en la tabla
            const tableBody = dynamicContent.querySelector('tbody');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de añadir nuevos datos

            users.forEach(user => {
                const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.balance}</td>
                <td>
                    <button class="btn btn-xs btn-info editar-usuario" data-user-id="${user.id}">Editar</button>
                    <button class="btn btn-xs btn-error eliminar-usuario" data-user-id="${user.id}">Eliminar</button>
                </td>
            </tr>
        `;
                tableBody.innerHTML += row;
            });


            attachUserEventListeners();
        })
        .catch(error => {
            console.error('Error al cargar los usuarios:', error);
        });
}


