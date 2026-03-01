import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            Find your next gig 🚀
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're hiring or looking for work, we've got you covered
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              to="/jobs"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
            >
              Check out jobs
            </Link>
            <Link 
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Get started
            </Link>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold mb-3">Looking for work?</h3>
            <p className="text-gray-600">
              Browse tons of job listings, apply in seconds, and keep track of everything in one place
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">Hiring someone?</h3>
            <p className="text-gray-600">
              Post your job opening, review applications, and find the perfect match for your team
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Super simple</h3>
            <p className="text-gray-600">
              No BS, no confusion. Just a straightforward job portal that actually works
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;