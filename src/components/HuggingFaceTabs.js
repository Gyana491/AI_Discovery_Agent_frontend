export default function HuggingFaceTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'papers', label: '📄 Papers' },
    { id: 'models', label: '🤖 Models' },
    { id: 'datasets', label: '📊 Datasets' },
    { id: 'spaces', label: '🚀 Spaces' }
  ];

  return (
    <div className="flex justify-center space-x-4 mb-8">
      {tabs.map(({ id, label }) => (
        <TabButton
          key={id}
          active={activeTab === id}
          onClick={() => onTabChange(id)}
        >
          {label}
        </TabButton>
      ))}
    </div>
  );
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