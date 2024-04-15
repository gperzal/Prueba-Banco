import { cargarContenidoUsuarios } from './modules/userManagement.js';
import { handleAddClientForm, handleTransferForm, loadClientOptions, closeDrawer, toggleDrawer } from './modules/drawers.js';
import { cargarContenidoTransferencias } from './modules/trasnferManagement.js';

document.addEventListener('DOMContentLoaded', () => {

    // Cargar opciones cuando la página esté lista
    loadClientOptions()


    document.getElementById('closeDrawerClient').addEventListener('click', function () {
        closeDrawer(document.getElementById('drawer-client'));
    });

    document.getElementById('closeDrawerTransfer').addEventListener('click', function () {
        closeDrawer(document.getElementById('drawer-transfer'));
    });

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


document.addEventListener('DOMContentLoaded', () => {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast toast-middle toast-middle ';
    document.body.appendChild(toastContainer);
});

