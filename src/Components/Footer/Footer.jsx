import { NavLink } from "react-router-dom";
import {GitHub, LinkedinIcon, Portfolio} from "../Icons/Icons"
const Footer = () => {

	 const onActive = (isActive) => {
		return (isActive ? `text-gray-400 hover:text-green-400 transition-colors duration-200 text-green-800` : 'text-gray-400 hover:text-green-400 transition-colors duration-200');
	  };

  return (
    <footer className="bg-[#212121]  text-white py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8 mb-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-green-400 mb-2">LeafScan AI</h3>
          <p className="text-gray-400 text-sm">
            Empowering farmers with intelligent disease detection.
            Dedicated to sustainable agriculture and food security.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>  
			  <NavLink
                to='/'
                className={({ isActive }) => onActive(isActive)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/about'
                className={({ isActive }) => onActive(isActive)}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/predict'
                className={({ isActive }) => onActive(isActive)}
              >
                Classify Leaf
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Contact / Social Media */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
          <div className="flex justify-center md:justify-start space-x-4">
            {/* Social Media Icons */}
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
              <GitHub />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
              <LinkedinIcon />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
              <Portfolio />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} LeafScan AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;