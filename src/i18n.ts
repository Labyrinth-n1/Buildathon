import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          app_name: 'EpiMind Pulse',
          dashboard: 'Dashboard',
          epidemiology: 'Epidemiology',
          analysis: 'Analysis',
          reports: 'History',
          settings: 'System',
          symptom_analyzer: 'Biosensory AI Analyzer',
          analyze: 'RUN ANALYSIS',
          risk_level: 'Risk Level',
          active_alerts: 'Active Alerts',
          login: 'Login',
          signup: 'Signup',
          logout: 'Logout',
        },
      },
      fr: {
        translation: {
          app_name: 'EpiMind Pulse',
          dashboard: 'Tableau de Bord',
          epidemiology: 'Épidémiologie',
          analysis: 'Analyse',
          reports: 'Historique',
          settings: 'Système',
          symptom_analyzer: 'Analyseur Biosensoriel AI',
          analyze: "LANCER L'ANALYSE",
          risk_level: 'Niveau de Risque',
          active_alerts: 'Alertes Actives',
          login: 'Connexion',
          signup: 'Inscription',
          logout: 'Déconnexion',
        },
      },
    },
  });

export default i18n;
