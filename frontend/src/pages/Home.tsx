import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedProjects } from '../api/projects';

export default function Home() {
  const { data: featuredProjects } = useQuery({
    queryKey: ['featuredProjects'],
    queryFn: fetchFeaturedProjects
  });

  return (
    <div>
      <section className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Financez l'innovation française
          </h1>
          <p className="text-xl mb-8">
            Découvrez et soutenez les projets innovants qui façonnent l'avenir
          </p>
          <Link
            to="/projects"
            className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100"
          >
            Découvrir les projets
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Projets à la une
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects?.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={project.images[0] || '/placeholder.jpg'}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {project.description.substring(0, 150)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-600 font-semibold">
                      {project.currentAmount}€ / {project.goalAmount}€
                    </span>
                    <Link
                      to={`/projects/${project._id}`}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Voir plus
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}