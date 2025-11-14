// calificaciones.js - Módulo para gestión de calificaciones

let modalCalificacion;
let currentCalificacionId = null;

// Inicializar módulo de calificaciones
function initCalificaciones() {
    modalCalificacion = new bootstrap.Modal(document.getElementById('modalCalificacion'));
    
    document.getElementById('btnNuevaCalificacion').addEventListener('click', openModalCalificacion);
    document.getElementById('btnGuardarCalificacion').addEventListener('click', saveCalificacion);
    document.getElementById('searchCalificaciones').addEventListener('keyup', searchCalificaciones);
}

// Cargar calificaciones en la tabla
async function loadCalificaciones() {
    try {

        const response  = await CalificacionesAPI.getAll();
        if (!response.success)  throw new Error(response.message || 'Error al obtener calificaciones');

        const calificaciones = response.data;
        const tbody = document.getElementById('calificacionesTableBody');
        
        if (!calificaciones || calificaciones.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        <i class="fas fa-star fa-3x mb-3 d-block" style="opacity: 0.3;"></i>
                        No hay calificaciones registradas
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = calificaciones.map(cal => `
            <tr>
                <td>${cal.id}</td>
                <td>${cal.alumno_nombre || 'Alumno #' + cal.alumno_id}</td>
                <td>${cal.curso_nombre || 'Curso #' + cal.curso_id}</td>
                <td>
                    <span class="badge ${getBadgeClass(cal.calificacion)}">
                        ${cal.calificacion}
                    </span>
                </td>
                <td>${formatDate(cal.fecha_calificacion)}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-info" onclick="viewCalificacion(${cal.id})" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editCalificacion(${cal.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCalificacion(${cal.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar calificaciones:', error);
        showError('Error al cargar la lista de calificaciones');
    }
}

// Obtener clase de badge según la calificación
function getBadgeClass(nota) {
    if (nota >= 10) return 'bg-success';
    if (nota >= 7) return 'bg-primary';
    if (nota >= 5) return 'bg-warning';
    return 'bg-danger';
}

// Abrir modal para nueva calificación
async function openModalCalificacion() {
    currentCalificacionId = null;
    document.getElementById('formCalificacion').reset();
    document.getElementById('calificacionId').value = '';
    document.getElementById('modalCalificacionTitle').textContent = 'Nueva Calificación';
    
    // Establecer fecha actual
    document.getElementById('calificacionFecha').valueAsDate = new Date();
    
    await loadAlumnosSelect();
    await loadCursosSelect();
    modalCalificacion.show();
}

// Ver detalles de una calificación
async function viewCalificacion(id) {
    try {
        const response = await CalificacionesAPI.getById(id);
        if (!response.success) throw new Error('Calificación no encontrada');
        const cal = response.data;
        
        const message = `
            <strong>Alumno:</strong> ${cal.alumno_nombre || 'Alumno #' + cal.alumno_id}<br>
            <strong>Curso:</strong> ${cal.curso_nombre || 'Curso #' + cal.curso_id}<br>
            <strong>Calificación:</strong> ${cal.calificacion}<br>
            <strong>Fecha:</strong> ${formatDate(cal.fecha_calificacion)}
        `;
        
        showAlert('Información de la Calificación', message, 'info');
    } catch (error) {
        console.error('Error al ver calificación:', error);
        showError('Error al obtener los datos de la calificación');
    }
}

// Editar calificación
async function editCalificacion(id) {
    try {
        const response = await CalificacionesAPI.getById(id);
        if (!response.success) throw new Error('Calificación no encontrada');
        const cal = response.data;

        await loadAlumnosSelect();
        await loadCursosSelect();
        
        currentCalificacionId = cal.id;
        document.getElementById('calificacionId').value = cal.id;
        document.getElementById('calificacionAlumno').value = cal.alumno_id;
        document.getElementById('calificacionCurso').value = cal.curso_id;
        document.getElementById('calificacionNota').value = cal.calificacion;
        document.getElementById('calificacionFecha').value = cal.fecha_calificacion;
        document.getElementById('modalCalificacionTitle').textContent = 'Editar Calificación';
        
        modalCalificacion.show();
    } catch (error) {
        console.error('Error al editar calificación:', error);
        showError('Error al cargar los datos de la calificación');
    }
}

// Guardar calificación (crear o actualizar)
async function saveCalificacion() {
    const form = document.getElementById('formCalificacion');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const calificacion = {
        alumno_id: parseInt(document.getElementById('calificacionAlumno').value),
        curso_id: parseInt(document.getElementById('calificacionCurso').value),
        calificacion: parseFloat(document.getElementById('calificacionNota').value),
        fecha_calificacion: document.getElementById('calificacionFecha').value
    };
    
    // Validar rango de calificación
    if (calificacion.calificacion < 1 || calificacion.calificacion > 12) {
        showError('La calificación debe estar entre 1 y 12');
        return;
    }
    
    try {
        if (currentCalificacionId) {
            await CalificacionesAPI.update(currentCalificacionId, calificacion);
            showSuccess('Calificación actualizada correctamente');
        } else {
            await CalificacionesAPI.create(calificacion);
            showSuccess('Calificación creada correctamente');
        }
        
        modalCalificacion.hide();
        loadCalificaciones();
    } catch (error) {
        console.error('Error al guardar calificación:', error);
        showError('Error al guardar la calificación. Verifique que el alumno no tenga ya una calificación para este curso.');
    }
}

// Eliminar calificación
async function deleteCalificacion(id) {
    const confirmed = await showConfirm(
        '¿Está seguro?',
        '¿Desea eliminar esta calificación? Esta acción no se puede deshacer.'
    );
    
    if (!confirmed) return;
    
    try {
        await CalificacionesAPI.delete(id);
        showSuccess('Calificación eliminada correctamente');
        loadCalificaciones();
    } catch (error) {
        console.error('Error al eliminar calificación:', error);
        showError('Error al eliminar la calificación');
    }
}

// Buscar calificaciones
function searchCalificaciones() {
    const searchTerm = document.getElementById('searchCalificaciones').value.toLowerCase();
    const table = document.getElementById('calificacionesTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}

// Cargar opciones de alumnos en selects
async function loadAlumnosSelect() {
    try {
        const response = await AlumnosAPI.getAll();
        if (!response.success) throw new Error('No se pudieron cargar los alumnos');
        const alumnos = response.data;

        const selectCalificacion = document.getElementById('calificacionAlumno');
        const selectInscripcion = document.getElementById('inscripcionAlumno');
        
        const optionHTML = '<option value="">Seleccione un alumno</option>' + 
            alumnos.map(alumno => 
                `<option value="${alumno.id}">${alumno.nombre} ${alumno.apellido}</option>`
            ).join('');
        
        if (selectCalificacion) selectCalificacion.innerHTML = optionHTML;
        if (selectInscripcion) selectInscripcion.innerHTML = optionHTML;
    } catch (error) {
        console.error('Error al cargar alumnos en select:', error);
    }
}