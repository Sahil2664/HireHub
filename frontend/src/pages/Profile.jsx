import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/axios';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: '',
    skills: '',
    phone: '',
    company: '',
    resume: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/user/profile');
      if (data.user.profile) {
        setProfileData({
          bio: data.user.profile.bio || '',
          skills: data.user.profile.skills?.join(', ') || '',
          phone: data.user.profile.phone || '',
          company: data.user.profile.company || '',
          resume: data.user.profile.resume || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...profileData,
        skills: profileData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      
      await API.put('/user/profile', { profile: dataToSend });
      setMessage('Profile updated! ✨');
      setEditing(false);
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Your Profile</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
              {user?.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
            </span>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${message.includes('✨') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          {!editing ? (
            <div>
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Name</h3>
                <p className="text-gray-700">{user?.name}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Bio</h3>
                <p className="text-gray-700">{profileData.bio || 'Not added yet'}</p>
              </div>

              {user?.role === 'seeker' && (
                <>
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-2">Skills</h3>
                    <p className="text-gray-700">{profileData.skills || 'Not added yet'}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-2">Resume Link</h3>
                    <p className="text-gray-700">{profileData.resume || 'Not added yet'}</p>
                  </div>
                </>
              )}

              {user?.role === 'recruiter' && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2">Company</h3>
                  <p className="text-gray-700">{profileData.company || 'Not added yet'}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Phone</h3>
                <p className="text-gray-700">{profileData.phone || 'Not added yet'}</p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {user?.role === 'seeker' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={profileData.skills}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="React, Node.js, Python..."
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Resume Link</label>
                    <input
                      type="text"
                      name="resume"
                      value={profileData.resume}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </>
              )}

              {user?.role === 'recruiter' && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={profileData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your company name"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;