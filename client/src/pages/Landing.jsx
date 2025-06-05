import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Welcome to TaskMaster
          </h1>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl">
            Your ultimate task management solution. Stay organized, boost productivity, and achieve your goals with our intuitive todo list application.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-4xl">
            <div className="bg-secondary-light/80 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-white">Organize Tasks</h3>
              <p className="text-gray-200">Create, categorize, and manage your tasks efficiently</p>
            </div>
            <div className="bg-secondary-light/80 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-white">Track Progress</h3>
              <p className="text-gray-200">Monitor your productivity and stay on top of your goals</p>
            </div>
            <div className="bg-secondary-light/80 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-white">Stay Focused</h3>
              <p className="text-gray-200">Focus on what matters most with our intuitive interface</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              className="btn btn-primary px-8 py-3 text-lg"
            >
              Get Started
            </Link>
            <Link
              to="/register"
              className="btn btn-secondary px-8 py-3 text-lg border-2 border-primary"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 