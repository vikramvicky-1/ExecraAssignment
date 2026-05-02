'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Could not connect to the backend server. Make sure it is running on port 5000.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Execra</span>
            </div>
            <div className="hidden sm:flex space-x-8">
              <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Services</a>
              <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">About</a>
              <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight">
            Elevating Your <span className="text-blue-600 dark:text-blue-400">Digital Presence</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We provide cutting-edge solutions to help your business thrive in the modern era. From web apps to AI, we've got you covered.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <button className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold hover:opacity-90 transition-all shadow-xl hover:shadow-2xl">
              Get Started
            </button>
            <button className="px-8 py-3 bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-full font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Services Section */}
        <section id="services" className="py-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Our Services</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2">Driven by backend data for real-time updates</p>
            </div>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800 ml-8 hidden sm:block"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
              <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
              <p className="text-zinc-500 text-sm">Please start the backend server in the <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/backend</code> folder using <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">npm run dev</code>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className="group bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-default"
                >
                  <div className="text-4xl mb-6 bg-zinc-50 dark:bg-zinc-800 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer info */}
        <footer className="mt-32 pt-12 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-8 pb-12">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black dark:bg-white rounded flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-sm">E</span>
            </div>
            <span className="text-zinc-900 dark:text-white font-bold tracking-tight">Execra Assignment</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Execra. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Terms</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
