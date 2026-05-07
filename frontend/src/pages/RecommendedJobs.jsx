import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/axios';
import { AuthContext } from '../context/AuthContext';

const RecommendedJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  const fetchRecommendedJobs = async () => {
    try {
      const { data } = await API.get('/ml/recommended-jobs');
      setJobs(data.jobs);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations');
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-700 border-green-300';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const getMatchEmoji = (score) => {
    if (score >= 70) return '🔥';
    if (score >= 50) return '👍';
    return '🤔';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 mb-2">Analyzing jobs for you...</div>
          <div className="text-gray-500">This might take a moment ✨</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Jobs Picked Just For You 🎯</h1>
          <p className="text-gray-600">AI-matched based on your profile and skills</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
            <p className="text-sm mt-2">Make sure you've completed your profile and added skills!</p>
          </div>
        )}

        {jobs.length === 0 && !error ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-xl text-gray-600 mb-4">No jobs available yet</p>
            <p className="text-gray-500">Check back later or complete your profile to get better matches</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 border border-gray-100 relative">
                {/* Match Score Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getMatchColor(job.match_score)}`}>
                    {getMatchEmoji(job.match_score)} {job.match_score}% Match
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
                  <p className="text-blue-600 font-medium mb-3">{job.company}</p>
                </div>

                <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                </div>

                <div className="mb-4">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                    {job.jobType}
                  </span>
                </div>

                <Link 
                  to={`/jobs/${job._id}`}
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedJobs;