const Header = ({ onLogout }: { onLogout: () => void }) => {
    return (
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold"></h1>
        <button
          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    );
  };
  
  export default Header;
  