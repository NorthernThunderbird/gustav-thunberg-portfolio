// Theme Management System
class ThemeManager {
  constructor() {
    this.theme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.bindEvents();
    this.watchSystemTheme();
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateThemeToggleIcon();

    // Dispatch custom event for mobile menu to update label
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  updateThemeToggleIcon() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label', `Switch to ${this.theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  bindEvents() {
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => this.toggleTheme());
    });
  }

  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Scroll Animation System
class ScrollAnimator {
  constructor() {
    this.elements = [];
    this.isObserving = false;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.findAnimatableElements();
    this.startObserving();
    this.setupScrollEffects();
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  findAnimatableElements() {
    this.elements = [
      ...document.querySelectorAll('.work, .about, .contact'),
      ...document.querySelectorAll('.work-item'),
      ...document.querySelectorAll('.stat')
    ];
  }

  startObserving() {
    this.elements.forEach((element) => {
      this.observer.observe(element);
    });
    this.isObserving = true;
  }

  animateElement(element) {
    if (element.classList.contains('work-item')) {
      setTimeout(() => {
        element.classList.add('animate');
      }, this.getRandomDelay(0, 200));
    } else if (element.classList.contains('stat')) {
      this.animateNumber(element);
    } else {
      element.classList.add('animate');
    }
  }

  animateNumber(statElement) {
    const numberElement = statElement.querySelector('.stat-number');
    if (!numberElement || numberElement.classList.contains('animated')) return;

    const finalNumber = parseInt(numberElement.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const start = performance.now();
    const suffix = numberElement.textContent.replace(/[0-9]/g, '');

    numberElement.classList.add('animated');

    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.floor(easeOut * finalNumber);

      numberElement.textContent = currentNumber + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  getRandomDelay(min, max) {
    return Math.random() * (max - min) + min;
  }

  setupScrollEffects() {
    let ticking = false;

    const updateScrollEffects = () => {
      const scrollY = window.pageYOffset;
      const header = document.querySelector('.header');

      // Header background - removed dynamic background color
      // Now using CSS variables only for instant theme switching

      // Parallax effect for hero content
      const heroContent = document.querySelector('.hero-content');
      if (heroContent && scrollY < window.innerHeight) {
        const parallaxSpeed = 0.5;
        heroContent.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
      }

      ticking = false;
    };

    const requestScrollUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  }
}

// Mobile Menu System
class MobileMenuManager {
  constructor() {
    this.hamburgerMenu = document.querySelector('.hamburger-menu');
    this.mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    this.mobileMenuClose = document.querySelector('.mobile-menu-close');
    this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    this.isOpen = false;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Hamburger menu toggle
    if (this.hamburgerMenu) {
      this.hamburgerMenu.addEventListener('click', () => this.toggleMenu());
    }

    // Close button
    if (this.mobileMenuClose) {
      this.mobileMenuClose.addEventListener('click', () => this.closeMenu());
    }

    // Close menu when clicking nav links
    this.mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu when clicking overlay background
    if (this.mobileMenuOverlay) {
      this.mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === this.mobileMenuOverlay) {
          this.closeMenu();
        }
      });
    }

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isOpen = true;
    this.hamburgerMenu?.classList.add('active');
    this.mobileMenuOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeMenu() {
    this.isOpen = false;
    this.hamburgerMenu?.classList.remove('active');
    this.mobileMenuOverlay?.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Smooth Scrolling for Navigation
class SmoothScroller {
  constructor() {
    this.init();
  }

  init() {
    this.bindNavLinks();
  }

  bindNavLinks() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          this.scrollToElement(target);
        }
      });
    });
  }

  scrollToElement(element) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = element.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Interactive Elements Enhancement
class InteractionEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.enhanceButtons();
    this.enhanceWorkItems();
    this.enhanceContactLinks();
  }

  enhanceButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', this.createRippleEffect);
    });
  }

  enhanceWorkItems() {
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-8px) scale(1.02)';
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  enhanceContactLinks() {
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-3px) scale(1.05)';
      });

      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  createRippleEffect(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

    // Add ripple animation CSS if not already present
    if (!document.querySelector('#ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.fps = 60;
    this.lastTime = performance.now();
    this.lowPerformanceMode = false;
    this.init();
  }

  init() {
    this.reduceMotionCheck();
    this.setupLazyLoading();
    this.setupPerformanceMonitoring();
    this.detectDeviceCapabilities();
  }

  reduceMotionCheck() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--timing-fast', '0.01ms');
      document.documentElement.style.setProperty('--timing-normal', '0.01ms');
      document.documentElement.style.setProperty('--timing-slow', '0.01ms');
      this.enableLowPerformanceMode();
    }
  }

  setupLazyLoading() {
    // Future implementation for lazy loading images when added
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0 && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }
  }

  setupPerformanceMonitoring() {
    let fpsHistory = [];
    
    const measureFPS = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      
      if (deltaTime > 0) {
        const currentFPS = 1000 / deltaTime;
        fpsHistory.push(currentFPS);
        
        // Keep only last 60 measurements
        if (fpsHistory.length > 60) {
          fpsHistory.shift();
        }
        
        // Calculate average FPS
        const avgFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
        
        // Enable low performance mode if FPS drops consistently below 30
        if (avgFPS < 30 && fpsHistory.length >= 30 && !this.lowPerformanceMode) {
          this.enableLowPerformanceMode();
        }
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    // Start monitoring after a delay to let the page settle
    setTimeout(() => {
      requestAnimationFrame(measureFPS);
    }, 2000);
  }

  detectDeviceCapabilities() {
    // Check for low-end device indicators
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isOldDevice = /android [1-4]\.|cpu os [1-9]_/i.test(userAgent);
    const hasLimitedRAM = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    if (isMobile || isOldDevice || hasLimitedRAM) {
      this.enableOptimizations();
    }
    
    // Check battery level
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        if (battery.level < 0.2 && !battery.charging) {
          this.enablePowerSavingMode();
        }
        
        battery.addEventListener('levelchange', () => {
          if (battery.level < 0.2 && !battery.charging) {
            this.enablePowerSavingMode();
          } else if (battery.level > 0.5 || battery.charging) {
            this.disablePowerSavingMode();
          }
        });
      });
    }
  }

  enableLowPerformanceMode() {
    if (this.lowPerformanceMode) return;
    
    this.lowPerformanceMode = true;
    document.documentElement.classList.add('low-performance');
    
    
    // Reduce animation complexity
    document.documentElement.style.setProperty('--timing-fast', '100ms');
    document.documentElement.style.setProperty('--timing-normal', '200ms');
    document.documentElement.style.setProperty('--timing-slow', '300ms');
    
    console.log('Low performance mode enabled');
  }

  enableOptimizations() {
    // Mobile/low-end device optimizations
    document.documentElement.classList.add('optimized');
    
    // Reduce blur effects
    const style = document.createElement('style');
    style.textContent = `
      .orb { filter: blur(30px) !important; }
      @media (max-width: 768px) {
        .orb { filter: blur(20px) !important; }
      }
    `;
    document.head.appendChild(style);
  }

  enablePowerSavingMode() {
    document.documentElement.classList.add('power-saving');
    
    
    console.log('Power saving mode enabled');
  }

  disablePowerSavingMode() {
    document.documentElement.classList.remove('power-saving');
    
    
    console.log('Power saving mode disabled');
  }
}

// Email Copy Handler
class EmailCopyHandler {
  constructor() {
    this.copyButton = null;
    this.init();
  }

  init() {
    this.copyButton = document.getElementById('copy-email-btn');
    console.log('EmailCopyHandler initialized, button found:', this.copyButton);
    if (this.copyButton) {
      this.copyButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Button clicked, attempting to copy');
        this.copyEmail();
      });
    }
  }

  async copyEmail() {
    const email = this.copyButton.getAttribute('data-email');
    console.log('Copying email:', email);

    try {
      await navigator.clipboard.writeText(email);
      console.log('Copy successful');
      this.showSnackbar('Copied to clipboard');
    } catch (err) {
      console.log('Clipboard API failed, using fallback:', err);
      // Fallback for older browsers
      this.fallbackCopy(email);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.showSnackbar('Copied to clipboard');
      } else {
        this.showSnackbar('Failed to copy');
      }
    } catch (err) {
      console.error('Failed to copy email:', err);
      this.showSnackbar('Failed to copy');
    }

    document.body.removeChild(textArea);
  }

  showSnackbar(message) {
    // Remove any existing snackbar
    const existingSnackbar = document.querySelector('.snackbar');
    if (existingSnackbar) {
      existingSnackbar.remove();
    }

    // Create snackbar element
    const snackbar = document.createElement('div');
    snackbar.className = 'snackbar';
    snackbar.textContent = message;
    document.body.appendChild(snackbar);

    // Trigger animation
    setTimeout(() => {
      snackbar.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      snackbar.classList.remove('show');
      setTimeout(() => {
        snackbar.remove();
      }, 300);
    }, 3000);
  }
}

// Error Handler
class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
  }

  handleError(event) {
    console.error('Application error:', event.error);
    // Graceful degradation - ensure basic functionality works
    this.fallbackToBasicMode();
  }

  handlePromiseRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  }

  fallbackToBasicMode() {
    // Remove complex animations and interactions if errors occur
    document.documentElement.style.setProperty('--timing-fast', '0ms');
    document.documentElement.style.setProperty('--timing-normal', '0ms');
    document.documentElement.style.setProperty('--timing-slow', '0ms');
  }
}


// Initialize Application
class App {
  constructor() {
    this.modules = {};
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    try {
      // Initialize core modules
      this.modules.errorHandler = new ErrorHandler();
      this.modules.themeManager = new ThemeManager();
      this.modules.performanceMonitor = new PerformanceMonitor();

      // Initialize UI modules
      this.modules.scrollAnimator = new ScrollAnimator();
      this.modules.smoothScroller = new SmoothScroller();
      this.modules.interactionEnhancer = new InteractionEnhancer();
      this.modules.mobileMenuManager = new MobileMenuManager();
      this.modules.emailCopyHandler = new EmailCopyHandler();

      // Mark app as initialized
      document.documentElement.setAttribute('data-app-initialized', 'true');

      // Store app reference globally for performance monitoring
      window.app = this;

      console.log('Portfolio application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      // Fallback to basic functionality
      this.initializeFallback();
    }
  }

  initializeFallback() {
    // Basic theme functionality
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      });
    }

    // Basic smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// Start the application
new App();