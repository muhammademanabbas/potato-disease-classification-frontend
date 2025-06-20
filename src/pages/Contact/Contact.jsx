// Contact.jsx
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend (FastAPI)
    // For now, we'll just log it to the console.
    console.log('Form data submitted:', formData);
    alert('Thank you for your message! We will get back to you shortly.'); // Using alert for demonstration
    setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      <div className="bg-white rounded-2xl shadow-xl mt-[20vh] overflow-hidden max-w-5xl w-full mx-auto
                      transform transition-all duration-300 hover:scale-[1.01]
                      grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10">

        {/* Left Section: Contact Info */}
        <div className="flex flex-col justify-center text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 flex items-center justify-center lg:justify-start">
            {/* Inline SVG for a message icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-green-600">
              <path d="M22 6L12 13L2 6"></path><path d="M2 3H22V19C22 19.5523 21.5523 20 21 20H3C2.44772 20 2 19.5523 2 19V3Z"></path>
            </svg>
            Get In Touch
          </h2>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-8">
            Have questions, feedback, or need support? We'd love to hear from you!
            Fill out the form or reach us through the details below.
          </p>

          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-center justify-center lg:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-4">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <span className="text-gray-700 text-lg">info@leafscanai.com</span>
            </div>

            {/* Phone (Placeholder) */}
            <div className="flex items-center justify-center lg:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-4">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-1.18 2.7l-1.95 1.12a2 2 0 0 0-.91.75 2.14 2.14 0 0 0-.21 1.77C6.9 14.53 9.4 17.03 12.56 17.5c.24.03.49.03.73.02a2.15 2.15 0 0 0 1.77-.21l1.12-1.95a2 2 0 0 1 2.7-1.18 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span className="text-gray-700 text-lg">+1 (123) 456-7890</span>
            </div>

            {/* Address (Placeholder) */}
            <div className="flex items-center justify-center lg:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-4">
                <path d="M18 8a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-10z"></path><path d="M12 2v4"></path><path d="M14 2h-4"></path><path d="M22 17h-2"></path><path d="M4 17H2"></path>
              </svg>
              <span className="text-gray-700 text-lg">123 Farm Lane, Agritown, Country</span>
            </div>
          </div>
        </div>

        {/* Right Section: Contact Form */}
        <div className="w-full">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">
            Send Us a Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-semibold mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-y"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full
                         shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
                         focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:-translate-y-1"
            >
              Send Message
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 inline-block">
                <path d="M17 17l5 5"></path><path d="M17 7l5-5"></path><path d="M2 12h20"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;



// import React from 'react'

// export default function Contact() {
//     return (
//         <div className="relative flex items-top justify-center min-h-[700px] bg-white sm:items-center sm:pt-0">
//             <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
//                 <div className="mt-8 overflow-hidden">
//                     <div className="grid grid-cols-1 md:grid-cols-2">
//                         <div className="p-6 mr-2 bg-gray-100 sm:rounded-lg">
//                             <h1 className="text-3xl sm:text-4xl text-gray-800 font-extrabold tracking-tight">
//                                 Get in touch: 
//                             </h1>
//                             <p className="text-normal text-lg sm:text-xl font-medium text-gray-600 mt-2">
//                                 Fill in the form to start a conversation
//                             </p>

//                             <div className="flex items-center mt-8 text-gray-600">
//                                 <svg
//                                     fill="none"
//                                     stroke="currentColor"
//                                     stroke-linecap="round"
//                                     stroke-linejoin="round"
//                                     stroke-width="1.5"
//                                     viewBox="0 0 24 24"
//                                     className="w-8 h-8 text-gray-500"
//                                 >
//                                     <path
//                                         stroke-linecap="round"
//                                         stroke-linejoin="round"
//                                         stroke-width="1.5"
//                                         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                                     />
//                                     <path
//                                         stroke-linecap="round"
//                                         stroke-linejoin="round"
//                                         stroke-width="1.5"
//                                         d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                                     />
//                                 </svg>
//                                 <div className="ml-4 text-md tracking-wide font-semibold w-40">
//                                     Acme Inc, Street, State, Postal Code
//                                 </div>
//                             </div>

//                             <div className="flex items-center mt-4 text-gray-600">
//                                 <svg
//                                     fill="none"
//                                     stroke="currentColor"
//                                     stroke-linecap="round"
//                                     stroke-linejoin="round"
//                                     stroke-width="1.5"
//                                     viewBox="0 0 24 24"
//                                     className="w-8 h-8 text-gray-500"
//                                 >
//                                     <path
//                                         stroke-linecap="round"
//                                         stroke-linejoin="round"
//                                         stroke-width="1.5"
//                                         d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                                     />
//                                 </svg>
//                                 <div className="ml-4 text-md tracking-wide font-semibold w-40">
//                                     +44 1234567890
//                                 </div>
//                             </div>

//                             <div className="flex items-center mt-2 text-gray-600">
//                                 <svg
//                                     fill="none"
//                                     stroke="currentColor"
//                                     stroke-linecap="round"
//                                     stroke-linejoin="round"
//                                     stroke-width="1.5"
//                                     viewBox="0 0 24 24"
//                                     className="w-8 h-8 text-gray-500"
//                                 >
//                                     <path
//                                         stroke-linecap="round"
//                                         stroke-linejoin="round"
//                                         stroke-width="1.5"
//                                         d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                                     />
//                                 </svg>
//                                 <div className="ml-4 text-md tracking-wide font-semibold w-40">
//                                     info@acme.org
//                                 </div>
//                             </div>
//                         </div>

//                         <form className="p-6 flex flex-col justify-center">
//                             <div className="flex flex-col">
//                                 <label for="name" className="hidden">
//                                     Full Name
//                                 </label>
//                                 <input
//                                     type="name"
//                                     name="name"
//                                     id="name"
//                                     placeholder="Full Name"
//                                     className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-green-500 focus:outline-none"
//                                 />
//                             </div>

//                             <div className="flex flex-col mt-2">
//                                 <label for="email" className="hidden">
//                                     Email
//                                 </label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     id="email"
//                                     placeholder="Email"
//                                     className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-green-500 focus:outline-none"
//                                 />
//                             </div>

//                             <div className="flex flex-col mt-2">
//                                 <label for="tel" className="hidden">
//                                     Number
//                                 </label>
//                                 <input
//                                     type="tel"
//                                     name="tel"
//                                     id="tel"
//                                     placeholder="Telephone Number"
//                                     className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-green-500 focus:outline-none"
//                                 />
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="md:w-32 bg-green-700 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-green-600 transition ease-in-out duration-300"
//                             >
//                                 Submit
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }