import { NavLink } from "react-router-dom";
const Footer = () => {

	 const onActive = (isActive) => {
		return (isActive ? `text-gray-400 hover:text-green-400 transition-colors duration-200 text-green-800` : 'text-gray-400 hover:text-green-400 transition-colors duration-200');
	  };

  return (
    // bg-gray-800
    <footer className="bg-[#212121]  text-white py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8 mb-8">
        {/* Company Info / Branding */}
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
            <li>
              <NavLink
                to='/contact'
                className={({ isActive }) => onActive(isActive)}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Contact / Social Media */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
          <div className="flex justify-center md:justify-start space-x-4">
            {/* Social Media Icons (using placeholders as direct icon libraries aren't available) */}
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h3V2h-3c-3.11 0-4 1.85-4 4v3.5H7v4h4V22h4v-8.5z"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.83-2.73 1.02-1.56-1.66-4.04-1.95-5.64-.63C12.15 4.54 10 5.86 10 8.01v1c-3.33-.31-6.29-1.76-8.32-4.04-.34.58-.53 1.25-.53 1.96 0 1.34.68 2.53 1.71 3.22-.63-.02-1.21-.19-1.72-.47v.03c0 2.37 1.68 4.35 3.91 4.8-.41.11-.84.17-1.28.17-.31 0-.61-.03-.91-.08.62 1.94 2.42 3.36 4.55 3.4c-1.68 1.32-3.81 2.11-6.13 2.11-.4 0-.79-.02-1.18-.07 2.18 1.39 4.77 2.2 7.55 2.2 9.05 0 15.65-7.49 15.65-15.65 0-.24-.01-.48-.01-.72.93-.67 1.73-1.5 2.36-2.44z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19H5V8h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3V13.5c0-1.35-.47-2.48-1.87-2.48-1.01 0-1.7.68-1.98 1.36-.1.25-.13.58-.13.91v7.19H8.5c.03-9.25 0-11 0-11h3v1.83c.57-.96 1.57-1.76 3.03-1.76 2.21 0 3.86 1.48 3.86 4.67v6.26z"/>
              </svg>
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