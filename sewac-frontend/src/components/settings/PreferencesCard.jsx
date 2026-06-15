import { useState } from "react";
import {
  Globe,
  Monitor,
  Calendar,
  Clock,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";

// Dictionary map handling all structural translations seamlessly
const translations = {
  English: {
    title: "Preferences",
    subtitle: "Customize your experience",
    labels: {
      language: "Language",
      theme: "Theme",
      dateFormat: "Date Format",
      timeFormat: "Time Format",
      dashboard: "Default Dashboard"
    },
    options: {
      theme: ["Light", "Dark", "System"],
      dateFormat: ["DD MMM YYYY", "YYYY-MM-DD", "MM/DD/YYYY", "DD/MM/YYYY"],
      timeFormat: ["12 Hour (AM/PM)", "24 Hour"],
      dashboard: ["Overview", "Analytics", "Citizen Requests", "Workforce Monitoring"]
    }
  },
  Kannada: {
    title: "ಆದ್ಯತೆಗಳು",
    subtitle: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ",
    labels: {
      language: "ಭಾಷೆ",
      theme: "ಥೀಮ್",
      dateFormat: "ದಿನಾಂಕದ ಸ್ವರೂಪ",
      timeFormat: "ಸಮಯದ ಸ್ವರೂಪ",
      dashboard: "ಡೀಫಾಲ್ಟ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"
    },
    options: {
      theme: ["ಬೆಳಕು (Light)", "ಕತ್ತಲೆ (Dark)", "ಸಿಸ್ಟಮ್ (System)"],
      dateFormat: ["DD MMM YYYY", "YYYY-MM-DD", "MM/DD/YYYY", "DD/MM/YYYY"],
      timeFormat: ["12 ಗಂಟೆ (AM/PM)", "24 ಗಂಟೆ"],
      dashboard: ["ಅವಲೋಕನ (Overview)", "ವಿಶ್ಲೇಷಣೆ (Analytics)", "ನಾಗರಿಕ ವಿನಂತಿಗಳು", "ಕಾರ್ಯಪಡೆ ಮೇಲ್ವಿಚಾರಣೆ"]
    }
  },
  Hindi: {
    title: "प्राथमिकताएं",
    subtitle: "अपने अनुभव को अनुकूलित करें",
    labels: {
      language: "भाषा",
      theme: "थीम",
      dateFormat: "दिनांक प्रारूप",
      timeFormat: "समय प्रारूप",
      dashboard: "डिफ़ॉल्ट डैशबोर्ड"
    },
    options: {
      theme: ["लाइट", "डार्क", "सिस्टम"],
      dateFormat: ["DD MMM YYYY", "YYYY-MM-DD", "MM/DD/YYYY", "DD/MM/YYYY"],
      timeFormat: ["12 घंटे (AM/PM)", "24 घंटे"],
      dashboard: ["अवलोकन (Overview)", "विश्लेषण (Analytics)", "नागरिक अनुरोध", "कार्यबल निगरानी"]
    }
  },
  Telugu: {
    title: "ప్రాధాన్యతలు",
    subtitle: "మీ అనుభవాన్ని అనుకూలీకరించండి",
    labels: {
      language: "భాష",
      theme: "థీమ్",
      dateFormat: "తేదీ ఆకృతి",
      timeFormat: "సమయ ఆకృతి",
      dashboard: "డిఫాల్ట్ డాష్‌బోర్డ్"
    },
    options: {
      theme: ["లైట్", "డార్క్", "సిస్టమ్"],
      dateFormat: ["DD MMM YYYY", "YYYY-MM-DD", "MM/DD/YYYY", "DD/MM/YYYY"],
      timeFormat: ["12 గంటలు (AM/PM)", "24 గంటలు"],
      dashboard: ["అవలోకనం (Overview)", "విశ్లేషణలు", "పౌరుల అభ్యర్థనలు", "కార్యబల పర్యవేక్షణ"]
    }
  },
  Tamil: {
    title: "விருப்பத்தேர்வுகள்",
    subtitle: "உங்கள் அனுபவத்தைத் தனிப்பயனாக்குங்கள்",
    labels: {
      language: "மொழி",
      theme: "தீம்",
      dateFormat: "தேதி வடிவம்",
      timeFormat: "நேர வடிவம்",
      dashboard: "இயல்புநிலை டாஷ்போர்டு"
    },
    options: {
      theme: ["லைட்", "டார்க்", "சிஸ்டம்"],
      dateFormat: ["DD MMM YYYY", "YYYY-MM-DD", "MM/DD/YYYY", "DD/MM/YYYY"],
      timeFormat: ["12 மணிநேரம் (AM/PM)", "24 மணிநேரம்"],
      dashboard: ["கண்ணோட்டம் (Overview)", "பகுப்பாய்வு", "குடிமக்கள் கோரிக்கைகள்", "பணியாளர் கண்காணிப்பு"]
    }
  }
};

export default function PreferencesCard() {
  const [language, setLanguage] = useState("English");
  
  // Use translations dynamically based on chosen language configuration state
  const t = translations[language] || translations.English;

  // Track independent values for selectors dynamically
  const [theme, setTheme] = useState(t.options.theme[0]);
  const [dateFormat, setDateFormat] = useState(t.options.dateFormat[0]);
  const [timeFormat, setTimeFormat] = useState(t.options.timeFormat[0]);
  const [dashboard, setDashboard] = useState(t.options.dashboard[0]);

  // Handler resets dropdown variables appropriately if changing system languages
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const nextTrans = translations[newLang] || translations.English;
    setTheme(nextTrans.options.theme[0]);
    setDateFormat(nextTrans.options.dateFormat[0]);
    setTimeFormat(nextTrans.options.timeFormat[0]);
    setDashboard(nextTrans.options.dashboard[0]);
  };

  const Row = ({ icon: Icon, label, value, onChange, options }) => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-center gap-2.5">
        <Icon size={14} className="text-[#7b8194]" />
        <span className="text-[12px] font-medium text-[#5f677a]">
          {label}
        </span>
      </div>

      <div className="relative w-full sm:w-auto">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            appearance-none
            w-full
            sm:w-[160px]
            h-[30px]
            rounded-[8px]
            border
            border-[#e6e8ef]
            bg-white
            pl-3
            pr-8
            text-[12px]
            font-medium
            text-[#374151]
            outline-none
            cursor-pointer
            focus:border-[#c084fc]
          "
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <ChevronDown
          size={13}
          className="
            absolute
            right-2.5
            top-1/2
            -translate-y-1/2
            text-[#9ca3af]
            pointer-events-none
          "
        />
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-[18px] border border-[#f2f3f7] shadow-sm p-5">
      <h3 className="text-[15px] font-semibold text-[#1f2937]">
        {t.title}
      </h3>

      <p className="text-[11px] text-[#8c95a8] mt-1">
        {t.subtitle}
      </p>

      <div className="mt-5 space-y-4">
        {/* Language explicitly handled by specialized setter hook */}
        <Row
          icon={Globe}
          label={t.labels.language}
          value={language}
          onChange={handleLanguageChange}
          options={["English", "Kannada", "Hindi", "Telugu", "Tamil"]}
        />

        <Row
          icon={Monitor}
          label={t.labels.theme}
          value={theme}
          onChange={setTheme}
          options={t.options.theme}
        />

        <Row
          icon={Calendar}
          label={t.labels.dateFormat}
          value={dateFormat}
          onChange={setDateFormat}
          options={t.options.dateFormat}
        />

        <Row
          icon={Clock}
          label={t.labels.timeFormat}
          value={timeFormat}
          onChange={setTimeFormat}
          options={t.options.timeFormat}
        />

        <Row
          icon={LayoutGrid}
          label={t.labels.dashboard}
          value={dashboard}
          onChange={setDashboard}
          options={t.options.dashboard}
        />
      </div>
    </div>
  );
}