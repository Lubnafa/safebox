/**
 * FAQ accordion and search functionality
 * Handles:
 * - Accordion open/close (only one open at a time)
 * - Live search filtering
 * - Respects prefers-reduced-motion
 */

export function initFAQ(): void {
  const faqContainer = document.querySelector('.faq-container');
  const searchInput = document.getElementById('faq-search-input') as HTMLInputElement;
  const faqItems = Array.from(document.querySelectorAll<HTMLElement>('[data-faq-item]'));
  const faqButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-faq-button]'));
  const noResultsMessage = document.querySelector<HTMLElement>('.faq-no-results');
  const faqList = document.querySelector<HTMLElement>('.faq-list');

  if (!faqContainer || faqItems.length === 0) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Get answer wrapper for a button
  const getAnswerWrapper = (button: HTMLButtonElement): HTMLElement | null => {
    const controlsId = button.getAttribute('aria-controls');
    if (!controlsId) return null;
    return document.getElementById(controlsId);
  };

  // Open an accordion item
  const openItem = (button: HTMLButtonElement) => {
    const answerWrapper = getAnswerWrapper(button);
    if (!answerWrapper) return;

    button.setAttribute('aria-expanded', 'true');
    button.classList.add('is-open');
    answerWrapper.classList.add('is-open');
    
    if (prefersReducedMotion) {
      // Instant for reduced motion
      answerWrapper.style.maxHeight = 'none';
      answerWrapper.style.opacity = '1';
    } else {
      // Animated expand
      const content = answerWrapper.querySelector<HTMLElement>('.faq-answer-content');
      if (content) {
        // Force reflow to ensure accurate height calculation
        answerWrapper.style.maxHeight = '0';
        void answerWrapper.offsetHeight;
        
        const height = content.scrollHeight;
        answerWrapper.style.maxHeight = `${height}px`;
        answerWrapper.style.opacity = '1';
      }
    }
  };

  // Close an accordion item
  const closeItem = (button: HTMLButtonElement) => {
    const answerWrapper = getAnswerWrapper(button);
    if (!answerWrapper) return;

    button.setAttribute('aria-expanded', 'false');
    button.classList.remove('is-open');
    answerWrapper.classList.remove('is-open');
    
    if (prefersReducedMotion) {
      // Instant for reduced motion
      answerWrapper.style.maxHeight = '0';
      answerWrapper.style.opacity = '0';
    } else {
      // Animated collapse
      answerWrapper.style.maxHeight = '0';
      answerWrapper.style.opacity = '0';
    }
  };

  // Toggle an accordion item
  const toggleItem = (button: HTMLButtonElement) => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      // Close this item
      closeItem(button);
    } else {
      // Close all other items first
      faqButtons.forEach(btn => {
        if (btn !== button && btn.getAttribute('aria-expanded') === 'true') {
          closeItem(btn);
        }
      });
      
      // Open this item
      openItem(button);
    }
  };

  // Handle button clicks
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      toggleItem(button);
    });
  });

  // Search functionality
  if (searchInput) {
    const performSearch = (query: string) => {
      const searchTerm = query.toLowerCase().trim();
      let visibleCount = 0;

      faqItems.forEach(item => {
        const button = item.querySelector<HTMLButtonElement>('[data-faq-button]');
        const answer = item.querySelector<HTMLElement>('.faq-answer-content');
        
        if (!button || !answer) return;

        const questionText = button.querySelector('.faq-question-text')?.textContent?.toLowerCase() || '';
        const answerText = answer.textContent?.toLowerCase() || '';
        const matches = searchTerm === '' || questionText.includes(searchTerm) || answerText.includes(searchTerm);

        if (matches) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
          // Close item if it's open and being hidden
          if (button.getAttribute('aria-expanded') === 'true') {
            closeItem(button);
          }
        }
      });

      // Show/hide no results message
      if (noResultsMessage && faqList) {
        if (visibleCount === 0 && searchTerm !== '') {
          faqList.style.display = 'none';
          noResultsMessage.classList.remove('hidden');
        } else {
          faqList.style.display = '';
          noResultsMessage.classList.add('hidden');
        }
      }
    };

    // Listen for input changes
    searchInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      performSearch(target.value);
    });

    // Initialize with empty search
    performSearch('');
  }

  // Initialize all items as closed
  faqButtons.forEach(button => {
    const answerWrapper = getAnswerWrapper(button);
    if (answerWrapper) {
      answerWrapper.style.maxHeight = '0';
      answerWrapper.style.opacity = '0';
    }
  });
}
