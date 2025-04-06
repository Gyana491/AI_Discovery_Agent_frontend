"use client";

import { useState } from "react";
import Link from "next/link";
import NewsletterPopup from "./NewsletterPopup";

export default function NavigationHeader() {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f1a]/90 backdrop-blur-xl border-b border-gray-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Navigation Bar */}
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#F2C94C] to-yellow-500 flex items-center justify-center shadow-lg transform transition-all duration-200 group-hover:scale-105">
                  <span className="text-black font-bold text-xl">WT</span>
                </div>
                <span className="text-white font-bold text-xl group-hover:text-[#F2C94C] transition-colors duration-200">What&apos;s Trending?</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              
              <Link 
                href="/trending-github" 
                className="text-gray-300 hover:text-[#F2C94C] transition-all duration-200 hover:scale-105"
              >
                🔥 GitHub Trends
              </Link>
              <Link 
                href="/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-[#F2C94C] transition-all duration-200 hover:scale-105"
              >
                🤗 HuggingFace
              </Link>
            </div>

            {/* Subscribe Button - Always Visible */}
            <button
              onClick={() => setIsNewsletterOpen(true)}
              className="bg-gradient-to-r from-[#F2C94C] via-yellow-500 to-amber-500 text-black px-4 py-2 md:px-6 md:py-2.5 rounded-full font-medium hover:shadow-[0_8px_16px_rgba(242,201,76,0.3)] hover:scale-105 transition-all duration-200 border border-yellow-400/30 backdrop-blur-sm text-sm md:text-base"
            >
              ✉️ Subscribe
            </button>
          </div>

          {/* Mobile Horizontal Scroll Navigation */}
          <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-3"></div>
            <div className="flex space-x-4 min-w-max pb-4">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-[#F2C94C] transition-all duration-200 bg-gray-800/50 px-4 py-2 rounded-full text-sm whitespace-nowrap"
              >
                🏠 Home
              </Link>
              <Link 
                href="/trending-github" 
                className="text-gray-300 hover:text-[#F2C94C] transition-all duration-200 bg-gray-800/50 px-4 py-2 rounded-full text-sm whitespace-nowrap"
              >
                🔥 GitHub Trends
              </Link>
              <a 
                href="https://huggingface.co" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-[#F2C94C] transition-all duration-200 bg-gray-800/50 px-4 py-2 rounded-full text-sm whitespace-nowrap"
              >
                🤗 HuggingFace
              </a>
            </div>
          </div>
        </div>
      </nav>

      <NewsletterPopup 
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />

      {/* Custom styles for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none; 
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}