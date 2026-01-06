"use client";

import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import Script from 'next/script';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

interface RecaptchaContextType {
  executeRecaptcha: (action: string) => Promise<string | null>;
  isLoaded: boolean;
}

const RecaptchaContext = createContext<RecaptchaContextType>({
  executeRecaptcha: async () => null,
  isLoaded: false,
});

export const useRecaptcha = () => useContext(RecaptchaContext);

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('RECAPTCHA_SITE_KEY not configured');
      return null;
    }

    if (!isLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded yet');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      return null;
    }
  }, [isLoaded]);

  const handleScriptLoad = () => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        setIsLoaded(true);
      });
    }
  };

  if (!RECAPTCHA_SITE_KEY) {
    // If no reCAPTCHA key, just render children without protection
    return <>{children}</>;
  }

  return (
    <RecaptchaContext.Provider value={{ executeRecaptcha, isLoaded }}>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />
      {children}
    </RecaptchaContext.Provider>
  );
}
