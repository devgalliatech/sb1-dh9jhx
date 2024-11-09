import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectById } from '../api/projects';
import { useAuth } from '../hooks/useAuth';

export default function ProjectDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id!)
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Projet non trouvé</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={project.images[0] || '/placeholder.jpg'}
          alt={project.title}
          className="w-full h-96 object-cover"
        />
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          <div className="flex items-center mb-6">
            <img
              src={`https://ui-avatars.com/api/?name=${project.creator.firstName}+${project.creator.lastName}`}
              alt={`${project.creator.firstName} ${project.creator.lastName}`}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">
                {project.creator.firstName} {project.creator.lastName}
              </p>
              <p className="text-gray-600">Créateur du projet</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-indigo-600">
                {project.currentAmount}€
              </span>
              <span className="text-gray-600">
                sur {project.goalAmount}€ objectif
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-indigo-600 h-4 rounded-full"
                style={{
                  width: `${Math.min(
                    (project.currentAmount / project.goalAmount) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {Math.round(
                  (project.currentAmount / project.goalAmount) * 100
                )}% financé
              </span>
              <span>
                {new Date(project.endDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {isAuthenticated && (
            <div className="mb-8">
              <button className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">
                Contribuer au projet
              </button>
            </div>
          )}

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">À propos du projet</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}