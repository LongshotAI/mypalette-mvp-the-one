
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Twitter, Instagram, Youtube, Film, Users, Calendar, Award } from 'lucide-react';

const AIFilm3Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-purple-300" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                AIFilm3
              </h3>
            </div>
            <p className="text-purple-200 max-w-xs">
              The premier AI film festival celebrating the intersection of artificial intelligence and cinematic artistry.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/aifilm3" className="text-purple-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/aifilm3" className="text-purple-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/aifilm3" className="text-purple-300 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Festival */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-300">Festival</h4>
            <ul className="space-y-2 text-purple-200">
              <li>
                <Link to="/aifilm3/info" className="hover:text-white transition-colors flex items-center">
                  <Film className="h-4 w-4 mr-2" />
                  About AIFilm3
                </Link>
              </li>
              <li>
                <Link to="/aifilm3/announcements" className="hover:text-white transition-colors flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule & Events
                </Link>
              </li>
              <li>
                <a href="#submissions" className="hover:text-white transition-colors flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Submit Your Film
                </a>
              </li>
              <li>
                <a href="#awards" className="hover:text-white transition-colors flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Awards & Categories
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-300">Community</h4>
            <ul className="space-y-2 text-purple-200">
              <li>
                <a href="#filmmakers" className="hover:text-white transition-colors flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Filmmakers
                </a>
              </li>
              <li>
                <a href="#judges" className="hover:text-white transition-colors">
                  Judges & Mentors
                </a>
              </li>
              <li>
                <a href="#sponsors" className="hover:text-white transition-colors">
                  Sponsors & Partners
                </a>
              </li>
              <li>
                <a href="#volunteers" className="hover:text-white transition-colors">
                  Volunteer Program
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-300">Support</h4>
            <ul className="space-y-2 text-purple-200">
              <li>
                <a href="mailto:info@aifilm3.com" className="hover:text-white transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#tickets" className="hover:text-white transition-colors">
                  Tickets & Passes
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#legal" className="hover:text-white transition-colors">
                  Terms & Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-purple-300">
            © 2024 AIFilm3. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-purple-300">
            <span>Powered by</span>
            <Link to="/" className="text-purple-200 hover:text-white transition-colors">
              MyPalette
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AIFilm3Footer;
