import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-600 mb-6">
            Welcome to HireHub
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your gateway to amazing career opportunities
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              to="/jobs"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700"
            >
              Browse Jobs
            </Link>
            <Link 
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg border-2 border-blue-600 hover:bg-blue-50"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">For Job Seekers</h3>
            <p className="text-gray-600">
              Find your dream job from thousands of listings. Apply with one click and track your applications.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">For Recruiters</h3>
            <p className="text-gray-600">
              Post jobs, manage applications, and find the perfect candidates for your company.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Easy to Use</h3>
            <p className="text-gray-600">
              Simple, intuitive interface designed to make your job search or hiring process seamless.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;