import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const translations = {
  en: {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    stations: 'Stations',
    bookings: 'Bookings',
    users: 'User Registry',
    providers: 'Providers',
    transactions: 'Transactions',
    revenue: 'Revenue',
    earnings: 'Earnings',
    profile: 'Profile',
    notifications: 'Notifications',
    settings: 'Settings',
    logout: 'Log out',
    reportBug: 'Report Bug',
    saveChanges: 'Save Changes',
    languageSelection: 'Language Selection',
    systemSettings: 'System Settings',
    publicProfile: 'Public Profile',
    soundEffects: 'Sound Effects',
    resetDefault: 'Reset to Default',
    recentActivity: 'Recent Activity',
    preferences: 'My Preferences',
    customizeSettings: 'Customize your VoltWay account settings',
    ops: 'Operations',
    net: 'Network',
    mgmt: 'Management',
    sys: 'System',
    darkMode: 'Dark Mode',
    emailAlerts: 'Email Alerts'
  },
  si: {
    dashboard: 'පාලක පුවරුව',
    analytics: 'විශ්ලේෂණ',
    stations: 'මධ්‍යස්ථාන',
    bookings: 'වෙන්කිරීම්',
    users: 'පරිශීලක ලේඛනය',
    providers: 'සේවා සපයන්නන්',
    transactions: 'ගනුදෙනු',
    revenue: 'ආදායම',
    earnings: 'ඉපැයීම්',
    profile: 'පැතිකඩ',
    notifications: 'දැනුම්දීම්',
    settings: 'සැකසුම්',
    logout: 'පිටවීම',
    reportBug: 'දෝෂයක් වාර්තා කරන්න',
    saveChanges: 'වෙනස්කම් සුරකින්න',
    languageSelection: 'භාෂාව තේරීම',
    systemSettings: 'පද්ධති සැකසුම්',
    publicProfile: 'ප්‍රසිද්ධ පැතිකඩ',
    soundEffects: 'ශබ්ද බලපෑම්',
    resetDefault: 'යථා තත්ත්වයට පත් කරන්න',
    recentActivity: 'මෑතකාලීන ක්‍රියාකාරකම්',
    preferences: 'මගේ මනාපයන්',
    customizeSettings: 'ඔබේ VoltWay ගිණුමේ සැකසුම් වෙනස් කරන්න',
    ops: 'මෙහෙයුම්',
    net: 'ජාලය',
    mgmt: 'කළමනාකරණය',
    sys: 'පද්ධතිය',
    darkMode: 'අඳුරු ප්‍රකාරය',
    emailAlerts: 'විද්‍යුත් තැපැල් ඇඟවීම්'
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    analytics: 'பகுப்பாய்வு',
    stations: 'நிலையங்கள்',
    bookings: 'பதிவுகள்',
    users: 'பயனர் பதிவு',
    providers: 'வழங்குநர்கள்',
    transactions: 'பரிவர்த்தனைகள்',
    revenue: 'வருவாய்',
    earnings: 'ஈட்டங்கள்',
    profile: 'சுயவிவரம்',
    notifications: 'அறிவிப்புகள்',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    reportBug: 'பிழையைப் புகாரளிக்கவும்',
    saveChanges: 'மாற்றங்களைச் சேமிக்கவும்',
    languageSelection: 'மொழி தேர்வு',
    systemSettings: 'கணினி அமைப்புகள்',
    publicProfile: 'பொது சுயவிவரம்',
    soundEffects: 'ஒலி விளைவுகள்',
    resetDefault: 'இயல்புநிலைக்கு மீட்டமைக்கவும்',
    recentActivity: 'சமீபத்திய செயல்பாடு',
    preferences: 'என் விருப்பத்தேர்வுகள்',
    customizeSettings: 'உங்கள் VoltWay கணக்கு அமைப்புகளைத் தனிப்பயனாக்கவும்',
    ops: 'செயல்பாடுகள்',
    net: 'பிணையம்',
    mgmt: 'மேலாண்மை',
    sys: 'கணினி',
    darkMode: 'இருண்ட பயன்முறை',
    emailAlerts: 'மின்னஞ்சல் எச்சரிக்கைகள்'
  }
};

const DEFAULT_SETTINGS = {
  language: 'en',
  notificationsEnabled: true,
  emailAlerts: false,
  darkMode: true,
  publicProfile: false,
  soundEffects: true
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('voltway_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('voltway_settings', JSON.stringify(settings));
    
    // Apply theme globally
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const t = (key) => {
    return translations[settings.language][key] || translations['en'][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ ...settings, updateSetting, t, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
