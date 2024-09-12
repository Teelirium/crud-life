import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const loc = useLocation();
  return (
    <div className="absolute right-1 top-1 gap-2 flex flex-row bg-slate-50 p-2 rounded-lg shadow-md text-center">
      <h3>Навигация:</h3>
      <Link
        to="/"
        className={[loc.pathname === '/' ? 'underline' : ''].join(' ')}
      >
        User
      </Link>
      <Link
        to="/manager"
        className={[loc.pathname === '/manager' ? 'underline' : ''].join(' ')}
      >
        Manager
      </Link>
    </div>
  );
}
