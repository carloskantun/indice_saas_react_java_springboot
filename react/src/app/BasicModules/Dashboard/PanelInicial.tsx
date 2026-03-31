import { Button } from '../../components/ui/button';
import { FavoritesBar } from '../../components/FavoritesBar';
import { useLanguage } from '../../shared/context';
import { useRoutedModuleTab } from '../../hooks/useRoutedModuleTab';

// Import all tab components
import Profile from './Profile';
import BusinessStructure from './BusinessStructure';
import BusinessProfile from './BusinessProfile';
import Plan from './Plan';
import Billing from './Billing';
import Users from './Users';

interface PanelInicialProps {
  onNavigate: (page?: string) => void;
}

const subTabIds = [
  'profile',
  'business-structure',
  'business-profile',
  'plan',
  'billing',
  'users',
] as const;

type PanelInicialTabId = (typeof subTabIds)[number];

const legacySubTabAliases: Partial<Record<string, PanelInicialTabId>> = {
  perfil: 'profile',
  estructuraEmpresarial: 'business-structure',
  perfilEmpresarial: 'business-profile',
  facturacion: 'billing',
  usuarios: 'users',
};

export default function PanelInicial({ onNavigate }: PanelInicialProps) {
  const { t } = useLanguage();
  const { activeTab: activeSubTab, setActiveTab: setActiveSubTab } = useRoutedModuleTab<PanelInicialTabId>(
    'business-profile',
    subTabIds,
    legacySubTabAliases,
  );

  const subTabs = [
    { id: 'profile', label: t.panelInicial.tabs.profile, emoji: '👤', component: Profile },
    { id: 'business-structure', label: t.panelInicial.tabs.businessStructure, emoji: '🏢', component: BusinessStructure },
    { id: 'business-profile', label: t.panelInicial.tabs.businessProfile, emoji: '📊', component: BusinessProfile },
    { id: 'plan', label: t.panelInicial.tabs.plan, emoji: '📋', component: Plan },
    { id: 'billing', label: t.panelInicial.tabs.billing, emoji: '🧾', component: Billing },
    { id: 'users', label: t.panelInicial.tabs.users, emoji: '👥', component: Users },
  ];

  // Get the active component
  const ActiveComponent = subTabs.find(tab => tab.id === activeSubTab)?.component || BusinessProfile;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header del módulo */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Barra de Favoritos */}
          <FavoritesBar 
            onNavigate={(page) => {
              if (page === 'home-panel') return;
              onNavigate(page);
            }} 
            currentModule="home-panel" 
          />
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t.panelInicial.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Configure your profile, business structure, billing, and more.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onNavigate()}
              className="text-sm gap-2"
            >
              <span className="text-lg">🏠</span> {t.panelInicial.back}
            </Button>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {subTabs.map(tab => (
              <button
                key={tab.id}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  activeSubTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveSubTab(tab.id as PanelInicialTabId)}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        <ActiveComponent />
      </div>
    </div>
  );
}
