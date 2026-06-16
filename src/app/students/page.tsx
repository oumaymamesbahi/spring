'use client';

import { useState, useEffect } from 'react';
import { getStudents, createStudent } from '@/lib/api';
import { Student, ApiError } from '@/types';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cnie: '',
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Erreur lors de la récupération des étudiants');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!formData.cnie || !formData.firstName || !formData.lastName || !formData.email) {
      setError('Tous les champs sont obligatoires');
      setSubmitting(false);
      return;
    }

    try {
      const newStudent = await createStudent({
        cnie: formData.cnie,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });

      setStudents((prev) => [...prev, newStudent]);
      setSuccess(`✅ Étudiant ${formData.firstName} ${formData.lastName} ajouté avec succès`);
      setFormData({ cnie: '', firstName: '', lastName: '', email: '' });
    } catch (err) {
      const apiError = err as ApiError;
      let errorMsg = '';

      // Vérifier les conditions dans le bon ordre (spécifique → général)
      if (apiError.message.includes('existe déjà')) {
        if (apiError.message.includes('CNIE')) {
          errorMsg = `⚠️ CNIE déjà utilisé : Un étudiant avec ce CNIE existe déjà. Veuillez entrer un CNIE différent.`;
        } else if (apiError.message.includes('email')) {
          errorMsg = `⚠️ Email déjà utilisé : Un étudiant avec cet email existe déjà. Veuillez entrer un email différent.`;
        } else {
          errorMsg = `⚠️ Cet étudiant existe déjà : ${apiError.message}`;
        }
      } else if (apiError.message.includes('obligatoire')) {
        errorMsg = `⚠️ Champ obligatoire : ${apiError.message}`;
      } else if (apiError.message.includes('CNIE')) {
        errorMsg = `❌ CNIE invalide : ${apiError.message}`;
      } else if (apiError.message.includes('email') || apiError.message.includes('Email')) {
        errorMsg = `❌ Email invalide : ${apiError.message}`;
      } else if (apiError.message.includes('prénom') || apiError.message.includes('Prénom')) {
        errorMsg = `❌ Prénom invalide : ${apiError.message}`;
      } else if (apiError.message.includes('nom') || apiError.message.includes('Nom')) {
        errorMsg = `❌ Nom invalide : ${apiError.message}`;
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Étudiants</h1>

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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ajouter un étudiant</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="cnie" className="block text-sm font-medium text-gray-700 mb-1">
                  CNIE
                </label>
                <input
                  id="cnie"
                  type="text"
                  name="cnie"
                  value={formData.cnie}
                  onChange={handleInputChange}
                  placeholder="CD2387"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Jean"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Dupont"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jean@example.com"
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
              Liste des étudiants ({students.length})
            </h2>
            {loading ? (
              <div className="text-center py-8 text-gray-600">Chargement...</div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-gray-600">Aucun étudiant trouvé</div>
            ) : (
              <div className="table-container">
                <table className="table-styling">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">CNIE</th>
                      <th className="table-header-cell">Prénom</th>
                      <th className="table-header-cell">Nom</th>
                      <th className="table-header-cell">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="table-row">
                        <td className="table-cell font-medium">{student.cnie}</td>
                        <td className="table-cell">{student.firstName}</td>
                        <td className="table-cell">{student.lastName}</td>
                        <td className="table-cell text-blue-600">{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
