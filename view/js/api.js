// api.js - Módulo para peticiones a la API REST

// Configuración de la API
const API_CONFIG = {
    baseURL: 'http://localhost:3000/api', // Cambia esto según tu configuración
    headers: {
        'Content-Type': 'application/json'
    }
};

// Utilidad para manejar errores
function handleError(error) {
    console.error('Error en la petición:', error);
    alert('Error en la operación. Por favor, intente nuevamente.');
    throw error;
}

// Utilidad para hacer peticiones HTTP
async function request(endpoint, options = {}) {
    try {
        const url = `${API_CONFIG.baseURL}${endpoint}`;
        const config = {
            headers: API_CONFIG.headers,
            ...options
        };

        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleError(error);
    }
}

// ==================== ALUMNOS ====================
const AlumnosAPI = {
    // Obtener todos los alumnos
    getAll: async () => {
        return await request('/alumnos', { method: 'GET' });
    },

    // Obtener un alumno por ID
    getById: async (id) => {
        return await request(`/alumnos/${id}`, { method: 'GET' });
    },

    // Crear un nuevo alumno
    create: async (alumno) => {
        return await request('/alumnos', {
            method: 'POST',
            body: JSON.stringify(alumno)
        });
    },

    // Actualizar un alumno
    update: async (id, alumno) => {
        return await request(`/alumnos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(alumno)
        });
    },

    // Eliminar un alumno
    delete: async (id) => {
        return await request(`/alumnos/${id}`, { method: 'DELETE' });
    }
};

// ==================== PROFESORES ====================
const ProfesoresAPI = {
    // Obtener todos los profesores
    getAll: async () => {
        return await request('/profesores', { method: 'GET' });
    },

    // Obtener un profesor por ID
    getById: async (id) => {
        return await request(`/profesores/${id}`, { method: 'GET' });
    },

    // Crear un nuevo profesor
    create: async (profesor) => {
        return await request('/profesores', {
            method: 'POST',
            body: JSON.stringify(profesor)
        });
    },

    // Actualizar un profesor
    update: async (id, profesor) => {
        return await request(`/profesores/${id}`, {
            method: 'PUT',
            body: JSON.stringify(profesor)
        });
    },

    // Eliminar un profesor
    delete: async (id) => {
        return await request(`/profesores/${id}`, { method: 'DELETE' });
    }
};

// ==================== CURSOS ====================
const CursosAPI = {
    // Obtener todos los cursos
    getAll: async () => {
        return await request('/cursos', { method: 'GET' });
    },

    // Obtener un curso por ID
    getById: async (id) => {
        return await request(`/cursos/${id}`, { method: 'GET' });
    },

    // Crear un nuevo curso
    create: async (curso) => {
        return await request('/cursos', {
            method: 'POST',
            body: JSON.stringify(curso)
        });
    },

    // Actualizar un curso
    update: async (id, curso) => {
        return await request(`/cursos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(curso)
        });
    },

    // Eliminar un curso
    delete: async (id) => {
        return await request(`/cursos/${id}`, { method: 'DELETE' });
    },

    // Obtener cursos por profesor
    getByProfesor: async (profesorId) => {
        return await request(`/cursos/profesor/${profesorId}`, { method: 'GET' });
    }
};

// ==================== CALIFICACIONES ====================
const CalificacionesAPI = {
    // Obtener todas las calificaciones
    getAll: async () => {
        return await request('/calificaciones', { method: 'GET' });
    },

    // Obtener una calificación por ID
    getById: async (id) => {
        return await request(`/calificaciones/${id}`, { method: 'GET' });
    },

    // Crear una nueva calificación
    create: async (calificacion) => {
        return await request('/calificaciones', {
            method: 'POST',
            body: JSON.stringify(calificacion)
        });
    },

    // Actualizar una calificación
    update: async (id, calificacion) => {
        return await request(`/calificaciones/${id}`, {
            method: 'PUT',
            body: JSON.stringify(calificacion)
        });
    },

    // Eliminar una calificación
    delete: async (id) => {
        return await request(`/calificaciones/${id}`, { method: 'DELETE' });
    },

    // Obtener calificaciones por alumno
    getByAlumno: async (alumnoId) => {
        return await request(`/calificaciones/alumno/${alumnoId}`, { method: 'GET' });
    },

    // Obtener calificaciones por curso
    getByCurso: async (cursoId) => {
        return await request(`/calificaciones/curso/${cursoId}`, { method: 'GET' });
    }
};

// ==================== INSCRIPCIONES ====================
const InscripcionesAPI = {
    // Obtener todas las inscripciones
    getAll: async () => {
        return await request('/inscripciones', { method: 'GET' });
    },

    // Obtener una inscripción por ID
    getById: async (id) => {
        return await request(`/inscripciones/${id}`, { method: 'GET' });
    },

    // Crear una nueva inscripción
    create: async (inscripcion) => {
        return await request('/inscripciones', {
            method: 'POST',
            body: JSON.stringify(inscripcion)
        });
    },

    // Actualizar una inscripción
    update: async (id, inscripcion) => {
        return await request(`/inscripciones/${id}`, {
            method: 'PUT',
            body: JSON.stringify(inscripcion)
        });
    },

    // Eliminar una inscripción
    delete: async (id) => {
        return await request(`/inscripciones/${id}`, { method: 'DELETE' });
    },

    // Obtener inscripciones por alumno
    getByAlumno: async (alumnoId) => {
        return await request(`/inscripciones/alumno/${alumnoId}`, { method: 'GET' });
    },

    // Obtener inscripciones por curso
    getByCurso: async (cursoId) => {
        return await request(`/inscripciones/curso/${cursoId}`, { method: 'GET' });
    }
};