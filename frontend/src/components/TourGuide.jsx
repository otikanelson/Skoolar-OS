import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TourGuide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [popupPosition, setPopupPosition] = useState({});
  const [isPositioning, setIsPositioning] = useState(false);

  const tutorialSteps = [
    {
      title: 'Welcome to Skoolar',
      description: 'Let us show you around our academic management platform. This comprehensive tour will take you through different pages to show you everything we offer.',
      target: null,
      position: 'center',
      page: '/',
    },
    {
      title: 'Explore All Features',
      description: 'Let\'s start by exploring our comprehensive feature set. Click Next to navigate to the Features page.',
      target: null,
      position: 'center',
      page: '/',
      navigate: '/features',
    },
    {
      title: 'Comprehensive Feature List',
      description: 'Here you can see all 8 major feature categories including Student Records Management, Result Processing, CBT Examination System, Parent Portal, Teacher Tools, Analytics & Reporting, Communication, and Security & Access Control.',
      target: 'features-grid',
      position: 'top',
      page: '/features',
    },
    {
      title: 'View Pricing Plans',
      description: 'Now let\'s check out our pricing plans to see which option works best for your school. Click Next to continue.',
      target: null,
      position: 'center',
      page: '/features',
      navigate: '/pricing',
    },
    {
      title: 'Subscription Plans',
      description: 'We offer three tiers: Basic (₦200/student/month), Standard (₦300/student/month), and Premium (₦400/student/month). Each plan is designed for different school sizes.',
      target: 'pricing-header',
      position: 'bottom',
      page: '/pricing',
    },
    {
      title: 'Plan Comparison',
      description: 'Click on any plan card to select it and see what\'s included. The Standard plan is recommended for most schools as it includes the CBT Examination System.',
      target: 'pricing-cards',
      position: 'top',
      page: '/pricing',
    },
    {
      title: 'Ready to Register?',
      description: 'Now that you\'ve seen our features and pricing, let\'s head back to register your school!',
      target: null,
      position: 'center',
      page: '/pricing',
      navigate: '/',
    },
    {
      title: 'Register Your School',
      description: 'Click this button to start the registration process. It only takes a few minutes to get your school set up on Skoolar!',
      target: 'register-button',
      position: 'bottom',
      page: '/',
    },
    {
      title: 'Already Registered?',
      description: 'If your school is already registered, use this button to login to your portal. That completes our tour - thank you for exploring Skoolar!',
      target: 'login-button',
      position: 'bottom',
      page: '/',
    },
  ];

  const nextTutorialStep = () => {
    const currentStep = tutorialSteps[tutorialStep];
    
    if (tutorialStep < tutorialSteps.length - 1) {
      if (currentStep.navigate) {
        sessionStorage.setItem('skoolar_tour_step', (tutorialStep + 1).toString());
        navigate(currentStep.navigate);
      } else {
        setTutorialStep(prev => prev + 1);
        sessionStorage.setItem('skoolar_tour_step', (tutorialStep + 1).toString());
      }
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
      sessionStorage.removeItem('skoolar_tour_active');
      sessionStorage.removeItem('skoolar_tour_step');
      cleanupHighlights();
    }
  };

  const skipTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
    sessionStorage.removeItem('skoolar_tour_active');
    sessionStorage.removeItem('skoolar_tour_step');
    cleanupHighlights();
  };

  const cleanupHighlights = () => {
    const allTargets = ['features-grid', 'pricing-header', 'pricing-cards', 'register-button', 'login-button'];
    allTargets.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.position = '';
        el.style.zIndex = '';
        el.style.boxShadow = '';
        el.style.borderRadius = '';
      }
    });
  };

  useEffect(() => {
    const hasVisited = localStorage.getItem('skoolar_visited');
    const tourActive = sessionStorage.getItem('skoolar_tour_active');
    const tourStep = sessionStorage.getItem('skoolar_tour_step');
    
    if (!hasVisited && !tourActive && location.pathname === '/') {
      setShowTutorial(true);
      sessionStorage.setItem('skoolar_tour_active', 'true');
      localStorage.setItem('skoolar_visited', 'true');
    } else if (tourActive === 'true' && tourStep) {
      // Add delay to ensure page is fully loaded before showing tour
      setTimeout(() => {
        setShowTutorial(true);
        setTutorialStep(parseInt(tourStep));
      }, 300);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!showTutorial) return;
    
    const currentStep = tutorialSteps[tutorialStep];
    
    if (currentStep.page !== location.pathname) {
      return;
    }

    const updatePosition = () => {
      if (currentStep.target) {
        const element = document.getElementById(currentStep.target);
        
        if (element) {
          // Force a reflow to get accurate measurements
          element.offsetHeight;
          
          const rect = element.getBoundingClientRect();
          const position = currentStep.position;
          const scrollY = window.scrollY || window.pageYOffset;
          
          // Get the actual center of the element
          const elementCenterX = rect.left + (rect.width / 2);
          const elementTop = rect.top + scrollY;
          const elementBottom = rect.bottom + scrollY;
          
          // Add extra spacing for better visibility
          const spacing = 40;
          
          if (position === 'bottom') {
            setPopupPosition({
              position: 'absolute',
              top: `${elementBottom + spacing}px`,
              left: `${elementCenterX}px`,
              transform: 'translateX(-50%)',
            });
          } else if (position === 'top') {
            setPopupPosition({
              position: 'absolute',
              top: `${elementTop - spacing}px`,
              left: `${elementCenterX}px`,
              transform: 'translate(-50%, -100%)',
            });
          }
          setIsPositioning(false);
        }
      } else {
        setPopupPosition({});
        setIsPositioning(false);
      }
    };
    
    if (currentStep.target) {
      const element = document.getElementById(currentStep.target);
      
      if (element) {
        setIsPositioning(true);
        
        element.style.position = 'relative';
        element.style.zIndex = '45';
        element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
        element.style.borderRadius = '4px';
        
        // Immediate scroll on page load
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // After scrolling to element, ensure popup is visible
          setTimeout(() => {
            updatePosition();
            // Scroll popup into view if needed
            const popupElement = document.querySelector('.z-50.bg-white.rounded-lg');
            if (popupElement) {
              const popupRect = popupElement.getBoundingClientRect();
              if (popupRect.top < 0 || popupRect.bottom > window.innerHeight) {
                popupElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
          }, 800);
        }, 100);
        
        const timeouts = [400, 700, 1000, 1300, 1600];
        timeouts.forEach(delay => {
          setTimeout(updatePosition, delay);
        });
        
        const handleScroll = () => updatePosition();
        window.addEventListener('scroll', handleScroll);
        
        return () => {
          window.removeEventListener('scroll', handleScroll);
          cleanupHighlights();
        };
      } else {
        // Element not found yet, retry
        const retryTimeout = setTimeout(() => {
          const retryElement = document.getElementById(currentStep.target);
          if (retryElement) {
            retryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(updatePosition, 500);
          }
        }, 500);
        
        return () => clearTimeout(retryTimeout);
      }
    } else {
      updatePosition();
    }
  }, [tutorialStep, showTutorial, location.pathname]);

  if (!showTutorial) return null;

  const currentStep = tutorialSteps[tutorialStep];
  if (currentStep.page !== location.pathname) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 z-40"
      />

      <motion.div
        key={tutorialStep}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`z-50 bg-white rounded-lg shadow-2xl p-6 max-w-md ${
          currentStep.position === 'center'
            ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            : isPositioning
            ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            : 'absolute'
        }`}
        style={
          currentStep.position === 'center' || isPositioning
            ? {}
            : popupPosition
        }
      >
        {currentStep.target && (
          <div
            className={`absolute ${
              currentStep.position === 'bottom'
                ? '-bottom-2 left-1/2 transform -translate-x-1/2'
                : '-top-2 left-1/2 transform -translate-x-1/2 rotate-180'
            }`}
          >
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
          </div>
        )}

        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">{tutorialStep + 1}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {currentStep.title}
            </h3>
            <p className="text-sm text-gray-600">
              {currentStep.description}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={skipTutorial}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Skip Tour
          </button>
          <button
            onClick={nextTutorialStep}
            className="px-4 py-2 text-sm bg-[#1e3a8a] text-white rounded hover:bg-[#1e40af]"
          >
            {tutorialStep < tutorialSteps.length - 1 ? 'Next' : 'Finish Tour'}
          </button>
        </div>

        <div className="flex gap-2 justify-center mt-4">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === tutorialStep ? 'bg-[#1e3a8a]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TourGuide;
