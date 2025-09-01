import React from 'react';
import { useRouter } from 'next/router';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import MobileFAB from './MobileFAB';

interface MobileCustomerLayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  showFAB?: boolean;
  onNewSubscription?: () => void;
  onNewLocation?: () => void;
  onSettings?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const MobileCustomerLayout: React.FC<MobileCustomerLayoutProps> = ({
  children,
  title,
  showBack = false,
  onBack,
  showSearch = false,
  onSearch,
  showFAB = true,
  onNewSubscription,
  onNewLocation,
  onSettings,
  user
}) => {
  const router = useRouter();

  const handleNewSubscription = () => {
    if (onNewSubscription) {
      onNewSubscription();
    } else {
      router.push('/plans');
    }
  };

  const handleNewLocation = () => {
    if (onNewLocation) {
      onNewLocation();
    } else {
      router.push('/customer/locations');
    }
  };

  const handleSettings = () => {
    if (onSettings) {
      onSettings();
    } else {
      router.push('/customer/profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <MobileHeader
        title={title}
        showBack={showBack}
        onBack={onBack}
        showSearch={showSearch}
        onSearch={onSearch}
        user={user}
      />

      {/* Contenido principal */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>

      {/* Navegación inferior */}
      <MobileBottomNav />

      {/* Floating Action Button */}
      {showFAB && (
        <MobileFAB
          onNewSubscription={handleNewSubscription}
          onNewLocation={handleNewLocation}
          onSettings={handleSettings}
        />
      )}

      {/* Safe area para dispositivos con notch */}
      <div className="h-safe-area-inset-bottom bg-gray-50 md:hidden"></div>
    </div>
  );
};

export default MobileCustomerLayout;
