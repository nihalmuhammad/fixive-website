/**
 * Fixive - Commercial Kitchen Maintenance Platform Landing Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 3. Interactive Concept Dashboard Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state
      tabBtns.forEach(b => {
        b.classList.remove('active', 'bg-orange-500/10', 'border-orange-500', 'text-orange-500');
        b.classList.add('border-transparent', 'text-slate-400');
      });

      btn.classList.add('active', 'bg-orange-500/10', 'border-orange-500', 'text-orange-500');
      btn.classList.remove('border-transparent', 'text-slate-400');

      // Update active tab content
      tabContents.forEach(content => {
        if (content.id === targetTab) {
          content.classList.add('active');
          content.style.display = 'block';
          setTimeout(() => {
            content.style.opacity = '1';
          }, 50);
        } else {
          content.classList.remove('active');
          content.style.opacity = '0';
          content.style.display = 'none';
        }
      });
    });
  });

  // 4. Maintenance Request Flow Interactive Severity Switcher (Tab 2)
  const severityBtns = document.querySelectorAll('.severity-btn');
  const etaDisplay = document.getElementById('mock-eta-display');

  severityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      severityBtns.forEach(b => {
        b.classList.remove('ring-2', 'ring-orange-500', 'bg-orange-500/20');
        b.classList.add('bg-slate-800');
      });
      btn.classList.add('ring-2', 'ring-orange-500', 'bg-orange-500/20');
      btn.classList.remove('bg-slate-800');

      const level = btn.getAttribute('data-severity');
      if (etaDisplay) {
        if (level === 'critical') {
          etaDisplay.textContent = '⚡ 60-Min Guaranteed Response Target';
          etaDisplay.className = 'text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-md border border-red-500/30';
        } else if (level === 'high') {
          etaDisplay.textContent = '⏱️ Example response target (pilot hypothesis)';
          etaDisplay.className = 'text-xs font-semibold text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-md border border-orange-500/30';
        } else {
          etaDisplay.textContent = '📅 Next Morning Scheduled Visit';
          etaDisplay.className = 'text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700';
        }
      }
    });
  });

  // 5. QR Code Asset Scan Simulator (Tab 1)
  const scanSimulateBtn = document.getElementById('scan-simulate-btn');
  const scanResultArea = document.getElementById('scan-result-area');
  const scanLoader = document.getElementById('scan-loader');

  if (scanSimulateBtn && scanResultArea && scanLoader) {
    scanSimulateBtn.addEventListener('click', () => {
      scanLoader.classList.remove('hidden');
      scanResultArea.classList.add('opacity-40');

      setTimeout(() => {
        scanLoader.classList.add('hidden');
        scanResultArea.classList.remove('opacity-40');
        
        // Flash subtle success highlight
        scanResultArea.classList.add('ring-2', 'ring-emerald-500');
        setTimeout(() => {
          scanResultArea.classList.remove('ring-2', 'ring-emerald-500');
        }, 1500);
      }, 1000);
    });
  }

  // 5b. Digital Request Logging Dispatch Simulator (Tab 2)
  const mockDispatchBtn = document.getElementById('mock-dispatch-btn');
  const mockDispatchToast = document.getElementById('mock-dispatch-toast');

  if (mockDispatchBtn && mockDispatchToast) {
    mockDispatchBtn.addEventListener('click', () => {
      mockDispatchToast.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
      setTimeout(() => {
        mockDispatchToast.classList.add('hidden');
      }, 4500);
    });
  }

  // 6. Pilot application form handling
  const waitlistForm = document.getElementById('waitlist-form');
  const confirmationModal = document.getElementById('confirmation-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('form-name').value.trim();
      const brandName = document.getElementById('form-brand').value.trim();
      const outlets = document.getElementById('form-outlets').value;
      const city = document.getElementById('form-city').value;
      const whatsapp = document.getElementById('form-whatsapp') ? document.getElementById('form-whatsapp').value.trim() : '';

      if (!fullName || !brandName || !whatsapp) {
        alert('Please fill out all required fields.');
        return;
      }

      const submitBtn = waitlistForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin inline mr-2"></i> Submitting Enquiry...`;
        if (window.lucide) lucide.createIcons();
      }

      // Build form submission payload
      const formData = new FormData(waitlistForm);
      formData.append('_subject', `New Fixive Pilot Application from ${brandName} (${city})`);
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');

      // Dispatch payload to nhlcvsbus@gmail.com
      let submissionSucceeded = false;
      try {
        const response = await fetch('https://formsubmit.co/ajax/nhlcvsbus@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json();
        if (data && data.success === 'false' && data.message && data.message.includes('Activation')) {
          console.warn('FormSubmit activation required for domain:', window.location.origin);
          // If activation is pending, allow native form submission to open FormSubmit activation notice page
          if (waitlistForm.action) {
            waitlistForm.submit();
            return;
          }
        }
        submissionSucceeded = response.ok && data && data.success !== 'false';
      } catch (err) {
        console.warn('Enquiry mail API notice:', err);
        alert('We could not send your application. Please try again or contact Fixive by email.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          if (window.lucide) lucide.createIcons();
        }
      }

      if (!submissionSucceeded) return;

      // Update modal details dynamically
      document.getElementById('modal-user-name').textContent = fullName;
      document.getElementById('modal-brand-name').textContent = brandName;
      document.getElementById('modal-city').textContent = city;

      // Show confirmation modal
      if (confirmationModal) {
        confirmationModal.classList.remove('hidden');
        confirmationModal.classList.add('flex');
      }

      // Reset form
      waitlistForm.reset();
    });
  }

  if (closeModalBtn && confirmationModal) {
    closeModalBtn.addEventListener('click', () => {
      confirmationModal.classList.add('hidden');
      confirmationModal.classList.remove('flex');
    });

    confirmationModal.addEventListener('click', (e) => {
      if (e.target === confirmationModal) {
        confirmationModal.classList.add('hidden');
        confirmationModal.classList.remove('flex');
      }
    });
  }

  // 7. Copy Referral/Waitlist Link
  const copyLinkBtn = document.getElementById('copy-link-btn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const originalText = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-400 inline mr-1"></i> Copied to Clipboard!`;
        if (window.lucide) lucide.createIcons();
        setTimeout(() => {
          copyLinkBtn.innerHTML = originalText;
          if (window.lucide) lucide.createIcons();
        }, 2500);
      }).catch(() => {
        alert('Waitlist link URL: ' + window.location.href);
      });
    });
  }
});
