import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
          <p className="text-blue-600 font-medium">{job.company}</p>
        </div>
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
          {job.jobType}
        </span>
      </div>

      <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
        <span>📍 {job.location}</span>
        <span>💰 {job.salary}</span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link 
          to={`/jobs/${job._id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;