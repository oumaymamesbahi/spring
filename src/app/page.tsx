'use client';

import { useState } from 'react';
import { getEnrollmentsByStudent, deleteEnrollment } from '@/lib/api';
import { Enrollment, ApiError } from '@/types';

export default function Dashboard() {
  const [cnie, setCnie] = useState('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnie.trim()) {
      setError('Veuillez entrer votre CNIE');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setSearched(true);

    try {
      const data = await getEnrollmentsByStudent(cnie);
      setEnrollments(data);
      setError(null);
      if (data.length === 0) {
        setSuccess('Aucune inscription trouvée pour ce CNIE');
      } else {
        setSuccess(null);
      }
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 404) {
        setError(`Étudiant avec CNIE "${cnie}" non trouvé`);
      } else {
        // Si le status est 204 ou réponse vide, c'est normal = pas d'inscriptions
        if (apiError.status === 204 || apiError.message.includes('non-JSON')) {
          setEnrollments([]);
          setSuccess('Aucune inscription trouvée pour ce CNIE');
          setError(null);
        } else {
          setError(apiError.message || 'Erreur lors de la récupération des inscriptions');
          setEnrollments([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (enrollmentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette inscription ?')) {
      return;
    }

    setDeletingId(enrollmentId);
    setError(null);
    setSuccess(null);

    try {
      await deleteEnrollment(enrollmentId, cnie);
      setEnrollments((prev) => prev.filter((e) => e.enrollmentId !== enrollmentId));
      setSuccess('✅ Inscription annulée avec succès');
    } catch (err) {
      const apiError = err as ApiError;
      let errorMsg = '';

      if (apiError.message.includes('24 heures') || apiError.message.includes('24h')) {
        errorMsg = `⏰ Annulation impossible : L'inscription date de plus de 24h. Vous ne pouvez annuler que dans les 24h suivant l'inscription.`;
      } else if (apiError.message.includes('non trouvée')) {
        errorMsg = `❌ Erreur : L'inscription n'existe pas ou a déjà été supprimée.`;
      } else if (apiError.message.includes('n\'appartient pas')) {
        errorMsg = `⚠️ Erreur : Cette inscription ne vous appartient pas.`;
      } else {
        errorMsg = `❌ Erreur : ${apiError.message}`;
      }
      setError(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Dashboard</h1>

      <div className="card mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="cnie" className="block text-sm font-medium text-gray-700 mb-2">
              CNIE
            </label>
            <input
              id="cnie"
              type="text"
              value={cnie}
              onChange={(e) => setCnie(e.target.value)}
              placeholder="Entrez votre CNIE (ex: CD2387)"
              className="input-field"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? 'Chargement...' : 'Voir mon dashboard'}
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {success && enrollments.length === 0 && (
        <div className="alert alert-warning">
          {success}
        </div>
      )}

      {success && enrollments.length > 0 && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {searched && enrollments.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Mes inscriptions ({enrollments.length})
          </h2>
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.enrollmentId}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {enrollment.courseName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Inscrit le : {formatDate(enrollment.enrollmentDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancel(enrollment.enrollmentId)}
                    disabled={!enrollment.deletable || deletingId === enrollment.enrollmentId}
                    className={
                      enrollment.deletable
                        ? 'btn-danger ml-4'
                        : 'btn-danger-disabled ml-4'
                    }
                    title={
                      !enrollment.deletable
                        ? 'Plus de 24h, suppression impossible'
                        : 'Annuler cette inscription'
                    }
                  >
                    {deletingId === enrollment.enrollmentId ? 'Annulation...' : 'Annuler'}
                  </button>
                </div>
                {!enrollment.deletable && (
                  <p className="text-xs text-gray-500 mt-2">
                    ⚠️ Plus de 24h, suppression impossible
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
