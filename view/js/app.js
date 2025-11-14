


document.addEventListener('DOMContentLoaded', function() {
    initApp();
});


function initApp() {
    console.log('Iniciando aplicación...');
    

    initAlumnos();
    initProfesores();
    initCursos();
    initCalificaciones();
    initInscripciones();
    

    setupNavigation();
    

    loadAlumnos();
    
    console.log('Aplicación iniciada correctamente');
}


function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.getAttribute('data-section');
            showSection(section);
            

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}


function showSection(sectionName) {

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    

    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        

        loadSectionData(sectionName);
    }
}


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




function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}


function showSuccess(message) {
    showToast(message, 'success');
}


function showError(message) {
    showToast(message, 'danger');
}


function showToast(message, type = 'info') {

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
    

    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}


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
    

    const oldAlert = document.getElementById('customAlert');
    if (oldAlert) oldAlert.remove();
    

    document.body.insertAdjacentHTML('beforeend', alertHTML);
    
    const modal = new bootstrap.Modal(document.getElementById('customAlert'));
    modal.show();
    

    document.getElementById('customAlert').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}


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
        

        const oldConfirm = document.getElementById('customConfirm');
        if (oldConfirm) oldConfirm.remove();
        

        document.body.insertAdjacentHTML('beforeend', confirmHTML);
        
        const modalElement = document.getElementById('customConfirm');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        

        document.getElementById('btnAcceptConfirm').addEventListener('click', function() {
            modal.hide();
            resolve(true);
        });
        
        document.getElementById('btnCancelConfirm').addEventListener('click', function() {
            modal.hide();
            resolve(false);
        });
        

        modalElement.addEventListener('hidden.bs.modal', function() {
            this.remove();
            resolve(false);
        });
    });
}


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


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