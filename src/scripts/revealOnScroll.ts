/**
 * Scroll reveal functionality using IntersectionObserver
 * Adds 'is-visible' class to elements when they enter the viewport
 * Respects prefers-reduced-motion
 * 
 * Supports:
 * - data-reveal-index: for indexed elements (cards, etc.)
 * - data-reveal: for general elements
 * - data-reveal="stagger": for list items with data-index (staggered reveal)
 */

export function initRevealOnScroll(): void {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // If reduced motion is preferred, make all revealable elements visible immediately
    const indexedElements = document.querySelectorAll('[data-reveal-index]');
    indexedElements.forEach((el) => {
      el.classList.add('is-visible');
    });
    
    const generalElements = document.querySelectorAll('[data-reveal]');
    generalElements.forEach((el) => {
      el.classList.add('is-visible');
    });
    
    const listItems = document.querySelectorAll('[data-reveal="stagger"] li[data-index]');
    listItems.forEach((el) => {
      el.classList.add('is-visible');
    });
    
    const lineDrawElements = document.querySelectorAll('[data-line-draw]');
    lineDrawElements.forEach((el) => {
      el.classList.add('is-visible');
    });
    
    return;
  }

  // Create IntersectionObserver
  const observerOptions: IntersectionObserverInit = {
    root: null, // viewport
    rootMargin: '0px 0px -100px 0px', // trigger slightly before element enters viewport
    threshold: 0.1, // trigger when 10% of element is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve after revealing to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with data-reveal-index attribute
  const indexedElements = document.querySelectorAll('[data-reveal-index]');
  indexedElements.forEach((el) => {
    observer.observe(el);
  });

  // Observe general reveal elements
  const generalElements = document.querySelectorAll('[data-reveal]:not([data-reveal="stagger"])');
  generalElements.forEach((el) => {
    observer.observe(el);
  });

  // Handle staggered list items
  const staggerContainers = document.querySelectorAll('[data-reveal="stagger"]');
  staggerContainers.forEach((container) => {
    const listItems = container.querySelectorAll('li[data-index]');
    listItems.forEach((item) => {
      observer.observe(item);
    });
  });

  // Handle timeline line draw
  const lineDrawElements = document.querySelectorAll('[data-line-draw]');
  lineDrawElements.forEach((el) => {
    observer.observe(el);
  });
}
