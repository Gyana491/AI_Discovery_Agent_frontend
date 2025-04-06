"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function TrendingGitHub() {
  const [activeTab, setActiveTab] = useState("repos"); // tabs: "repos", "developers"
  const [repos, setRepos] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingData = async () => {
      setLoading(true);
      try {
        const [repoRes, devRes] = await Promise.all([
          fetch(process.env.NEXT_PUBLIC_API_GITHUB_REPO),
          fetch(process.env.NEXT_PUBLIC_API_GITHUB_DEV),
        ]);

        const repoData = await repoRes.json();
        const devData = await devRes.json();

        setRepos(repoData);
        setDevelopers(devData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  return (
    <div
      className="min-h-screen pt-32 md:pt-36 pb-8 md:pb-12 px-4 md:px-8 lg:px-12"
      style={{ background: "linear-gradient(to bottom, #201B2C, #2D1F46)" }}
    >
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-4 text-white leading-tight">
          Trending on <span className="text-[#F2C94C]">GitHub</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-gray-300">
          Discover the hottest repositories and developers rising in popularity
          across the GitHub community.
        </p>

        <Link href="https://github.com/trending" target="_blank">
          <button className="bg-[#F2C94C] text-[#1B3B4A] px-6 py-2 rounded-full font-semibold hover:scale-105 transition duration-200 shadow">
            Explore on GitHub ↗
          </button>
        </Link>
      </section>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto flex gap-6 justify-center mt-10">
        <button
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "repos"
              ? "bg-[#F2C94C] text-black"
              : "bg-[#2D1F46] text-white border border-[#F2C94C]"
          }`}
          onClick={() => setActiveTab("repos")}
        >
          🔥 Trending Repositories
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "developers"
              ? "bg-[#F2C94C] text-black"
              : "bg-[#2D1F46] text-white border border-[#F2C94C]"
          }`}
          onClick={() => setActiveTab("developers")}
        >
          👨‍💻 Trending Developers
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Trending Repositories */}
          {activeTab === "repos" && (
            <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {repos.map((repo, index) => (
                <RepoCard
                  key={index}
                  title={repo.title}
                  repo_url={repo.repo_url}
                  description={repo.description}
                  language={repo.language}
                  stars={repo.stars}
                  forks={repo.forks}
                  todayStars={repo.todayStars}
                />
              ))}
            </section>
          )}

          {/* Trending Developers */}
          {activeTab === "developers" && (
            <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {developers.map((dev, index) => (
                <DevoCard
                  key={index}
                  username={dev.username}
                  avatar={dev.avatar}
                  description={dev.description}
                  language={dev.repo_url}
                  stars={dev.stars}
                  forks={dev.forks}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

// Repo Card
function RepoCard({
  title,
  repo_url,
  description,
  language,
  stars,
  forks,
  todayStars,
}) {
  return (
    <div className="bg-[#2D1F46] text-white rounded-2xl p-6 shadow-lg border border-[#3B2B64] hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-bold text-[#F2C94C] mb-1">
        <a href={repo_url} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h2>
      <p className="text-gray-300 text-sm mb-4">{description}</p>
      <div className="flex justify-between text-sm text-gray-400">
        <div>
          <span className="block">Language: {language}</span>
          <span className="block">{todayStars}</span>
        </div>
        <div className="flex gap-4 items-end">
          <span>⭐ {stars}</span>
          <span>🍴 {forks}</span>
        </div>
      </div>
    </div>
  );
}

// Developer Card
function DevoCard({ username, avatar, description, language, stars, forks }) {
  return (
    <div className="bg-[#2D1F46] text-white rounded-2xl p-6 shadow-lg border border-[#3B2B64] hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-4 mb-3">
        {avatar ? (
          <img
            src={avatar}
            alt={`${username}'s avatar`}
            className="w-10 h-10 rounded-full border border-[#F2C94C]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentElement.innerHTML = `<div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-lg">${username[0].toUpperCase()}</div>`;
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-lg">
            {username[0].toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-[#F2C94C]">{username}</h2>
          <a
            href={language}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 underline"
          >
            Visit Repo
          </a>
        </div>
      </div>
      <p className="text-gray-300 text-sm mb-3">{description}</p>
      <div className="text-sm text-gray-400 flex justify-between items-center">
        <span className="text-blue-400">Repo_URL: {language}</span>
        <div className="flex gap-4">
          <span>⭐ {stars}</span>
          <span>🍴 {forks}</span>
        </div>
      </div>
    </div>
  );
}