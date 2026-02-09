import { Link, Outlet, useLocation } from 'react-router';
import { Home, Info } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About Us', icon: Info },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-indigo-600">Link Predictor</h2>
          <p className="text-sm text-gray-500">Analysis Tool</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
