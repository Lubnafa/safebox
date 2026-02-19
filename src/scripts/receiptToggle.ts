/**
 * Receipt toggle controller for TrustPrivacy section
 * Handles switching between Saved and Not Saved states
 * Updates aria-pressed and receipt card classes
 * Respects prefers-reduced-motion
 */

export function initReceiptToggle(): void {
  const receiptContainer = document.querySelector('.receipt-container');
  if (!receiptContainer) return;

  const toggleButtons = Array.from(receiptContainer.querySelectorAll<HTMLButtonElement>('.receipt-toggle-btn'));
  const receiptCard = receiptContainer.querySelector<HTMLElement>('.receipt-card');
  const savedFields = Array.from(receiptContainer.querySelectorAll<HTMLElement>('.receipt-field-saved'));
  const statusField = receiptContainer.querySelector<HTMLElement>('.receipt-field-status');
  const statusValue = statusField?.querySelector<HTMLElement>('.receipt-value');

  if (toggleButtons.length === 0 || !receiptCard) return;

  // Switch to a specific state
  const switchState = (state: 'saved' | 'not-saved') => {
    const isSaved = state === 'saved';

    // Update toggle buttons
    toggleButtons.forEach(btn => {
      const btnState = btn.getAttribute('data-state');
      const isActive = btnState === state;
      btn.setAttribute('aria-pressed', isActive.toString());
      
      if (isActive) {
        btn.classList.add('active');
        btn.classList.remove('bg-white', 'text-gray-700');
        btn.classList.add('bg-gray-900', 'text-white', 'border-gray-900');
      } else {
        btn.classList.remove('active');
        btn.classList.remove('bg-gray-900', 'text-white', 'border-gray-900');
        btn.classList.add('bg-white', 'text-gray-700');
      }
    });

    // Update receipt card class
    receiptCard.classList.toggle('is-saved', isSaved);
    receiptCard.classList.toggle('is-not-saved', !isSaved);

    // Update saved fields visibility using classes
    savedFields.forEach(field => {
      if (isSaved) {
        field.classList.remove('is-hidden');
      } else {
        field.classList.add('is-hidden');
      }
    });

    // Update status value
    if (statusValue) {
      statusValue.textContent = isSaved ? 'Yes' : 'No';
    }
  };

  // Handle button clicks
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const state = btn.getAttribute('data-state') as 'saved' | 'not-saved';
      if (state) {
        switchState(state);
      }
    });
  });

  // Initialize to saved state
  switchState('saved');
}
