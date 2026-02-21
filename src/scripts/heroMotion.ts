/**
 * Hero motion and parallax controller
 * Handles load animations and mouse parallax effects
 */

export function initHeroMotion() {
  const hero = document.getElementById('hero') as HTMLElement;
  if (!hero) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize animation state
  hero.setAttribute('data-animate-ready', 'false');
  
  // Initialize CSS variables for background flow
  hero.style.setProperty('--px', '0px');
  hero.style.setProperty('--py', '0px');
  hero.style.setProperty('--bg-x', '0px');
  hero.style.setProperty('--bg-y', '0px');
  hero.style.setProperty('--bg-x-2', '0px');
  hero.style.setProperty('--bg-y-2', '0px');

  // Trigger animations on load
  function triggerAnimations() {
    // Small delay to ensure DOM is ready
    requestAnimationFrame(() => {
      hero.setAttribute('data-animate-ready', 'true');
    });
  }

  // Initialize parallax (desktop only, respects reduced motion)
  function initParallax() {
    if (prefersReducedMotion) return;
    
    // Only enable parallax on desktop (lg breakpoint and above)
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    let rafId: number | null = null;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    function updateParallax() {
      // Smooth interpolation for parallax movement
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;

      // Cap movement to subtle values (max 20px in each direction)
      const cappedX = Math.max(-20, Math.min(20, currentX));
      const cappedY = Math.max(-20, Math.min(20, currentY));

      hero.style.setProperty('--px', `${cappedX}px`);
      hero.style.setProperty('--py', `${cappedY}px`);
      
      // Background flow effect - different speeds for depth (more pronounced)
      hero.style.setProperty('--bg-x', `${cappedX * 0.5}px`);
      hero.style.setProperty('--bg-y', `${cappedY * 0.5}px`);
      hero.style.setProperty('--bg-x-2', `${cappedX * 0.7}px`);
      hero.style.setProperty('--bg-y-2', `${cappedY * 0.7}px`);

      rafId = requestAnimationFrame(updateParallax);
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate offset from center (normalized to -1 to 1)
      const offsetX = (e.clientX - centerX) / (rect.width / 2);
      const offsetY = (e.clientY - centerY) / (rect.height / 2);
      
      // Scale to parallax amount (small values for subtle effect)
      mouseX = offsetX * 15;
      mouseY = offsetY * 15;
    }

    function handleMouseLeave() {
      // Reset to center when mouse leaves
      mouseX = 0;
      mouseY = 0;
    }

    // Start parallax loop
    updateParallax();

    // Add event listeners
    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
    };
  }

  // Initialize everything
  triggerAnimations();
  
  // Wait a bit before starting parallax to avoid interfering with load animations
  setTimeout(() => {
    initParallax();
  }, 1000);

  // Handle window resize for parallax
  let resizeTimeout: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      // Parallax will re-check on next mouse move
    }, 250);
  });
}
