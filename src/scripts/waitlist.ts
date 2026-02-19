/**
 * Waitlist form handler
 * Handles inline email capture flow for the final CTA section
 * - Toggles email input visibility
 * - Validates email format
 * - Shows success message
 * - Respects prefers-reduced-motion
 */

export function initWaitlist(): void {
  const triggerButton = document.querySelector('[data-waitlist-trigger]') as HTMLButtonElement;
  const formWrapper = document.querySelector('[data-waitlist-form]') as HTMLElement;
  const formElement = document.querySelector('[data-waitlist-form-element]') as HTMLFormElement;
  const emailInput = document.getElementById('waitlist-email') as HTMLInputElement;
  const errorMessage = document.getElementById('waitlist-error') as HTMLElement;
  const successMessage = document.querySelector('[data-waitlist-success]') as HTMLElement;
  const buttonsContainer = document.querySelector('.final-cta-buttons') as HTMLElement;

  if (!triggerButton || !formWrapper || !formElement || !emailInput || !errorMessage || !successMessage) {
    return;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Email validation function
  function validateEmail(email: string): boolean {
    return email.includes('@') && email.includes('.');
  }

  // Show form
  function showForm(): void {
    buttonsContainer.classList.add('is-hidden');
    
    if (prefersReducedMotion) {
      setTimeout(() => {
        buttonsContainer.classList.add('hidden');
        formWrapper.classList.remove('hidden');
        formWrapper.classList.add('is-visible');
        emailInput.focus();
      }, 0);
    } else {
      setTimeout(() => {
        buttonsContainer.classList.add('hidden');
        formWrapper.classList.remove('hidden');
        // Force reflow to ensure transition
        formWrapper.offsetHeight;
        formWrapper.classList.add('is-visible');
        setTimeout(() => {
          emailInput.focus();
        }, 100);
      }, 300);
    }
  }

  // Hide form and show success
  function showSuccess(): void {
    formWrapper.classList.remove('is-visible');
    
    if (prefersReducedMotion) {
      formWrapper.classList.add('hidden');
      successMessage.classList.remove('hidden');
      successMessage.classList.add('is-visible');
    } else {
      setTimeout(() => {
        formWrapper.classList.add('hidden');
        successMessage.classList.remove('hidden');
        // Force reflow to ensure transition
        successMessage.offsetHeight;
        successMessage.classList.add('is-visible');
      }, 300);
    }
  }

  // Show error
  function showError(): void {
    errorMessage.classList.remove('hidden');
    errorMessage.setAttribute('aria-live', 'assertive');
    emailInput.setAttribute('aria-invalid', 'true');
    emailInput.focus();
  }

  // Hide error
  function hideError(): void {
    errorMessage.classList.add('hidden');
    emailInput.setAttribute('aria-invalid', 'false');
  }

  // Handle trigger button click
  triggerButton.addEventListener('click', (e) => {
    e.preventDefault();
    showForm();
  });

  // Handle form submission
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // Hide error if it was shown
    hideError();
    
    // Validate email
    if (!validateEmail(email)) {
      showError();
      return;
    }

    // Show success message
    showSuccess();
  });

  // Clear error on input
  emailInput.addEventListener('input', () => {
    if (!errorMessage.classList.contains('hidden')) {
      hideError();
    }
  });
}
