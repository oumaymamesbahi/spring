'use client';

import { useState, useEffect } from 'react';
import { getStudents, getCourses, createEnrollment } from '@/lib/api';
import { Student, Course, ApiError } from '@/types';

export default function EnrollmentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [studentsData, coursesData] = await Promise.all([
        getStudents(),
        getCourses(),
      ]);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!selectedStudent || !selectedCourse) {
      setError('Veuillez sélectionner un étudiant et un cours');
      setSubmitting(false);
      return;
    }

    const student = students.find(
      (s) => s.id.toString() === selectedStudent || s.id === parseInt(selectedStudent, 10)
    );
    const course = courses.find(
      (c) => c.id.toString() === selectedCourse || c.id === parseInt(selectedCourse, 10)
    );

    if (!student || !course) {
      setError('Étudiant ou cours non trouvé');
      setSubmitting(false);
      return;
    }

    try {
      await createEnrollment(student.cnie, selectedCourse);
      setSuccess(
        `✅ ${student.firstName} ${student.lastName} inscrit au cours "${course.title}" avec succès !`
      );
      setSelectedStudent('');
      setSelectedCourse('');
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Erreur lors de l\'inscription';
      let errorMsg = '';

      if (apiError.status === 400) {
        if (errorMessage.toLowerCase().includes('déjà inscrit')) {
          errorMsg = `⚠️ ${student.firstName} ${student.lastName} est déjà inscrit au cours "${course.title}".`;
        } else if (
          errorMessage.toLowerCase().includes('maximum') ||
          errorMessage.toLowerCase().includes('atteint')
        ) {
          errorMsg = `🚫 Cours complet : Le cours "${course.title}" a atteint le nombre maximum de 3 étudiants. Inscription impossible pour ${student.firstName} ${student.lastName}.`;
        } else if (errorMessage.toLowerCase().includes('non trouvé') || errorMessage.toLowerCase().includes('introuvable')) {
          errorMsg = `❌ Erreur : L'étudiant ou le cours n'existe plus. Veuillez rafraîchir la page.`;
        } else {
          errorMsg = `❌ Erreur : ${errorMessage}`;
        }
      } else if (apiError.status === 404) {
        errorMsg = `❌ Ressource non trouvée : ${errorMessage}`;
      } else {
        errorMsg = `❌ Erreur serveur : ${errorMessage}`;
      }
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Inscrire un Étudiant</h1>

      {error && (
        <div className="alert alert-error">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="text-center py-8 text-gray-600">Chargement...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un étudiant
              </label>
              <select
                id="student"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="input-field"
              >
                <option value="">-- Choisir un étudiant --</option>
                {students.length === 0 ? (
                  <option disabled>Aucun étudiant disponible</option>
                ) : (
                  students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.cnie})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un cours
              </label>
              <select
                id="course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="input-field"
              >
                <option value="">-- Choisir un cours --</option>
                {courses.length === 0 ? (
                  <option disabled>Aucun cours disponible</option>
                ) : (
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.credits} crédits)
                    </option>
                  ))
                )}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedStudent || !selectedCourse}
              className="btn-primary w-full"
            >
              {submitting ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Étudiants ({students.length})
          </h2>
          {students.length === 0 ? (
            <p className="text-gray-600">Aucun étudiant</p>
          ) : (
            <ul className="space-y-2">
              {students.map((student) => (
                <li key={student.id} className="text-sm text-gray-700">
                  {student.firstName} {student.lastName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Cours ({courses.length})
          </h2>
          {courses.length === 0 ? (
            <p className="text-gray-600">Aucun cours</p>
          ) : (
            <ul className="space-y-2">
              {courses.map((course) => (
                <li key={course.id} className="text-sm text-gray-700">
                  {course.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
