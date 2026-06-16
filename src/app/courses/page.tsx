'use client';

import { useState, useEffect } from 'react';
import { getCourses, createCourse } from '@/lib/api';
import { Course, ApiError } from '@/types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    credits: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Erreur lors de la récupération des cours');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!formData.title || !formData.description || !formData.credits) {
      setError('Tous les champs sont obligatoires');
      setSubmitting(false);
      return;
    }

    const credits = parseInt(formData.credits, 10);
    if (isNaN(credits) || credits <= 0) {
      setError('Les crédits doivent être un nombre positif');
      setSubmitting(false);
      return;
    }

    try {
      const newCourse = await createCourse({
        title: formData.title,
        description: formData.description,
        credits,
      });

      setCourses((prev) => [...prev, newCourse]);
      setSuccess(`✅ Cours "${formData.title}" ajouté avec succès`);
      setFormData({ title: '', description: '', credits: '' });
    } catch (err) {
      const apiError = err as ApiError;
      let errorMsg = '';

      // Vérifier les conditions dans le bon ordre (spécifique → général)
      if (apiError.message.includes('existe déjà')) {
        errorMsg = `⚠️ Ce cours existe déjà : Un cours avec ce titre est déjà enregistré. Veuillez choisir un autre titre.`;
      } else if (apiError.message.includes('obligatoire')) {
        errorMsg = `⚠️ Champ obligatoire : ${apiError.message}`;
      } else if (apiError.message.includes('Titre')) {
        errorMsg = `❌ Titre invalide : ${apiError.message}`;
      } else if (apiError.message.includes('Description') || apiError.message.includes('description')) {
        errorMsg = `❌ Description invalide : ${apiError.message}`;
      } else if (apiError.message.includes('Crédits') || apiError.message.includes('crédits')) {
        errorMsg = `❌ Crédits invalides : ${apiError.message}`;
      } else {
        errorMsg = `❌ ${apiError.message}`;
      }
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Cours</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ajouter un cours</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Mathématiques avancées"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description du cours..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>
              <div>
                <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
                  Crédits
                </label>
                <input
                  id="credits"
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  placeholder="3"
                  min="1"
                  className="input-field"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Liste des cours ({courses.length})
            </h2>
            {loading ? (
              <div className="text-center py-8 text-gray-600">Chargement...</div>
            ) : courses.length === 0 ? (
              <div className="text-center py-8 text-gray-600">Aucun cours trouvé</div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
                            {course.credits} crédits
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                        ID: {course.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
