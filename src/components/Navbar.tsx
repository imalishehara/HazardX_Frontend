import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/alerts", label: "Alerts" },
    { path: "/submit-symptoms", label: "Submit Symptoms" },
    { path: "/request-aid", label: "Request Aid" },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center justify-center
    ${isActive 
      ? "text-white bg-blue-600 shadow-md" 
      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"}`;

  return (
    <nav className="backdrop-blur-md bg-white/90 shadow-lg fixed w-full top-0 left-0 z-30 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center h-12 select-none">
            <span className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
              Hazard<span className="text-pink-500">X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <div className="flex space-x-2">
              {navLinks.map(link => (
                <NavLink key={link.path} to={link.path} className={linkClass} end={link.path === "/"}>
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="ml-4 flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium">
                Log in
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                Sign up as Volunteer
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu sliding panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 sm:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          <div className="flex flex-col px-4 space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
                end={link.path === "/"}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-6 space-y-3">
              <Link to="/login" className="w-full block px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-center">
                Log in
              </Link>
              <Link to="/signup" className="w-full block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md text-center">
                Sign up as Volunteer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;