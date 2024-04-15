export function cargarContenidoTransferencias() {
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
                    console.log('Antes de ocultar skeleton:', document.getElementById('userTableSkeleton'));
                    document.getElementById('userTableSkeleton').classList.add('hidden');
                })
                .catch(error => console.error('Error al cargar las transferencias:', error));
        })
        .catch(error => console.error('Error al cargar la tabla de transferencias:', error));
}