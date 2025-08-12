import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  User, 
  BarChart3, 
  Settings, 
  LogOut,
  X,
  Home,
  Users,
  DollarSign,
  Activity,
  ChevronLeft,
  ChevronRight,
  Plus,
  Play
} from 'lucide-react';

const Sidebar = ({ isOpen, onToggle, onLogout, groups = [], onAddToGroup, onExecuteGroup }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Claims', path: '/claims' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: User, label: 'Providers', path: '/providers' },
    { icon: DollarSign, label: 'Payments', path: '/payments' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Activity, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const isActivePath = (path) => {
    if (path === '/claims') {
      return location.pathname === '/' || location.pathname === '/claims';
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gray-800 text-white transform transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto ${
        isOpen ? 'w-64' : 'lg:w-16 w-64'
      }`}>
        
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className={`flex items-center transition-all duration-300 ${
              isOpen ? 'opacity-100' : 'lg:opacity-0 opacity-100'
            }`}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText size={18} />
              </div>
              {isOpen && (
                <h2 className="text-xl font-bold ml-3">MediClaim</h2>
              )}
            </div>
            <div className="flex items-center">
              {/* Desktop toggle button - always visible */}
              <button 
                onClick={onToggle} 
                className="hidden lg:block p-1 rounded hover:bg-gray-700 transition-colors"
                title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
              {/* Mobile close button */}
              <button onClick={onToggle} className="lg:hidden">
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 flex-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => {
                // Close sidebar on mobile when item is clicked
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className={`flex items-center px-6 py-3 text-sm hover:bg-gray-700 transition-colors group ${
                isActivePath(item.path) 
                  ? 'bg-gray-700 border-r-4 border-blue-500 text-blue-300' 
                  : 'text-gray-300'
              }`}
              title={!isOpen ? item.label : ''}
            >
              <item.icon size={20} className={`${isOpen ? 'mr-3' : 'mx-auto'} transition-all duration-300`} />
              {isOpen && (
                <span className="transition-all duration-300">{item.label}</span>
              )}
            </Link>
          ))}
          
          {/* Groups Section */}
          {isOpen && groups && groups.length > 0 && (
            <div className="mt-6 px-6">
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Groups
                </h3>
                <div className="space-y-1">
                  {groups.map((group) => (
                    <div key={group.id} className="bg-gray-750 rounded-lg p-3 border border-gray-600">
                      {/* Group Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <Users size={14} className="text-blue-400" />
                        <span className="text-sm font-medium text-white truncate">
                          {group.name}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          ({group.memberCount})
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAddToGroup && onAddToGroup(group.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          title="Add Action"
                        >
                          <Plus size={12} />
                          Add Action
                        </button>
                        <button
                          onClick={() => onExecuteGroup && onExecuteGroup(group.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          title="Execute"
                        >
                          <Play size={12} />
                          Execute
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </nav>
        
        <div className="border-t border-gray-700 p-6">
          <button 
            onClick={onLogout}
            className={`flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors group ${
              isOpen ? 'justify-start' : 'justify-center'
            }`}
            title={!isOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className={`${isOpen ? 'mr-3' : ''} transition-all duration-300`} />
            {isOpen && (
              <span className="transition-all duration-300">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;