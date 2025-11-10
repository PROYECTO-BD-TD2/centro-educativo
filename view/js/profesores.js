// profesores.js - Módulo para gestión de profesores

let modalProfesor;
let currentProfesorId = null;

// Inicializar módulo de profesores
function initProfesores() {
    modalProfesor = new bootstrap.Modal(document.getElementById('modalProfesor'));
    
    document.getElementById('btnNuevoProfesor').addEventListener('click', openModalProfesor);
    document.getElementById('btnGuardarProfesor').addEventListener('click', saveProfesor);
    document.getElementById('searchProfesores').addEventListener('keyup', searchProfesores);
}

// Cargar profesores en la tabla
async function loadProfesores() {
    try {
        const profesores = await ProfesoresAPI.getAll();
        const tbody = document.getElementById('profesoresTableBody');
        
        if (!profesores || profesores.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        <i class="fas fa-chalkboard-teacher fa-3x mb-3 d-block" style="opacity: 0.3;"></i>
                        No hay profesores registrados
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = profesores.map(profesor => `
            <tr>
                <td>${profesor.id}</td>
                <td>${profesor.nombre}</td>
                <td>${profesor.apellido}</td>
                <td>${profesor.email}</td>
                <td>${profesor.telefono || '-'}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-info" onclick="viewProfesor(${profesor.id})" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editProfesor(${profesor.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProfesor(${profesor.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar profesores:', error);
        showError('Error al cargar la lista de profesores');
    }
}

// Abrir modal para nuevo profesor
function openModalProfesor() {
    currentProfesorId = null;
    document.getElementById('formProfesor').reset();
    document.getElementById('profesorId').value = '';
    document.getElementById('modalProfesorTitle').textContent = 'Nuevo Profesor';
    modalProfesor.show();
}

// Ver detalles de un profesor
async function viewProfesor(id) {
    try {
        const profesor = await ProfesoresAPI.getById(id);
        
        const message = `
            <strong>Nombre:</strong> ${profesor.nombre} ${profesor.apellido}<br>
            <strong>Email:</strong> ${profesor.email}<br>
            <strong>Teléfono:</strong> ${profesor.telefono || 'No especificado'}
        `;
        
        showAlert('Información del Profesor', message, 'info');
    } catch (error) {
        console.error('Error al ver profesor:', error);
        showError('Error al obtener los datos del profesor');
    }
}

// Editar profesor
async function editProfesor(id) {
    try {
        const profesor = await ProfesoresAPI.getById(id);
        
        currentProfesorId = profesor.id;
        document.getElementById('profesorId').value = profesor.id;
        document.getElementById('profesorNombre').value = profesor.nombre;
        document.getElementById('profesorApellido').value = profesor.apellido;
        document.getElementById('profesorEmail').value = profesor.email;
        document.getElementById('profesorTelefono').value = profesor.telefono || '';
        document.getElementById('modalProfesorTitle').textContent = 'Editar Profesor';
        
        modalProfesor.show();
    } catch (error) {
        console.error('Error al editar profesor:', error);
        showError('Error al cargar los datos del profesor');
    }
}

// Guardar profesor (crear o actualizar)
async function saveProfesor() {
    const form = document.getElementById('formProfesor');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const profesor = {
        nombre: document.getElementById('profesorNombre').value.trim(),
        apellido: document.getElementById('profesorApellido').value.trim(),
        email: document.getElementById('profesorEmail').value.trim(),
        telefono: document.getElementById('profesorTelefono').value.trim() || null
    };
    
    try {
        if (currentProfesorId) {
            await ProfesoresAPI.update(currentProfesorId, profesor);
            showSuccess('Profesor actualizado correctamente');
        } else {
            await ProfesoresAPI.create(profesor);
            showSuccess('Profesor creado correctamente');
        }
        
        modalProfesor.hide();
        loadProfesores();
    } catch (error) {
        console.error('Error al guardar profesor:', error);
        showError('Error al guardar el profesor');
    }
}

// Eliminar profesor
async function deleteProfesor(id) {
    const confirmed = await showConfirm(
        '¿Está seguro?',
        '¿Desea eliminar este profesor? Esta acción no se puede deshacer.'
    );
    
    if (!confirmed) return;
    
    try {
        await ProfesoresAPI.delete(id);
        showSuccess('Profesor eliminado correctamente');
        loadProfesores();
    } catch (error) {
        console.error('Error al eliminar profesor:', error);
        showError('Error al eliminar el profesor');
    }
}

// Buscar profesores
function searchProfesores() {
    const searchTerm = document.getElementById('searchProfesores').value.toLowerCase();
    const table = document.getElementById('profesoresTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}

// Cargar opciones de profesores en selects
async function loadProfesoresSelect() {
    try {
        const profesores = await ProfesoresAPI.getAll();
        const select = document.getElementById('cursoProfesor');
        
        select.innerHTML = '<option value="">Seleccione un profesor</option>';
        
        profesores.forEach(profesor => {
            const option = document.createElement('option');
            option.value = profesor.id;
            option.textContent = `${profesor.nombre} ${profesor.apellido}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar profesores en select:', error);
    }
}