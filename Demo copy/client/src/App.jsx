import React, { useEffect, useState, useRef } from "react";

// --- Placeholder Icons (replace with your actual icon library if available) ---
const Lightbulb = ({ className }) => <span className={className}>💡</span>;
const LightbulbOff = ({ className }) => <span className={className}>⚪</span>;
const PresentationChart = ({ className }) => <span className={className}>📊</span>;
const PencilIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const ArrowElbowRight = ({ className }) => <span className={className}>↪️</span>;
const ListNumbers = ({ className }) => <span className={className}>#️⃣</span>;
const Wrench = ({ className }) => <span className={className}>🔧</span>;
// --- NEW ICONS for Client Specific Details ---
const Cube = ({ className }) => <span className={className}>📦</span>;
const CalendarIcon = ({ className }) => <span className={className}>📅</span>;
const Calendar = ({ className }) => <span className={className}>📅</span>;
const ArrowsClockwise = ({ className }) => <span className={className}>🔄</span>;
const ProjectListIcon = ({ className }) => (
  <span className={`${className} relative flex items-center justify-center`}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full text-yellow-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3/5 h-3/5 absolute text-green-600"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg>
  </span>
);
const ChartLineUp = ({ className }) => <span className={className}>📈</span>;
const Eye = ({ className }) => <span className={className}>👁️</span>;
// -----------------------------------------------------------------------------

// --- Skeleton Component ---
function Skeleton({ className, variant = 'default' }) {
  const baseClass = 'skeleton rounded';
  const variantClasses = {
    card: 'skeleton-card',
    text: 'skeleton-text',
    avatar: 'skeleton-avatar',
    button: 'skeleton-button',
    default: ''
  };
  return <div className={`${baseClass} ${variantClasses[variant]} ${className}`}></div>;
}
// --- End Skeleton Component ---

const categoryColors = {
  "Client": "from-lime-400 to-emerald-500 border-lime-600 text-gray-900 dark:from-lime-700 dark:to-emerald-600 dark:border-lime-400 dark:text-gray-100",
  "Sycamore": "from-cyan-400 to-teal-500 border-cyan-600 text-gray-900 dark:from-cyan-700 dark:to-teal-600 dark:border-cyan-400 dark:text-gray-100",
  "Sycamore and Client": "from-violet-400 to-purple-500 border-violet-600 text-gray-900 dark:from-violet-700 dark:to-purple-600 dark:border-violet-400 dark:text-gray-100",
};

const cardColors = {
  "Client": "from-lime-300 to-emerald-400 border-lime-500 text-gray-900 dark:from-lime-600 dark:to-emerald-500 dark:border-lime-300 dark:text-gray-100",
  "Sycamore": "from-cyan-300 to-teal-400 border-cyan-500 text-gray-900 dark:from-cyan-600 dark:to-teal-500 dark:border-cyan-300 dark:text-gray-100",
  "Sycamore and Client": "from-violet-300 to-purple-400 border-violet-500 text-gray-900 dark:from-violet-600 dark:to-purple-500 dark:border-violet-300 dark:text-gray-100",
};

// --- NEW: Product Update Tabs Configuration ---
const PRODUCT_TABS = [
  { key: 'currentState', title: 'Current State', icon: PresentationChart },
  { key: 'nextUp', title: 'Next Up', icon: ArrowElbowRight },
  { key: 'top3', title: 'Top 3 Items in Upcoming Release(s)', icon: ListNumbers },
  { key: 'techStack', title: 'Tech Stack/Infra Upgrades', icon: Wrench },
];

// --- NEW: Client Specific Details Tabs Configuration ---
const CLIENT_SPECIFIC_TABS = [
  { key: 'deploymentDetails', title: 'Deployment Details', icon: Cube },
  { key: 'scheduledActivities', title: 'Scheduled Activities/ Backlog', icon: Calendar },
  { key: 'productAlignment', title: 'Product Development & Services Alignment', icon: ArrowsClockwise },
  { key: 'performanceMetrics', title: 'Performance Metrics from last week', icon: ChartLineUp },
];

// Fixed API_BASE declaration
const API_BASE = "http://localhost:4000";

// --- FULL SUBCATEGORY MAP (Matching the provided form image) ---
const FULL_SUBCATEGORY_MAP = {
  "Customer Information with Sycamore Personal": [
    { key: "Customer Name", category: "Client", initialValue: "" },
    { key: "Customer Location", category: "Client", initialValue: "" },
    { key: "Logo", category: "Client", initialValue: "" },
    { key: "Customer Description", category: "Client", initialValue: "" },
    { key: "Customer Since When / Initial Go Live", category: "Sycamore", initialValue: "" },
    { key: "Number of Active Users", category: "Client", initialValue: "" },
    { key: "Number of Full Users", category: "Client", initialValue: "" },
    { key: "Number of Other Users", category: "Client", initialValue: "" },
    { key: "Business", category: "Client", initialValue: "" },
    { key: "Quality", category: "Sycamore", initialValue: "" },
    { key: "CSM", category: "Sycamore", initialValue: "" },
    { key: "Production Operation POC", category: "Sycamore", initialValue: "" },
    { key: "Lead BA", category: "Sycamore", initialValue: "" },
    { key: "Backup CSM", category: "Sycamore", initialValue: "" },
    { key: "Support Lead", category: "Sycamore", initialValue: "" },
    { key: "Technical", category: "Sycamore", initialValue: "" },
    { key: "Customer POC", category: "Sycamore", initialValue: "" },
    { key: "Specialist in Sycamore Informatics", category: "Sycamore", initialValue: "" },
    { key: "SME", category: "Sycamore", initialValue: "" },
    { key: "Support Team", category: "Sycamore", initialValue: "" },
    { key: "Escalation Matrix", category: "Sycamore", initialValue: "" },
  ],
  "Product & Versions": [
    { key: "Sycamore Informatics Product", category: "Sycamore", initialValue: "" },
    { key: "Add-on Modules", category: "Sycamore", initialValue: "" },
    { key: "Next Planned Version in Development", category: "Sycamore", initialValue: "" },
    { key: "Next Planned Version of Release", category: "Sycamore", initialValue: "" },
    { key: "Major Features Used or Requested", category: "Sycamore", initialValue: "" },
    { key: "Release Notes", category: "Sycamore", initialValue: "" },
    { key: "Product Documents", category: "Sycamore", initialValue: "" },
    { key: "Deployment Documents", category: "Sycamore", initialValue: "" },
    { key: "BCP - Business Continuity Plan", category: "Sycamore and Client", initialValue: "" }, 
  ],
  "Server & Infrastructure Usage": [
    { key: "CPU", category: "Sycamore", initialValue: "" },
    { key: "Memory", category: "Sycamore", initialValue: "" },
    { key: "App Cloud", category: "Sycamore", initialValue: "" },
    { key: "Data Cloud", category: "Sycamore", initialValue: "" },
    { key: "Compute Cloud", category: "Sycamore", initialValue: "" },
    { key: "Database", category: "Sycamore", initialValue: "" },
    { key: "Architecture", category: "Sycamore", initialValue: "" }, 
    { key: "Hosting Platform", category: "Sycamore", initialValue: "" }, 
    { key: "Project Lifecycle Status", category: "Sycamore", initialValue: "" }, 
    { key: "Software Licenses Details", category: "Sycamore and Client", initialValue: "" }, 
    { key: "OS & Version", category: "Sycamore and Client", initialValue: "" }, 
    { key: "Environments", category: "Sycamore and Client", initialValue: "" }, 
    { key: "Hosting Details", category: "Sycamore and Client", initialValue: "" }, 
    { key: "RDP", category: "Sycamore", initialValue: "" },
    { key: "RTO", category: "Sycamore", initialValue: "" },
    { key: "RPO", category: "Sycamore", initialValue: "" },
    { key: "RTM", category: "Sycamore", initialValue: "" },
    { key: "RTMVE", category: "Sycamore", initialValue: "" },
    { key: "System Availability", category: "Sycamore", initialValue: "" },
  ],
  "Support & Tickets": [
    { key: "Critical Tickets", category: "Sycamore", initialValue: "" },
    { key: "High", category: "Sycamore", initialValue: "" },
    { key: "Medium", category: "Sycamore", initialValue: "" },
    { key: "Low", category: "Sycamore", initialValue: "" },
    { key: "Ticket Volume and Resolution Time", category: "Sycamore", initialValue: "" },
    { key: "Backlog tickets/issues", category: "Sycamore", initialValue: "" }, 
    { key: "Capacity Planned", category: "Sycamore", initialValue: "" }, 
    { key: "Escalation Matrix", category: "Sycamore", initialValue: "" }, 
    { key: "Support Team", category: "Sycamore", initialValue: "" }, 
  ],
  "Process & Compliance": [
    { key: "SOW", category: "Sycamore", initialValue: "" }, 
    { key: "Quality Process", category: "Sycamore", initialValue: "" }, 
    { key: "Quality Management", category: "Sycamore", initialValue: "" }, 
    { key: "QM and Certifications", category: "Sycamore", initialValue: "" },
    { key: "Training & Onboarding (Client Data)", category: "Sycamore", initialValue: "" },
  ],
  "Stakeholders & Business Modules": [
    { key: "Business - contact", category: "Client", initialValue: "" }, 
    { key: "BOM", category: "Client", initialValue: "" }, 
    { key: "Customer Sentiment", category: "Client", initialValue: "" }, 
    { key: "Other Client-Specific Tools", category: "Client", initialValue: "" }, 
    { key: "Language supported", category: "Sycamore and Client", initialValue: "" }, 
  ],
  "Licensing & Tools": [
    { key: "Windows Licensing", category: "Sycamore", initialValue: "" },
    { key: "CAL", category: "Sycamore", initialValue: "" },
    { key: "SAL", category: "Sycamore", initialValue: "" },
    { key: "MS Office", category: "Sycamore", initialValue: "" },
    { key: "Other Licensing", category: "Sycamore", initialValue: "" },
    { key: "Adobe", category: "Sycamore", initialValue: "" },
    { key: "Notepad", category: "Sycamore", initialValue: "" },
  ]
};

// Flatten the map to get initial state object for the form
const getInitialFormState = () => {
  const state = {};
  Object.values(FULL_SUBCATEGORY_MAP).forEach(group => {
    group.forEach(item => {
      state[item.key] = item.initialValue;
    });
  });
  return state;
};

// --- AddClientModal Component ---
function AddClientModal({
  isVisible,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) {
  const [formData, setFormData] = useState(initialData);
  const [clientName, setClientName] = useState("");
  const [color, setColor] = useState("#4f46e5"); // Default color
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (isVisible) {
      setFormData(getInitialFormState());
      setClientName("");
      setColor("#4f46e5");
      setLogoFile(null);
      // Clear file input on open/reset
      const fileInput = document.getElementById('logo-upload');
      if(fileInput) fileInput.value = '';
    }
  }, [isVisible]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Limit file type to PNG and size (optional but good practice)
      if (e.target.files[0].type !== 'image/png') {
        window.alert("Please upload a PNG file.");
        e.target.value = '';
        setLogoFile(null);
        return;
      }
      setLogoFile(e.target.files[0]);
    } else {
      setLogoFile(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      window.alert("Client Name is required.");
      return;
    }

    // Transform formData into the structure expected by the backend
    const customerData = {
      Client: [],
      Sycamore: [],
      "Sycamore and Client": [],
    };

    Object.values(FULL_SUBCATEGORY_MAP).forEach(group => {
      group.forEach(item => {
        // Use the value from the form data state
        const value = formData[item.key]?.trim() || '';

        // Only include fields that have a value
        if (value) {
          customerData[item.category].push(`${item.key}: ${value}`);
        }
      });
    });

    // Pass everything to the parent handler
    onSubmit({
      customerName: clientName.trim(),
      customerData: customerData,
      logoFile: logoFile,
      color: color,
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-full sm:max-w-6xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 dark:text-gray-200 animate-slide-in mx-2 sm:mx-4" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="text-black">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
            <h2 className="text-responsive-3xl font-bold text-black dark:text-white">Add New Client</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus-ring animate-hover-lift" aria-label="Close modal">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

            <div className="p-4 sm:p-6">
            {/* Top General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 text-black animate-fade-in">
              <div className="col-span-1">
                <label className="block text-responsive-sm font-medium text-black dark:text-gray-300">Client Name <span className="text-red-500">*</span></label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 dark:bg-gray-900 text-gray-900 dark:text-white focus-ring" />
              </div>
              <div className="col-span-1">
                <label className="block text-responsive-sm font-medium text-black dark:text-gray-300">Color (for card/logo)</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 block w-full h-10 rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-1 dark:bg-gray-900 focus-ring" />
              </div>
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <label className="block text-responsive-sm font-medium text-black dark:text-gray-300">Logo Image (.png)</label>
                <input id="logo-upload" type="file" accept="image/png" onChange={handleFileChange} className="mt-1 block w-full text-responsive-sm text-black dark:text-gray-400 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 focus-ring" />
                {logoFile && <p className="text-responsive-sm text-green-500 mt-1">Ready to upload: {logoFile.name}</p>}
              </div>
            </div>

            {/* Form Fields - Based on Screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {Object.entries(FULL_SUBCATEGORY_MAP).map(([groupTitle, items]) => (
                <div key={groupTitle} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl text-black dark:text-white animate-fade-in">
                  <h3 className="text-responsive-lg font-semibold mb-4 border-b pb-2 dark:text-white text-black">{groupTitle}</h3>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.key}>
                        <label className="block text-responsive-sm font-medium text-black dark:text-gray-400">
                          {item.key} <span className="text-responsive-sm font-normal text-blue-500">({item.category})</span>
                        </label>
                        <input
                          type="text"
                          value={formData[item.key]}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 dark:bg-gray-900 text-gray-900 dark:text-white focus-ring"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus-ring animate-hover-lift"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2 focus-ring animate-hover-lift"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// --- End AddClientModal Component ---

// --- RichTextEditor Component ---
function RichTextEditor({ value, onChange, placeholder, readOnly = false }) {
  const editorRef = useRef(null);
  const [showColorPalette, setShowColorPalette] = useState(false);

  useEffect(() => {
    // Only update the innerHTML if it's different from the prop value
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const changeFontSize = (direction) => {
    // Using 'fontSize' with relative sizes (1-7) is more reliable than pixel manipulation.
    const currentSize = document.queryCommandValue('fontSize') || '3'; // Default to normal size
    let newSize = parseInt(currentSize, 10);
    newSize = direction === 'increase' ? Math.min(newSize + 1, 7) : Math.max(newSize - 1, 1);
    handleCommand('fontSize', newSize.toString());
  };
  
  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          if (editorRef.current) {
            editorRef.current.focus();
          }
          handleCommand('insertImage', imageUrl);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleColorSelect = (color) => {
    handleCommand('foreColor', color);
    setShowColorPalette(false);
  };

  const colors = [
    '#000000', '#16A34A', '#14B8A6', '#06B6D4', '#0891B2', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#FFFFFF', '#15803D', '#0D9488', '#0E7490', '#075985', '#2563EB', '#4F46E5', '#7C3AED', '#9333EA', '#C026D3',
    '#F8FAFC', '#166534', '#134E4A', '#155E75', '#0C4A6E', '#1E40AF', '#3730A3', '#5B21B6', '#7E22CE', '#A21CAF',
    '#F1F5F9', '#14532D', '#115E59', '#164E63', '#083344', '#1E3A8A', '#312E81', '#4C1D95', '#6B21A8', '#86198F',
    '#E2E8F0', '#064E3B', '#134E4A', '#083344', '#042f2e', '#1C2E59', '#282A66', '#3B096C', '#581C87', '#701A75',
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
      {!readOnly && (
        <div className="flex items-center flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
          <button type="button" onClick={() => handleCommand('bold')} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-bold text-black dark:text-white">B</button>
          <button type="button" onClick={() => handleCommand('italic')} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 italic text-black dark:text-white">I</button>
          <button type="button" onClick={() => handleCommand('underline')} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 underline text-black dark:text-white">U</button>
          <button type="button" onClick={() => changeFontSize('increase')} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-lg text-black dark:text-white">A+</button>
          <button type="button" onClick={() => changeFontSize('decrease')} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-xs text-black dark:text-white">A-</button>
          <button type="button" onClick={handleAddImage} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white">🖼️</button>
          <div className="relative">
            <button type="button" onClick={() => setShowColorPalette(!showColorPalette)} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white">🎨</button>
            {showColorPalette && (
              <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg p-2 grid grid-cols-5 gap-1">
                {colors.map(color => (
                  <button key={color} type="button" onClick={() => handleColorSelect(color)} className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-500" style={{ backgroundColor: color }}></button>
                ))}
              </div>
          )}
          </div>
        </div>
      )}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={(e) => !readOnly && onChange(e.currentTarget.innerHTML)}
        className={`w-full h-48 p-4 focus:outline-none overflow-y-auto ${readOnly ? 'bg-gray-100 dark:bg-gray-800 cursor-default' : ''}`}
        placeholder={placeholder}
        style={{
          minHeight: '12rem', // Equivalent to h-48
          '--placeholder-text': `"${placeholder}"`,
        }}
      ></div>
    </div>
  );
}
// --- End RichTextEditor Component ---

// --- EditClientModal Component ---
function EditClientModal({ clientName, onClose, onEditLogo, onEditBackground, onHideClient, onUnhideClient, isHidden }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4 dark:text-white">Edit {clientName}</h3>
        <div className="space-y-3">
          <button
            className="w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600"
            onClick={() => { onEditBackground(clientName); onClose(); }}
          >
            Edit Background
          </button>
          <button
            className={`w-full text-white py-2 px-4 rounded ${isHidden ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
            onClick={() => { isHidden ? onUnhideClient(clientName) : onHideClient(clientName); onClose(); }}
          >
            {isHidden ? 'Unhide Client' : 'Delete(HIDE) Client'}
          </button>
        </div>
        <button
          className="mt-6 w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// --- UploadLogoModal Component ---
function UploadLogoModal({ clientName, onClose, onLogoUpdated }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('logo', selectedFile);
    formData.append('clientName', clientName); // Pass clientName for filename

    try {
      // Upload the file and update the sheet in one request
      const response = await fetch(`${API_BASE}/api/customers/${clientName}/logo`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload logo and update sheet.');
      }

      onLogoUpdated(); // Callback to refresh logos in App.jsx
      onClose();

    } catch (err) {
      console.error("Logo upload/update failed:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4 dark:text-white">Upload Logo for {clientName}</h3>
        <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="mb-4 text-black dark:text-white" />
        {selectedFile && <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Selected: {selectedFile.name}</p>}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleUpload}
            disabled={loading || !selectedFile}
          >
            {loading ? 'Uploading...' : 'Upload & Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ColorPickerModal Component ---
function ColorPickerModal({ clientName, onClose, onColorSaved, initialColor }) {
  const [selectedColor, setSelectedColor] = useState(initialColor || '#ffffff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/customers/${clientName}/background`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color: selectedColor }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save background color.');
      }

      onColorSaved(clientName, selectedColor); // Update UI state
      onClose();
    } catch (err) {
      console.error("Saving background color failed:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4 dark:text-white">Choose Background for {clientName}</h3>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="w-full h-24 mb-4 border rounded"
        />
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Color'}
          </button>
        </div>
      </div>
    </div>
  );
};

// New Component in App.jsx (above App export)
function TrackerModal({ isVisible, clientName, onClose, onSave, isSaving, initialData }) {
    // --- Add this conversion utility inside TrackerModal (or globally in App.jsx) ---
    const excelSerialToJSDate = (serial) => {
        // 1. Subtract the epoch difference (41295 is 2013-01-01)
        // 2. Adjust for Windows vs Mac Excel epochs (only needed for edge cases, keeping simple)
        const excelEpoch = new Date(Date.UTC(1899, 11, 30)); 
        const days = serial - 1; // Excel days are 1-based, JS is 0-based day diff

        const ms = days * 24 * 60 * 60 * 1000;
        const date = new Date(excelEpoch.getTime() + ms);
        
        // Check if conversion resulted in an invalid date
        if (isNaN(date.getTime())) {
            return null;
        }
        return date;
    };

    // Utility function to convert a Date object to MM/DD/YYYY format
    const dateToMmddyyyy = (date) => {
        if (!date) return null;
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const y = date.getFullYear();
        return `${m}/${d}/${y}`;
    };

    // Utility function to convert MM/DD/YYYY to YYYY-MM-DD (for input[type=date])
    const mmddyyyyToYyyymmdd = (dateStr) => {
        // Expected dateStr format: MM/DD/YYYY
        if (!dateStr || dateStr.length !== 10) return '';
        const [m, d, y] = dateStr.split('/');
        return `${y}-${m}-${d}`;
    };
    // Utility function to convert YYYY-MM-DD back to MM/DD/YYYY (for state keys)
    const yyyymmddToMmddyyyy = (dateStr) => {
        // Expected dateStr format: YYYY-MM-DD
        if (!dateStr || dateStr.length !== 10) return '';
        const [y, m, d] = dateStr.split('-');
        return `${m}/${d}/${y}`;
    };

    // NEW STATE: Holds cleaned data
    const [processedData, setProcessedData] = useState({});

    // State for the YYYY-MM-DD format (used by input[type=date])
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [content, setContent] = useState('');

    const [showAllEntries, setShowAllEntries] = useState(false); // NEW state for toggling view
    // The key used to look up the data in processedData (MM/DD/YYYY)
    const selectedDateKey = yyyymmddToMmddyyyy(selectedDate);
    const currentYear = new Date(selectedDate).getFullYear();


    // NEW EFFECT: Clean the initialData and set the processedData state
    useEffect(() => {
        const cleanedData = {};
        for (const key in initialData) {
            let dateKey = key;
            
            // 1. Check if the key is an Excel Serial Number
            if (!isNaN(key) && Number(key) > 30000) { // High number check
                const dateObj = excelSerialToJSDate(Number(key));
                dateKey = dateToMmddyyyy(dateObj); // Convert to MM/DD/YYYY
            } else if (typeof key === 'string' && key.includes('-')) {
                 // 2. Handle a potential YYYY-MM-DD format key and convert it to MM/DD/YYYY
                 dateKey = yyyymmddToMmddyyyy(key);
            }

            if (dateKey && dateKey !== 'NaN/NaN/NaN') {
                cleanedData[dateKey] = initialData[key];
            }
        }
        setProcessedData(cleanedData);
        
        // Ensure content updates after processing is complete
        setContent(cleanedData[selectedDateKey] || '');
    }, [initialData]); // Run only when initialData (prop) changes


    // Effect to UPDATE THE CONTENT whenever the selectedDateKey changes
    useEffect(() => {
        // Now use the cleaned processedData
        setContent(processedData[selectedDateKey] || '');
    }, [selectedDateKey, processedData]);
    // Get sorted dates from the processed data
    const sortedDates = Object.keys(processedData).sort((a, b) => {
        // Parse date strings (MM/DD/YYYY) to Date objects for comparison
        const parseDate = (dateStr) => {
            const [m, d, y] = dateStr.split('/');
            return new Date(y, m - 1, d);
        };
        return parseDate(b) - parseDate(a); // Sort descending (newest first)
    });

    const monthlyGroupedDates = sortedDates.reduce((acc, dateKey) => {
        const dateParts = dateKey.split('/'); // MM/DD/YYYY
        // Create a display key like "December 2025"
        const monthYearKey = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]).toLocaleString('en-US', { month: 'long', year: 'numeric' });
        
        if (!acc[monthYearKey]) {
            acc[monthYearKey] = [];
        }
        acc[monthYearKey].push(dateKey);
        return acc;
    }, {});

    // Get the sorted month/year keys (e.g., ["December 2025", "November 2025"])
    const sortedMonthYearKeys = Object.keys(monthlyGroupedDates).sort((a, b) => {
        // Simple date parsing for comparison
        return new Date(b) - new Date(a); 
    });
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden transform transition-all duration-500 dark:text-gray-200 animate-slide-in" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="sticky top-0 bg-indigo-600 dark:bg-indigo-800 p-5 border-b border-indigo-700 flex justify-between items-center z-10 text-white rounded-t-3xl">
                    <h2 className="text-3xl font-extrabold flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8" />
                        {clientName} Tracker ({currentYear})
                    </h2>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-indigo-700 transition-all focus-ring" aria-label="Close modal">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Content Grid (Journal Layout) */}
                <div className="flex h-full max-h-[calc(90vh-80px)]">
                    
                    {/* Left Column: Date/History Sidebar (Journal Aesthetics) */}
                    <div className="w-1/4 min-w-[280px] p-4 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto theme-text-primary flex-shrink-0">
                        <h3 className="text-xl font-bold mb-4 border-b pb-2 text-indigo-600 dark:text-indigo-400">Tracker Entries ({sortedDates.length})</h3>
                        
                        {/* Date Picker for new/current entry */}
                        <div className="mb-4 p-3 rounded-xl shadow-inner bg-white dark:bg-gray-700">
                            <label className="block text-sm font-medium mb-1">Select Date for Entry:</label>
                            <input 
                                type="date" 
                                value={selectedDate} 
                                onChange={(e) => setSelectedDate(e.target.value)} 
                                disabled={showAllEntries} // Disable when viewing all entries
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 focus-ring"
                            />
                            <p className="mt-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                {processedData[selectedDateKey] ? `Viewing existing entry for ${selectedDateKey}` : `Starting new entry for ${selectedDateKey}`}
                            </p>
                        </div>
                        
                        {/* History List - Aesthetic List */}
                        <div className="space-y-4 mt-4"> 
                            {sortedMonthYearKeys.map(monthYearKey => (
                                <div key={monthYearKey}>
                                    <h4 className="text-sm font-semibold sticky top-0 bg-gray-50 dark:bg-gray-800 py-1 z-0 text-gray-500 dark:text-gray-400">
                                        {monthYearKey}
                                    </h4>
                                    <div className="space-y-2 pt-1">
                                        {monthlyGroupedDates[monthYearKey].map(dateKey => (
                                            <button
                                                key={dateKey}
                                                onClick={() => {
                                                    setSelectedDate(mmddyyyyToYyyymmdd(dateKey)); 
                                                    setShowAllEntries(false); // Switch back to single entry view
                                                }}
                                                className={`w-full text-left p-3 rounded-lg transition-all duration-200 theme-bg-secondary hover:bg-indigo-100 dark:hover:bg-indigo-900 border ${
                                                    dateKey === selectedDateKey
                                                        ? 'bg-indigo-50 dark:bg-indigo-700 border-indigo-500 font-bold shadow-md'
                                                        : 'border-gray-200 dark:border-gray-700'
                                                }`}
                                            >
                                                <span className="block text-lg">{dateKey}</span>
                                                <span className="text-xs theme-text-secondary truncate block">
                                                    {/* Shortened character count for display */}
                                                    {getCharacterCount(processedData[dateKey] || '')} chars saved
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {sortedDates.length === 0 && <p className="text-center text-gray-500 italic pt-4">No past entries found.</p>}
                        </div>
                    </div>

                    {/* Right Column: Editor/Content Display */}
                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto theme-text-primary">
                        <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                            <span>Entry Details</span>
                            <button
                                onClick={() => setShowAllEntries(!showAllEntries)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm focus-ring"
                            >
                                {showAllEntries ? 'View Single Entry' : 'View All'}
                            </button>
                        </h3>

                        {showAllEntries ? (
                            <div className="space-y-6">
                                {sortedMonthYearKeys.map(monthYearKey => (
                                    <div key={monthYearKey}>
                                        <h4 className="text-xl font-bold mb-3 text-indigo-500 dark:text-indigo-300 sticky top-0 bg-white dark:bg-gray-900 py-2 z-10">
                                            {monthYearKey}
                                        </h4>
                                        <div className="space-y-4">
                                            {monthlyGroupedDates[monthYearKey].map(dateKey => (
                                                <div key={dateKey} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
                                                    <p className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">{dateKey}</p>
                                                    <div
                                                        className="prose dark:prose-invert max-w-none text-white" // Added text-white for visibility
                                                        dangerouslySetInnerHTML={{ __html: processedData[dateKey] || '<p class="text-gray-300 italic">No content</p>' }} // Adjusted placeholder color
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {sortedDates.length === 0 && <p className="text-center text-gray-500 italic pt-4">No past entries found.</p>}
                            </div>
                        ) : (
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder={`Document your tracker data for ${selectedDateKey}...`}
                                readOnly={false} // Ensure it's editable in single entry view
                            />
                        )}
                    </div>
                </div>

                {/* Footer: Save/Cancel */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 z-10 rounded-b-3xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border rounded-xl text-black dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition focus-ring animate-hover-lift"
                    >
                        Close
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving || showAllEntries} // Disable when viewing all entries
                        onClick={() => onSave(selectedDateKey, content)} // Pass selectedDateKey (MM/DD/YYYY)
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center gap-2 focus-ring animate-hover-lift"
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : 'Save Entry'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- NEW: ProjectListModal Component ---
function ProjectListModal({ isVisible, clientName, onClose, onSave, isSaving, initialData }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [content, setContent] = useState('');

  useEffect(() => {
    // Update content when the selected year or initial data changes
    setContent(initialData[selectedYear] || '');
  }, [selectedYear, initialData]);

  if (!isVisible) return null;

  const yearOptions = [2024, 2025, 2026]; // Example years

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-500 dark:text-gray-200 animate-slide-in" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="sticky top-0 bg-yellow-500 dark:bg-yellow-700 p-5 border-b border-yellow-600 flex justify-between items-center z-10 text-white rounded-t-3xl">
          <h2 className="text-3xl font-extrabold flex items-center gap-3 text-gray-900 dark:text-white">
            <ProjectListIcon className="w-8 h-8" />
            {clientName} Project List
          </h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-yellow-600 transition-all focus-ring" aria-label="Close modal">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-lg font-medium text-black dark:text-gray-300">Select Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="p-2 border rounded-md dark:bg-gray-700 text-black dark:text-white"
            >
              {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder={`Enter project list summary for ${selectedYear}...`}
          />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 z-10 rounded-b-3xl">
          <button type="button" onClick={onClose} className="px-6 py-2 border rounded-xl text-black dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition focus-ring">
            Close
          </button>
          <button
            type="submit"
            disabled={isSaving}
            onClick={() => onSave(selectedYear, content)}
            className="px-6 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-xl shadow-md hover:bg-yellow-600 transition disabled:bg-yellow-300 disabled:cursor-not-allowed flex items-center gap-2 focus-ring"
          >
            {isSaving ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div> Saving...</>
            ) : 'Save Project List'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- NEW: ClientSpecificDetailsSection Component ---
function ClientSpecificDetailsSection({
    selectedCustomer,
    selectedWeek,
    clientSpecificData,
    setClientSpecificData,
    activeClientTab,
    setActiveClientTab,
    handleSaveClientSpecificData,
    isSavingClientSpecificData,
    isEditing,
    onEditToggle,
    isEditingClientSpecificDetails,
    setIsEditingClientSpecificDetails
}) {
    if (!selectedCustomer || !selectedWeek) return null;

    return (
        <div className="w-full rounded-2xl shadow-xl border mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-black dark:text-white">
            <div className="bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-white p-3 sm:p-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-2xl font-bold">Client Specific Details</h2>
                <div className="flex gap-2">
                    <button
                        onClick={isEditingClientSpecificDetails ? handleSaveClientSpecificData : () => setIsEditingClientSpecificDetails(true)}
                        disabled={isSavingClientSpecificData}
                        className="px-4 py-2 bg-yellow-400 text-purple-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSavingClientSpecificData ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-900"></div>
                                Saving...
                            </>
                        ) : isEditingClientSpecificDetails ? (
                            'Save Client Details'
                        ) : (
                            'Edit'
                        )}
                    </button>
                </div>
            </div>

            <div className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
                    {CLIENT_SPECIFIC_TABS.map((tab) => {
                        const isActive = tab.key === activeClientTab;
                        const IconComponent = tab.icon;

                        return (
                            <div key={tab.key} className="transition-all duration-300">
                                <div
                                    onClick={() => isEditing && setActiveClientTab(isActive ? null : tab.key)}
                                    className={`text-xl font-semibold mb-2 flex items-center gap-2 text-black dark:text-white border-b pb-2 ${isEditing ? 'cursor-pointer' : 'cursor-default'} transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 ${
                                        isActive ? 'border-purple-500 bg-purple-50 dark:bg-purple-900' : 'border-transparent hover:border-gray-300'
                                    }`}
                                >
                                    <IconComponent className={`w-6 h-6 transition-colors duration-200 ${isActive ? 'text-purple-500' : 'text-gray-400'}`} />
                                    <span>{tab.title}</span>
                                    <span className="ml-auto">
                                        {isActive ? <Lightbulb className="w-6 h-6 text-yellow-400" /> : <LightbulbOff className="w-6 h-6 text-gray-400" />}
                                    </span>
                                </div>

                                {isActive && (
                                    <div className="mt-4 transition-opacity duration-300 animate-fade-in">
                                        {isEditingClientSpecificDetails ? (
                                            <RichTextEditor
                                                value={clientSpecificData[tab.key] || ''}
                                                onChange={(html) => setClientSpecificData(prev => ({ ...prev, [tab.key]: html }))}
                                                placeholder={`Enter details for "${tab.title}"...`}
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-y-auto"
                                                dangerouslySetInnerHTML={{ __html: clientSpecificData[tab.key] || '<p class="text-gray-500 italic">No data available</p>' }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
  );
}
// --- End ClientSpecificDetailsSection Component ---

// --- NEW: TrackerSection Component ---
function ProductUpdatesSection({
    selectedCustomer,
    selectedWeek,
    productUpdateData,
    setProductUpdateData,
    activeProductTab,
    setActiveProductTab,
    handleSaveProductUpdateData,
    isSavingProductUpdate,
    isEditing,
    onEditToggle,
    isEditingProductUpdates,
    setIsEditingProductUpdates
}) {
    if (!selectedCustomer || !selectedWeek) return null;

    const activeTabConfig = PRODUCT_TABS.find(t => t.key === activeProductTab);
    const ActiveIcon = activeTabConfig?.icon;

    return (
        <div className="w-full rounded-2xl shadow-xl border mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-black dark:text-white">
            <div className="bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-white p-3 sm:p-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-2xl font-bold">Product Updates for {selectedCustomer}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={isEditingProductUpdates ? handleSaveProductUpdateData : () => setIsEditingProductUpdates(true)}
                        disabled={isSavingProductUpdate}
                        className="px-4 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSavingProductUpdate ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
                                Saving...
                            </>
                        ) : isEditingProductUpdates ? (
                            'Save Product Update'
                        ) : (
                            'Edit'
                        )}
                    </button>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                {/* 🔥 NEW: Map over ALL tabs and conditionally render the editor */}
                <div className="space-y-4 sm:space-y-6">
                    {PRODUCT_TABS.map((tab) => {
                        const isActive = tab.key === activeProductTab;
                        const IconComponent = tab.icon;

                        return (
                            <div key={tab.key} className="transition-all duration-300">
                                {/* The tab title/header acts as the drop-down control */}
                                <div
                                    onClick={() =>
                                        // If the clicked tab is already active, close it. Otherwise, open it.
                                        setActiveProductTab(isActive ? null : tab.key)
                                    }
                                    className={`text-xl font-semibold mb-2 flex items-center gap-2 text-black dark:text-white border-b pb-2 cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 ${
                                        isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-transparent hover:border-gray-300'
                                    }`}
                                >
                                    <IconComponent className={`w-6 h-6 transition-colors duration-200 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                                    <span>{tab.title}</span>
                                    <span className="ml-auto">
                                        {isActive
                                            ? <Lightbulb className="w-6 h-6 text-yellow-400" />
                                            : <LightbulbOff className="w-6 h-6 text-gray-400" />
                                        }
                                    </span>
                                </div>

                                {/* Conditionally render the RichTextEditor */}
                                {isActive && (
                                    <div className="mt-4 transition-opacity duration-300 animate-fade-in">
                                        {isEditingProductUpdates ? (
                                            <RichTextEditor
                                                value={productUpdateData[tab.key] || ''}
                                                onChange={(html) => setProductUpdateData(prev => ({ ...prev, [tab.key]: html }))}
                                                placeholder={`Enter the details for "${tab.title}" here...`}
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-y-auto"
                                                dangerouslySetInnerHTML={{ __html: productUpdateData[tab.key] || '<p class="text-gray-500 italic">No data available</p>' }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
// --- End ProductUpdatesSection Component ---


const getCharacterCount = (htmlString) => {
  if (!htmlString) return 0;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  return tempDiv.textContent.length || 0;
};

const SYCAMORE_SUBCATEGORIES = {
  "Customer & Engagement": [
    "Customer Since When / Initial Go Live",
    "Project Lifecycle Status",
    "Customer POC",
    "CSM",
    "Backup CSM",
    "Quality Lead",
    "Lead BA",
    "Production Operation POC",
    "Support Lead",
    "Technical Lead",
    "Specialist in Sycamore Informatics",
    "SME",
    "Support Team",
    "Escalation Matrix",
  ],
  "Product & Versions": [
    "Sycamore Informatics Product",
    "Add-on Modules",
    "Next Planned Version in Development",
    "Next Planned Version of Release",
    "Major Features Used or Requested",
    "Release Notes",
  ],
  "System & Infrastructure": [
    "Hosting Platform",
    "App Cloud",
    "Data Cloud",
    "Compute Cloud",
    "Database",
    "Architecture",
  ],
  "Performance & Availability": [
    "CPU",
    "Memory",
    "System Availability",
    "RDP",
    "RTO",
    "RPO",
  ],
  "Support & Operations": [
    "Critical Tickets",
    "High",
    "Medium",
    "Low",
    "Ticket Volume and Resolution Time",
    "Backlog tickets/issues",
    "Capacity Planned",
    "RTM",
    "RTMVE",
  ],
  "Documents": [
    "SOW",
    "QM and Certification",
    "Product Documents",
    "Deployment Documents",
    "Consolidated Document"
  ],
  "Licensing & Tools": [
    "Windows Licensing",
    "CAL",
    "SAL",
    "MS Office",
    "Other Licensing",
    "Adobe",
    "Notepad",
  ],
  "Training & Onboarding": [
    "Training & Onboarding (Client Data)",
  ],
};

const CLIENT_SUBCATEGORIES = {
  "Basic Information": [
    "Customer Name",
    "Customer Location",
    "Customer Description",
  ],
  "Usage & Tools": [
    "Business - contact",
    "Number of Active Users",
    "Number of Full Users",
    "Number of Other Users",
    "Customer Sentiment",
    "Other Client-Specific Tools",
  ]
};

const SYCAMORE_AND_CLIENT_SUBCATEGORIES = {
  "Technical Details": [
    "Software Licenses Details",
    "OS & Version",
    "Environments",
  ],
  "Deployment & Support": [
    "Hosting Details",
    "BCP - Business Continuity Plan",
    "Language supported",
  ]
};

function CustomerList({
  customers,
  selectedCustomer,
  isClientListExpanded,
  onCustomerSelect,
  onExpand,
  onHover,
  onLeave,
  setEditingClient,
  customerListRef,
  showScrollButtons, 
  scrollLeft, 
  scrollRight, 
  clientCustomizations,
  setSelectedCustomer,
  handleOpenTracker,
  handleOpenPLModal
}) {
  return (
    <div className="relative flex items-center mb-6">
      {isClientListExpanded && showScrollButtons && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-md transition-all -translate-x-1/2"
          aria-label="Scroll left"
        >
          &lt;
        </button>
      )}
      <div
        ref={customerListRef}
        className="flex flex-nowrap overflow-x-auto gap-2 md:gap-4 py-2 scrollbar-hide items-center"
      >
        {isClientListExpanded ? (
          customers.map((cust) => (
            <div
              key={cust}
              className="flex flex-col items-center gap-2"
            >
              <div
                onClick={() => onCustomerSelect(cust)}
                onMouseEnter={(e) => onHover(cust, e)}
                onMouseLeave={onLeave}
              className={`group relative flex-shrink-0 w-20 sm:w-28 h-16 sm:h-20 p-1 rounded-lg shadow-md transition-all border-4 transform hover:scale-110 cursor-pointer animate-fade-in ${selectedCustomer === cust ? "border-blue-500" : "border-black/20 hover:border-black/40"}`}
              style={{ backgroundColor: (clientCustomizations[cust] && clientCustomizations[cust].bgColor) || '#ffffff' }}
              >
                <img
                  src={`/${cust}.png`}
                  alt={`${cust} logo`}
                  className="w-full h-full object-contain rounded-md"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoMTAwdjYwSDBWMHoiIGZpbGw9IiNGM0Y0RjYiLz48dGV4dCB4PSI1MCIgeT0iMzUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2QjcyODQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPntjdXN0fTwvdGV4dD48L3N2Zz4=';
                    e.target.alt = `${cust} placeholder logo`;
                    e.target.className = 'w-full h-full object-scale-down rounded-md p-2';
                  }}
                />
                <button
                  className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingClient(cust);
                  }}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
            <div className="flex flex-col items-center">
                <div 
                  className="text-xs sm:text-sm font-medium theme-text-primary w-20 sm:w-28 text-center truncate"
                >
                  {cust}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <button
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedCustomer(cust);
                            handleOpenTracker(cust); 
                        }}
                        className="p-1 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors focus-ring"
                        title={`Open Tracker for ${cust}`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleOpenPLModal(cust); }}
                        className="p-1 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 transition-colors focus-ring"
                        title={`Open Project List for ${cust}`}
                    >
                        <ProjectListIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
            </div>
          ))
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <div
                key={selectedCustomer}
                onClick={onExpand}
                onMouseEnter={(e) => onHover(selectedCustomer, e)}
                onMouseLeave={onLeave}
              className={`flex-shrink-0 w-28 h-20 p-1 rounded-lg shadow-md transition-all border-4 transform hover:scale-110 border-blue-500 cursor-pointer animate-fade-in`}
              style={{ backgroundColor: (clientCustomizations[selectedCustomer] && clientCustomizations[selectedCustomer].bgColor) || '#ffffff' }}
            >
                <img
                  src={`/${selectedCustomer}.png`}
                  alt={`${selectedCustomer} logo`}
                  className="w-full h-full object-contain rounded-md"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoMTAwdjYwSDBWMHoiIGZpbGw9IiNGM0Y0RjYiLz48dGV4dCB4PSI1MCIgeT0iMzUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2QjcyODQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPnNlbGVjdGVkQ3VzdH08L3RleHQ+PC9zdmc+';
                    e.target.alt = `${selectedCustomer} placeholder logo`;
                    e.target.className = 'w-full h-full object-scale-down rounded-md p-2';
                  }}
                />
              </div>
            <div className="text-base font-medium theme-text-primary w-28 text-center truncate">{selectedCustomer}</div>
            </div>
          <button onClick={onExpand} className="flex-shrink-0 w-20 sm:w-28 h-16 sm:h-20 rounded-lg shadow-md transition-all bg-white hover:bg-gray-50 border-2 border-black/20 flex items-center justify-center text-2xl font-bold">...</button>
          </>
        )}
      </div>
      {isClientListExpanded && showScrollButtons && (<button onClick={scrollRight} className="absolute right-0 z-10 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-md transition-all translate-x-1/2" aria-label="Scroll right">&gt;</button>)}
    </div>
  );
}

function Header({
  theme,
  setTheme,
  selectedWeek,
  handleWeekChange,
  availableWeeks,
  isLoading,
  isEditing,
  startEdit,
  saveAllChanges,
  setIsEditing,
  onAddClientClick, // Updated prop name
  query,
  setQuery,
  searchContainerRef,
  selectedCustomer,
  isWeeklyUpdateVisible,
  setIsWeeklyUpdateVisible,
  showHiddenClients,
  setShowHiddenClients
}) {
  return (
      <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 text-white p-4 flex flex-col sm:flex-row justify-between items-center shadow-xl gap-4 animate-fade-in">
      <div className="flex items-center gap-4">
        <img src="/sycamore-logo.png" alt="Sycamore Informatics Logo" className="h-10 sm:h-12 mr-2 sm:mr-3" />
        <h1 className="text-3xl lg:text-4xl font-extrabold drop-shadow-lg whitespace-nowrap">
          Sycamore Informatics Customer Dashboard
        </h1>
      </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 text-lg sm:text-xl focus-ring animate-hover-lift"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div className="flex items-center gap-2">
          <label htmlFor="week-select" className="sr-only">Week</label>
          <select
            id="week-select"
            aria-label="Select week"
            title="Change week"
            value={selectedWeek}
            onChange={handleWeekChange}
            disabled={isLoading}
            className={`rounded-xl shadow-md border-2 focus:border-blue-400 px-2 sm:px-3 py-2 text-responsive-sm min-w-[120px] sm:min-w-[140px] transition-colors text-black ${availableWeeks.find(w => w.value === selectedWeek)?.isCurrent ? "bg-green-100 border-green-400 font-semibold" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 dark:text-white"} focus-ring`}
          >
            {availableWeeks.map((week) => (
              <option key={week.value} value={week.value} className={week.isCurrent ? "font-bold" : ""}>
                {week.label}
              </option>
            ))}
          </select>
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={saveAllChanges} className="rounded-xl bg-gradient-to-r from-green-500 to-lime-500 text-white hover:scale-105 transition-transform shadow-md px-3 sm:px-4 py-2 text-responsive-sm focus-ring">Save</button>
            <button onClick={() => setIsEditing(false)} className="rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-all px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 text-responsive-sm focus-ring">Cancel</button>
          </div>
        ) : (
          <>
            {selectedCustomer && (<button onClick={startEdit} title="Edit Customer" className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all focus-ring" aria-label="Edit customer">✏️</button>)}
          <button title="Add Customer" onClick={onAddClientClick} className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all focus-ring animate-hover-lift" aria-label="Add new client">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </>
        )}
        <div className="relative" ref={searchContainerRef}>
          <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="rounded-full shadow-inner bg-white/10 focus:bg-white/20 border-none pl-9 sm:pl-11 pr-4 py-2 transition-all duration-300 ease-in-out text-white placeholder-gray-300 w-48 sm:w-64 text-responsive-sm focus-ring" />
        </div>
        {!isWeeklyUpdateVisible && (
          <button
            onClick={() => setIsWeeklyUpdateVisible(true)}
            title="Summary of the week's updates"
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg sm:text-xl focus-ring animate-hover-lift"
            aria-label="Show weekly updates"
          >
            🗒️
            </button>
        )}
        <button
          onClick={() => setShowHiddenClients(!showHiddenClients)}
          title={showHiddenClients ? "Hide hidden clients" : "Show hidden clients"}
          className={`px-3 sm:px-4 py-2 font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg sm:text-xl focus-ring animate-hover-lift ${showHiddenClients ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
          aria-label={showHiddenClients ? "Hide hidden clients" : "Show hidden clients"}
        >
          <Eye className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Client");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [query, setQuery] = useState("");
  const [data, setData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [editingFields, setEditingFields] = useState({});
  const [masterData, setMasterData] = useState({});
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isClientListExpanded, setIsClientListExpanded] = useState(true);
  const customerListRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
  const [hoveredCustomer, setHoveredCustomer] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSubsections, setExpandedSubsections] = useState({});
  const [theme, setTheme] = useState('light');
  const [sowUploadUrl, setSowUploadUrl] = useState('');
  const [isWeeklyUpdateVisible, setIsWeeklyUpdateVisible] = useState(false);
  const [weeklyUpdateText, setWeeklyUpdateText] = useState('');
  const [isSavingUpdate, setIsSavingUpdate] = useState(false);
  const [isAddClientModalVisible, setIsAddClientModalVisible] = useState(false); // New state for modal
  const [isAddingClient, setIsAddingClient] = useState(false);
  
  // --- NEW: Product Update States ---
  const [editingClient, setEditingClient] = useState(null);
  const [showLogoUploadModal, setShowLogoUploadModal] = useState(false);
  const [clientToEditLogo, setClientToEditLogo] = useState(null);
  const [showColorPickerModal, setShowColorPickerModal] = useState(false);
  const [clientToEditBg, setClientToEditBg] = useState(null);
  const [hiddenClients, setHiddenClients] = useState(() => {
    const savedHidden = localStorage.getItem('hiddenClients');
    return savedHidden ? new Set(JSON.parse(savedHidden)) : new Set();
  });
  const [showHiddenClients, setShowHiddenClients] = useState(false);
  const [productUpdateData, setProductUpdateData] = useState({});
  const [activeProductTab, setActiveProductTab] = useState(null); // No tab is active by default
  const [isSavingProductUpdate, setIsSavingProductUpdate] = useState(false);
  const [productUpdateError, setProductUpdateError] = useState(null);
  
  // --- NEW: Client Specific Details States ---
  const [clientSpecificData, setClientSpecificData] = useState({});
  const [activeClientTab, setActiveClientTab] = useState(null);
  const [isSavingClientSpecificData, setIsSavingClientSpecificData] = useState(false);
  const [clientSpecificError, setClientSpecificError] = useState(null);
  const [clientCustomizations, setClientCustomizations] = useState({});
  const [isEditingProductUpdates, setIsEditingProductUpdates] = useState(false);
  const [isEditingClientSpecificDetails, setIsEditingClientSpecificDetails] = useState(false);

// --- NEW: Tracker States ---
  const [isTrackerModalVisible, setIsTrackerModalVisible] = useState(false);
  const [selectedTrackerDate, setSelectedTrackerDate] = useState(new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
  const [trackerData, setTrackerData] = useState({}); // Stores all loaded tracker data for the selected client/year
  const [isTrackerLoading, setIsTrackerLoading] = useState(false);
  const [isTrackerSaving, setIsTrackerSaving] = useState(false);
 const [trackerError, setTrackerError] = useState(null);

 // --- NEW: Project List (PL) States ---
 const [isPLModalVisible, setIsPLModalVisible] = useState(false);
 const [plData, setPLData] = useState({});
 const [selectedPLYear, setSelectedPLYear] = useState(new Date().getFullYear());
 const [isPLSaving, setIsPLSaving] = useState(false);

  const searchContainerRef = useRef(null);
  const prevCustomerRef = useRef();

  const scrollLeft = () => {
  if (customerListRef.current) {
    customerListRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  }
  };

  const scrollRight = () => {
  if (customerListRef.current) {
    customerListRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  }
  };

  const categoryOrder = ["Client", "Sycamore", "Sycamore and Client"];


  const sortCategories = (categories) => {
    return categories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  useEffect(() => {
    localStorage.setItem('hiddenClients', JSON.stringify(Array.from(hiddenClients)));
  }, [hiddenClients]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const weeksResponse = await fetch(`${API_BASE}/api/weeks`);
        if (!weeksResponse.ok) {
          const errorText = await weeksResponse.text();
          throw new Error(`Server responded with ${weeksResponse.status}: ${errorText}`);
        }
        const weeksList = await weeksResponse.json();
        setAvailableWeeks(weeksList);

        const currentWeek = weeksList.find(w => w.isCurrent);
        if (currentWeek) {
          setSelectedWeek(currentWeek.value);
        } else if (weeksList.length > 0) {
          setSelectedWeek(weeksList[0].value); // Fallback to the first week
        }
      } catch (error) {
        let detailedError = error.message;
        // Provide a more helpful message for the common "Failed to fetch" network error.
        if (error.message.includes('Failed to fetch')) {
          detailedError = `A network error occurred. Please ensure the backend server is running at ${API_BASE} and accessible.`;
        }
        
        setError(`Failed to load initial week data. ${detailedError}`);
        console.error('Error loading initial week data:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const loadWeekData = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const [customerList, categoriesResponse, healthData, weeklyUpdateResponse] = await Promise.all([
          fetch(`${API_BASE}/api/customers?week=${selectedWeek}`).then(r => r.json()),
          fetch(`${API_BASE}/api/categories?week=${selectedWeek}`).then(r => r.json()),
          fetch(`${API_BASE}/api/health`).then(r => r.json()),
          fetch(`${API_BASE}/api/weekly-update?week=${selectedWeek}`).then(r => r.json())
        ]);
        setCustomers(customerList);
        setSowUploadUrl(healthData.sow_upload_url || '');
        const categories = categoriesResponse.categories || categoriesResponse;
        const filteredCategories = categories.filter(category => !category.startsWith('_'));
        setAvailableCategories(sortCategories(filteredCategories));
        
        if (customerList.length > 0) {
          // Only set the selected customer if one isn't already selected.
          // This prevents overwriting the selection during a targeted refresh.
          if (!selectedCustomer) {
            setSelectedCustomer(customerList[0]);
          }
        } else {
            setSelectedCustomer("");
            setData({});
        }


        if (filteredCategories.length && !filteredCategories.includes(selectedCategory)) {
          setSelectedCategory(sortCategories(filteredCategories)[0]);
        }

        setWeeklyUpdateText(weeklyUpdateResponse.text || '');

      } catch (error) {
        setError(`Failed to load data for ${selectedWeek}.`);
        console.error('Error loading week data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedWeek) {
      loadWeekData();
    }
  }, [selectedWeek]);

  useEffect(() => {
    const run = async () => {
      setError(null);
      const prevCustomer = prevCustomerRef.current;
      prevCustomerRef.current = selectedCustomer;
      setIsLoading(true);
      setProductUpdateError(null);
      setClientSpecificError(null);
      setMasterData({});

      // NEW: Reset product update data when customer changes
      if (prevCustomer !== selectedCustomer) {
        setProductUpdateData({});
        setClientSpecificData({});
      }

      // NEW: Fetch product update data concurrently
      if (selectedCustomer && !query.trim()) {
        fetch(`${API_BASE}/api/customers/${encodeURIComponent(selectedCustomer)}/product-update?week=${selectedWeek}`)
          .then(res => res.ok ? res.json() : res.status === 404 ? { data: {} } : Promise.reject(new Error('Failed to fetch product updates')))
          .then(json => setProductUpdateData(json.data || {}))
          .catch(err => {
            console.error("Error fetching product update data:", err.message);
            setProductUpdateError('Could not load product updates.');
          });

        // NEW: Fetch client specific data concurrently
        fetch(`${API_BASE}/api/customers/${encodeURIComponent(selectedCustomer)}/client-specific-details?week=${selectedWeek}`)
          .then(res => res.ok ? res.json() : res.status === 404 ? { data: {} } : Promise.reject(new Error('Failed to fetch client specific details')))
          .then(json => setClientSpecificData(json.data || {}))
          .catch(err => {
            console.error("Error fetching client specific details:", err.message);
            setClientSpecificError('Could not load client specific details.');
          });
      }

      try {
        if (query.trim()) {
          const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}&week=${selectedWeek}`);
          // Handle API errors gracefully
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Search failed: ${errorText}`);
          }
          const json = await res.json();
          // FIX: Update the customers state with the list of customers that matched the search query
          setCustomers(json.customers || []); 
          setData(json.results || {});
        } else if (selectedCustomer) {
          const res = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(selectedCustomer)}?week=${selectedWeek}`);
          if (!res.ok) { 
            const errorText = await res.text();
            throw new Error(`Customer fetch failed: ${errorText}`);
          }
          const json = await res.json();

          let combinedData = { ...json };

          // If we are not on the master week, fetch master data to merge
          if (selectedWeek !== 'master') {
            try {
              const masterRes = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(selectedCustomer)}?week=master`);
              if (masterRes.ok) {
                const masterJson = await masterRes.json();
                setMasterData(masterJson); // Store master data separately
                // Merge master data into the weekly data for display
                for (const category in masterJson) {
                  if (!combinedData[category]) {
                    combinedData[category] = [];
                  }
                  // FIX: Prevent duplicate entries by checking if the subcategory already exists
                  masterJson[category].forEach(masterItem => {
                    const masterSubcategory = masterItem.split(':')[0].trim();
                    const existsInWeekly = combinedData[category].some(
                      weeklyItem => weeklyItem.split(':')[0].trim() === masterSubcategory
                    );
                    if (!existsInWeekly) {
                      combinedData[category].push(masterItem);
                    }
                  });
                }
              }
            } catch (e) {
              console.error("Could not fetch master data for merging:", e);
            }
          }

          if (prevCustomer !== selectedCustomer) {
            setExpandedSubsections({});
          }
          setData({ [selectedCustomer]: combinedData });
          setEditingFields(combinedData);
        } else {
          setData({});
          setEditingFields({});
        }
      } catch (error) {
        setError('Failed to load customer or search data: ' + error.message);
        console.error('Error loading data:', error);
        setData({});
        setEditingFields({});
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedWeek) {
      run();
    }
  }, [query, selectedCustomer, selectedWeek]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (isThemeTransitioning) {
      document.body.classList.add('transitioning');
    } else {
      document.body.classList.remove('transitioning');
    }
  }, [isThemeTransitioning]);

  useEffect(() => {
  const checkOverflow = () => {
    if (customerListRef.current) {
      const { scrollWidth, clientWidth } = customerListRef.current;
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  };

  checkOverflow();
  window.addEventListener('resize', checkOverflow);
  return () => window.removeEventListener('resize', checkOverflow);
  }, [customers, isClientListExpanded]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchBar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        // Fetch data from the 'master' source which contains logos and backgrounds
        const response = await fetch(`${API_BASE}/api/data?week=master`);
        if (!response.ok) {
          throw new Error('Failed to fetch master data');
        }
        const masterData = await response.json();

        const customizations = {};
        for (const customerName in masterData) {
          customizations[customerName] = {
            bgColor: masterData[customerName].Background || '#ffffff',
          };
        }
        setClientCustomizations(customizations);
      } catch (error) {
        console.error("Could not load client customizations:", error);
      }
    };
    fetchMasterData();
  }, []);

  const startEdit = () => {
    setIsEditing(true);
  };

  const saveAllChanges = async () => {
    setIsLoading(true);

    const weeklyPayload = {};
    const masterPayload = {};

    // Separate the edited fields into weekly and master payloads
    for (const category in editingFields) {
      if (category.startsWith('_')) continue;

      weeklyPayload[category] = [];
      masterPayload[category] = [];

      editingFields[category].forEach(editedItem => {
        const masterItemsForCategory = masterData[category] || [];
        const key = editedItem.split(':')[0];

        // An item belongs to the master sheet if a field with the same key exists in the original master data.
        const isMasterField = masterItemsForCategory.some(masterItem => masterItem.startsWith(key + ':'));

        if (isMasterField) {
          masterPayload[category].push(editedItem);
        } else {
          weeklyPayload[category].push(editedItem);
        }
      });
    }

    const savePromises = [];

    // Save weekly data if not in master view
    if (selectedWeek !== 'master') {
      savePromises.push(
        fetch(`${API_BASE}/api/customers/${encodeURIComponent(selectedCustomer)}/data?week=${selectedWeek}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(weeklyPayload),
        })
      );
    }

    // Save master data
    savePromises.push(
      fetch(`${API_BASE}/api/customers/${encodeURIComponent(selectedCustomer)}/data?week=master`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(masterPayload),
      })
    );

    try {
        await Promise.all(savePromises.map(p => p.then(async res => {
            if (!res.ok) {
                const errorBody = await res.text();
                throw new Error(`API save failed (${res.status}): ${errorBody}`);
            }
            return res;
        })));

        // If all promises resolved successfully (no error thrown above)
        window.alert('Changes saved successfully!');
        setIsEditing(false);

        await fetch(`${API_BASE}/api/cache/clear`, { method: 'POST' });

        const currentCustomer = selectedCustomer;
        setSelectedCustomer(null); // Clear selection to reset data fetching context

        setTimeout(() => {
            setSelectedCustomer(currentCustomer);
        }, 500); // Set a longer, more reliable delay

    } catch (err) {
        window.alert('Error saving changes: ' + err.message);
    } finally {
        setIsLoading(false); // Ensure loading state is reset
    }
  };
  
  const handleEditLogo = (clientName) => {
    setClientToEditLogo(clientName);
    setShowLogoUploadModal(true);
  };

  const handleLogoUpdated = () => {
    // This is crucial: Force a refresh of customer logos
    // For now, we can just reload the page for simplicity
    window.location.reload();
  };

  const handleEditBackground = (clientName) => {
    setClientToEditBg(clientName);
    setShowColorPickerModal(true);
  };

  const handleColorSaved = (clientName, color) => {
    setClientCustomizations(prev => ({
      ...prev,
      [clientName]: { ...(prev[clientName] || {}), bgColor: color }
    }));
    // You might want to trigger a data refresh here as well
  };

  const handleDeleteClient = async (clientName) => {
    if (window.confirm(`Are you sure you want to delete ${clientName}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(clientName)}?week=${selectedWeek}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete client.');
        }

        // Clear cache on the backend
        await fetch(`${API_BASE}/api/cache/clear`, { method: 'POST' });

        // Update frontend state
        setCustomers(prev => prev.filter(c => c !== clientName));
        if (selectedCustomer === clientName) {
          const remainingCustomers = customers.filter(c => c !== clientName && !hiddenClients.has(c));
          setSelectedCustomer(remainingCustomers.length > 0 ? remainingCustomers[0] : "");
        }

        window.alert(`Client "${clientName}" deleted successfully.`);
      } catch (error) {
        console.error('Error deleting client:', error);
        window.alert('Error deleting client: ' + error.message);
      }
    }
  };

  const handleHideClient = (clientName) => {
    setHiddenClients(prev => new Set(prev).add(clientName));
    if (selectedCustomer === clientName) {
      setSelectedCustomer(customers.find(c => !hiddenClients.has(c) && c !== clientName) || "");
    }
  };

  const handleUnhideClient = (clientName) => {
    setHiddenClients(prev => {
      const newSet = new Set(prev);
      newSet.delete(clientName);
      return newSet;
    });
  };

const handleOpenTracker = async (clientName) => {
    setIsTrackerModalVisible(true);
    setIsTrackerLoading(true);
    const currentYear = new Date().getFullYear();
    
    try {
        const response = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(clientName)}/tracker?year=${currentYear}`);
        if (!response.ok) {
            // Assume 404 means sheet not created yet, return empty object
            if (response.status === 404) {
                 setTrackerData({});
            } else {
                 throw new Error("Failed to fetch tracker data.");
            }
        } else {
            const result = await response.json();
            setTrackerData(result.data || {});
        }
        
    } catch (e) {
        console.error("Error fetching tracker data:", e);
        setTrackerData({});
        window.alert('Error fetching tracker data: ' + e.message);
    } finally {
        setIsTrackerLoading(false);
    }
};

const handleSaveTrackerData = async (date, content) => {
    setIsTrackerSaving(true);
    try {
        const response = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(selectedCustomer)}/tracker`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, content }),
        });

        if (!response.ok) {
            const errorText = await response.json();
            throw new Error(errorText.error || 'Failed to save tracker data.');
        }

        window.alert('Tracker entry saved successfully!');
        setTrackerData(prev => ({ ...prev, [date]: content }));
        await fetch(`${API_BASE}/api/cache/clear`, { method: 'POST' }); 
        handleOpenTracker(selectedCustomer); 
    } catch (err) {
        window.alert('Error saving tracker data: ' + err.message);
    } finally {
        setIsTrackerSaving(false);
    }
};

const handleOpenPLModal = async (clientName) => {
    setIsPLModalVisible(true);
    setSelectedCustomer(clientName); // Ensure the correct client is selected
    // Fetch data for all years for simplicity, or just the current year
    try {
        const response = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(clientName)}/project-list`);
        if (!response.ok) {
            if (response.status === 404) setPLData({});
            else throw new Error("Failed to fetch project list data.");
        } else {
            const result = await response.json();
            setPLData(result.data || {});
        }
    } catch (e) {
        console.error("Error fetching project list data:", e);
        setPLData({});
        window.alert('Error fetching project list data: ' + e.message);
    }
};

const handleSavePLData = async (year, content) => {
    setIsPLSaving(true);
    try {
        const response = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(selectedCustomer)}/project-list`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ year, content }),
        });

        if (!response.ok) {
            const errorText = await response.json();
            throw new Error(errorText.error || 'Failed to save project list data.');
        }

        window.alert('Project list saved successfully!');
        setPLData(prev => ({ ...prev, [year]: content }));
        await fetch(`${API_BASE}/api/cache/clear`, { method: 'POST' });
        // Optionally re-fetch to confirm
        handleOpenPLModal(selectedCustomer);
    } catch (err) {
        window.alert('Error saving project list: ' + err.message);
    } finally {
        setIsPLSaving(false);
    }
};

  const handleFieldChange = (category, itemIndex, event) => {
    const customerData = data[selectedCustomer];
    if (!customerData || !customerData[category]) return;

    const [subcategory] = (customerData[category][itemIndex] || "").split(':');
    const newItem = `${subcategory}: ${event.target.value}`;
    const newFields = { ...editingFields };
    if (!newFields[category]) {
      newFields[category] = [];
    }
    newFields[category][itemIndex] = newItem;
    setEditingFields(newFields);
  };

  const handleMouseEnter = async (customer, e) => {
    try {
      const res = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(customer)}?week=${selectedWeek}`);
      const json = await res.json();

      const { _meta, ...customerData } = json;
      const clientInfo = customerData["Client"] || [];
      const basicInfo = clientInfo.filter(item => {
        const key = item.split(':')[0].trim();
        return ["Customer Name", "Customer Location", "Customer Description"].includes(key);
      });

      setHoveredCustomer({ name: customer, info: basicInfo });
      setHoverPosition({ x: e.clientX, y: e.clientY });
    } catch (error) {
      console.error('Error fetching customer hover info:', error);
    }
  };

  const handleThemeChange = (newTheme) => {
    setIsThemeTransitioning(true);
    setTheme(newTheme);
    setTimeout(() => setIsThemeTransitioning(false), 300); // Match transition duration
  };

  const handleMouseLeave = () => {
    setHoveredCustomer(null);
  };

  const handleAddClient = async ({ customerName, customerData, logoFile, color }) => {
    setIsAddingClient(true);
    try {
      // 1. SAVE CLIENT DATA FIRST (to Google Sheet)
      const response = await fetch(`${API_BASE}/api/customers?week=${selectedWeek}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, customerData })
      });

      // Check response.ok before trying to parse JSON
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error (${response.status}): ${errorText.substring(0, 100)}...`);
      }
      
      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error || 'Failed to add client.');
      }

      // 2. UPLOAD LOGO FILE (if present) AFTER CLIENT IS SAVED
      if (logoFile) {
        const formData = new FormData();
        formData.append('clientName', customerName);
        formData.append('logo', logoFile);
        const uploadResponse = await fetch(`${API_BASE}/api/upload-logo`, {
          method: 'POST',
          body: formData,
        });

        // Check if upload failed (e.g., non-200 status, server error)
        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.warn(`Logo upload failed after client save: ${errorText}`);
            // Note: Client is already saved, so we don't throw here to avoid rolling back
        } else {
          const uploadResult = await uploadResponse.json();
          if (!uploadResult.success) {
            console.warn('Logo upload failed (Server responded with error):', uploadResult.error);
          }
        }
      }

      window.alert(`Client "${customerName}" added successfully to ${selectedWeek}!`);
      
      // 3. Trigger a final, clean data reload.
      // This is done by triggering the main useEffect which fetches customer data.
      const forceReload = async (newCustomerName) => {
          // 1. Clear caches on server immediately
          await fetch(`${API_BASE}/api/cache/clear`, { method: 'POST' });

          // 2. Clear selected customer and query to reset main state
          setQuery('');

          // 3. Fetch the new customer list directly.
          const updatedCustomersResponse = await fetch(`${API_BASE}/api/customers?week=${selectedWeek}`);
          const updatedCustomers = await updatedCustomersResponse.json();

          // 4. Update the state with the new list and select the new customer.
          setCustomers(updatedCustomers);
          setSelectedCustomer(newCustomerName);

          // 5. Close modals.
          setIsClientListExpanded(false);
          setIsAddClientModalVisible(false);
      }

      await forceReload(customerName);

    } catch (err) {
      // Catch the error thrown from the main save step
      window.alert('An error occurred while adding the client: ' + err.message);
    } finally {
      setIsAddingClient(false);
    }
  };

  // --- NEW SAVE PRODUCT UPDATE DATA HANDLER ---
  const handleSaveProductUpdateData = async () => {
    if (!selectedCustomer) return;
    setIsSavingProductUpdate(true);
    try {
        const response = await fetch(
            `${API_BASE}/api/customers/${encodeURIComponent(selectedCustomer)}/product-update?week=${selectedWeek}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productUpdateData),
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Failed to save product updates. Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.ok) {
            window.alert('Product updates saved successfully!');
            await fetch(`${API_BASE}/api/cache/clear`, { method: 'POST' });
        } else {
            window.alert(result.error || 'Failed to save product updates.');
        }
    } catch (err) {
        window.alert('Error saving product updates: ' + err.message);
    } finally {
        setIsSavingProductUpdate(false);
    }
  };
  // ---------------------------------------------

  // --- NEW: SAVE CLIENT SPECIFIC DATA HANDLER ---
const handleSaveClientSpecificData = async () => {
  if (!selectedCustomer) return;
  setIsSavingClientSpecificData(true);
  const url = `${API_BASE}/api/customers/${encodeURIComponent(selectedCustomer)}/client-specific-details?week=${selectedWeek}`;
  console.log(`Request: PUT ${url}`);
  try {
      const response = await fetch(
          url,
          {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(clientSpecificData),
          },
      );
      console.log(`Response status: ${response.status}`);
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Failed to save client details. Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.ok) {
          window.alert('Client specific details saved successfully!');
          await fetch(`${API_BASE}/api/cache/clear`, { method: 'POST' });
      } else {
          window.alert(result.error || 'Failed to save client details.');
      }
  } catch (err) {
      window.alert('Error saving client details: ' + err.message);
  } finally {
      setIsSavingClientSpecificData(false);
  }
};
  // ---------------------------------------------

  const handleSaveWeeklyUpdate = async () => {
    setIsSavingUpdate(true);
    try {
      const response = await fetch(`${API_BASE}/api/weekly-update?week=${selectedWeek}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: weeklyUpdateText }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save update.');
      }
      window.alert('Weekly update saved!');
      setIsWeeklyUpdateVisible(false);
    } catch (error) {
      window.alert(`Error: ${error.message}`);
    } finally {
      setIsSavingUpdate(false);
    }
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
    setQuery("");
  };

  const isGlobalSearch = query.trim().length > 0;

  const getDisplayData = () => {
    const filteredData = {};
    for (const [key, value] of Object.entries(data)) {
        if (!key.startsWith('_')) {
            filteredData[key] = value;
        }
    }

    if (isGlobalSearch) {
      return filteredData;
    }
    
    if (selectedCustomer && filteredData[selectedCustomer]) {
      const customerData = filteredData[selectedCustomer];
      const allCategoriesData = {};
      for (const category of availableCategories) {
        allCategoriesData[category] = customerData[category] || [];
        // Ensure all document types are present for the "Sycamore" category
        if (category === "Sycamore") {
          const docSubcategories = SYCAMORE_SUBCATEGORIES["Documents"] || [];
          docSubcategories.forEach(docKey => {
            const keyExists = allCategoriesData[category].some(item => item.split(":")[0].trim() === docKey);
            if (!keyExists) {
              allCategoriesData[category].push(`${docKey}: `); // Add with empty value
            }
          });
          // Sort items to respect the order in SYCAMORE_SUBCATEGORIES
          allCategoriesData[category].sort((a, b) => {
            const keyA = a.split(":")[0].trim();
            const keyB = b.split(":")[0].trim();
            return docSubcategories.indexOf(keyA) - docSubcategories.indexOf(keyB);
          });
        }
      }
      return { [selectedCustomer]: allCategoriesData };
    }

    return {};
  };

  const displayData = getDisplayData();
  
  const getSubcategories = (category) => {
    switch (category) {
      case "Client":
        return CLIENT_SUBCATEGORIES;
      case "Sycamore":
        return SYCAMORE_SUBCATEGORIES;
      case "Sycamore and Client":
        return SYCAMORE_AND_CLIENT_SUBCATEGORIES;
      default:
        return {};
    }
  };

  const getSubsections = (items, subcategoryMapping) => {
    const subsections = {};
    for (const subsectionTitle in subcategoryMapping) {
      subsections[subsectionTitle] = items.filter(item => {
        const key = item.split(":")[0].trim();
        return subcategoryMapping[subsectionTitle].includes(key);
      });
    }
    return subsections;
  };

  const toggleSubsection = (subsectionTitle) => {
    setExpandedSubsections(prev => ({
      ...prev,
      [subsectionTitle]: !prev[subsectionTitle]
    }));
  };

  const isUrl = (text) => /^(https?:\/\/.+)|(www\..+)$/i.test(text);

  // And ensure the link has the correct protocol for opening
  const normalizeUrl = (url) => {
      if (!url) return '';
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      if (url.startsWith('www.')) return `https://${url}`;
      return url; // Return as is if format is unknown/invalid
  };




  const LoadingSkeleton = ({ type }) => {
    if (type === 'customerCard') {
      return (
        <div className="w-full rounded-2xl shadow-xl border bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 text-gray-900 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 dark:text-gray-100 animate-fade-in">
          <div className="p-4 sm:p-6">
            <Skeleton variant="text" className="h-6 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-3/4" />
              <Skeleton variant="text" className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      );
    }
    if (type === 'customerList') {
      return (
        <div className="flex flex-nowrap gap-4 py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 animate-fade-in">
            <Skeleton variant="avatar" className="w-20 sm:w-28 h-16 sm:h-20 rounded-lg" />
              <Skeleton variant="text" className="h-4 w-20" />
            </div>
          ))}
        </div>
      );
    }
    if (type === 'categorySection') {
      return (
        <div className="w-full rounded-2xl shadow-xl border bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 text-gray-900 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 dark:text-gray-100 animate-fade-in">
          <div className="p-4 sm:p-6">
            <Skeleton variant="text" className="h-8 w-48 mb-4" />
            <div className="space-y-4">
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-5/6" />
              <Skeleton variant="text" className="h-4 w-4/6" />
              <Skeleton variant="text" className="h-4 w-3/6" />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const subsectionEmojis = {
    "Customer & Engagement": "👥",
    "Product & Versions": "📦",
    "System & Infrastructure": "🏗️",
    "Performance & Availability": "⚡",
    "Support & Operations": "🛠️",
    "Compliance & Certifications": "📜",
    "Licensing & Tools": "🔑",
    "Training & Onboarding": "🎓",
  };

  const splitItems = (items) => {
    const half = Math.ceil(items.length / 2);
    return {
      firstHalf: items.slice(0, half),
      secondHalf: items.slice(half),
    };
  };

  // Determine customers to render based on view mode
  const customersToRender = isGlobalSearch ? Object.keys(displayData) : (selectedCustomer && displayData[selectedCustomer] ? [selectedCustomer] : []);
  const weeklyUpdatesData = data._weeklyUpdates && data._weeklyUpdates[selectedWeek];


  return (
    // Updated primary text color for better contrast
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-gray-100'} transition-colors duration-300`}>

      <Header
        theme={theme}
        setTheme={setTheme}
        selectedWeek={selectedWeek}
        handleWeekChange={handleWeekChange}
        availableWeeks={availableWeeks}
        isLoading={isLoading}
        isEditing={isEditing}
        startEdit={startEdit}
        saveAllChanges={saveAllChanges}
        setIsEditing={setIsEditing}
        onAddClientClick={() => setIsAddClientModalVisible(true)} // Use new handler
        query={query}
        setQuery={setQuery}
        searchContainerRef={searchContainerRef}
        selectedCustomer={selectedCustomer}
        isWeeklyUpdateVisible={isWeeklyUpdateVisible}
        setIsWeeklyUpdateVisible={setIsWeeklyUpdateVisible}
        showHiddenClients={showHiddenClients}
        setShowHiddenClients={setShowHiddenClients}
      />

      <div className="p-4">
      <CustomerList
        customers={showHiddenClients ? customers : customers.filter(c => !hiddenClients.has(c))}
        selectedCustomer={selectedCustomer}
        isClientListExpanded={isClientListExpanded}
        onCustomerSelect={(cust) => { setQuery(""); setSelectedCustomer(cust); setIsClientListExpanded(false); }}
        onExpand={() => setIsClientListExpanded(true)}
        onHover={handleMouseEnter}
        onLeave={handleMouseLeave}
        setEditingClient={setEditingClient}
        customerListRef={customerListRef}
        showScrollButtons={showScrollButtons}
        scrollLeft={scrollLeft}
        scrollRight={scrollRight}
        clientCustomizations={clientCustomizations}
        setSelectedCustomer={setSelectedCustomer}
        handleOpenTracker={handleOpenTracker}
        handleOpenPLModal={handleOpenPLModal}
      />

        <div className="mt-4 mb-4 flex flex-col items-center">
        {isWeeklyUpdateVisible && (
            <div className="w-full p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 text-black">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Weekly Updates for {availableWeeks.find(w => w.value === selectedWeek)?.label || selectedWeek}</h3>
              <RichTextEditor value={weeklyUpdateText} onChange={setWeeklyUpdateText} placeholder="Enter your updates for the week..." />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-black dark:text-gray-400">{getCharacterCount(weeklyUpdateText)} / 2000 characters</span>
                <div className="flex gap-2">
                  <button onClick={() => setIsWeeklyUpdateVisible(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    Cancel
                  </button>
                  <button onClick={handleSaveWeeklyUpdate} disabled={isSavingUpdate} className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-300 transition">
                    {isSavingUpdate ? 'Saving...' : 'Save Update'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {hoveredCustomer && (
          <div
            className="absolute z-50 p-3 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 flex flex-col gap-1 text-black dark:text-gray-200"
            style={{ left: hoverPosition.x + 15, top: hoverPosition.y + 15 }}
          >
            <div className="text-xs text-black dark:text-gray-400 mb-1">
              {availableWeeks.find(w => w.value === selectedWeek)?.label || selectedWeek}
            </div>
            {hoveredCustomer.info.length > 0 ? (
              hoveredCustomer.info.map((item, index) => {
                const [key, value] = item.split(":");
                return (
                  <div key={index}>
                    <p className={`${key.trim() === "Customer Name" ? "font-bold text-base" : "text-sm text-black dark:text-gray-100"}`}>
                      {key.trim() === "Customer Name" ? value?.trim() || "No Name" :
                        key.trim() === "Customer Location" ? `📍 ${value?.trim() || "No Location"}` :
                          `📄 ${value?.trim() || "No Description"}`}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-black dark:text-gray-400 italic">No customer info available</p>
            )}
          </div>
        )}

        {isLoading && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Loading data...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          {customersToRender.length === 0 && !isLoading && !weeklyUpdatesData && (
            <p className="text-left text-gray-600 dark:text-gray-400 col-span-full italic">
              {selectedWeek === "master" ? "No master data available" :
                `No data available for ${availableWeeks.find(w => w.value === selectedWeek)?.label || selectedWeek}`}
            </p>
          )}

          {weeklyUpdatesData && (
            <div className="w-full rounded-2xl shadow-xl border mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-black dark:text-white">
              <div className="p-4 sm:p-6">
                <h2 className="text-2xl font-semibold mb-4 capitalize border-b pb-2 flex items-center gap-3 text-black dark:text-white">
                  <span className="opacity-70">📝</span>
                  <span>Weekly Updates for {availableWeeks.find(w => w.value === selectedWeek)?.label || selectedWeek}</span>
                </h2>
                <div className="space-y-2 text-black dark:text-gray-300">
                  <p>{weeklyUpdatesData}</p>
                </div>
              </div>
            </div>
          )}

          {customersToRender.length > 0 && customersToRender.map(customerName => (
            <React.Fragment key={customerName}>
              {Object.keys(displayData[customerName]).map(category => {
                const items = displayData[customerName][category];
                if (!items || items.length === 0 || category.startsWith('_') || category === 'Background') return null;

                if (!Array.isArray(items)) {
                  console.error(`Data for category "${category}" of customer "${customerName}" is not an array.`, items);
                  return <div key={category} className="text-red-500">Error: Invalid data format for {category}.</div>;
                }

                let headerText;
                if (isGlobalSearch) {
                  headerText = `${customerName} - ${category}`;
                } else if (category === "Client") {
                  headerText = customerName;
                } else {
                  headerText = category;
                }
                
                // Use the SOW URL from the data state for the specific customer
                const customerSowUrl = data[customerName]?._sowUrl || '';

                return (
                  // Ensure text color is defined by cardColors for contrast
                  <React.Fragment key={`${customerName}-${category}-wrapper`}>
                    {(!category.startsWith('_') && items && items.length > 0) ? (
                      <div key={`${customerName}-${category}`} className={`w-full rounded-2xl shadow-xl border bg-gradient-to-br hover:shadow-2xl transition-shadow ${cardColors[category] || "from-gray-50 to-gray-100 border-gray-300 text-gray-900 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 dark:text-gray-100"}`}>
              <div className="p-4 sm:p-6 text-gray-900 dark:text-gray-100">
                          <h2 className={`text-responsive-3xl font-semibold mb-4 capitalize pb-2 flex items-center gap-3 text-black ${isGlobalSearch ? 'border-b' : 'border-b-0'}`}>
                            <span className="opacity-70">{category === "Client" ? '👤' : category === "Sycamore" ? '⚙️' : '🤝'}</span>
                            <span>{headerText}</span>
                          </h2>

                          {category === "Sycamore" && !isGlobalSearch ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                              {Object.entries(getSubsections(items, getSubcategories(category))).map(([subsectionTitle, subsectionItems]) => (
                                <div key={subsectionTitle} className="mb-2">
                                  <div
                                    className="flex justify-between items-center cursor-pointer text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 border-b-2 border-gray-200 dark:border-gray-700 pb-1"
                                    onClick={() => toggleSubsection(subsectionTitle)}
                                  >
                                    <h3 className="flex items-center gap-2">
                                      <span>{subsectionEmojis[subsectionTitle] || '🔹'}</span>
                                      <span>{subsectionTitle}</span>
                                    </h3>
                                    <span className="text-lg transition-transform transform">
                                      {expandedSubsections[subsectionTitle] ? '−' : '+'}
                                    </span>
                                  </div>
                                  {expandedSubsections[subsectionTitle] && (
                                    <div className="space-y-2 pl-4">
                                      {subsectionItems.length > 0 ? subsectionItems.map((item, index) => {
                                        const [key, value] = item.split(":");

                                        const customerData = data[customerName];
                                        // The `itemUrl` now correctly gets the link from the merged data's _meta property.
                                        const itemUrl = customerData?._meta?.documentUrls?.[key.trim()];

                                        return (
                                          <div key={index} className="flex flex-col text-gray-900 dark:text-gray-100">
                                            <div className="flex">
                                              <span className="font-semibold min-w-0 flex-shrink-0">{key.trim()}:</span>
                                              <span className="ml-2 flex-1">
                                                {isEditing ? (
                                                  <input
                                                    type="text"
                                                    value={editingFields[category]?.[items.indexOf(item)]?.split(/:(.*)/s)[1]?.trim() || ""}
                                                    onChange={(e) => handleFieldChange(category, items.indexOf(item), e)}
                                                    className="w-full border-b border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-500 bg-transparent"
                                                  />
                                                ) : (
                                                <div className="flex items-center justify-between w-full gap-2">
                                                    <span className="break-words text-gray-700 dark:text-gray-300">
                                                      {value?.trim() || "No Data"} 
                                                    </span>
                                                    {/* Unified logic for all document links */}
                                                    {subsectionTitle === "Documents" && (
                                                        <a href={itemUrl || `https://docs.google.com/forms/d/e/1FAIpQLSfl3i-eG-No_231d-2L_SA_231d-2L_SA/viewform?usp=pp_url&entry.12345=${encodeURIComponent(customerName)}&entry.67890=${encodeURIComponent(key.trim())}`} target="_blank" rel="noopener noreferrer" className="ml-4 px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-shrink-0">
                                                            View
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                              </span>
                                              </div>
                                          </div>
                                        );
                                      }) : <span className="italic text-gray-500 dark:text-gray-400">No Data</span>}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            (() => {
                              const isClient = category === "Client";
                              const basicKeys = ["Customer Name", "Customer Location", "Customer Description"];
                              const basic = isClient ? items.filter(i => basicKeys.includes(i.split(":")[0].trim())) : [];
                              const others = isClient ? items.filter(i => !basicKeys.includes(i.split(":")[0].trim())) : [];
                              const itemsForGrid = isEditing ? items : (isClient ? others : items);
                              const { firstHalf, secondHalf } = splitItems(itemsForGrid);

                              const getVal = (key) => 
                                basic.find(i => i.startsWith(key))?.split(":")[1]?.trim() || "";

                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-responsive-2xl">
                                  {isClient && !isEditing && basic.length > 0 && (
                                    <div className="col-span-1 md:col-span-2 -mt-2 text-gray-900 dark:text-gray-100 text-responsive-xl">
                                      <p className="font-medium">
                                        📍 {getVal("Customer Location") || "No Location"}
                                        <br />
                                        💊 {getVal("Customer Description") || "No Description"}
                                      </p>
                                    </div>
                                  )}

                                  <div className="space-y-2">
                                    {firstHalf.map((item, index) => {
                                      const [key, value] = item.split(":");

                                        const customerData = data[customerName];
                                        const itemUrl = customerData?._meta?.documentUrls?.[key.trim()];

                                      return (
                                        <div key={index} className="flex flex-col text-gray-900 dark:text-gray-100">
                                          <div className="flex">
                                            <span className="font-semibold min-w-0 flex-shrink-0">{key.trim()}:</span>
                                            <span className="ml-2 flex-1">
                                              {isEditing ? (
                                                <input
                                                  type="text"
                                                  value={editingFields[category]?.[items.findIndex(i => i === item)]?.split(/:(.*)/s)[1]?.trim() || ""}
                                                  onChange={(e) => handleFieldChange(category, items.findIndex(i => i === item), e)}
                                                  className="w-full border-b border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-500 bg-transparent"
                                                />
                                              ) : (
                                                <span className="break-words text-gray-700 dark:text-gray-300">{value?.trim() || "No Data"}</span>
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {secondHalf.length > 0 && (
                                    <div className="space-y-2">
                                      {secondHalf.map((item, index) => {
                                        const [key, value] = item.split(":");

                                            const customerData = data[customerName];
                                            const itemUrl = customerData?._meta?.documentUrls?.[key.trim()];

                                        return (
                                          <div key={index} className="flex flex-col text-gray-900 dark:text-gray-100">
                                            <div className="flex">
                                              <span className="font-semibold min-w-0 flex-shrink-0">{key.trim()}:</span>
                                              <span className="ml-2 flex-1">
                                                {isEditing ? (
                                                  <input
                                                    type="text"
                                                    value={editingFields[category]?.[items.indexOf(item)]?.split(/:(.*)/s)[1]?.trim() || ""}
                                                    onChange={(e) => handleFieldChange(category, items.indexOf(item), e)}
                                                    className="w-full border-b border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-500 bg-transparent"
                                                  />
                                                ) : (
                                                <span className="break-words text-gray-700 dark:text-gray-300">{value?.trim() || "No Data"}</span>
                                              )}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })()
                          )}
                        </div>
                      </div>
                    ) : null}

                    {category === "Client" && selectedCustomer === customerName && !isGlobalSearch && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4">
                        <ProductUpdatesSection
                          selectedCustomer={selectedCustomer}
                          selectedWeek={selectedWeek}
                          productUpdateData={productUpdateData}
                          setProductUpdateData={setProductUpdateData}
                          activeProductTab={activeProductTab}
                          setActiveProductTab={setActiveProductTab}
                          handleSaveProductUpdateData={handleSaveProductUpdateData}
                          isSavingProductUpdate={isSavingProductUpdate}
                          isEditing={isEditingProductUpdates}
                          onEditToggle={() => setIsEditingProductUpdates(!isEditingProductUpdates)}
                          isEditingProductUpdates={isEditingProductUpdates}
                          setIsEditingProductUpdates={setIsEditingProductUpdates}
                        />
                        <ClientSpecificDetailsSection
                          selectedCustomer={selectedCustomer}
                          selectedWeek={selectedWeek}
                          clientSpecificData={clientSpecificData}
                          setClientSpecificData={setClientSpecificData}
                          activeClientTab={activeClientTab}
                          setActiveClientTab={setActiveClientTab}
                          handleSaveClientSpecificData={handleSaveClientSpecificData}
                          isSavingClientSpecificData={isSavingClientSpecificData}
                          isEditing={isEditingClientSpecificDetails}
                          onEditToggle={() => setIsEditingClientSpecificDetails(!isEditingClientSpecificDetails)}
                          isEditingClientSpecificDetails={isEditingClientSpecificDetails}
                          setIsEditingClientSpecificDetails={setIsEditingClientSpecificDetails}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <AddClientModal
        isVisible={isAddClientModalVisible}
        onClose={() => setIsAddClientModalVisible(false)}
        onSubmit={handleAddClient}
        initialData={getInitialFormState()}
        isSubmitting={isAddingClient}
      />

      {editingClient && (
        <EditClientModal
          clientName={editingClient}
          onClose={() => setEditingClient(null)}
          onEditLogo={handleEditLogo}
          onEditBackground={handleEditBackground}
          onHideClient={handleHideClient}
          onUnhideClient={handleUnhideClient}
          isHidden={hiddenClients.has(editingClient)}
        />
      )}

      {showLogoUploadModal && (
        <UploadLogoModal
          clientName={clientToEditLogo}
          onClose={() => setShowLogoUploadModal(false)}
          onLogoUpdated={handleLogoUpdated}
        />
      )}

      {showColorPickerModal && (
        <ColorPickerModal
          clientName={clientToEditBg}
          onClose={() => setShowColorPickerModal(false)}
          onColorSaved={handleColorSaved}
          initialColor={(clientCustomizations[clientToEditBg] || {}).bgColor}
        />
      )}

      {isTrackerModalVisible && selectedCustomer && (
          <TrackerModal
              isVisible={isTrackerModalVisible}
              clientName={selectedCustomer}
              onClose={() => setIsTrackerModalVisible(false)}
              onSave={handleSaveTrackerData}
              isLoading={isTrackerLoading}
              isSaving={isTrackerSaving}
              initialData={trackerData}
          />
      )}

      {isPLModalVisible && selectedCustomer && (
        <ProjectListModal
          isVisible={isPLModalVisible}
          clientName={selectedCustomer}
          onClose={() => setIsPLModalVisible(false)}
          onSave={handleSavePLData}
          isSaving={isPLSaving}
          initialData={plData}
        />
      )}
    </div>
  );
}
