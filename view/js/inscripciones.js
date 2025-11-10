// inscripciones.js - Módulo para gestión de inscripciones

let modalInscripcion;
let currentInscripcionId = null;

// Inicializar módulo de inscripciones
function initInscripciones() {
    modalInscripcion = new bootstrap.Modal(document.getElementById('modalInscripcion'));
    
    document.getElementById('btnNuevaInscripcion').addEventListener('click', openModalInscripcion);
    document.getElementById('btnGuardarInscripcion').addEventListener('click', saveInscripcion);
    document.getElementById('searchInscripciones').addEventListener('keyup', searchInscripciones);
}

// Cargar inscripciones en la tabla
async function loadInscripciones() {
    try {
        const inscripciones = await InscripcionesAPI.getAll();
        const tbody = document.getElementById('inscripcionesTableBody');
        
        if (!inscripciones || inscripciones.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        <i class="fas fa-clipboard-list fa-3x mb-3 d-block" style="opacity: 0.3;"></i>
                        No hay inscripciones registradas
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = inscripciones.map(insc => `
            <tr>
                <td>${insc.id}</td>
                <td>${insc.alumno_nombre || 'Alumno #' + insc.alumno_id}</td>
                <td>${insc.curso_nombre || 'Curso #' + insc.curso_id}</td>
                <td>${formatDate(insc.fecha_inscripcion)}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-info" onclick="viewInscripcion(${insc.id})" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editInscripcion(${insc.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteInscripcion(${insc.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar inscripciones:', error);
        showError('Error al cargar la lista de inscripciones');
    }
}

// Abrir modal para nueva inscripción
async function openModalInscripcion() {
    currentInscripcionId = null;
    document.getElementById('formInscripcion').reset();
    document.getElementById('inscripcionId').value = '';
    document.getElementById('modalInscripcionTitle').textContent = 'Nueva Inscripción';
    
    // Establecer fecha actual
    document.getElementById('inscripcionFecha').valueAsDate = new Date();
    
    await loadAlumnosSelect();
    await loadCursosSelect();
    modalInscripcion.show();
}

// Ver detalles de una inscripción
async function viewInscripcion(id) {
    try {
        const insc = await InscripcionesAPI.getById(id);
        
        const message = `
            <strong>Alumno:</strong> ${insc.alumno_nombre || 'Alumno #' + insc.alumno_id}<br>
            <strong>Curso:</strong> ${insc.curso_nombre || 'Curso #' + insc.curso_id}<br>
            <strong>Fecha de Inscripción:</strong> ${formatDate(insc.fecha_inscripcion)}
        `;
        
        showAlert('Información de la Inscripción', message, 'info');
    } catch (error) {
        console.error('Error al ver inscripción:', error);
        showError('Error al obtener los datos de la inscripción');
    }
}

// Editar inscripción
async function editInscripcion(id) {
    try {
        const insc = await InscripcionesAPI.getById(id);
        
        await loadAlumnosSelect();
        await loadCursosSelect();
        
        currentInscripcionId = insc.id;
        document.getElementById('inscripcionId').value = insc.id;
        document.getElementById('inscripcionAlumno').value = insc.alumno_id;
        document.getElementById('inscripcionCurso').value = insc.curso_id;
        document.getElementById('inscripcionFecha').value = insc.fecha_inscripcion;
        document.getElementById('modalInscripcionTitle').textContent = 'Editar Inscripción';
        
        modalInscripcion.show();
    } catch (error) {
        console.error('Error al editar inscripción:', error);
        showError('Error al cargar los datos de la inscripción');
    }
}

// Guardar inscripción (crear o actualizar)
async function saveInscripcion() {
    const form = document.getElementById('formInscripcion');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const inscripcion = {
        alumno_id: parseInt(document.getElementById('inscripcionAlumno').value),
        curso_id: parseInt(document.getElementById('inscripcionCurso').value),
        fecha_inscripcion: document.getElementById('inscripcionFecha').value
    };
    
    try {
        if (currentInscripcionId) {
            await InscripcionesAPI.update(currentInscripcionId, inscripcion);
            showSuccess('Inscripción actualizada correctamente');
        } else {
            await InscripcionesAPI.create(inscripcion);
            showSuccess('Inscripción creada correctamente');
        }
        
        modalInscripcion.hide();
        loadInscripciones();
    } catch (error) {
        console.error('Error al guardar inscripción:', error);
        showError('Error al guardar la inscripción. Verifique que el alumno no esté ya inscrito en este curso.');
    }
}

// Eliminar inscripción
async function deleteInscripcion(id) {
    const confirmed = await showConfirm(
        '¿Está seguro?',
        '¿Desea eliminar esta inscripción? Esta acción no se puede deshacer.'
    );
    
    if (!confirmed) return;
    
    try {
        await InscripcionesAPI.delete(id);
        showSuccess('Inscripción eliminada correctamente');
        loadInscripciones();
    } catch (error) {
        console.error('Error al eliminar inscripción:', error);
        showError('Error al eliminar la inscripción');
    }
}

// Buscar inscripciones
function searchInscripciones() {
    const searchTerm = document.getElementById('searchInscripciones').value.toLowerCase();
    const table = document.getElementById('inscripcionesTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}