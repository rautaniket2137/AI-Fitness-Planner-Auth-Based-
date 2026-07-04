import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-24 text-center">
    <h1 className="text-3xl font-bold text-slate-800 mb-2">404</h1>
    <p className="text-slate-500 mb-6">Page not found.</p>
    <Link to="/" className="text-primary-600 font-medium">
      ← Back to home
    </Link>
  </div>
);

export default NotFoundPage;
