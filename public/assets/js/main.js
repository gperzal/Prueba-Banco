document.addEventListener('DOMContentLoaded', () => {

    //     // Encuentra el enlace de usuarios y agrega el evento click
    //     document.querySelectorAll('[data-table-target]').forEach(button => {
    //         button.addEventListener('click', (e) => {
    //             e.preventDefault(); // Previene la navegación directa
    //             cargarContenidoUsuarios(); // Función que cargará la tabla de usuarios
    //         });

    //     });

    //     // Encuentra el enlace de usuarios y agrega el evento click
    //     document.querySelectorAll('[data-table-target]').forEach(button => {
    //         button.addEventListener('click', (e) => {
    //             e.preventDefault(); // Previene la navegación directa
    //             cargarContenidoTransferencias(); // Función que cargará la tabla de usuarios
    //         });

    //     });

    document.querySelectorAll('.linkUsuarios').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Previene la navegación directa
            cargarContenidoUsuarios(); // Función que cargará la tabla de usuarios
        });
    });

    // Encuentra el enlace de transferencias y agrega el evento click
    document.querySelectorAll('.linkTransfer').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Previene la navegación directa
            cargarContenidoTransferencias(); // Función que cargará la tabla de transferencias
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


    document.addEventListener('submit', function (event) {
        const form = event.target;

        if (form.id === ' add-client-form') {
            event.preventDefault(); // Previene el envío normal del formulario
            handleAddClientForm(form);
        } else if (form.id === 'transfer-form') {
            event.preventDefault(); // Previene el envío normal del formulario
            handleTransferForm(form);
        }

    });


});


function handleAddClientForm(form) {
    // Aquí manejas la lógica de agregar un cliente
    console.log('Manejando agregar cliente...');
    const nombre = document.getElementById('clientName').value;
    const balance = document.getElementById('clientBalance').value;

    // Prepara el objeto de datos para enviar al servidor
    const userData = {
        nombre: nombre,
        balance: balance
    };

    // Envía la solicitud POST al servidor
    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Especifica el tipo de contenido
        },
        body: JSON.stringify(userData), // Convierte los datos del usuario a JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Problema al agregar el cliente');
            }
            return response.json(); // Procesa la respuesta del servidor
        })
        .then(data => {
            console.log('Cliente agregado con éxito', data);
            // Aquí puedes actualizar la UI o cerrar el drawer si es necesario
            document.getElementById(' add-client-form').reset();
            showToast('Cliente agregado con éxito', 'success');
            cargarContenidoUsuarios();
        })
        .catch(error => {
            console.error('Error:', error);
            // Maneja errores, como mostrar una alerta al usuario
        });
}

function handleTransferForm(form) {
    // Aquí manejas la lógica de transferencia
    console.log('Manejando transferencia...');
    const emisorId = document.getElementById('emisorId').value;
    const receptorId = document.getElementById('receptorId').value;
    const monto = Number(document.getElementById('montoTransferencia').value);

    console.log(emisorId, receptorId, monto);
    // Aquí agregas la lógica para asegurarte de que el emisor y el receptor no sean el mismo
    if (!validateTransfer()) {
        // Mostrar error si es necesario
        console.error('Emisor y receptor no pueden ser el mismo.');
        return;
    }

    // Prepara el objeto de datos para enviar al servidor
    const transferData = {
        emisorId: emisorId,
        receptorId: receptorId,
        monto: monto
    };

    // Envía la solicitud POST al servidor
    fetch('/api/transfers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Especifica el tipo de contenido
        },
        body: JSON.stringify(transferData), // Convierte los datos de la transferencia a JSON
    })
        .then(response => {
            console.log(response); // Imprime la respuesta completa para depuración
            if (!response.ok) {
                // Si quieres inspeccionar el cuerpo de la respuesta cuando hay un error:
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json(); // Procesa la respuesta del servidor
        })
        .then(data => {
            console.log('Transferencia realizada con éxito', data);
            showToast('Transferencia realizada con éxito', 'success');
            // Aquí puedes actualizar la UI o cerrar el drawer si es necesario
            document.getElementById('drawer-transfer').classList.remove('open'); // Cierra el drawer
            document.getElementById('transfer-form').reset(); // Limpia el formulario
        })
        .catch(error => {
            console.error('Error:', error);
            // Maneja errores, como mostrar una alerta al usuario
        });
}




function cargarContenidoUsuarios() {
    fetch('/table/users.html')
        .then(response => response.text())
        .then(html => {
            // Reemplaza el contenido de dynamicContent con la tabla de usuarios
            const dynamicContent = document.getElementById('dynamicContent');
            dynamicContent.innerHTML = html;

            var editUserForm = document.getElementById('editUserForm');
            if (editUserForm) {
                editUserForm.addEventListener('submit', function (event) {
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
                            cargarContenidoUsuarios();
                            document.getElementById('editUserModal').close();
                        })
                        .catch(error => {
                            console.error('Error al actualizar el usuario:', error);

                        });
                });
            }


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
                    // Ocultar el skeleton y mostrar la tabla
                    document.getElementById('userTableSkeleton').classList.add('hidden');


                })
                .catch(error => console.error('Error al cargar los usuarios:', error));
        })
        .catch(error => console.error('Error al cargar la tabla de usuarios:', error));
}

function cargarContenidoTransferencias() {
    // Primero, carga la plantilla de la tabla de transferencias
    fetch('/table/transfers.html')
        .then(response => response.text())
        .then(html => {
            // Inserta el HTML en el contenedor dinámico
            document.getElementById('dynamicContent').innerHTML = html;

            // Luego, carga los datos de las transferencias
            fetch('/api/transfers')
                .then(response => response.json())
                .then(transfers => {

                    return Promise.all(transfers.map(transfer => {
                        // Aquí obtienes los nombres del emisor y receptor para cada transferencia
                        return Promise.all([
                            fetch(`/api/users/${transfer.emisorId}`).then(res => res.json()),
                            fetch(`/api/users/${transfer.receptorId}`).then(res => res.json())
                        ]).then(([emisor, receptor]) => {
                            // Agregamos los nombres de emisor y receptor al objeto de transferencia
                            transfer.nombreEmisor = emisor.nombre;
                            transfer.nombreReceptor = receptor.nombre;
                            return transfer;
                        });
                    }));
                })
                .then(transfersConNombres => {

                    // Ahora que tenemos los nombres, podemos llenar la tabla
                    const tableBody = document.querySelector('#transfersTable tbody');
                    tableBody.innerHTML = ''; // Limpiar la tabla antes de añadir nuevos datos

                    transfersConNombres.forEach(transfer => {
                        const fecha = new Date(transfer.fecha).toLocaleString();
                        const row = `
                            <tr>
                                <td>${fecha}</td>
                                <td>${transfer.nombreEmisor}</td>
                                <td>${transfer.nombreReceptor}</td>
                                <td>${transfer.monto}</td>
                            </tr>
                        `;
                        tableBody.innerHTML += row;
                    });

                    document.getElementById('userTableSkeleton').classList.add('hidden');
                })
                .catch(error => console.error('Error al cargar las transferencias:', error));
        })
        .catch(error => console.error('Error al cargar la tabla de transferencias:', error));
}



// Agregar event listener cuando el modal se muestra y está listo
function eliminarUsuario(userId) {
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

function closeEditModal() {
    const modal = document.getElementById('editUserModal');
    const form = document.getElementById('editUserForm');
    modal.close();
    // Remueve el event listener para limpiar
    form.removeEventListener('submit', manejarEnvioFormulario);
}

// FIN EDITAR USUARIO




// Función para validar que emisor y receptor no sean iguales
function validateTransfer() {
    const emisor = document.getElementById('emisorId').value;
    const receptor = document.getElementById('receptorId').value;

    if (emisor === receptor) {
        showToast('No puede transferirse dinero a sí mismo', 'info');
        return false; // Evita que el formulario se envíe
    }
    return true; // Permite que el formulario se envíe
}



function showToast(message, type) {
    // Crea el div del toast
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;

    // Agrega el mensaje al toast
    toast.textContent = message;

    // Añade el toast al DOM
    document.querySelector('.toast').appendChild(toast);

    // Elimina el toast después de 5 segundos
    setTimeout(() => {
        toast.remove();
    }, 5000);
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

document.addEventListener('DOMContentLoaded', () => {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast toast-middle toast-middle ';
    document.body.appendChild(toastContainer);
});

