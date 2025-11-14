

let modalCurso;
let currentCursoId = null;


function initCursos() {
    modalCurso = new bootstrap.Modal(document.getElementById('modalCurso'));
    
    document.getElementById('btnNuevoCurso').addEventListener('click', openModalCurso);
    document.getElementById('btnGuardarCurso').addEventListener('click', saveCurso);
    document.getElementById('searchCursos').addEventListener('keyup', searchCursos);
}


async function loadCursos() {
    try {
        
        const response = await CursosAPI.getAll();
        if (!response.success)  throw new Error(response.message || 'Error al obtener cursos');

        const cursos = response.data;
        const tbody = document.getElementById('cursosTableBody');
        
        if (!cursos || cursos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        <i class="fas fa-book fa-3x mb-3 d-block" style="opacity: 0.3;"></i>
                        No hay cursos registrados
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = cursos.map(curso => `
            <tr>
                <td>${curso.id}</td>
                <td>${curso.nombre}</td>
                <td>${curso.descripcion || '-'}</td>
                <td>${curso.profesor_nombre || 'Sin asignar'}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-info" onclick="viewCurso(${curso.id})" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editCurso(${curso.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCurso(${curso.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar cursos:', error);
        showError('Error al cargar la lista de cursos');
    }
}


async function openModalCurso() {
    currentCursoId = null;
    document.getElementById('formCurso').reset();
    document.getElementById('cursoId').value = '';
    document.getElementById('modalCursoTitle').textContent = 'Nuevo Curso';
    
    await loadProfesoresSelect();
    modalCurso.show();
}


async function viewCurso(id) {
    try {
        const response = await CursosAPI.getById(id);
        if (!response.success)  throw new Error(response.message || 'Error al obtener curso');
        const curso = response.data;
        
        const message = `
            <strong>Nombre:</strong> ${curso.nombre}<br>
            <strong>Descripción:</strong> ${curso.descripcion || 'Sin descripción'}<br>
            <strong>Profesor:</strong> ${curso.profesor_nombre || 'Sin asignar'}
        `;
        
        showAlert('Información del Curso', message, 'info');
    } catch (error) {
        console.error('Error al ver curso:', error);
        showError('Error al obtener los datos del curso');
    }
}


async function editCurso(id) {
    try {
        
        const response = await CursosAPI.getById(id);
        if (!response.success)  throw new Error(response.message || 'Error al obtener curso');
        const curso = response.data;
        
        await loadProfesoresSelect();
        
        currentCursoId = curso.id;
        document.getElementById('cursoId').value = curso.id;
        document.getElementById('cursoNombre').value = curso.nombre;
        document.getElementById('cursoDescripcion').value = curso.descripcion || '';
        document.getElementById('cursoProfesor').value = curso.profesor_id || '';
        document.getElementById('modalCursoTitle').textContent = 'Editar Curso';
        
        modalCurso.show();
    } catch (error) {
        console.error('Error al editar curso:', error);
        showError('Error al cargar los datos del curso');
    }
}


async function saveCurso() {
    const form = document.getElementById('formCurso');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const curso = {
        nombre: document.getElementById('cursoNombre').value.trim(),
        descripcion: document.getElementById('cursoDescripcion').value.trim() || null,
        profesor_id: document.getElementById('cursoProfesor').value || null
    };
    
    try {
        if (currentCursoId) {
            await CursosAPI.update(currentCursoId, curso);
            showSuccess('Curso actualizado correctamente');
        } else {
            await CursosAPI.create(curso);
            showSuccess('Curso creado correctamente');
        }
        
        modalCurso.hide();
        loadCursos();
    } catch (error) {
        console.error('Error al guardar curso:', error);
        showError('Error al guardar el curso');
    }
}


async function deleteCurso(id) {
    const confirmed = await showConfirm(
        '¿Está seguro?',
        '¿Desea eliminar este curso? Esta acción eliminará también las inscripciones y calificaciones asociadas.'
    );
    
    if (!confirmed) return;
    
    try {
        await CursosAPI.delete(id);
        showSuccess('Curso eliminado correctamente');
        loadCursos();
    } catch (error) {
        console.error('Error al eliminar curso:', error);
        showError('Error al eliminar el curso');
    }
}


function searchCursos() {
    const searchTerm = document.getElementById('searchCursos').value.toLowerCase();
    const table = document.getElementById('cursosTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}


async function loadCursosSelect() {
    try {
        const response = await CursosAPI.getAll();
        if (!response.success) throw new Error('No se pudieron cargar los cursos');
        const cursos = response.data;

        const selectCalificacion = document.getElementById('calificacionCurso');
        const selectInscripcion = document.getElementById('inscripcionCurso');
        
        const optionHTML = '<option value="">Seleccione un curso</option>' + 
            cursos.map(curso => `<option value="${curso.id}">${curso.nombre}</option>`).join('');
        
        if (selectCalificacion) selectCalificacion.innerHTML = optionHTML;
        if (selectInscripcion) selectInscripcion.innerHTML = optionHTML;
    } catch (error) {
        console.error('Error al cargar cursos en select:', error);
    }
}