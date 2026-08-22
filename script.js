/* ==========================================
   TruGreen Interactivity Script
   Root Location: script.js
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('.top-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
  });

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobileToggle');
  const closeDrawer = document.getElementById('closeDrawer');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (closeDrawer) closeDrawer.addEventListener('click', closeMobileMenu);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileMenu);

  // 3. Interactive Service Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(targetTab);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // 4. Modal Handlers (Get Started & Quote Modals)
  const estimateModal = document.getElementById('estimateModal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-trigger');
  const modalTriggers = document.querySelectorAll('.open-estimate-modal');

  function openModal() {
    if (estimateModal) {
      estimateModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (estimateModal) {
      estimateModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (estimateModal) {
    estimateModal.addEventListener('click', (e) => {
      if (e.target === estimateModal) {
        closeModal();
      }
    });
  }

  // 5. ZIP Code Search Simulator
  const zipForms = document.querySelectorAll('.zip-form-submit');
  zipForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const zipInput = form.querySelector('input[type="text"], input[type="number"]');
      const zipValue = zipInput ? zipInput.value.trim() : '';

      if (!/^\d{5}$/.test(zipValue)) {
        alert('Please enter a valid 5-digit US ZIP Code.');
        return;
      }

      // Simulate local branch response
      const resultsContainer = document.getElementById('modalStepResult') || form;
      alert(`Great news! TruGreen offers customized lawn & pest care plans in ZIP code ${zipValue}.\n\nYour 15% online discount has been applied!`);
      closeModal();
    });
  });

  // 6. Google Sheets Integration for Step 1 Data Capture
  const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzkyfPpdcA52F95xUCJ9l4nJfuXyGi_TgZxs1bn86CSRqEOf5dNNzUUABZ5KbK736IvmQ/exec';

  async function sendStep1DataToGoogleSheet(data) {
    if (!GOOGLE_SHEETS_WEB_APP_URL || GOOGLE_SHEETS_WEB_APP_URL.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
      console.log('Google Sheets Web App URL not set yet. Data captured:', data);
      return;
    }

    try {
      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      console.log('Step 1 personal info successfully submitted to Google Sheets.');
    } catch (error) {
      console.error('Failed to send Step 1 data to Google Sheets:', error);
    }
  }

  // 7. Multi-Step Buy Online Form Handler
  let currentStep = 1;
  const totalSteps = 5;
  const steps = document.querySelectorAll('.step-card');
  const progressFill = document.getElementById('progressFill');
  const stepCounterText = document.getElementById('stepCounterText');
  const btnNextStep = document.getElementById('btnNextStep');
  const btnPrevStep = document.getElementById('btnPrevStep');

  function updateMultiStepView() {
    if (!steps.length) return;

    steps.forEach((step, idx) => {
      if (idx + 1 === currentStep) {
        step.classList.add('active-step');
      } else {
        step.classList.remove('active-step');
      }
    });

    // Update Progress Fill width
    if (progressFill) {
      progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
    }

    // Update Step Counter Text
    if (stepCounterText) {
      stepCounterText.textContent = `Step ${currentStep} of ${totalSteps}`;
    }

    // Button states
    if (btnPrevStep) {
      btnPrevStep.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    }

    if (btnNextStep) {
      if (currentStep === totalSteps) {
        btnNextStep.textContent = 'Complete & Save 15%';
      } else {
        btnNextStep.textContent = 'Next Step ›';
      }
    }

    // Update Step 5 Summary if viewing Step 5
    if (currentStep === 5) {
      const fName = document.getElementById('stepFirstName')?.value || 'John';
      const lName = document.getElementById('stepLastName')?.value || 'Doe';
      const phone = document.getElementById('stepPhone')?.value || '(555) 000-0000';
      const email = document.getElementById('stepEmail')?.value || 'john.doe@example.com';
      const addr = document.getElementById('stepAddress')?.value || '1790 Kirby Parkway';
      const zip = document.getElementById('stepZip')?.value || '38138';

      const sName = document.getElementById('summaryName');
      const sContact = document.getElementById('summaryContact');
      const sAddr = document.getElementById('summaryAddress');

      if (sName) sName.textContent = `${fName} ${lName}`;
      if (sContact) sContact.textContent = `${email} | ${phone}`;
      if (sAddr) sAddr.textContent = `${addr}, ${zip}`;
    }
  }

  // Selection Card Click Handler (Yard Size, Plans, Concerns)
  document.querySelectorAll('.select-card').forEach(card => {
    card.addEventListener('click', function() {
      const parentGrid = this.closest('.option-grid');
      const isMulti = parentGrid && parentGrid.classList.contains('multi-select');

      if (!isMulti && parentGrid) {
        parentGrid.querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
      }
      this.classList.toggle('selected');
    });
  });

  // Next Step Trigger
  if (btnNextStep) {
    btnNextStep.addEventListener('click', () => {
      // Validate Step 1 (Personal Info)
      if (currentStep === 1) {
        const fName = document.getElementById('stepFirstName');
        const lName = document.getElementById('stepLastName');
        const phone = document.getElementById('stepPhone');
        const email = document.getElementById('stepEmail');

        if (!fName || !fName.value.trim() || !lName || !lName.value.trim()) {
          alert('Please enter your first and last name.');
          return;
        }
        if (!phone || !phone.value.trim()) {
          alert('Please enter your mobile phone number.');
          return;
        }
        if (!email || !email.value.trim() || !email.value.includes('@')) {
          alert('Please enter a valid email address.');
          return;
        }

        // Send Step 1 Data to Google Sheet automatically when Next button is clicked
        const step1Data = {
          firstName: fName.value.trim(),
          lastName: lName.value.trim(),
          mobilePhone: phone.value.trim(),
          email: email.value.trim(),
          timestamp: new Date().toLocaleString()
        };

        sendStep1DataToGoogleSheet(step1Data);
      }

      // Validate Step 2 (Location)
      if (currentStep === 2) {
        const address = document.getElementById('stepAddress');
        const zip = document.getElementById('stepZip');
        if (address && !address.value.trim()) {
          alert('Please enter your property street address.');
          return;
        }
        if (zip && !/^\d{5}$/.test(zip.value.trim())) {
          alert('Please enter a valid 5-digit ZIP code.');
          return;
        }
      }

      if (currentStep < totalSteps) {
        currentStep++;
        updateMultiStepView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Complete Step
        alert('🎉 Congratulations! Your TruGreen customized lawn care quote is confirmed with 15% Web Exclusive Discount applied!\n\nA TruGreen specialist will contact you shortly to confirm your service start date.');
        window.location.href = 'index.html';
      }
    });
  }

  // Prev Step Trigger
  if (btnPrevStep) {
    btnPrevStep.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateMultiStepView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Initialize Multi-step view if present
  if (steps.length) {
    updateMultiStepView();
  }

});

