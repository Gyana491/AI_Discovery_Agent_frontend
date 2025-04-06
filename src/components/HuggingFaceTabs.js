export default function HuggingFaceTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto mb-8">
      <TabButton
        active={activeTab === "papers"}
        onClick={() => onTabChange("papers")}
      >
        Papers
      </TabButton>
      <TabButton
        active={activeTab === "models"}
        onClick={() => onTabChange("models")}
      >
        Models
      </TabButton>
      <TabButton
        active={activeTab === "datasets"}
        onClick={() => onTabChange("datasets")}
      >
        Datasets
      </TabButton>
      <TabButton
        active={activeTab === "spaces"}
        onClick={() => onTabChange("spaces")}
      >
        Spaces
      </TabButton>
    </div>
  );
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-200 min-w-[140px] ${
        active
          ? "bg-[#F2C94C] text-black transform hover:scale-105"
          : "text-[#F2C94C] border-2 border-[#F2C94C] hover:bg-[#F2C94C] hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}