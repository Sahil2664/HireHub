import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/axios';
import { AuthContext } from '../context/AuthContext';

const Applications = () => {
  const { user } = useContext(AuthContext);
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'recruiter' && jobId) {
      fetchJobApplications();
    } else if (user?.role === 'seeker') {
      fetchMyApplications();
    }
  }, [user, jobId]);

  const fetchJobApplications = async () => {
    try {
      const { data } = await API.get(`/applications/job/${jobId}`);
      setApplications(data.applications);
      if (data.applications.length > 0) {
        setJob(data.applications[0].job);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const { data } = await API.get('/applications/my-applications');
      setApplications(data.applications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await API.put(`/applications/${applicationId}/status`, { status });
      setApplications(applications.map(app =>
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // For Recruiters
  if (user?.role === 'recruiter') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-4xl font-bold mb-2">Applications 📬</h1>
          {job && <p className="text-gray-600 mb-6">For: {job.title}</p>}

          {applications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-xl text-gray-600">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{app.applicant?.name}</h3>
                      <p className="text-gray-600 mb-2">{app.applicant?.email}</p>
                      
                      {app.coverLetter && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter:</p>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded">{app.coverLetter}</p>
                        </div>
                      )}

                      <div className="text-sm text-gray-500">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="ml-4">
                      <div className="mb-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      {app.status === 'pending' && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => updateStatus(app._id, 'accepted')}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateStatus(app._id, 'rejected')}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // For Job Seekers
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold mb-2">My Applications 📝</h1>
        <p className="text-gray-600 mb-6">Track your job applications</p>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-xl text-gray-600 mb-4">No applications yet</p>
            <p className="text-gray-500">Start applying to jobs to see them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{app.job?.title}</h3>
                    <p className="text-blue-600 font-medium mb-2">{app.job?.company}</p>
                    <div className="flex gap-4 text-gray-600 text-sm mb-3">
                      <span>📍 {app.job?.location}</span>
                      <span>💰 {app.job?.salary}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.status}
                    </span>
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

export default Applications;