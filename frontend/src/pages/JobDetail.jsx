import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import { AuthContext } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJob();
    if (user?.role === 'seeker') {
      fetchMatchScore();
    }
  }, [id, user]);

  const fetchJob = async () => {
    try {
      const { data } = await API.get(`/jobs/${id}`);
      setJob(data.job);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job:', error);
      setLoading(false);
    }
  };

  const fetchMatchScore = async () => {
    try {
      const { data } = await API.get(`/ml/match-score/${id}`);
      setMatchScore(data.match_score);
    } catch (error) {
      console.error('Error fetching match score:', error);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-700';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getMatchMessage = (score) => {
    if (score >= 70) return "Great match! You're a strong candidate 🔥";
    if (score >= 50) return "Good match! Worth applying 👍";
    return "Consider building more relevant skills 🤔";
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await API.post(`/applications/apply/${id}`, { coverLetter });
      setMessage('Application sent! 🎉');
      setCoverLetter('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
    setApplying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Job not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Match Score for Job Seekers */}
          {matchScore !== null && user?.role === 'seeker' && (
            <div className={`mb-6 p-4 rounded-lg ${getMatchColor(matchScore)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold mb-1">{matchScore}% Match</div>
                  <div className="text-sm">{getMatchMessage(matchScore)}</div>
                </div>
                <div className="text-4xl">
                  {matchScore >= 70 ? '🔥' : matchScore >= 50 ? '👍' : '🤔'}
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
            <p className="text-xl text-blue-600 font-medium">{job.company}</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <span className="bg-gray-100 px-4 py-2 rounded-lg">📍 {job.location}</span>
            <span className="bg-gray-100 px-4 py-2 rounded-lg">💰 {job.salary}</span>
            <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg">{job.jobType}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-3">About the role</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          <div className="text-sm text-gray-500 mb-8">
            Posted on {new Date(job.createdAt).toLocaleDateString()}
          </div>

          {user?.role === 'seeker' && (
            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold mb-4">Interested? Apply now!</h2>
              
              {message && (
                <div className={`p-4 rounded-lg mb-4 ${message.includes('🎉') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleApply}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Cover Letter (optional)</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    placeholder="Tell them why you'd be great for this role..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={applying}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {applying ? 'Sending...' : 'Submit Application'}
                </button>
              </form>
            </div>
          )}

          {!user && (
            <div className="border-t pt-6 text-center">
              <p className="text-gray-600 mb-4">Want to apply? You'll need to log in first</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Log in to apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;