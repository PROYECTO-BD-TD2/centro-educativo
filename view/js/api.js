

const API_CONFIG = {
    baseURL: 'http://localhost/developer/proyrcto-final-DB/public/index.php', 
    headers: {
        'Content-Type': 'application/json'
    }
};

function handleError(error) {
    console.error('Error en la petición:', error);
    alert('Error en la operación. Por favor, intente nuevamente.');
    throw error;
}

async function request(endpoint, options = {}) {
    try {
        const url = `${API_CONFIG.baseURL}${endpoint}`;
        const config = {
            headers: API_CONFIG.headers,
            ...options
        };

        const response = await fetch(url, config);
        
        if (!response.ok) {
            console.log(await response.text());
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Respuesta de la API:', data);
        return data;
    } catch (error) {
        handleError(error);
    }
}


const AlumnosAPI = {
    
    getAll: async () => {
        return await request('/alumnos', { method: 'GET' });
    },

    getById: async (id) => {
        return await request(`/alumnos/${id}`, { method: 'GET' });
    },

    create: async (alumno) => {
        return await request('/alumnos', {
            method: 'POST',
            body: JSON.stringify(alumno)
        });
    },

    update: async (id, alumno) => {
        return await request(`/alumnos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(alumno)
        });
    },

    delete: async (id) => {
        return await request(`/alumnos/${id}`, { method: 'DELETE' });
    }
};


const ProfesoresAPI = {
    getAll: async () => {
        return await request('/profesores', { method: 'GET' });
    },

    getById: async (id) => {
        return await request(`/profesores/${id}`, { method: 'GET' });
    },

    create: async (profesor) => {
        return await request('/profesores', {
            method: 'POST',
            body: JSON.stringify(profesor)
        });
    },

    update: async (id, profesor) => {
        return await request(`/profesores/${id}`, {
            method: 'PUT',
            body: JSON.stringify(profesor)
        });
    },

    delete: async (id) => {
        return await request(`/profesores/${id}`, { method: 'DELETE' });
    },
    getByCurso: async (cursoId) => {
        return await request(`/profesores/curso/${cursoId}`, { method: 'GET' });
    }   
};


const CursosAPI = {
    getAll: async () => {
        return await request('/cursos', { method: 'GET' });
    },

    getById: async (id) => {
        return await request(`/cursos/${id}`, { method: 'GET' });
    },

    create: async (curso) => {
        return await request('/cursos', {
            method: 'POST',
            body: JSON.stringify(curso)
        });
    },

    update: async (id, curso) => {
        return await request(`/cursos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(curso)
        });
    },

    delete: async (id) => {
        return await request(`/cursos/${id}`, { method: 'DELETE' });
    },

    getByProfesor: async (profesorId) => {
        return await request(`/cursos/profesor/${profesorId}`, { method: 'GET' });
    },
    getByAlumno: async (alumnoId) => {
        return await request(`/cursos/alumno/${alumnoId}`, { method: 'GET' });
    }
};


const CalificacionesAPI = {
    getAll: async () => {
        return await request('/calificaciones', { method: 'GET' });
    },

    getById: async (id) => {
        return await request(`/calificaciones/${id}`, { method: 'GET' });
    },

    create: async (calificacion) => {
        return await request('/calificaciones', {
            method: 'POST',
            body: JSON.stringify(calificacion)
        });
    },

    update: async (id, calificacion) => {
        return await request(`/calificaciones/${id}`, {
            method: 'PUT',
            body: JSON.stringify(calificacion)
        });
    },

    delete: async (id) => {
        return await request(`/calificaciones/${id}`, { method: 'DELETE' });
    },

    getByAlumno: async (alumnoId) => {
        return await request(`/calificaciones/alumno/${alumnoId}`, { method: 'GET' });
    },

    getByCurso: async (cursoId) => {
        return await request(`/calificaciones/curso/${cursoId}`, { method: 'GET' });
    }
};


const InscripcionesAPI = {
    getAll: async () => {
        return await request('/inscripciones', { method: 'GET' });
    },

    getById: async (id) => {
        return await request(`/inscripciones/${id}`, { method: 'GET' });
    },

    create: async (inscripcion) => {
        return await request('/inscripciones', {
            method: 'POST',
            body: JSON.stringify(inscripcion)
        });
    },

    update: async (id, inscripcion) => {
        return await request(`/inscripciones/${id}`, {
            method: 'PUT',
            body: JSON.stringify(inscripcion)
        });
    },

    delete: async (id) => {
        return await request(`/inscripciones/${id}`, { method: 'DELETE' });
    },

    getByAlumno: async (alumnoId) => {
        return await request(`/inscripciones/alumno/${alumnoId}`, { method: 'GET' });
    },

    getByCurso: async (cursoId) => {
        return await request(`/inscripciones/curso/${cursoId}`, { method: 'GET' });
    }
};