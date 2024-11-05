// components/GoogleTranslate.tsx
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: {
          new(options: any, element: string): any;
          getInstance(): any;
          InlineLayout: { HORIZONTAL: number };
        };
      };
    };
  }
}

const GoogleTranslate: React.FC = () => {
  const [isTranslateEnabled, setIsTranslateEnabled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      removeGoogleTranslateScript();
    };
  }, []);

  useEffect(() => {
    if (isTranslateEnabled) {
      addGoogleTranslateScript();
    } else {
      removeGoogleTranslateScript();
    }
  }, [isTranslateEnabled]);

  useEffect(() => {
    if (isTranslateEnabled) {
      setIsTranslateEnabled(false);
      removeGoogleTranslateScript();
    }
  }, [pathname]);

  const addGoogleTranslateScript = () => {
    if (document.querySelector("script[src*='translate_a/element.js']")) {
      return;
    }

    const translateElement = document.getElementById('google_translate_element');
    if (!translateElement) {
      console.warn('Google translate element not found');
      return;
    }

    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    
    script.onerror = () => {
      console.error('Failed to load Google Translate script');
      setIsTranslateEnabled(false);
    };

    document.body.appendChild(script);

    (window as any).googleTranslateElementInit = () => {
      try {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "ko",
            includedLanguages: "vi",
            layout: (window as any).google.translate.TranslateElement.InlineLayout.HORIZONTAL,
            autoDisplay: true,
            multilanguagePage: true
          },
          "google_translate_element"
        );

        setTimeout(() => {
          try {
            const iframe = document.querySelector('iframe.goog-te-menu-frame') as HTMLIFrameElement;
            if (iframe && iframe.contentDocument) {
              const selectElement = iframe.contentDocument.querySelector('.goog-te-combo') as HTMLSelectElement;
              if (selectElement) {
                selectElement.value = 'vi';
                selectElement.dispatchEvent(new Event('change'));
              }
            }
          } catch (error) {
            console.error('Error setting initial translation:', error);
          }
        }, 1000);
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
        setIsTranslateEnabled(false);
      }
    };
  };

  const removeGoogleTranslateScript = () => {
    // Reset Google Translate iframe
    const iframe = document.querySelector('iframe.goog-te-menu-frame') as HTMLIFrameElement;
    if (iframe) {
      const selectElement = iframe.contentDocument?.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = 'ko'; // Chuyển về ngôn ngữ gốc (tiếng Hàn)
        selectElement.dispatchEvent(new Event('change'));
      }
    }

    // Xóa script
    const scripts = document.querySelectorAll("script[src*='translate_a/element.js'], script[src*='translate.google.com']");
    scripts.forEach(script => script.remove());

    // Xóa các elements
    const elements = document.querySelectorAll(".goog-te-banner-frame, .skiptranslate, iframe.goog-te-menu-frame, .goog-te-menu-value, #\\:1\\.container, #goog-gt-");
    elements.forEach((el) => el.remove());

    // Reset body styles
    document.body.style.top = 'auto';
    document.body.style.position = 'static';
    document.documentElement.style.height = 'auto';
    document.body.classList.remove('translated-ltr');
    document.body.classList.remove('translated-rtl');

    // Xóa cookies
    const domains = [
      window.location.hostname,
      `.${window.location.hostname}`,
      `${window.location.hostname}`,
      '.google.com',
      'translate.googleapis.com',
      `.translate.goog`
    ];

    const paths = ['/', '/g', '/translate_a'];

    domains.forEach(domain => {
      paths.forEach(path => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
        document.cookie = `GOOGTRANS=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;
        document.cookie = `GOOGTRANS=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
      });
    });

    // Xóa localStorage và sessionStorage
    localStorage.removeItem('googtrans');
    sessionStorage.removeItem('googtrans');

    // Reset URL nếu có parameter translate
    if (window.location.href.includes('translate.goog')) {
      window.location.href = window.location.href.replace(/\?_x_tr_[^&]+&?/g, '').replace('translate.goog', window.location.hostname);
    }

    // Force reset Google Translate state
    if (window.google && window.google.translate) {
      const elem = document.getElementById('google_translate_element');
      if (elem) {
        elem.innerHTML = '';
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'vi',
            autoDisplay: false
          },
          'google_translate_element'
        );
      }
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame, .goog-te-menu-value { 
        display: none !important;
      }
      .goog-te-gadget {
        font-size: 0px !important;
      }
      .goog-te-gadget span {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  return (
    <div>
      <button
        onClick={() => setIsTranslateEnabled((prev) => !prev)}
        style={{
          padding: '8px 16px',
          backgroundColor: isTranslateEnabled ? '#ff4d4d' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease'
        }}
      >
        {isTranslateEnabled ? "Tắt Dịch" : "Bật Dịch"}
      </button>
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;
