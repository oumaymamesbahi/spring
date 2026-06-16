import { Student, Course, Enrollment, ApiError } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get('content-type');
  let data: any = null;

  // Essayer de parser le JSON si la réponse contient du contenu
  if (contentType && contentType.includes('application/json') && response.status !== 204) {
    try {
      data = await response.json();
    } catch (e) {
      // Si le JSON est invalide et c'est une erreur, retourner un message par défaut
      if (!response.ok) {
        throw {
          message: 'Une erreur est survenue (réponse invalide)',
          status: response.status,
        } as ApiError;
      }
    }
  }

  // Vérifier le statut de la réponse
  if (!response.ok) {
    // Chercher le message d'erreur dans l'ordre de priorité
    let errorMessage = '';

    // 1. Chercher dans le header X-Error (pour les Mono réactifs)
    const errorHeader = response.headers.get('X-Error');
    if (errorHeader) {
      errorMessage = errorHeader;
    }
    // 2. Chercher dans data.message (du JSON)
    else if (data && data.message) {
      errorMessage = data.message;
    }
    // 3. Chercher dans data.error (du JSON)
    else if (data && data.error) {
      errorMessage = data.error;
    }
    // 4. Chercher dans data si c'est une string
    else if (typeof data === 'string') {
      errorMessage = data;
    }
    // 5. Message par défaut selon le status
    else {
      errorMessage = `Erreur serveur (${response.status})`;
    }

    console.error('API Error:', { status: response.status, message: errorMessage, headers: Object.fromEntries(response.headers.entries()) });

    throw {
      message: errorMessage,
      status: response.status,
    } as ApiError;
  }

  return data || {};
}

// Student endpoints
export async function getStudents(): Promise<Student[]> {
  const response = await fetch(`${API_BASE}/students`);
  return handleResponse<Student[]>(response);
}

export async function getStudentByCnie(cnie: string): Promise<Student> {
  const response = await fetch(`${API_BASE}/students/cnie/${cnie}`);
  return handleResponse<Student>(response);
}

export async function createStudent(student: Omit<Student, 'id'>): Promise<Student> {
  const response = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  return handleResponse<Student>(response);
}

// Course endpoints
export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_BASE}/courses`);
  return handleResponse<Course[]>(response);
}

export async function getCourseById(id: string): Promise<Course> {
  const response = await fetch(`${API_BASE}/courses/${id}`);
  return handleResponse<Course>(response);
}

export async function createCourse(course: Omit<Course, 'id'>): Promise<Course> {
  const response = await fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });
  return handleResponse<Course>(response);
}

// Enrollment endpoints
export async function getEnrollmentsByStudent(cnie: string): Promise<Enrollment[]> {
  const response = await fetch(`${API_BASE}/enrollments/student/${cnie}`);
  return handleResponse<Enrollment[]>(response);
}

export async function createEnrollment(
  studentCnie: string,
  courseId: string
): Promise<Enrollment> {
  const response = await fetch(`${API_BASE}/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentCnie, courseId }),
  });
  return handleResponse<Enrollment>(response);
}

export async function deleteEnrollment(enrollmentId: string, cnie: string): Promise<void> {
  const response = await fetch(`${API_BASE}/enrollments/${enrollmentId}/student/${cnie}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
}
