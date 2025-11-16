import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PackageItem {
  id?: number | string;
  name: string;
  speed: string | number;
  speed_unit?: string;
  speedUnit?: string;
  download_speed?: number | string;
  upload_speed?: number | string;
  price?: string;
  description?: string;
  features?: string[];
  popular?: boolean;
  premium?: boolean;
}

interface BenefitItem {
  id?: number | string;
  title: string;
  description: string;
}

interface InternetData {
  packages: PackageItem[];
  benefits: BenefitItem[];
}

interface InternetDataContextType {
  internetData: InternetData | null;
  setInternetData: (data: InternetData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const InternetDataContext = createContext<InternetDataContextType | undefined>(undefined);

export function InternetDataProvider({ children }: { children: ReactNode }) {
  const [internetData, setInternetData] = useState<InternetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <InternetDataContext.Provider
      value={{
        internetData,
        setInternetData,
        isLoading,
        setIsLoading,
        error,
        setError
      }}
    >
      {children}
    </InternetDataContext.Provider>
  );
}

export function useInternetData() {
  const context = useContext(InternetDataContext);
  if (context === undefined) {
    throw new Error('useInternetData must be used within an InternetDataProvider');
  }
  return context;
}