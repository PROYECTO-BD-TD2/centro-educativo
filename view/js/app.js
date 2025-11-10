// app.js - Archivo principal de la aplicación

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Función principal de inicialización
function initApp() {
    console.log('Iniciando aplicación...');
    
    // Inicializar módulos
    initAlumnos();
    initProfesores();
    initCursos();
    initCalificaciones();
    initInscripciones();
    
    // Configurar navegación
    setupNavigation();
    
    // Cargar datos iniciales
    loadAlumnos();
    
    console.log('Aplicación iniciada correctamente');
}

// Configurar navegación entre secciones
function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Actualizar estado activo en el menú
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Mostrar sección específica
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Cargar datos de la sección
        loadSectionData(sectionName);
    }
}

// Cargar datos según la sección
function loadSectionData(section) {
    switch(section) {
        case 'alumnos':
            loadAlumnos();
            break;
        case 'profesores':
            loadProfesores();
            break;
        case 'cursos':
            loadCursos();
            break;
        case 'calificaciones':
            loadCalificaciones();
            break;
        case 'inscripciones':
            loadInscripciones();
            break;
    }
}

// ==================== UTILIDADES ====================

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

// Mostrar mensaje de éxito
function showSuccess(message) {
    showToast(message, 'success');
}

// Mostrar mensaje de error
function showError(message) {
    showToast(message, 'danger');
}

// Mostrar toast notification
function showToast(message, type = 'info') {
    // Crear elemento de toast
    const toastContainer = getOrCreateToastContainer();
    
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.id = toastId;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Eliminar el toast después de que se oculte
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Obtener o crear contenedor de toasts
function getOrCreateToastContainer() {
    let container = document.getElementById('toastContainer');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    return container;
}

// Mostrar alerta personalizada
function showAlert(title, message, type = 'info') {
    const iconMap = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        danger: 'fa-exclamation-circle'
    };
    
    const colorMap = {
        info: 'primary',
        success: 'success',
        warning: 'warning',
        danger: 'danger'
    };
    
    const icon = iconMap[type] || iconMap.info;
    const color = colorMap[type] || colorMap.info;
    
    const alertHTML = `
        <div class="modal fade" id="customAlert" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-${color} text-white">
                        <h5 class="modal-title">
                            <i class="fas ${icon} me-2"></i>${title}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${message}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Eliminar modal anterior si existe
    const oldAlert = document.getElementById('customAlert');
    if (oldAlert) oldAlert.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', alertHTML);
    
    const modal = new bootstrap.Modal(document.getElementById('customAlert'));
    modal.show();
    
    // Limpiar después de cerrar
    document.getElementById('customAlert').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Mostrar diálogo de confirmación
function showConfirm(title, message) {
    return new Promise((resolve) => {
        const confirmHTML = `
            <div class="modal fade" id="customConfirm" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-dark">
                            <h5 class="modal-title">
                                <i class="fas fa-exclamation-triangle me-2"></i>${title}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${message}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btnCancelConfirm">
                                Cancelar
                            </button>
                            <button type="button" class="btn btn-danger" id="btnAcceptConfirm">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Eliminar modal anterior si existe
        const oldConfirm = document.getElementById('customConfirm');
        if (oldConfirm) oldConfirm.remove();
        
        // Agregar nuevo modal
        document.body.insertAdjacentHTML('beforeend', confirmHTML);
        
        const modalElement = document.getElementById('customConfirm');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Manejar botones
        document.getElementById('btnAcceptConfirm').addEventListener('click', function() {
            modal.hide();
            resolve(true);
        });
        
        document.getElementById('btnCancelConfirm').addEventListener('click', function() {
            modal.hide();
            resolve(false);
        });
        
        // Limpiar después de cerrar
        modalElement.addEventListener('hidden.bs.modal', function() {
            this.remove();
            resolve(false);
        });
    });
}

// Validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}