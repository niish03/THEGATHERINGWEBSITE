document.addEventListener('DOMContentLoaded', () => {
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

  // Handle sticky header scroll & edge cases for navigation highlights
  function updateScrollState() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
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

  function submitBookingLead() {
    // Hide progress bar and nav buttons
    const progressContainer = document.querySelector('.widget-progress-container');
    const navBtns = document.querySelector('.widget-nav-buttons');
    
    if(progressContainer) progressContainer.style.display = 'none';
    if(navBtns) navBtns.style.display = 'none';

    stepPanels.forEach(panel => panel.classList.remove('active'));
    
    // Activate confirmation panel (Step 4)
    const confirmationPanel = document.querySelector('.step-panel[data-step="4"]');
    if(confirmationPanel) {
      confirmationPanel.classList.add('active');
      const msgEl = document.getElementById('confirmation-message');
      
      let evTypeStr = 'upcoming event';
      if (widgetState.eventType === 'celebrations') {
        evTypeStr = 'celebration';
      } else if (widgetState.eventType === 'corporate') {
        evTypeStr = 'corporate event';
      } else if (widgetState.eventType === 'community-social') {
        evTypeStr = 'community or social event';
      } else if (widgetState.eventType === 'other') {
        const otherVal = document.getElementById('widget-other-event').value.trim();
        evTypeStr = otherVal ? otherVal : 'event';
      } else if (widgetState.eventType) {
        evTypeStr = widgetState.eventType;
      }

      if(msgEl) {
        msgEl.innerHTML = `Thanks, <strong>${widgetState.name}</strong>! We've received your request and are excited to help you plan your ${evTypeStr}. Our team will review your request and be in touch within 2–4 business hours to discuss your event, answer your questions, and help you create an unforgettable experience at The Gathering Conference Center.`;
      }
    }
  }

  // Initialize widget
  updateWidgetUI();
  }

  /* ==========================================
     INTERACTIVE VENUE SHOWCASE (MULTI-SELECT)
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
        { src: 'assets/room_a_meeting.jpg', caption: 'The Honeysuckle Room — Professional boardroom setup' },
        { src: 'assets/gallery_corp.jpg', caption: 'The Honeysuckle Room — Seminar configuration' },
        { src: 'assets/gallery_wedding.jpg', caption: 'The Honeysuckle Room — Intimate banquet setting' }
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
        { src: 'assets/room_b_banquet.jpg', caption: 'The Magnolia Room — Grand banquet configuration' },
        { src: 'assets/gallery_corp.jpg', caption: 'The Magnolia Room — Corporate event layout' },
        { src: 'assets/hero.jpg', caption: 'The Magnolia Room — Elegant reception setup' }
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
        { src: 'assets/gallery_corp.jpg', caption: 'The Blues Room — Workshop & training setup' },
        { src: 'assets/room_a_meeting.jpg', caption: 'The Blues Room — Meeting table layout' },
        { src: 'assets/gallery_wedding.jpg', caption: 'The Blues Room — Celebration setting' }
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
        { src: 'assets/room_b_banquet.jpg', caption: 'The Harmony Room — Banquet configuration' },
        { src: 'assets/hero.jpg', caption: 'The Harmony Room — Large event layout' },
        { src: 'assets/gallery_wedding.jpg', caption: 'The Harmony Room — Celebration decor' }
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

  // Room order for adjacency checks
  const roomOrder = ['a', 'b', 'c', 'd'];
  const partitionMap = { 'a-b': 'partition-ab', 'b-c': 'partition-bc', 'c-d': 'partition-cd' };

  function updateVenueUI() {
    // 1. Update SVG highlights
    svgRooms.forEach(room => {
      const rid = room.id.replace('fp-', '');
      room.classList.toggle('selected', selectedRooms.has(rid));
    });

    // 2. Update partitions — open between adjacent selected rooms
    svgPartitions.forEach(part => part.classList.remove('open'));
    for (let i = 0; i < roomOrder.length - 1; i++) {
      const a = roomOrder[i], b = roomOrder[i + 1];
      if (selectedRooms.has(a) && selectedRooms.has(b)) {
        const partId = partitionMap[`${a}-${b}`];
        const partEl = document.getElementById(partId);
        if (partEl) partEl.classList.add('open');
      }
    }

    const selArray = Array.from(selectedRooms);
    if (selArray.length === 0) {
      selectedRooms.add('a');
      updateVenueUI();
      return;
    }

    // 3. Populate single card with data (combined if multiple)
    if (selArray.length === 1) {
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
    } else {
      // Combined: aggregate values dynamically
      const names = selArray.map(rid => roomData[rid].name.replace('The ', '').replace(' Room', ''));
      const totalBanquet = selArray.reduce((sum, rid) => sum + roomData[rid].banquet, 0);
      const totalTheater = selArray.reduce((sum, rid) => sum + roomData[rid].theater, 0);
      const totalWidth = selArray.reduce((sum, rid) => sum + roomData[rid].widthFt, 0);

      document.getElementById('detail-room-name').textContent = names.join(' + ');
      document.getElementById('detail-room-tagline').textContent = `${selArray.length} rooms combined for your event`;
      document.getElementById('detail-banquet').textContent = totalBanquet;
      document.getElementById('detail-theater').textContent = totalTheater;
      document.getElementById('detail-dimensions').textContent = `${totalWidth} × 60 ft`;

      // Build combined description
      const roomNamesList = selArray.map(rid => roomData[rid].name).join(', ');
      document.getElementById('detail-description').textContent = `Combine ${roomNamesList} by retracting our acoustic sliding partition dividers to create a seamlessly connected event space of ${totalWidth} × 60 ft — ideal for large-scale events.`;

      // Merge unique perfect-for tags from all selected rooms
      const allTags = new Set();
      selArray.forEach(rid => roomData[rid].perfectFor.forEach(t => allTags.add(t)));
      allTags.add('Large Weddings');
      allTags.add('Galas');
      allTags.add('Exhibitions');

      const pfContainer = document.getElementById('detail-perfect-for');
      pfContainer.innerHTML = Array.from(allTags).map(tag => {
        const icon = pfIcons[tag] || defaultPfIcon;
        return `<div class="pf-item">${icon}<span>${tag}</span></div>`;
      }).join('');
    }

    // 4. Update slider
    initSlider(selArray);
  }

  // Toggle room selection
  function toggleRoom(roomId) {
    if (selectedRooms.has(roomId)) {
      if (selectedRooms.size > 1) {
        selectedRooms.delete(roomId);
      }
    } else {
      selectedRooms.add(roomId);
    }
    updateVenueUI();
  }

  // Bind SVG room clicks
  svgRooms.forEach(room => {
    room.addEventListener('click', () => {
      const roomId = room.id.replace('fp-', '');
      toggleRoom(roomId);
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
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.dataset.image;
      const imgCaption = item.dataset.caption;

      lightboxImg.src = imgSrc;
      lightboxCaption.textContent = imgCaption;
      lightboxModal.style.display = 'flex';
    });
  });

  // Link click on active slide image to open Lightbox Modal
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

  // Handle Wizard Redirection CTAs
  const wizardRedirectBtns = document.querySelectorAll('.wizard-redirect-btn');
  const bookingWidget = document.getElementById('booking-widget');

  if (wizardRedirectBtns.length > 0 && bookingWidget) {
    wizardRedirectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Only prevent default if it's an anchor link we want to handle smoothly
        if (btn.tagName.toLowerCase() === 'a' && btn.getAttribute('href') === '#hero') {
          e.preventDefault();
          
          // Close mobile menu if it's open
          if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }
          
          // On desktop, scroll to hero top. On mobile, scroll directly to the widget.
          const isMobile = window.innerWidth <= 992; // Using 992px as typical tablet/mobile breakpoint
          const heroSection = document.getElementById('hero');
          const targetElement = (isMobile && bookingWidget) ? bookingWidget : (heroSection || bookingWidget);

          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });

            // Detect when scrolling has finished
            let scrollTimeout;
            const scrollHandler = () => {
              clearTimeout(scrollTimeout);
              scrollTimeout = setTimeout(() => {
                window.removeEventListener('scroll', scrollHandler);
                
                // Highlight the booking widget after scroll is complete
                if (bookingWidget) {
                  bookingWidget.classList.add('highlight-widget');
                  
                  // Remove highlight after animation
                  setTimeout(() => {
                    bookingWidget.classList.remove('highlight-widget');
                  }, 2000);
                }
              }, 100); // 100ms without scroll event means scroll finished
            };
            
            window.addEventListener('scroll', scrollHandler);

            // Fallback: If already at the target (no scrolling needed)
            // widget container has 100px scroll margin, hero has 0
            const expectedOffset = (targetElement === bookingWidget) ? 100 : 0;
            if (Math.abs(targetElement.getBoundingClientRect().top - expectedOffset) < 50) {
              window.removeEventListener('scroll', scrollHandler);
              if (bookingWidget) {
                bookingWidget.classList.add('highlight-widget');
                setTimeout(() => {
                  bookingWidget.classList.remove('highlight-widget');
                }, 2000);
              }
            }
          }
        }
      });
    });
  }
});
