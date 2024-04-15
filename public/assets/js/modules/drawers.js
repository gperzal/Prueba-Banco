



export function handleAddClientForm(form) {
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

export function handleTransferForm(form) {
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



export async function loadClientOptions() {
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


export function toggleDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    drawer.classList.toggle('open');
    drawer.style.transform = drawer.classList.contains('open') ? 'translateX(0%)' : 'translateX(100%)';
}

// Función para cerrar un drawer específico
export function closeDrawer(drawer) {
    drawer.classList.remove('open');
    drawer.style.transform = 'translateX(100%)';
}