import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faRoute, faUsers, faCube } from '@fortawesome/free-solid-svg-icons';


const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h1 className="text-xl font-bold mb-6">F&V Collection</h1>
      <ul className="mt-16">
        <li className="mb-8 flex items-center space-x-4 group">
          <FontAwesomeIcon icon={faHome} className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
          <a href="dashboard" className="hover:text-gray-300 transition-colors">Dashboard</a>
        </li>
        <li className="mb-8 flex items-center space-x-4 group">
          <FontAwesomeIcon icon={faRoute} className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
          <a href="routes" className="hover:text-gray-300 transition-colors">Routes</a>
        </li>
        <li className="mb-8 flex items-center space-x-4 group">
          <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
          <a href="users" className="hover:text-gray-300 transition-colors">Users</a>
        </li>
        <li className="flex items-center space-x-4 group">
          <FontAwesomeIcon icon={faCube} className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
          <a href="#" className="hover:text-gray-300 transition-colors">Other</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
