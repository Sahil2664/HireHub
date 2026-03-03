import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/axios';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const { data } = await API.get('/jobs/recruiter/my-jobs');
      setJobs(data.jobs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job? This can\'t be undone.')) return;

    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (error) {
      alert('Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Dashboard 📊</h1>
            <p className="text-gray-600">Manage your job postings</p>
          </div>
          <Link
            to="/post-job"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            + Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-xl text-gray-600 mb-4">No jobs posted yet</p>
            <Link
              to="/post-job"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                    <div className="flex gap-4 text-gray-600 mb-3">
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary}</span>
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                        {job.jobType}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{job.description.substring(0, 150)}...</p>
                    <div className="text-sm text-gray-500">
                      Posted {new Date(job.createdAt).toLocaleDateString()} • {job.applications?.length || 0} applications
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Link
                      to={`/applications/${job._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
                    >
                      View Applications
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;