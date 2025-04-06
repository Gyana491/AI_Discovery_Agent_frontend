"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import HuggingFaceTabs from "./HuggingFaceTabs";

export default function HuggingFaceStyledUI({
  initialPapers,
  initialTimeFrame,
}) {
  const [timeFrame, setTimeFrame] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedTimeFrame") || initialTimeFrame;
    }
    return initialTimeFrame;
  });

  const [activeTab, setActiveTab] = useState("papers");
  const [papers, setPapers] = useState(initialPapers || []);
  const [models, setModels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint;
        switch (activeTab) {
          case "models":
            endpoint = "/api/huggingface/models";
            break;
          case "datasets":
            endpoint = "/api/huggingface/datasets";
            break;
          case "spaces":
            endpoint = "/api/huggingface/spaces";
            break;
          default:
            endpoint = `${process.env.NEXT_PUBLIC_API_PAPERS}`;
        }

        const response = await fetch(`${endpoint}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        switch (activeTab) {
          case "models":
            setModels(data.models || []);
            break;
          case "datasets":
            setDatasets(data.recentlyTrending || []);
            break;
          case "spaces":
            setSpaces(data || []);
            break;
          default:
            setPapers(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        toast.error(error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const titleMap = {
      today: "Today",
      three_days: "Last 3 Days",
      week: "This Week",
      month: "This Month",
    };
    document.title = `HuggingFace ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - Top ${titleMap[timeFrame]}`;
  }, [timeFrame, activeTab]);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_SUBSCRIBE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("You've successfully subscribed!");
        setEmail("");
        setShowModal(false);
      } else {
        toast.error(result.error || "Subscription failed.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      <Toaster position="top-right" reverseOrder={false} />

      <section className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          INNOVATIVE <span className="text-[#F2C94C]">AI/ML</span> EXPLORER.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[#e0e0e0] leading-relaxed">
          Explore trending content from the HuggingFace community with elegant, user-focused
          design.
        </p>

        <HuggingFaceTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'papers' && (
          <TimeFrameSelector timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
        )}

        <p className="text-[#F2C94C] mt-3 font-medium tracking-wide">
          {loading ? "" : `Showing ${getItemCount()} items`}
        </p>

        {/* Subscribe Button */}
        <div className="mt-10">
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-yellow-300 transition"
          >
            📩 Subscribe for Updates
          </button>
        </div>
      </section>

      {/* Content Section */}
      <section className="mt-20 space-y-10 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-400 mb-4">⚠️ Error loading content</div>
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchData();
              }}
              className="text-[#F2C94C] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          renderContent()
        )}
      </section>

      {/* Subscription Modal */}
      {showModal && (
        <SubscriptionModal
          email={email}
          setEmail={setEmail}
          handleSubscribe={handleSubscribe}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );

  function getItemCount() {
    switch (activeTab) {
      case "models":
        return models.length;
      case "datasets":
        return datasets.length;
      case "spaces":
        return spaces.length;
      default:
        return papers.length;
    }
  }

  function renderContent() {
    switch (activeTab) {
      case "models":
        return models.map((model, index) => (
          <ModelCard
            key={index}
            title={model.modelId.split('/')[1]}
            author={model.author}
            downloads={model.downloads}
            likes={model.likes}
            lastModified={model.lastModified}
            avatarUrl={model.authorAvatar}
            pipeline_tag={model.pipelineTag}
            isGated={model.isGated}
          />
        ));
      case "datasets":
        return datasets.map((dataset, index) => (
          <DatasetCard
            key={index}
            title={dataset.repoData.id}
            author={dataset.repoData.author}
            downloads={dataset.repoData.downloads}
            likes={dataset.repoData.likes}
            lastModified={dataset.repoData.lastModified}
            datasetsServerInfo={dataset.repoData.datasetsServerInfo}
            gated={dataset.repoData.gated}
          />
        ));
      case "spaces":
        return spaces.map((space, index) => (
          <SpaceCard
            key={index}
            id={space.id}
            title={space.title}
            author={space.author}
            authorAvatar={space.authorAvatar}
            description={space.description}
            emoji={space.emoji}
            likes={space.likes}
            lastModified={space.lastModified}
            domains={space.domains}
          />
        ));
      default:
        return papers.map((paper, index) => (
          <PaperRow
            key={index}
            title={paper.title}
            image={paper.image || "/placeholder.jpg"}
            link={paper.link}
            upvotes={paper.upvotes}
            comments={paper.comments}
            submittedBy={paper.submittedBy || "Unknown"}
          />
        ));
    }
  }
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
        active
          ? "bg-[#F2C94C] text-black"
          : "text-[#F2C94C] border border-[#F2C94C] hover:bg-[#F2C94C] hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function ModelCard({ title, author, downloads, likes, lastModified, avatarUrl, pipeline_tag, isGated }) {
  return (
    <div className="bg-[#1c1c2b] rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] p-6 border border-gray-800">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${author}'s avatar`}
                className="w-12 h-12 rounded-full border-2 border-[#F2C94C] shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentElement.innerHTML = `<div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-xl">${author[0].toUpperCase()}</div>`;
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-xl">
                {author[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <a
                href={`https://huggingface.co/${author}/${title}`}
                className="text-xl font-semibold text-[#F2C94C] hover:underline hover:text-yellow-400 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
              {pipeline_tag && (
                <span className="inline-block bg-[#2D1F46] text-[#F2C94C] text-xs px-3 py-1 rounded-full font-medium border border-[#3D2F56] shadow-sm">
                  {pipeline_tag.replace(/-/g, ' ')}
                </span>
              )}
              {isGated && (
                <span className="inline-block bg-yellow-600 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                  Gated Access
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://huggingface.co/${author}`}
                className="text-gray-400 hover:text-[#F2C94C] transition-colors duration-200 text-sm flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                {author}
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-3">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 flex items-center gap-2 bg-[#252535] px-3 py-1 rounded-full">
              <span className="text-lg">⬇️</span>
              <span className="font-medium">{downloads.toLocaleString()}</span>
            </span>
            <span className="text-gray-400 flex items-center gap-2 bg-[#252535] px-3 py-1 rounded-full">
              <span className="text-lg">❤️</span>
              <span className="font-medium">{likes.toLocaleString()}</span>
            </span>
          </div>
          <div className="text-gray-500 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Updated {new Date(lastModified).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function DatasetCard({ title, author, downloads, likes, lastModified, datasetsServerInfo, gated }) {
  if (!title || !author) {
    return null; // Don't render if essential data is missing
  }

  const formattedTitle = title.includes('/') ? title.split('/')[1] : title;
  
  return (
    <div className="bg-[#1c1c2b] rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <a
              href={`https://huggingface.co/datasets/${title}`}
              className="text-xl font-semibold text-[#F2C94C] hover:underline truncate max-w-[300px]"
              target="_blank"
              rel="noopener noreferrer"
              title={formattedTitle}
            >
              {formattedTitle}
            </a>
            {gated && (
              <span className="bg-yellow-600 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                Gated Access
              </span>
            )}
          </div>
          <p className="text-gray-400 mt-1">by {author}</p>
          
          {datasetsServerInfo && (
            <div className="mt-4 space-y-3">
              {datasetsServerInfo.numRows > 0 && (
                <p className="text-gray-400 text-sm">
                  {datasetsServerInfo.numRows.toLocaleString()} rows
                </p>
              )}
              
              {datasetsServerInfo.modalities?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {datasetsServerInfo.modalities.map((modality, index) => (
                    <span 
                      key={index} 
                      className="bg-[#2D1F46] text-[#F2C94C] text-xs px-2 py-1 rounded-full"
                      title={`Modality: ${modality}`}
                    >
                      {modality}
                    </span>
                  ))}
                </div>
              )}
              
              {datasetsServerInfo.formats?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {datasetsServerInfo.formats.map((format, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full"
                      title={`Format: ${format}`}
                    >
                      {format}
                    </span>
                  ))}
                </div>
              )}
              
              {datasetsServerInfo.libraries?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {datasetsServerInfo.libraries.map((library, index) => (
                    <span 
                      key={index} 
                      className="bg-[#1a1a2e] text-gray-400 text-xs px-2 py-1 rounded-full border border-gray-700"
                      title={`Supported library: ${library}`}
                    >
                      {library}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end space-y-2 ml-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 flex items-center gap-1" title="Downloads">
              <span>⬇️</span>
              {downloads?.toLocaleString() || '0'}
            </span>
            <span className="text-gray-400 flex items-center gap-1" title="Likes">
              <span>❤️</span>
              {likes?.toLocaleString() || '0'}
            </span>
          </div>
          <div className="text-gray-400 text-xs">
            Updated: {new Date(lastModified).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpaceCard({ id, title, author, authorAvatar, description, emoji, likes, lastModified, domains }) {
  return (
    <div className="bg-[#1c1c2b] rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] p-6 border border-gray-800">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-shrink-0">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={`${author}'s avatar`}
                className="w-12 h-12 rounded-full border-2 border-[#F2C94C] shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentElement.innerHTML = `<div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-xl">${author[0].toUpperCase()}</div>`;
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-xl">
                {author[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <a
                href={domains ? `https://${domains}` : `https://huggingface.co/spaces/${id}`}
                className="text-xl font-semibold text-[#F2C94C] hover:underline hover:text-yellow-400 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {emoji && <span className="mr-2">{emoji}</span>}
                {title}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://huggingface.co/${author}`}
                className="text-gray-400 hover:text-[#F2C94C] transition-colors duration-200 text-sm flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                {author}
              </a>
            </div>
            {description && (
              <p className="text-gray-400 text-sm mt-3 line-clamp-2">{description}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-3">
          <span className="text-gray-400 flex items-center gap-2 bg-[#252535] px-3 py-1 rounded-full">
            <span className="text-lg">❤️</span>
            <span className="font-medium">{likes.toLocaleString()}</span>
          </span>
          <div className="text-gray-500 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Updated {new Date(lastModified).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeFrameSelector({ timeFrame, setTimeFrame }) {
  return (
    <div className="relative inline-block">
      <select
        value={timeFrame}
        onChange={(e) => {
          setTimeFrame(e.target.value);
          localStorage.setItem("selectedTimeFrame", e.target.value);
        }}
        className="appearance-none bg-gray-800 text-white border border-gray-700 rounded-full px-6 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg font-semibold cursor-pointer"
      >
        <option value="today">Top Today</option>
        <option value="three_days">Top Last 3 Days</option>
        <option value="week">Top This Week</option>
        <option value="month">Top This Month</option>
      </select>
      <svg
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

function PaperRow({ title, image, upvotes, link, comments, submittedBy }) {
  const arxivId = link.split("/").pop();
  const arxivPdfLink = `https://arxiv.org/pdf/${arxivId}`;

  return (
    <div className="bg-[#1c1c2b] rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl md:flex">
      <div className="md:flex-shrink-0">
        <img
          className="h-56 w-full object-cover md:w-56"
          src={image}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.parentElement.innerHTML = `
              <div class="h-56 w-full md:w-56 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-4xl">
                ${title[0].toUpperCase()}
              </div>
            `;
          }}
        />
      </div>
      <div className="p-8 w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <a
              href={link}
              className="block text-xl leading-tight font-semibold text-white hover:underline mb-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {title}
            </a>
            <div className="text-sm text-gray-400">
              Submitted by {submittedBy}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-300">
              ⬆ {upvotes}
            </div>
            <div className="flex items-center text-gray-400">💬 {comments}</div>
          </div>
        </div>
        <div className="flex space-x-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F2C94C] hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
          >
            View on HuggingFace
          </a>
          <a
            href={arxivPdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#F2C94C] text-[#F2C94C] hover:bg-[#F2C94C] hover:text-black font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
          >
            View PDF
          </a>
        </div>
      </div>
    </div>
  );
}

function SubscriptionModal({ email, setEmail, handleSubscribe, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white text-black rounded-xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Subscribe to Email Digest</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="flex justify-between">
          <button
            onClick={handleSubscribe}
            className="bg-yellow-400 px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition"
          >
            Subscribe
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
