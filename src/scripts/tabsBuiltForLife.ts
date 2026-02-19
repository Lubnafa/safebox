/**
 * Tab controller for BuiltForRealLife section
 * Handles:
 * - Click to activate tabs
 * - Keyboard navigation (left/right arrows, Enter/Space)
 * - Applying active classes
 * - Swapping panel content
 * - Moving underline using CSS variables
 * - Respects prefers-reduced-motion
 */

export function initTabsBuiltForLife(): void {
  const tabContainer = document.querySelector('.built-for-tabs-container');
  if (!tabContainer) return;

  const tabs = Array.from(tabContainer.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = Array.from(tabContainer.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
  const underline = tabContainer.querySelector<HTMLElement>('.built-for-tab-underline');
  
  if (tabs.length === 0 || panels.length === 0) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize underline position
  const updateUnderline = (activeTab: HTMLButtonElement) => {
    if (!underline) return;
    
    const tabRect = activeTab.getBoundingClientRect();
    const containerRect = activeTab.closest('.built-for-tabs')?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    const left = tabRect.left - containerRect.left;
    const width = tabRect.width;
    
    if (prefersReducedMotion) {
      // Instant positioning for reduced motion
      underline.style.left = `${left}px`;
      underline.style.width = `${width}px`;
    } else {
      // Animated positioning
      underline.style.left = `${left}px`;
      underline.style.width = `${width}px`;
    }
  };

  // Set initial underline position (after a brief delay to ensure layout is stable)
  const initialActiveTab = tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0];
  if (initialActiveTab) {
    // Use requestAnimationFrame to ensure layout is complete
    requestAnimationFrame(() => {
      updateUnderline(initialActiveTab);
    });
  }

  // Switch to a specific tab
  const switchTab = (targetTab: HTMLButtonElement) => {
    const targetTabId = targetTab.getAttribute('data-tab');
    if (!targetTabId) return;

    // Update tab states
    tabs.forEach(tab => {
      const isSelected = tab === targetTab;
      tab.setAttribute('aria-selected', isSelected.toString());
      tab.classList.toggle('active', isSelected);
    });

    // Update panel states
    panels.forEach(panel => {
      const panelId = panel.getAttribute('data-panel');
      const isActive = panelId === targetTabId;
      
      if (isActive) {
        // Show panel
        panel.hidden = false;
        panel.classList.add('active');
        
        // Trigger panel transition
        if (!prefersReducedMotion) {
          // Reset styles and force reflow
          panel.style.opacity = '0';
          panel.style.transform = 'translateY(10px)';
          void panel.offsetHeight;
          
          // Animate in
          requestAnimationFrame(() => {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
          });
        } else {
          // Instant for reduced motion
          panel.style.opacity = '1';
          panel.style.transform = 'translateY(0)';
        }
      } else {
        // Hide panel
        if (!prefersReducedMotion) {
          // Animate out
          panel.style.opacity = '0';
          panel.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            panel.hidden = true;
            panel.classList.remove('active');
            // Reset styles after hiding
            panel.style.opacity = '';
            panel.style.transform = '';
          }, 300);
        } else {
          // Instant for reduced motion
          panel.hidden = true;
          panel.classList.remove('active');
          panel.style.opacity = '';
          panel.style.transform = '';
        }
      }
    });

    // Update underline position
    updateUnderline(targetTab);

    // Focus the tab for keyboard users
    targetTab.focus();
  };

  // Handle tab clicks
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab);
    });

    // Handle keyboard navigation
    tab.addEventListener('keydown', (e) => {
      const currentIndex = tabs.indexOf(tab);
      let targetIndex = currentIndex;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          targetIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          switchTab(tabs[targetIndex]);
          break;
        
        case 'ArrowRight':
          e.preventDefault();
          targetIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          switchTab(tabs[targetIndex]);
          break;
        
        case 'Home':
          e.preventDefault();
          switchTab(tabs[0]);
          break;
        
        case 'End':
          e.preventDefault();
          switchTab(tabs[tabs.length - 1]);
          break;
        
        case 'Enter':
        case ' ':
          e.preventDefault();
          switchTab(tab);
          break;
      }
    });
  });

  // Update underline on window resize
  let resizeTimeout: number | undefined;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      const activeTab = tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0];
      if (activeTab) {
        updateUnderline(activeTab);
      }
    }, 150);
  });
}
