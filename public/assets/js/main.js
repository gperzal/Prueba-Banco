document.addEventListener('DOMContentLoaded', () => {

    // Encuentra el enlace de usuarios y agrega el evento click
    document.querySelectorAll('[data-table-target]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Previene la navegación directa
            cargarContenidoUsuarios(); // Función que cargará la tabla de usuarios
        });

    });

    // Selecciona todos los botones que abren drawers y asigna eventos
    document.querySelectorAll('[data-drawer-target]').forEach(button => {
        button.addEventListener('click', function (event) {
            // Previene la propagación para evitar cerrar inmediatamente el drawer
            event.stopPropagation();
            toggleDrawer(this.getAttribute('data-drawer-target'));
        });
    });

    // Cerrar los drawers cuando se hace clic fuera
    document.addEventListener('click', function (event) {
        document.querySelectorAll('.drawer.open').forEach(drawer => {
            if (!drawer.contains(event.target)) {
                closeDrawer(drawer);
            }
        });
    });

    // Función para alternar la apertura del drawer
    function toggleDrawer(drawerId) {
        const drawer = document.getElementById(drawerId);
        drawer.classList.toggle('open');
        drawer.style.transform = drawer.classList.contains('open') ? 'translateX(0%)' : 'translateX(100%)';
    }

    // Función para cerrar un drawer específico
    function closeDrawer(drawer) {
        drawer.classList.remove('open');
        drawer.style.transform = 'translateX(100%)';
    }


    // Función para cargar la tabla de usuarios
    document.getElementById('editUserForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Previene el envío normal del formulario

        // Obtiene los valores del formulario
        const userId = this.dataset.userId; // Asegúrate de que este dato se establece correctamente
        const nombre = document.getElementById('editUserName').value;
        const balance = document.getElementById('editUserBalance').value;

        // Llamada a la API para actualizar los datos del usuario
        fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, balance }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el usuario');
                }
                return response.json();
            })
            .then(data => {
                // Cierra el modal y recarga el contenido de usuarios
                // Aquí necesitas tener una función que vuelva a cargar la tabla de usuarios
                cargarContenidoUsuarios();
                document.getElementById('editUserModal').close(); // Asegúrate de que este es el ID correcto del modal
            })
            .catch(error => {
                console.error('Error al actualizar el usuario:', error);
                // Aquí puedes manejar el error, como mostrar un mensaje al usuario
            });
    });



});


function cargarContenidoUsuarios() {
    fetch('/table/users.html')
        .then(response => response.text())
        .then(html => {
            // Reemplaza el contenido de dynamicContent con la tabla de usuarios
            const dynamicContent = document.getElementById('dynamicContent');
            dynamicContent.innerHTML = html;
            // Ahora, carga los usuarios con una llamada a la API
            fetch('/api/users')
                .then(response => response.json())
                .then(users => {
                    // Debes insertar cada usuario en la tabla
                    const tableBody = dynamicContent.querySelector('tbody');
                    tableBody.innerHTML = ''; // Limpiar la tabla antes de añadir nuevos datos

                    users.forEach(user => {
                        // Crea las filas de la tabla con los datos de los usuarios
                        const row = `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.nombre}</td>
                                <td>${user.balance}</td>
                                <td>
                                    <button class="btn btn-xs btn-info" onclick="editarUsuario(${user.id})">Editar</button>
                                    <button class="btn btn-xs btn-error" onclick="eliminarUsuario(${user.id})">Eliminar</button>
                                </td>
                            </tr>
                        `;
                        tableBody.innerHTML += row;
                    });
                    // Ocultar el skeleton y mostrar la tabla
                    document.getElementById('userTableSkeleton').classList.add('hidden');
                    document.getElementById('userTableContainer').classList.remove('hidden');
                })
                .catch(error => console.error('Error al cargar los usuarios:', error));
        })
        .catch(error => console.error('Error al cargar la tabla de usuarios:', error));
}



// Función para Eliminar un usuario// Asumiendo que tienes un botón de "Eliminar" en cada fila de la tabla que llama a esta función

// Esta función se llama cuando se hace clic en el botón de "Eliminar" de un usuario en la tabla
function confirmarEliminacion(userId) {
    const deleteUserModal = document.getElementById('deleteUserModal');
    const botonEliminar = deleteUserModal.querySelector('.btn-error');

    // Guarda el ID del usuario en el botón de eliminar del modal
    botonEliminar.dataset.userId = userId;

    // Muestra el modal de confirmación
    deleteUserModal.showModal();
}

// Añadir un controlador de eventos al botón de eliminar dentro del modal
document.querySelector('#deleteUserModal .btn-error').addEventListener('click', function () {
    const userId = this.dataset.userId; // El ID del usuario a eliminar
    eliminarUsuario(userId);
});

function eliminarUsuario(userId) {
    // Aquí iría la llamada a la API
    fetch(`/api/users/${userId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }
            // Elimina la fila de la tabla y cierra el modal
            document.querySelector(`tr[data-user-id="${userId}"]`).remove();
            document.getElementById('deleteUserModal').close();
        })
        .catch(error => {
            console.error('Error al eliminar el usuario:', error);
            // Aquí podrías mostrar un mensaje de error si fuera necesario
        });
}

// Esta función se llama cuando se hace clic en "Cancelar" en el modal de confirmación
function cerrarModalEliminar() {
    document.getElementById('deleteUserModal').close();
}



// FIN ELIMINAR USUARIO

// Función para Actualizar un usuario
function editarUsuario(userId) {
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
        // Maneja el error mostrando un mensaje al usuario, por ejemplo.
    });
    // Aquí sigue el resto de tu lógica de actualización...
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

function closeEditModal() {
    const modal = document.getElementById('editUserModal');
    const form = document.getElementById('editUserForm');
    modal.close();
    // Remueve el event listener para limpiar
    form.removeEventListener('submit', manejarEnvioFormulario);
}

// FIN EDITAR USUARIO


// Función para configurar la carga de usuarios, si es necesario.
function loadClientOptions() {
    const clients = [{ id: 1, name: 'Cliente 1' }, { id: 2, name: 'Cliente 2' }]; // Debería venir de una API
    const emisor = document.getElementById('emisorId');
    const receptor = document.getElementById('receptorId');

    clients.forEach(client => {
        let option = new Option(client.name, client.id);
        emisor.append(option.cloneNode(true));
        receptor.append(option);
    });
}

// Función para validar que emisor y receptor no sean iguales
function validateTransfer() {
    const emisor = document.getElementById('emisorId').value;
    const receptor = document.getElementById('receptorId').value;

    if (emisor === receptor) {
        alert("No puede transferirse dinero a sí mismo, debe elegir otro receptor.");
        return false; // Evita que el formulario se envíe
    }
    return true; // Permite que el formulario se envíe
}



// Cargar opciones cuando la página esté lista
async function loadClientOptions() {
    try {
        const response = await fetch('/api/users/');
        const clients = await response.json();

        const emisor = document.getElementById('emisorId');
        const receptor = document.getElementById('receptorId');

        // Limpia las opciones existentes
        emisor.innerHTML = '';
        receptor.innerHTML = '';

        // Añade las opciones a cada selector
        clients.forEach(client => {
            let option = new Option(client.nombre, client.id); // Usa 'nombre' en lugar de 'name'
            emisor.append(option.cloneNode(true));
            receptor.append(option);
        });
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
}

// Cargar opciones cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadClientOptions);






