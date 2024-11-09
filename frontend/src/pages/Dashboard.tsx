import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchDashboardProjects } from '../api/dashboard';

export default function Dashboard() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['dashboardProjects'],
    queryFn: fetchDashboardProjects
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Link
          to="/dashboard/new-project"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Nouveau projet
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects?.map((project) => (
          <div
            key={project._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{project.title}</h2>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Objectif:</span>
                  <span className="font-semibold">{project.goalAmount}€</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        (project.currentAmount / project.goalAmount) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-indigo-600 font-semibold">
                    {project.currentAmount}€ collectés
                  </span>
                  <span className="text-gray-600">
                    {new Date(project.endDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">
                      {project.stats?.contributorsCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Contributeurs</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">
                      {project.stats?.commentsCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Commentaires</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">
                      {Math.round(
                        (project.currentAmount / project.goalAmount) * 100
                      )}%
                    </div>
                    <div className="text-sm text-gray-600">Financé</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    Voir
                  </Link>
                  <Link
                    to={`/dashboard/projects/${project._id}/edit`}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}