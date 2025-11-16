



let modalAlumno;
let currentAlumnoId = null;


function initAlumnos() {
    modalAlumno = new bootstrap.Modal(document.getElementById('modalAlumno'));
    

    document.getElementById('btnNuevoAlumno').addEventListener('click', openModalAlumno);
    document.getElementById('btnGuardarAlumno').addEventListener('click', saveAlumno);
    document.getElementById('searchAlumnos').addEventListener('keyup', searchAlumnos);
}


async function loadAlumnos() {
    try {
        const response = await AlumnosAPI.getAll();
        if (!response.success)  throw new Error(response.message || 'Error al obtener alumnos');

        const alumnos = response.data;
        const tbody = document.getElementById('alumnosTableBody');
        
        if (!alumnos || alumnos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-4">
                        <i class="fas fa-user-graduate fa-3x mb-3 d-block" style="opacity: 0.3;"></i>
                        No hay alumnos registrados
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = alumnos.map(alumno => `
            <tr>
                <td>${alumno.id}</td>
                <td>${alumno.documento}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.apellido}</td>
                <td>${formatDate(alumno.fecha_nacimiento)}</td>
                <td>${alumno.email}</td>
                <td>${alumno.telefono || '-'}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-info" onclick="viewAlumno(${alumno.id})" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editAlumno(${alumno.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAlumno(${alumno.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar alumnos:', error);
        showError('Error al cargar la lista de alumnos');
    }
}


function openModalAlumno() {
    currentAlumnoId = null;
    document.getElementById('formAlumno').reset();
    document.getElementById('alumnoId').value = '';
    document.getElementById('modalAlumnoTitle').textContent = 'Nuevo Alumno';
    modalAlumno.show();
}


async function viewAlumno(id) {
    try {
        const response = await AlumnosAPI.getById(id);
        if (!response.success)  throw new Error(response.message || 'Error al obtener alumno');

        const alumno = response.data;
        const message = `
            <strong>Nombre:</strong> ${alumno.nombre} ${alumno.apellido}<br>
            <strong>Documento:</strong> ${alumno.documento}<br>
            <strong>Email:</strong> ${alumno.email}<br>
            <strong>Fecha de Nacimiento:</strong> ${formatDate(alumno.fecha_nacimiento)}<br>
            <strong>Teléfono:</strong> ${alumno.telefono || 'No especificado'}
        `;
        
        showAlert('Información del Alumno', message, 'info');
    } catch (error) {
        console.error('Error al ver alumno:', error);
        showError('Error al obtener los datos del alumno');
    }
}


async function editAlumno(id) {
    try {
        const response = await AlumnosAPI.getById(id);
        if (!response.success)  throw new Error(response.message || 'Error al obtener alumno');

        const alumno = response.data;

        currentAlumnoId = alumno.id;
        document.getElementById('alumnoId').value = alumno.id;
        document.getElementById('alumnoDocumento').value = alumno.documento;
        document.getElementById('alumnoNombre').value = alumno.nombre;
        document.getElementById('alumnoApellido').value = alumno.apellido;
        document.getElementById('alumnoFechaNac').value = alumno.fecha_nacimiento;
        document.getElementById('alumnoEmail').value = alumno.email;
        document.getElementById('alumnoTelefono').value = alumno.telefono || '';
        document.getElementById('modalAlumnoTitle').textContent = 'Editar Alumno';
        
        modalAlumno.show();
    } catch (error) {
        console.error('Error al editar alumno:', error);
        showError('Error al cargar los datos del alumno');
    }
}


async function saveAlumno() {
    const form = document.getElementById('formAlumno');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const alumno = {
        documento: document.getElementById('alumnoDocumento').value.trim(),
        nombre: document.getElementById('alumnoNombre').value.trim(),
        apellido: document.getElementById('alumnoApellido').value.trim(),
        fecha_nacimiento: document.getElementById('alumnoFechaNac').value,
        email: document.getElementById('alumnoEmail').value.trim(),
        telefono: document.getElementById('alumnoTelefono').value.trim() || null
    };
    
    try {
        if (currentAlumnoId) {
            await AlumnosAPI.update(currentAlumnoId, alumno);
            showSuccess('Alumno actualizado correctamente');
        } else {
            await AlumnosAPI.create(alumno);
            showSuccess('Alumno creado correctamente');
        }
        
        modalAlumno.hide();
        loadAlumnos();
    } catch (error) {
        console.error('Error al guardar alumno:', error);
        showError('Error al guardar el alumno');
    }
}


async function deleteAlumno(id) {
    const confirmed = await showConfirm(
        '¿Está seguro?',
        '¿Desea eliminar este alumno? Esta acción no se puede deshacer.'
    );
    
    if (!confirmed) return;
    
    try {
        await AlumnosAPI.delete(id);
        showSuccess('Alumno eliminado correctamente');
        loadAlumnos();
    } catch (error) {
        console.error('Error al eliminar alumno:', error);
        showError('Error al eliminar el alumno');
    }
}


function searchAlumnos() {
    const searchTerm = document.getElementById('searchAlumnos').value.toLowerCase();
    const table = document.getElementById('alumnosTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}