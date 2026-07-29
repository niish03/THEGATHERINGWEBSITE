document.addEventListener('DOMContentLoaded', () => {
  // Web3Forms Access Key configuration placeholder
  const WEB3FORMS_ACCESS_KEY = '6595d0b1-3bdc-43ca-80dd-e75e1f0515fe';

  /* ==========================================
     PHONE AUTOFILL HANDLER
     ========================================== */
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      let digits = this.value.replace(/\D/g, '');
      if (digits.length > 10) {
        this.value = digits.slice(-10);
      }
    });
  });

  /* ==========================================
     DATE VALIDATION HELPER
     ========================================== */
  function isValidHighLevelDate(dateStr) {
    if (!dateStr) return false;
    let matchYMD = dateStr.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    let matchMDY = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    
    let y, m, d;
    if (matchYMD) {
      y = parseInt(matchYMD[1], 10);
      m = parseInt(matchYMD[2], 10);
      d = parseInt(matchYMD[3], 10);
    } else if (matchMDY) {
      m = parseInt(matchMDY[1], 10);
      d = parseInt(matchMDY[2], 10);
      y = parseInt(matchMDY[3], 10);
    } else {
      return false;
    }
    return (m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1900);
  }

  /* ==========================================
     SCROLL-SPY ACTIVE PAGE INDICATOR & STICKY HEADER
     ========================================== */
  const header = document.querySelector('.header');
  const navSpyLinks = document.querySelectorAll('.nav-link[data-section]');
  const spySections = [];

  navSpyLinks.forEach(link => {
    const sectionId = link.getAttribute('data-section');
    const section = document.getElementById(sectionId);
    if (section) {
      spySections.push({ id: sectionId, el: section });
    }
  });

  // Observe catering and group it under the "Amenities" nav link
  const cateringSec = document.getElementById('catering');
  if (cateringSec) {
    spySections.push({ id: 'catering', el: cateringSec });
  }

  function updateScrollState() {
    const navLogoImg = document.querySelector('#nav-logo .logo-img');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      if (navLogoImg) navLogoImg.src = 'assets/photos/logo-dark.png';
    } else {
      header.classList.remove('scrolled');
      if (navLogoImg) navLogoImg.src = 'assets/photos/logo.png';
    }

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition < 50) {
      // Force 'Home' active at the top
      navSpyLinks.forEach(link => {
        if (link.getAttribute('data-section') === 'hero') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    } else if (scrollPosition + windowHeight >= documentHeight - 30) {
      // Force 'Contact' active at the bottom
      navSpyLinks.forEach(link => {
        if (link.getAttribute('data-section') === 'contact') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateScrollState);
  updateScrollState(); // Initialize header state and nav highlight

  // Setup IntersectionObserver for sections in between
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Only handle updates if we aren't at the very top or bottom
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isNearTop = scrollPosition < 50;
      const isNearBottom = scrollPosition + windowHeight >= documentHeight - 30;

      if (entry.isIntersecting && !isNearTop && !isNearBottom) {
        let activeId = entry.target.id;
        // Group catering and amenities together under the "amenities" nav item
        if (activeId === 'catering') {
          activeId = 'amenities';
        }
        
        navSpyLinks.forEach(link => {
          if (link.getAttribute('data-section') === activeId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-25% 0px -50% 0px',
    threshold: 0
  });

  spySections.forEach(({ el }) => {
    spyObserver.observe(el);
  });

  /* ==========================================
     MOBILE HAMBURGER MENU
     ========================================== */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  /* ==========================================
     3-STEP GAMIFIED BOOKING WIDGET LOGIC
     ========================================== */
  const widget = document.getElementById('booking-widget');
  if (widget) {
    const stepPanels = document.querySelectorAll('.booking-widget .step-panel');
    const progressPercent = document.getElementById('widget-progress-percent');
    const stepDots = document.querySelectorAll('.booking-widget .widget-step-dot');
    
    const eventTypeCards = document.querySelectorAll('.event-type-card');
    const guestInput = document.getElementById('widget-guests-input');
    
    const btnPrev = document.getElementById('widget-prev-btn');
    const btnNext = document.getElementById('widget-next-btn');

    let widgetState = {
      step: 1,
      eventType: '',
      date: '',
      guests: '',
      name: '',
      email: '',
      phone: '',
      info: ''
    };

    // Step transitions
    function updateWidgetUI() {
      // Progress Bar
      const progress = ((widgetState.step - 1) / 2) * 100;
      progressPercent.style.width = `${progress || 10}%`; // Minimum width for starting

      // Step dots active states
      stepDots.forEach((dot, index) => {
        const dotStep = index + 1;
        dot.classList.remove('active', 'completed');
        if (dotStep === widgetState.step) {
          dot.classList.add('active');
        } else if (dotStep < widgetState.step) {
          dot.classList.add('completed');
        }
      });

    // Panel visibility
    stepPanels.forEach(panel => {
      panel.classList.remove('active');
      if (parseInt(panel.dataset.step) === widgetState.step) {
        panel.classList.add('active');
      }
    });

    // Nav Buttons styling
    if (widgetState.step === 1) {
      btnPrev.style.visibility = 'hidden';
      btnNext.textContent = 'Next Step →';
    } else {
      btnPrev.style.visibility = 'visible';
      if (widgetState.step === 3) {
        btnNext.textContent = 'Get in Touch';
      } else {
        btnNext.textContent = 'Continue →';
      }
    }
  }

  // Error handling for form validation
  function clearErrors() {
    document.querySelectorAll('.widget-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.widget-input.error').forEach(el => el.classList.remove('error'));
  }

  function showError(inputId, msg) {
    const inputEl = document.getElementById(inputId);
    if (!inputEl) return;
    inputEl.classList.add('error');
    
    let errorEl = inputEl.parentNode.querySelector('.widget-error-msg');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'widget-error-msg';
      inputEl.parentNode.insertBefore(errorEl, inputEl.nextSibling);
    }
    errorEl.textContent = msg;
  }

  // Clear error on input
  document.querySelectorAll('.widget-input').forEach(input => {
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        this.classList.remove('error');
        const errorMsg = this.parentNode.querySelector('.widget-error-msg');
        if (errorMsg) errorMsg.remove();
      }
    });
  });

  // Validate current step
  function isStepValid() {
    clearErrors();
    let isValid = true;

    if (widgetState.step === 1) {
      const dateInput = document.getElementById('widget-date');
      const dateVal = dateInput.value.trim();
      
      if (!dateVal) {
        if (dateInput.validity && dateInput.validity.badInput) {
           showError('widget-date', 'Please enter a valid date.');
           isValid = false;
        } else {
           showError('widget-date', 'Please select a preferred event date.');
           isValid = false;
        }
      } else if (!isValidHighLevelDate(dateVal)) {
        showError('widget-date', 'Please enter a valid date.');
        isValid = false;
      }
      if (isValid) widgetState.date = dateVal;
    } else if (widgetState.step === 2) {
      const guestInputEl = document.getElementById('widget-guests-input');
      if (!guestInputEl || !guestInputEl.value || guestInputEl.value < 1) {
        showError('widget-guests-input', 'Please enter a valid estimated guest count.');
        isValid = false;
      }
      if (isValid) widgetState.guests = guestInputEl.value;
    } else if (widgetState.step === 3) {
      const nameVal = document.getElementById('widget-name').value.trim();
      const emailVal = document.getElementById('widget-email').value.trim();
      const phoneVal = document.getElementById('widget-phone').value.trim();
      const infoVal = document.getElementById('widget-info').value.trim();

      if (!nameVal) {
        showError('widget-name', 'Please enter your full name.');
        isValid = false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        showError('widget-email', 'Please enter your email address.');
        isValid = false;
      } else if (!emailRegex.test(emailVal)) {
        showError('widget-email', 'Please enter a valid email address.');
        isValid = false;
      }
      
      if (!phoneVal) {
        showError('widget-phone', 'Please enter your phone number.');
        isValid = false;
      }

      if (isValid) {
        widgetState.name = nameVal;
        widgetState.email = emailVal;
        widgetState.phone = phoneVal;
        widgetState.info = infoVal;
      }
    }
    return isValid;
  }

  // Event Card selection
  const otherEventContainer = document.getElementById('other-event-container');
  const otherEventInput = document.getElementById('widget-other-event');

  eventTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      eventTypeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      widgetState.eventType = card.dataset.value;
      
      if (widgetState.eventType === 'other') {
        if (otherEventContainer) otherEventContainer.style.display = 'block';
        // Do not auto-advance when "other" is selected so they can type
      } else {
        if (otherEventContainer) otherEventContainer.style.display = 'none';
        
        // Auto advance to Step 2 for high converting UX, but only if date is filled
        setTimeout(() => {
          if (widgetState.step === 1) {
            const dateVal = document.getElementById('widget-date').value.trim();
            if (dateVal && isValidHighLevelDate(dateVal)) {
              widgetState.date = dateVal;
              widgetState.step = 2;
              updateWidgetUI();
            }
          }
        }, 300);
      }
    });
  });

  // No longer using guest slider and room cards

  // Button navigation clicks
  btnNext.addEventListener('click', () => {
    if (!isStepValid()) return;

    if (widgetState.step < 3) {
      widgetState.step++;
      updateWidgetUI();
    } else {
      // Simulate Form Submission Success
      submitBookingLead();
    }
  });

  btnPrev.addEventListener('click', () => {
    if (widgetState.step > 1) {
      widgetState.step--;
      updateWidgetUI();
    }
  });

  async function submitBookingLead() {
    // 1. Show loading state on the button
    const originalBtnText = btnNext.textContent;
    btnNext.disabled = true;
    btnNext.textContent = 'Sending...';
    btnPrev.disabled = true;

    // Clear any previous error message
    const existingError = document.getElementById('widget-submit-error');
    if (existingError) existingError.remove();

    // Prepare Web3Forms payload
    let evTypeStr = '';
    if (widgetState.eventType === 'celebrations') {
      evTypeStr = 'celebration';
    } else if (widgetState.eventType === 'corporate') {
      evTypeStr = 'corporate event';
    } else if (widgetState.eventType === 'community-social') {
      evTypeStr = 'community or social event';
    } else if (widgetState.eventType === 'other') {
      const otherVal = document.getElementById('widget-other-event').value.trim();
      evTypeStr = otherVal ? otherVal : '';
    } else if (widgetState.eventType) {
      evTypeStr = widgetState.eventType;
    }

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New Event Inquiry from ${widgetState.name}`,
      from_name: 'The Gathering Website',
      name: widgetState.name,
      email: widgetState.email,
      phone: widgetState.phone,
      event_type: evTypeStr || 'None provided',
      guest_count: widgetState.guests,
      preferred_date: widgetState.date,
      additional_info: widgetState.info || 'None provided'
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Hide progress bar and nav buttons
        const progressContainer = document.querySelector('.widget-progress-container');
        const navBtns = document.querySelector('.widget-nav-buttons');
        
        if (progressContainer) progressContainer.style.display = 'none';
        if (navBtns) navBtns.style.display = 'none';

        stepPanels.forEach(panel => panel.classList.remove('active'));
        
        // Activate confirmation panel (Step 4)
        const confirmationPanel = document.querySelector('.step-panel[data-step="4"]');
        if (confirmationPanel) {
          confirmationPanel.classList.add('active');
          const msgEl = document.getElementById('confirmation-message');

          if (msgEl) {
            const rawName = widgetState.name ? widgetState.name.trim().split(' ')[0] : '';
            const firstName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : '';
            const greeting = firstName ? `Thanks, <strong>${firstName}</strong>!` : 'Thanks!';
            msgEl.innerHTML = `${greeting} We've received your request and will contact you within 2–4 business hours to discuss your event and answer any questions.`;
          }
        }
      } else {
        throw new Error(result.message || 'Form submission failed.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Re-enable buttons
      btnNext.disabled = false;
      btnNext.textContent = originalBtnText;
      btnPrev.disabled = false;

      // Show user-friendly error message in Step 3
      const step3Panel = document.querySelector('.step-panel[data-step="3"]');
      if (step3Panel) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'widget-submit-error';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '15px';
        errorDiv.style.textAlign = 'center';
        errorDiv.innerHTML = `⚠️ Submission failed. Please check your connection and try again.`;
        step3Panel.appendChild(errorDiv);
      }
    }
  }

  // Initialize widget
  updateWidgetUI();
  }

  /* ==========================================
     INTERACTIVE VENUE SHOWCASE
     ========================================== */
  const svgRooms = document.querySelectorAll('.fp-room');
  const svgPartitions = document.querySelectorAll('.fp-partition');
  const selectedRooms = new Set(['a']);

  // Room Data
  const roomData = {
    a: {
      name: 'The Honeysuckle Room',
      tagline: 'Warm. Inviting. Perfect for intimate events.',
      dimensions: '40 × 60 ft',
      widthFt: 40,
      banquet: 120,
      theater: 230,
      description: 'Warm, inviting, and perfect for intimate events. The Honeysuckle Room offers a refined space ideal for bridal showers, small weddings, workshops, and private meetings.',
      perfectFor: ['Bridal & Baby Showers', 'Birthday Celebrations', 'Small Weddings', 'Meetings', 'Workshops', 'Training Sessions'],
      images: [
        { src: 'assets/photos/Honeysuckle1.png', caption: 'The Honeysuckle Room — Banquet setup with crystal chandelier & projection screen' },
        { src: 'assets/photos/Entrance1.png', caption: 'The Honeysuckle Room — Dedicated entrance (Door 1)' },
        { src: 'assets/photos/Lobby1.png', caption: 'Grand Lobby — Welcoming lounge connecting to The Honeysuckle Room' }
      ]
    },
    b: {
      name: 'The Magnolia Room',
      tagline: 'Spacious. Impressive. Perfect for large gatherings.',
      dimensions: '62 × 60 ft',
      widthFt: 62,
      banquet: 210,
      theater: 500,
      description: 'Spacious, impressive, and perfect for large gatherings. The Magnolia Room delivers a grand atmosphere for weddings, conferences, galas, and corporate events.',
      perfectFor: ['Weddings', 'Conferences', 'Galas', 'Large Community Events', 'Banquets', 'Corporate Events'],
      images: [
        { src: 'assets/photos/Magnolia1.png', caption: 'The Magnolia Room — Grand banquet configuration with partition dividers visible' },
        { src: 'assets/photos/Magnolia2.png', caption: 'The Magnolia Room — Spacious open layout for large events' },
        { src: 'assets/photos/Entrance2.png', caption: 'The Magnolia Room — Dedicated entrance (Door 2)' }
      ]
    },
    c: {
      name: 'The Blues Room',
      tagline: 'Versatile. Comfortable. Great for meetings & workshops.',
      dimensions: '35 × 60 ft',
      widthFt: 35,
      banquet: 120,
      theater: 230,
      description: 'Versatile, comfortable, and great for focused gatherings. The Blues Room is an excellent choice for corporate meetings, birthday parties, receptions, and training seminars.',
      perfectFor: ['Corporate Meetings', 'Birthday Parties', 'Receptions', 'Training Seminars', 'Workshops'],
      images: [
        { src: 'assets/photos/Blues1.png', caption: 'The Blues Room — Elegant banquet setup with chandeliers' },
        { src: 'assets/photos/Entrance3.png', caption: 'The Blues Room — Dedicated entrance (Door 3)' },
        { src: 'assets/photos/Lobby3.png', caption: 'Grand Lobby — Reception & lounge area adjacent to The Blues Room' }
      ]
    },
    d: {
      name: 'The Harmony Room',
      tagline: 'Elegant. Functional. Made for bigger celebrations.',
      dimensions: '55 × 60 ft',
      widthFt: 55,
      banquet: 210,
      theater: 500,
      description: 'Elegant, functional, and made for bigger celebrations. The Harmony Room provides ample space for corporate celebrations, large receptions, banquets, and community events.',
      perfectFor: ['Corporate Celebrations', 'Large Receptions', 'Banquets', 'Community Events', 'Holiday Parties'],
      images: [
        { src: 'assets/photos/Harmony1.png', caption: 'The Harmony Room — Grand banquet layout with elegant ring chandeliers' },
        { src: 'assets/photos/Entrance4.png', caption: 'The Harmony Room — Dedicated entrance (Door 4)' },
        { src: 'assets/photos/Lobby2.png', caption: 'Grand Lobby — Spacious lounge connecting to The Harmony Room' }
      ]
    }
  };

  // Small SVG icons for Perfect For items
  const pfIcons = {
    'Bridal & Baby Showers': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    'Birthday Celebrations': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'Small Weddings': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    'Meetings': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'Workshops': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    'Training Sessions': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    'Weddings': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    'Conferences': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    'Galas': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    'Large Community Events': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'Banquets': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    'Corporate Events': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    'Corporate Meetings': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    'Birthday Parties': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'Receptions': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    'Training Seminars': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    'Corporate Celebrations': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    'Large Receptions': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'Community Events': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'Holiday Parties': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
  };
  const defaultPfIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';



  function updateVenueUI() {
    // 1. Update SVG highlights
    svgRooms.forEach(room => {
      const rid = room.id.replace('fp-', '');
      room.classList.toggle('selected', selectedRooms.has(rid));
    });

    const selArray = Array.from(selectedRooms);
    if (selArray.length === 0) {
      selectedRooms.add('a');
      updateVenueUI();
      return;
    }

    // 2. Populate detail card with single room data
    const data = roomData[selArray[0]];
    document.getElementById('detail-room-name').textContent = data.name;
    document.getElementById('detail-room-tagline').textContent = data.tagline;
    document.getElementById('detail-banquet').textContent = data.banquet;
    document.getElementById('detail-theater').textContent = data.theater;
    document.getElementById('detail-dimensions').textContent = data.dimensions;
    document.getElementById('detail-description').textContent = data.description;

    // Perfect for — icon-prefixed grid
    const pfContainer = document.getElementById('detail-perfect-for');
    pfContainer.innerHTML = data.perfectFor.map(tag => {
      const icon = pfIcons[tag] || defaultPfIcon;
      return `<div class="pf-item">${icon}<span>${tag}</span></div>`;
    }).join('');

    // 3. Update slider
    initSlider(selArray);
  }

  // Select a single room (clears any previous selection)
  function selectRoom(roomId) {
    selectedRooms.clear();
    selectedRooms.add(roomId);
    updateVenueUI();
  }

  // Bind SVG room clicks
  svgRooms.forEach(room => {
    room.addEventListener('click', () => {
      const roomId = room.id.replace('fp-', '');
      selectRoom(roomId);
    });
  });

  /* ==========================================
     ROOM IMAGE SLIDER
     ========================================== */
  let currentSliderImages = [];
  let sliderIndex = 0;

  const sliderImg = document.getElementById('slider-img');
  const sliderCaption = document.getElementById('slider-caption');
  const sliderDotsContainer = document.getElementById('slider-dots');
  const sliderPrevBtn = document.getElementById('slider-prev-btn');
  const sliderNextBtn = document.getElementById('slider-next-btn');

  function renderSlider() {
    if (!currentSliderImages.length) return;

    // Update image & caption with smooth fade transition
    if (sliderImg) {
      sliderImg.style.opacity = '0';
      setTimeout(() => {
        sliderImg.src = currentSliderImages[sliderIndex].src;
        sliderImg.alt = currentSliderImages[sliderIndex].caption;
        if (sliderCaption) sliderCaption.textContent = currentSliderImages[sliderIndex].caption;
        sliderImg.style.opacity = '1';
      }, 150);
    }

    // Re-render dot navigators
    if (sliderDotsContainer) {
      sliderDotsContainer.innerHTML = '';
      currentSliderImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'slider-dot';
        if (index === sliderIndex) dot.classList.add('active');
        dot.dataset.index = index;
        sliderDotsContainer.appendChild(dot);
      });
    }
  }

  function initSlider(roomIds) {
    // Aggregate images from all selected rooms
    currentSliderImages = [];
    roomIds.forEach(rid => {
      if (roomData[rid] && roomData[rid].images) {
        currentSliderImages.push(...roomData[rid].images);
      }
    });
    sliderIndex = 0;
    renderSlider();
  }

  // Slide navigation click events
  if (sliderNextBtn) {
    sliderNextBtn.addEventListener('click', () => {
      sliderIndex = (sliderIndex + 1) % currentSliderImages.length;
      renderSlider();
    });
  }

  if (sliderPrevBtn) {
    sliderPrevBtn.addEventListener('click', () => {
      sliderIndex = (sliderIndex - 1 + currentSliderImages.length) % currentSliderImages.length;
      renderSlider();
    });
  }

  // Dots click delegation
  if (sliderDotsContainer) {
    sliderDotsContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('.slider-dot');
      if (dot) {
        sliderIndex = parseInt(dot.dataset.index);
        renderSlider();
      }
    });
  }

  // Initialize with Honeysuckle Room selected
  if (svgRooms && svgRooms.length > 0) {
    updateVenueUI();
  }

  /* ==========================================
     IMAGE GALLERY LIGHTBOX (NEW)
     ========================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  /* ==========================================
     EXPLORE THE GATHERING SHOWCASE SLIDER
     ========================================== */
  const exploreImages = [
    // 1. Exterior & Entrances
    {
      src: 'assets/photos/Outside2.png',
      title: 'The Gathering Exterior',
      sub: 'Modern Architecture',
      desc: 'Our modern white-brick venue features multiple private entrances, gorgeous exterior illumination, and ample complimentary guest parking.',
      category: 'exterior'
    },
    {
      src: 'assets/photos/Entrance1.png',
      title: 'Dedicated Entrance 1',
      sub: 'Direct Venue Access',
      desc: 'Provide your guests with an exclusive experience using private, direct entries leading straight into specific event areas.',
      category: 'exterior'
    },
    {
      src: 'assets/photos/Entrance2.png',
      title: 'Dedicated Entrance 2',
      sub: 'Magnolia Foyer Access',
      desc: 'Separate entryway designed to allow smooth, independent traffic flows for multiple simultaneous gatherings.',
      category: 'exterior'
    },
    {
      src: 'assets/photos/Entrance3.png',
      title: 'Dedicated Entrance 3',
      sub: 'Blues Foyer Access',
      desc: 'Guests arrive in style through customized greeting entryways tailored for private celebrations.',
      category: 'exterior'
    },
    {
      src: 'assets/photos/Entrance4.png',
      title: 'Dedicated Entrance 4',
      sub: 'Harmony Foyer Access',
      desc: 'Elegant, private entry points that ensure an organized, upscale arrivals experience for VIPs.',
      category: 'exterior'
    },
    // 2. Lobby & Lounges
    {
      src: 'assets/photos/Lobby2.png',
      title: 'Grand Lobby Foyer',
      sub: 'First Impressions',
      desc: 'Stunning polished marble floors, designer ring chandeliers, and custom warm woodwork make a luxurious statement upon arrival.',
      category: 'lobby'
    },
    {
      src: 'assets/photos/Lobby1.png',
      title: 'Lobby Cozy Lounge',
      sub: 'Pre-Function Comfort',
      desc: 'Plush, comfortable leather seating areas encourage mingling, registration, and cocktail hour relaxation.',
      category: 'lobby'
    },
    {
      src: 'assets/photos/Lobby3.png',
      title: 'Lobby Reception Desk',
      sub: 'Welcoming Space',
      desc: 'Well-appointed lounge spaces ideal for guest registration, directional signage, and reception setups.',
      category: 'lobby'
    },
    // 3. Event Rooms
    {
      src: 'assets/photos/Harmony1.png',
      title: 'The Harmony Room',
      sub: 'Grand Banquet Layout',
      desc: 'Our largest single ballroom setup, featuring modern ring lighting, round-table seating, and acoustic sliding wall options.',
      category: 'rooms'
    },
    {
      src: 'assets/photos/Magnolia1.png',
      title: 'The Magnolia Room',
      sub: 'Conference & Banquets',
      desc: 'Configured beautifully with banquet tables, demonstrating the room\'s versatility, clean lines, and integrated AV capability.',
      category: 'rooms'
    },
    {
      src: 'assets/photos/Magnolia2.png',
      title: 'The Magnolia Open Space',
      sub: 'Large Scale Gatherings',
      desc: 'A spacious and bright configuration ideal for exhibitions, wedding receptions, and high-attendance conferences.',
      category: 'rooms'
    },
    {
      src: 'assets/photos/Blues1.png',
      title: 'The Blues Room',
      sub: 'Comfortable Celebrations',
      desc: 'A charming banquet setup complete with chandeliers, perfect for birthday parties, private banquets, and seminars.',
      category: 'rooms'
    },
    {
      src: 'assets/photos/Honeysuckle1.png',
      title: 'The Honeysuckle Room',
      sub: 'Intimate Event Setting',
      desc: 'Beautifully configured for bridal showers or meetings, showing the warmth, comfort, and premium finishes of the space.',
      category: 'rooms'
    },
    // 4. Bar & Catering
    {
      src: 'assets/photos/Bar.png',
      title: 'Full-Service Built-in Bar',
      sub: 'Cocktails & Beverages',
      desc: 'A gorgeous in-house bar featuring custom marble counters and professional bartending options to elevate your toast.',
      category: 'catering'
    },
    {
      src: 'assets/photos/FoodCollage.png',
      title: 'Chef-Crafted Catering',
      sub: 'Culinary Masterpieces',
      desc: 'Our professional culinary team designs bespoke, mouth-watering platters and buffet selections for every taste profile.',
      category: 'catering'
    },
    {
      src: 'assets/photos/Food1.jpeg',
      title: 'Artisanal Hors d\'oeuvres',
      sub: 'Gourmet Starters',
      desc: 'Elegant, delicious starters created to set the tone for an exceptional dining experience.',
      category: 'catering'
    },
    {
      src: 'assets/photos/Food2.jpeg',
      title: 'Exquisite Main Platters',
      sub: 'Five-Star Dining',
      desc: 'Perfectly seasoned and styled dishes cooked to perfection for a premium sit-down experience.',
      category: 'catering'
    },
    {
      src: 'assets/photos/Food3.jpeg',
      title: 'Savory Buffet Selections',
      sub: 'Custom Curated Menus',
      desc: 'Versatile menu plans with options to accommodate dietary needs and themed party catering.',
      category: 'catering'
    },
    {
      src: 'assets/photos/Food4.jpeg',
      title: 'Chef\'s Plated Specialties',
      sub: 'Gastronomy Excellence',
      desc: 'Each plate is individually styled and curated for maximum visual appeal and flavor complexity.',
      category: 'catering'
    },
    {
      src: 'assets/photos/Food5.jpeg',
      title: 'Decadent Fine Desserts',
      sub: 'Sweet Endings',
      desc: 'Delectable dessert styling that looks as incredible as it tastes, leaving a memorable impression on your guests.',
      category: 'catering'
    }
  ];

  // Slider State
  let filteredImages = [...exploreImages];
  let activeIndex = 0;
  let isAutoplayPaused = false;
  const AUTOPLAY_INTERVAL = 6000; // 6 seconds
  let progressStartTimestamp = null;
  let progressAnimationFrame = null;

  // DOM Elements
  const exploreImg = document.getElementById('explore-active-img');
  const exploreTitle = document.getElementById('explore-active-title');
  const exploreSub = document.getElementById('explore-active-sub');
  const exploreDesc = document.getElementById('explore-active-desc');
  const exploreCounter = document.getElementById('explore-counter');
  const explorePrevBtn = document.getElementById('explore-prev-btn');
  const exploreNextBtn = document.getElementById('explore-next-btn');
  const exploreZoomBtn = document.getElementById('explore-zoom-btn');
  const explorePlayBtn = document.getElementById('explore-play-btn');
  const exploreProgressBar = document.getElementById('explore-progress-bar');
  const exploreTabBtns = document.querySelectorAll('.explore-tab-btn');
  const slideContainer = document.getElementById('explore-slide-container');

  function initExploreSlider() {
    if (!exploreImg) return;
    
    renderExploreSlide();
    startAutoplayProgress();

    // Navigation Click listeners
    if (explorePrevBtn) {
      explorePrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateExploreSlider(-1);
      });
    }
    if (exploreNextBtn) {
      exploreNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateExploreSlider(1);
      });
    }
    
    // Zoom / Fullscreen Modal triggers
    if (slideContainer) {
      slideContainer.addEventListener('click', () => {
        openExploreLightbox();
      });
    }
    if (exploreZoomBtn) {
      exploreZoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openExploreLightbox();
      });
    }
    
    // Autoplay controls
    if (explorePlayBtn) {
      explorePlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleExploreAutoplay();
      });
    }

    // Filter Buttons
    exploreTabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        exploreTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        filterExploreImages(filter);
      });
    });

    // Touch Swipe navigation (Mobile friendly)
    let startX = 0;
    let endX = 0;
    if (slideContainer) {
      slideContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      slideContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        if (Math.abs(diffX) > 50) { // threshold
          if (diffX > 0) {
            navigateExploreSlider(1); // Swipe left -> Next
          } else {
            navigateExploreSlider(-1); // Swipe right -> Prev
          }
        }
      }, { passive: true });
    }
  }

  function renderExploreSlide() {
    if (!filteredImages.length || !exploreImg) return;
    const current = filteredImages[activeIndex];
    
    exploreImg.style.opacity = '0';
    setTimeout(() => {
      exploreImg.src = current.src;
      exploreImg.alt = `${current.title} - ${current.sub}`;
      if (exploreTitle) exploreTitle.textContent = current.title;
      if (exploreSub) exploreSub.textContent = current.sub;
      if (exploreDesc) exploreDesc.textContent = current.desc;
      if (exploreCounter) exploreCounter.textContent = `${activeIndex + 1} / ${filteredImages.length}`;
      exploreImg.style.opacity = '1';
      
      // Zoom animation
      exploreImg.classList.remove('zoomed');
      void exploreImg.offsetWidth; // Reflow
      exploreImg.classList.add('zoomed');
    }, 150);

    resetAutoplayProgress();
  }

  function navigateExploreSlider(dir) {
    if (!filteredImages.length) return;
    activeIndex = (activeIndex + dir + filteredImages.length) % filteredImages.length;
    renderExploreSlide();
  }

  function filterExploreImages(category) {
    if (category === 'all') {
      filteredImages = [...exploreImages];
    } else {
      filteredImages = exploreImages.filter(img => img.category === category);
    }
    activeIndex = 0;
    renderExploreSlide();
  }

  function toggleExploreAutoplay() {
    isAutoplayPaused = !isAutoplayPaused;
    
    const playIcon = explorePlayBtn.querySelector('.play-icon');
    const pauseIcon = explorePlayBtn.querySelector('.pause-icon');
    const playText = explorePlayBtn.querySelector('.play-text');
    
    if (isAutoplayPaused) {
      if (playIcon) playIcon.style.display = 'inline-block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (playText) playText.textContent = 'Play Autoplay';
      cancelAnimationFrame(progressAnimationFrame);
      if (exploreProgressBar) exploreProgressBar.style.width = '0%';
    } else {
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'inline-block';
      if (playText) playText.textContent = 'Pause Autoplay';
      startAutoplayProgress();
    }
  }

  function startAutoplayProgress() {
    if (isAutoplayPaused || !exploreProgressBar) return;
    
    cancelAnimationFrame(progressAnimationFrame);
    progressStartTimestamp = performance.now();
    
    function animate(timestamp) {
      if (isAutoplayPaused) return;
      
      const elapsed = timestamp - progressStartTimestamp;
      const progress = Math.min((elapsed / AUTOPLAY_INTERVAL) * 100, 100);
      
      if (exploreProgressBar) exploreProgressBar.style.width = `${progress}%`;
      
      if (elapsed >= AUTOPLAY_INTERVAL) {
        navigateExploreSlider(1);
        progressStartTimestamp = performance.now();
      }
      
      progressAnimationFrame = requestAnimationFrame(animate);
    }
    
    progressAnimationFrame = requestAnimationFrame(animate);
  }

  function resetAutoplayProgress() {
    if (isAutoplayPaused) return;
    progressStartTimestamp = performance.now();
    if (exploreProgressBar) exploreProgressBar.style.width = '0%';
  }

  function openExploreLightbox() {
    if (!filteredImages.length || !lightboxModal) return;
    const current = filteredImages[activeIndex];
    lightboxImg.src = current.src;
    lightboxCaption.textContent = `${current.title} — ${current.desc}`;
    lightboxModal.style.display = 'flex';
  }

  // Initialize Showcase Slider
  initExploreSlider();


  // Link click on active slide image to open Lightbox Modal (For Floorplan Rooms Slider)
  if (sliderImg) {
    sliderImg.addEventListener('click', () => {
      if (!currentSliderImages.length || !lightboxModal) return;
      lightboxImg.src = currentSliderImages[sliderIndex].src;
      lightboxCaption.textContent = currentSliderImages[sliderIndex].caption;
      lightboxModal.style.display = 'flex';
    });
  }

  const closeLightbox = () => {
    lightboxModal.style.display = 'none';
    lightboxImg.src = '';
    lightboxCaption.textContent = '';
  };

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  /* ==========================================
     EVENT MARQUEE BUILDER
     ========================================== */
  const marqueeIcons = {
    'Corporate Meetings': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    'Conferences & Seminars': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    'Weddings': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    'Banquets': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    'Birthday Celebrations': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/><path d="M12 3v1"/></svg>',
    'Baby & Bridal Showers': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
    'Church & Faith-Based Events': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 22H6a2 2 0 0 1-2-2V8l8-6 8 6v12a2 2 0 0 1-2 2z"/><path d="M12 6v8"/><path d="M8 10h8"/></svg>',
    'Family Reunions': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'Holiday Parties': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    'Community Gatherings': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    'Fundraisers & Nonprofit Events': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    'Training Sessions & Workshops': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>',
    'Graduation Celebrations': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg>',
    'Anniversary Parties': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c-4.97 0-9-2.686-9-6v-2c0-3.314 4.03-6 9-6s9 2.686 9 6v2c0 3.314-4.03 6-9 6z"/><path d="M12 8V2"/><path d="M9 5l3-3 3 3"/></svg>'
  };

  const marqueeRow1Events = [
    'Corporate Meetings', 'Conferences & Seminars', 'Weddings', 'Banquets',
    'Birthday Celebrations', 'Baby & Bridal Showers', 'Church & Faith-Based Events'
  ];
  const marqueeRow2Events = [
    'Family Reunions', 'Holiday Parties', 'Community Gatherings',
    'Fundraisers & Nonprofit Events', 'Training Sessions & Workshops',
    'Graduation Celebrations', 'Anniversary Parties'
  ];

  function createMarqueePill(name) {
    const pill = document.createElement('div');
    pill.className = 'marquee-pill';
    pill.innerHTML = `
      <span class="pill-icon">${marqueeIcons[name]}</span>
      <span class="pill-text">${name}</span>
    `;
    return pill;
  }

  function populateMarqueeRow(container, events) {
    // Duplicate items 4x for seamless loop on wider containers
    const allEvents = [...events, ...events, ...events, ...events];
    allEvents.forEach(name => container.appendChild(createMarqueePill(name)));
  }

  const marqueeRow1 = document.getElementById('marquee-row-1');
  const marqueeRow2 = document.getElementById('marquee-row-2');
  
  if (marqueeRow1 && marqueeRow2) {
    populateMarqueeRow(marqueeRow1, marqueeRow1Events);
    populateMarqueeRow(marqueeRow2, marqueeRow2Events);
  }

  /* ==========================================
     AMENITIES SLIDER (Infinite)
     ========================================== */
  const amenitiesTrack = document.getElementById('amenitiesTrack');
  const btnPrev = document.getElementById('amenitiesBtnPrev');
  const btnNext = document.getElementById('amenitiesBtnNext');
  
  if (amenitiesTrack && btnPrev && btnNext) {
    const gap = 32;
    const slideDelay = 3000;
    let autoPlayInterval;
    let isTransitioning = false;

    // Clone all original cards and append for infinite loop
    const originalCards = Array.from(amenitiesTrack.querySelectorAll('.amenity-card'));
    const totalOriginal = originalCards.length;
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      amenitiesTrack.appendChild(clone);
    });

    // currentIndex references the first visible card (0 = first original)
    let currentIndex = 0;

    function getCardWidth() {
      const firstCard = amenitiesTrack.querySelector('.amenity-card');
      return firstCard ? firstCard.offsetWidth : 380;
    }

    function setTrackPosition(animate) {
      const cardWidth = getCardWidth();
      const offset = currentIndex * (cardWidth + gap);
      if (!animate) {
        amenitiesTrack.style.transition = 'none';
      } else {
        amenitiesTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      }
      amenitiesTrack.style.transform = `translateX(-${offset}px)`;
      // Force reflow when disabling transition
      if (!animate) amenitiesTrack.offsetHeight;
    }

    function slideNext() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      setTrackPosition(true);
    }

    function slidePrev() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      if (currentIndex < 0) {
        // Jump to the cloned tail instantly, then animate back
        currentIndex = totalOriginal - 1;
        setTrackPosition(true);
        isTransitioning = false;
        return;
      }
      setTrackPosition(true);
    }

    // After transition, check if we've scrolled into clone territory
    amenitiesTrack.addEventListener('transitionend', () => {
      if (currentIndex >= totalOriginal) {
        currentIndex = currentIndex - totalOriginal;
        setTrackPosition(false); // Instant jump, no animation
      }
      isTransitioning = false;
    });

    function startAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(slideNext, slideDelay);
    }

    btnNext.addEventListener('click', () => {
      slideNext();
      startAutoPlay();
    });

    btnPrev.addEventListener('click', () => {
      slidePrev();
      startAutoPlay();
    });

    // Pause on hover
    amenitiesTrack.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    amenitiesTrack.addEventListener('mouseleave', startAutoPlay);

    // Handle screen resizes
    window.addEventListener('resize', () => {
      setTrackPosition(false);
    });

    // Init
    setTrackPosition(false);
    startAutoPlay();
  }

  /* ==========================================
     ADD-ONS DYNAMIC LIST
     ========================================== */
  const addonItems = document.querySelectorAll('.addon-item');
  let selectedAddons = [];

  addonItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('selected');
      const addonName = item.dataset.name;
      
      if (item.classList.contains('selected')) {
        selectedAddons.push(addonName);
      } else {
        selectedAddons = selectedAddons.filter(a => a !== addonName);
      }

      // Automatically append selected add-ons to the contact form message textarea
      const contactMessage = document.getElementById('contact-message');
      if (contactMessage) {
        // Strip out any previously auto-generated add-ons header line
        let userText = contactMessage.value.replace(/^Interested Add-ons:.*?\n\n/g, '');
        
        if (selectedAddons.length > 0) {
          contactMessage.value = `Interested Add-ons: ${selectedAddons.join(', ')}\n\n${userText}`;
        } else {
          contactMessage.value = userText;
        }
      }
    });
  });

  /* ==========================================
     CATEGORIZED FAQ ACCORDION
     ========================================== */
  const faqCatBtns = document.querySelectorAll('.faq-cat-btn');
  const faqGroups = document.querySelectorAll('.faq-group');
  const faqItems = document.querySelectorAll('.faq-item');

  // FAQ Category selector tabs
  faqCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      faqCatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      faqGroups.forEach(group => {
        group.classList.remove('active');
        if (group.id === `faq-group-${btn.dataset.category}`) {
          group.classList.add('active');
        }
      });
    });
  });

  // Accordion Expand/Collapse logic
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all other active items in the current active FAQ Group
      const currentActiveGroup = document.querySelector('.faq-group.active');
      const siblings = currentActiveGroup.querySelectorAll('.faq-item');
      siblings.forEach(sib => {
        sib.classList.remove('open');
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  /* ==========================================
     CONTACT PAGE & FINAL LEAD CAPTURE
     ========================================== */
  const contactForm = document.getElementById('lead-capture-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const eventType = document.getElementById('contact-event-type').value;
      const guests = document.getElementById('contact-guests').value;
      const eventDate = document.getElementById('contact-event-date').value;
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !phone || !eventType || !guests) {
        alert('Please fill out all required fields.');
        return;
      }

      // Simulate API submit
      const formPanel = document.querySelector('.contact-form-panel');
      let successHTML = `
        <div style="text-align: center; padding: 40px 0;">
          <div style="width: 60px; height: 60px; background-color: rgba(16, 185, 129, 0.1); border: 2px solid var(--success); color: var(--success); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 30px; height: 30px; stroke-linecap: round; stroke-linejoin: round;"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <h3 style="font-family: var(--font-headings); font-size: 1.6rem; color: var(--text-dark); margin-bottom: 12px;">Inquiry Received!</h3>
          <p style="color: var(--text-main); font-size: 0.95rem; margin-bottom: 20px;">Thank you, <strong>${name}</strong>. We've received your request for a <strong>${eventType.toUpperCase()}</strong> event.</p>
      `;

      if (eventDate) {
        successHTML += `<p style="color: var(--text-main); font-size: 0.9rem; margin-bottom: 12px;">Requested Date: <strong>${eventDate}</strong></p>`;
      }

      successHTML += `
          <p style="color: var(--text-light); font-size: 0.85rem;">One of our events coordinators will call you at <strong>${phone}</strong> or email you within 2 business hours with confirmations and a pricing guide.</p>
        </div>
      `;

      formPanel.innerHTML = successHTML;
    });
  }

  /* ==========================================
     COOKIE CONSENT BANNER LOGIC (NEW)
     ========================================== */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept-btn');
  const cookieDeclineBtn = document.getElementById('cookie-decline-btn');

  // Check Local Storage
  const cookieConsent = localStorage.getItem('gathering-cookie-consent');
  if (!cookieConsent && cookieBanner) {
    setTimeout(() => {
      cookieBanner.style.display = 'block';
    }, 1000);
  }

  if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('gathering-cookie-consent', 'accepted');
      cookieBanner.style.display = 'none';
    });
  }

  if (cookieDeclineBtn) {
    cookieDeclineBtn.addEventListener('click', () => {
      localStorage.setItem('gathering-cookie-consent', 'declined');
      cookieBanner.style.display = 'none';
    });
  }

  /* ==========================================
     HERO TYPEWRITER EFFECT
     ========================================== */
  const typewriterText = document.querySelector('.typewriter-text');
  if (typewriterText) {
    const events = [
      "Corporate Meetings & Conferences",
      "Weddings & Receptions",
      "Banquets & Galas",
      "Birthday Celebrations",
      "Baby & Bridal Showers",
      "Church & Faith-Based Events",
      "Family Reunions",
      "Holiday Parties",
      "Fundraisers & Community Events",
      "Training & Workshops",
      "Graduation & Anniversary Celebrations"
    ];
    let eventIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
      const currentEvent = events[eventIndex];
      
      if (isDeleting) {
        typewriterText.textContent = currentEvent.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterText.textContent = currentEvent.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentEvent.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        eventIndex = (eventIndex + 1) % events.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000);
  }

  const bookingWidget = document.getElementById('booking-widget');

  // Shared Helper: Smoothly scroll to booking widget/form, glow, & focus
  function scrollToBookingWidget(shouldFocus = false) {
    if (!bookingWidget) return;
    const isMobile = window.innerWidth <= 992;
    const heroSection = document.getElementById('hero');
    const targetElement = (isMobile && bookingWidget) ? bookingWidget : (heroSection || bookingWidget);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });

      let scrollTimeout;
      const scrollHandler = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          window.removeEventListener('scroll', scrollHandler);
          bookingWidget.classList.add('highlight-widget');

          if (shouldFocus) {
            const dateInput = document.getElementById('widget-date');
            if (dateInput) dateInput.focus({ preventScroll: true });
          }

          setTimeout(() => {
            bookingWidget.classList.remove('highlight-widget');
          }, 2000);
        }, 100);
      };

      window.addEventListener('scroll', scrollHandler);

      const expectedOffset = (targetElement === bookingWidget) ? 100 : 0;
      if (Math.abs(targetElement.getBoundingClientRect().top - expectedOffset) < 50) {
        window.removeEventListener('scroll', scrollHandler);
        bookingWidget.classList.add('highlight-widget');
        if (shouldFocus) {
          const dateInput = document.getElementById('widget-date');
          if (dateInput) dateInput.focus({ preventScroll: true });
        }
        setTimeout(() => {
          bookingWidget.classList.remove('highlight-widget');
        }, 2000);
      }
    }
  }

  // Handle Wizard Redirection CTAs
  const wizardRedirectBtns = document.querySelectorAll('.wizard-redirect-btn');

  if (wizardRedirectBtns.length > 0 && bookingWidget) {
    wizardRedirectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        if (btn.tagName.toLowerCase() === 'a' && (href === '#hero' || href === '#booking-widget' || href === '#inquire' || href === '#book')) {
          e.preventDefault();
          
          if (typeof navLinks !== 'undefined' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (typeof mobileMenuToggle !== 'undefined') mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
          }

          scrollToBookingWidget(false);
        }
      });
    });
  }

  // Deep Link Landing Handler: Auto-scroll to form when visiting URLs with #inquire, #book, #booking-widget, etc.
  function checkUrlForFormLanding() {
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    
    const formHashes = ['#inquire', '#book', '#booking-widget', '#contact', '#plan', '#form'];
    const hasFormQuery = search.includes('inquire') || search.includes('book') || search.includes('form');

    if (formHashes.includes(hash) || hasFormQuery) {
      setTimeout(() => {
        scrollToBookingWidget(true);
      }, 400);
    }
  }

  checkUrlForFormLanding();
  window.addEventListener('hashchange', checkUrlForFormLanding);

  // ==========================================
  // MENU LIGHTBOX MODAL WITH INTERACTIVE ZOOM (NEW)
  // ==========================================

  // Full ordered menu list matching the buttons in the DOM
  const MENU_LIST = [
    { name: 'Breakfast', url: 'assets/photos/menu-Breakfast.png' },
    { name: 'Lunch',     url: 'assets/photos/menu-Lunch.png' },
    { name: 'Dinner',   url: 'assets/photos/menu-Dinner.png' },
    { name: 'Specialty Menus', url: 'assets/photos/menu-Full Specialty.png' },
    { name: 'Bar & Add-Ons',  url: 'assets/photos/menu-Bar and add-on.png' },
  ];

  let currentMenuIndex = 0;

  const menuBtns = document.querySelectorAll('.catering-menu-btn');
  const menuModal = document.getElementById('menu-modal');
  const menuModalTitle = document.getElementById('menu-modal-title');
  const menuModalImg = document.getElementById('menu-modal-img');
  const menuModalCloseBtn = document.getElementById('menu-modal-close-btn');
  const menuModalOverlay = document.getElementById('menu-modal-overlay');
  const menuModalCtaBtn = document.getElementById('menu-modal-cta-btn');
  const menuModalZoomContainer = document.getElementById('menu-modal-zoom-container');
  const menuModalViewport = document.getElementById('menu-modal-viewport');
  const menuNavPrev = document.getElementById('menu-nav-prev');
  const menuNavNext = document.getElementById('menu-nav-next');
  const menuProgressBar = document.getElementById('menu-progress-bar');
  
  const zoomInBtn = document.getElementById('menu-zoom-in-btn');
  const zoomOutBtn = document.getElementById('menu-zoom-out-btn');
  const zoomResetBtn = document.getElementById('menu-zoom-reset-btn');
  const zoomIndicator = document.getElementById('menu-zoom-indicator');
  const panningTip = document.getElementById('menu-panning-tip');
  
  let menuScale = 1;
  let menuTranslateX = 0;
  let menuTranslateY = 0;
  let isMenuDragging = false;
  let menuStartX = 0;
  let menuStartY = 0;
  let menuLastTranslateX = 0;
  let menuLastTranslateY = 0;
  let menuLastActiveElement = null;
  
  const MENU_MIN_ZOOM = 1;
  const MENU_MAX_ZOOM = 4;
  const MENU_ZOOM_STEP = 0.5;

  // Build progress dots + connecting lines
  function buildProgressDots() {
    if (!menuProgressBar) return;
    menuProgressBar.innerHTML = '';
    MENU_LIST.forEach((item, i) => {
      // Connecting line before each dot (except the first)
      if (i > 0) {
        const line = document.createElement('div');
        line.className = 'menu-progress-line';
        line.dataset.lineIndex = i - 1;
        menuProgressBar.appendChild(line);
      }
      const dot = document.createElement('button');
      dot.className = 'menu-progress-dot';
      dot.dataset.menuIndex = i;
      dot.setAttribute('aria-label', `View ${item.name} menu`);
      dot.title = item.name;
      dot.addEventListener('click', () => navigateTo(i));
      menuProgressBar.appendChild(dot);
    });
  }

  // Refresh which dot is active and which lines are filled
  function updateProgressDots(index) {
    if (!menuProgressBar) return;
    menuProgressBar.querySelectorAll('.menu-progress-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    menuProgressBar.querySelectorAll('.menu-progress-line').forEach((line, i) => {
      // Fill lines to the left of (and up to) the active dot
      line.classList.toggle('passed', i < index);
    });
  }

  // Update disabled state for prev/next buttons
  function updateNavButtons(index) {
    if (menuNavPrev) menuNavPrev.disabled = index === 0;
    if (menuNavNext) menuNavNext.disabled = index === MENU_LIST.length - 1;
  }

  // Navigate to a specific menu index with a crossfade
  function navigateTo(index) {
    if (index < 0 || index >= MENU_LIST.length) return;
    currentMenuIndex = index;
    const item = MENU_LIST[index];

    // Crossfade: fade out, swap src, fade in
    if (menuModalImg) {
      menuModalImg.style.opacity = '0';
      menuModalImg.style.transition = 'opacity 0.2s ease';
      setTimeout(() => {
        menuModalImg.src = item.url;
        if (menuModalTitle) menuModalTitle.textContent = `${item.name} Menu`;
        menuModalImg.onload = () => {
          menuModalImg.style.opacity = '1';
        };
        // Fallback in case onload already fired (cached image)
        if (menuModalImg.complete) menuModalImg.style.opacity = '1';
      }, 200);
    }

    resetMenuZoom();
    updateProgressDots(index);
    updateNavButtons(index);
  }

  // Open Menu Modal (accepts an index into MENU_LIST)
  function openMenuModal(index) {
    buildProgressDots();
    currentMenuIndex = (typeof index === 'number') ? index : 0;
    const item = MENU_LIST[currentMenuIndex];
    menuLastActiveElement = document.activeElement;
    if (menuModalImg) {
      menuModalImg.src = item.url;
      menuModalImg.style.opacity = '1';
    }
    if (menuModalTitle) menuModalTitle.textContent = `${item.name} Menu`;
    
    // Reset zoom and translations
    resetMenuZoom();
    updateProgressDots(currentMenuIndex);
    updateNavButtons(currentMenuIndex);
    
    if (menuModal) {
      menuModal.style.display = 'flex';
      setTimeout(() => {
        menuModal.classList.add('active');
        if (menuModalCloseBtn) menuModalCloseBtn.focus();
      }, 10);
    }
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    // Accessibility focus trap setup
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
    const header = document.querySelector('.header');
    if (header) header.setAttribute('aria-hidden', 'true');
  }

  // Close Menu Modal
  function closeMenuModal() {
    if (menuModal) {
      menuModal.classList.remove('active');
      setTimeout(() => {
        menuModal.style.display = 'none';
        if (menuModalImg) menuModalImg.src = '';
        if (menuLastActiveElement) menuLastActiveElement.focus();
      }, 300);
    }
    
    document.body.style.overflow = '';
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.removeAttribute('aria-hidden');
    const header = document.querySelector('.header');
    if (header) header.removeAttribute('aria-hidden');
  }

  // Apply Transform
  function applyMenuTransform(withTransition = true) {
    if (!menuModalZoomContainer) return;
    
    if (withTransition) {
      menuModalZoomContainer.style.transition = 'transform 0.25s cubic-bezier(0.1, 0.8, 0.3, 1)';
    } else {
      menuModalZoomContainer.style.transition = 'none';
    }
    menuModalZoomContainer.style.transform = `translate(${menuTranslateX}px, ${menuTranslateY}px) scale(${menuScale})`;
    if (zoomIndicator) zoomIndicator.textContent = `${Math.round(menuScale * 100)}%`;
    
    // Toggle pan instructions depending on zoom level
    if (panningTip) {
      if (menuScale > 1) {
        panningTip.style.opacity = '1';
      } else {
        panningTip.style.opacity = '0.4';
      }
    }
  }

  // Reset Zoom
  function resetMenuZoom() {
    menuScale = 1;
    menuTranslateX = 0;
    menuTranslateY = 0;
    menuLastTranslateX = 0;
    menuLastTranslateY = 0;
    applyMenuTransform(true);
  }

  // Zoom Operations
  function zoomMenuIn() {
    if (menuScale < MENU_MAX_ZOOM) {
      menuScale += MENU_ZOOM_STEP;
      applyMenuTransform(true);
    }
  }

  function zoomMenuOut() {
    if (menuScale > MENU_MIN_ZOOM) {
      menuScale -= MENU_ZOOM_STEP;
      if (menuScale <= MENU_MIN_ZOOM) {
        menuScale = MENU_MIN_ZOOM;
        menuTranslateX = 0;
        menuTranslateY = 0;
        menuLastTranslateX = 0;
        menuLastTranslateY = 0;
      } else {
        const limits = getMenuPanningLimits();
        menuTranslateX = Math.max(-limits.limitX, Math.min(limits.limitX, menuTranslateX));
        menuTranslateY = Math.max(-limits.limitY, Math.min(limits.limitY, menuTranslateY));
        menuLastTranslateX = menuTranslateX;
        menuLastTranslateY = menuTranslateY;
      }
      applyMenuTransform(true);
    }
  }

  // Get Panning boundaries based on scale and container sizes
  function getMenuPanningLimits() {
    if (!menuModalViewport || !menuModalImg) return { limitX: 0, limitY: 0 };
    
    const viewportRect = menuModalViewport.getBoundingClientRect();
    const imgWidth = menuModalImg.clientWidth;
    const imgHeight = menuModalImg.clientHeight;
    
    const zoomedWidth = imgWidth * menuScale;
    const zoomedHeight = imgHeight * menuScale;
    
    const limitX = zoomedWidth > viewportRect.width ? (zoomedWidth - viewportRect.width) / 2 : 0;
    const limitY = zoomedHeight > viewportRect.height ? (zoomedHeight - viewportRect.height) / 2 : 0;
    
    return { limitX, limitY };
  }

  // Dragging and Panning Handlers
  function handleMenuDragStart(e) {
    if (menuScale <= 1) return; // Don't pan if zoomed out
    isMenuDragging = true;
    if (menuModalZoomContainer) menuModalZoomContainer.classList.add('dragging');
    
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    
    menuStartX = clientX;
    menuStartY = clientY;
  }

  function handleMenuDragMove(e) {
    if (!isMenuDragging) return;
    
    // Prevent touch-scrolling the viewport when panning
    if (e.cancelable) e.preventDefault();
    
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - menuStartX;
    const dy = clientY - menuStartY;
    
    menuTranslateX = menuLastTranslateX + dx;
    menuTranslateY = menuLastTranslateY + dy;
    
    // Constrain to limits
    const limits = getMenuPanningLimits();
    menuTranslateX = Math.max(-limits.limitX, Math.min(limits.limitX, menuTranslateX));
    menuTranslateY = Math.max(-limits.limitY, Math.min(limits.limitY, menuTranslateY));
    
    applyMenuTransform(false); // Disable transition for raw updates
  }

  function handleMenuDragEnd() {
    if (!isMenuDragging) return;
    isMenuDragging = false;
    if (menuModalZoomContainer) menuModalZoomContainer.classList.remove('dragging');
    menuLastTranslateX = menuTranslateX;
    menuLastTranslateY = menuTranslateY;
  }

  // Handle Menu Button Click — match clicked button to MENU_LIST index by href or text
  if (menuBtns.length > 0) {
    menuBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const href = btn.getAttribute('href') || '';
        const text = btn.textContent.trim();
        // Try to find the index by matching url fragment or label
        let idx = MENU_LIST.findIndex(m =>
          href.includes(encodeURIComponent(m.name)) ||
          href.includes(m.url) ||
          text.toLowerCase().includes(m.name.toLowerCase())
        );
        if (idx === -1) idx = 0; // fallback
        openMenuModal(idx);
      });
    });
  }

  // Prev / Next Nav
  if (menuNavPrev) menuNavPrev.addEventListener('click', () => navigateTo(currentMenuIndex - 1));
  if (menuNavNext) menuNavNext.addEventListener('click', () => navigateTo(currentMenuIndex + 1));

  // Bind Close Events
  if (menuModalCloseBtn) menuModalCloseBtn.addEventListener('click', closeMenuModal);
  if (menuModalOverlay) menuModalOverlay.addEventListener('click', closeMenuModal);
  
  // Bind Zoom Clicks
  if (zoomInBtn) zoomInBtn.addEventListener('click', zoomMenuIn);
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomMenuOut);
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetMenuZoom);
  
  // Bind Mouse Drag and Touch events on zoom container
  if (menuModalZoomContainer) {
    menuModalZoomContainer.addEventListener('mousedown', handleMenuDragStart);
    menuModalZoomContainer.addEventListener('touchstart', handleMenuDragStart, { passive: true });
    
    window.addEventListener('mousemove', handleMenuDragMove);
    window.addEventListener('touchmove', handleMenuDragMove, { passive: false });
    
    window.addEventListener('mouseup', handleMenuDragEnd);
    window.addEventListener('touchend', handleMenuDragEnd);
  }

  // Double click image to toggle zoom
  if (menuModalViewport) {
    menuModalViewport.addEventListener('dblclick', (e) => {
      e.preventDefault();
      if (menuScale > 1) {
        resetMenuZoom();
      } else {
        menuScale = 2.5;
        applyMenuTransform(true);
      }
    });

    // Mouse wheel zoom inside viewport
    menuModalViewport.addEventListener('wheel', (e) => {
      if (menuModal && menuModal.style.display !== 'none') {
        e.preventDefault();
        const zoomFactor = 0.15;
        if (e.deltaY < 0) {
          if (menuScale < MENU_MAX_ZOOM) {
            menuScale = Math.min(MENU_MAX_ZOOM, menuScale + zoomFactor);
            applyMenuTransform(true);
          }
        } else {
          if (menuScale > MENU_MIN_ZOOM) {
            menuScale = Math.max(MENU_MIN_ZOOM, menuScale - zoomFactor);
            if (menuScale <= MENU_MIN_ZOOM) {
              menuScale = MENU_MIN_ZOOM;
              menuTranslateX = 0;
              menuTranslateY = 0;
              menuLastTranslateX = 0;
              menuLastTranslateY = 0;
            } else {
              const limits = getMenuPanningLimits();
              menuTranslateX = Math.max(-limits.limitX, Math.min(limits.limitX, menuTranslateX));
              menuTranslateY = Math.max(-limits.limitY, Math.min(limits.limitY, menuTranslateY));
              menuLastTranslateX = menuTranslateX;
              menuLastTranslateY = menuTranslateY;
            }
            applyMenuTransform(true);
          }
        }
      }
    }, { passive: false });
  }

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (!menuModal || menuModal.style.display === 'none') return;
    
    if (e.key === 'Escape') {
      closeMenuModal();
    }

    // Arrow key navigation between menus
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateTo(currentMenuIndex - 1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateTo(currentMenuIndex + 1);
    }
    
    // Trap Focus inside modal controls
    if (e.key === 'Tab') {
      const focusables = menuModal.querySelectorAll('button, [tabindex="0"]');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
  });

  // CTA Button action: Close modal, redirect to form wizard
  if (menuModalCtaBtn && bookingWidget) {
    menuModalCtaBtn.addEventListener('click', () => {
      closeMenuModal();
      
      setTimeout(() => {
        scrollToBookingWidget(true);
      }, 350);
    });
  }

  /* ==========================================
     MOBILE STICKY FOOTER — HIDE WHEN FORM IS VISIBLE
     ========================================== */
  const mobileStickyFooter = document.querySelector('.mobile-sticky-footer');
  const bookingWidgetEl = document.querySelector('.booking-widget');

  if (mobileStickyFooter && bookingWidgetEl) {
    const stickyFooterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mobileStickyFooter.classList.add('hidden');
        } else {
          mobileStickyFooter.classList.remove('hidden');
        }
      });
    }, { threshold: 0.1 });

    stickyFooterObserver.observe(bookingWidgetEl);
  }
});
