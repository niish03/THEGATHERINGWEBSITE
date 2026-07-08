document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     STICKY HEADER & NAV SCROLL
     ========================================== */
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
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
    const guestSlider = document.getElementById('widget-guests');
    const guestValOutput = document.getElementById('guest-val');
    const roomCards = document.querySelectorAll('.room-select-card');
    
    const btnPrev = document.getElementById('widget-prev-btn');
    const btnNext = document.getElementById('widget-next-btn');

    let widgetState = {
      step: 1,
      eventType: '',
      guests: 50,
      preferredRoom: '',
      date: '',
      name: '',
      email: '',
      phone: ''
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
        btnNext.textContent = 'Get a Custom Quote ✨';
      } else {
        btnNext.textContent = 'Next Step →';
      }
    }
  }

  // Validate current step
  function isStepValid() {
    if (widgetState.step === 1) {
      if (!widgetState.eventType) {
        alert('Please select an event type to continue.');
        return false;
      }
    } else if (widgetState.step === 2) {
      // Room layout choice is optional, user is allowed to proceed without selecting
      return true;
    } else if (widgetState.step === 3) {
      const dateVal = document.getElementById('widget-date').value;
      const nameVal = document.getElementById('widget-name').value.trim();
      const emailVal = document.getElementById('widget-email').value.trim();
      const phoneVal = document.getElementById('widget-phone').value.trim();

      if (!dateVal || !nameVal || !emailVal || !phoneVal) {
        alert('Please complete all contact details to request your quote.');
        return false;
      }

      // Quick Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        alert('Please enter a valid email address.');
        return false;
      }

      widgetState.date = dateVal;
      widgetState.name = nameVal;
      widgetState.email = emailVal;
      widgetState.phone = phoneVal;
    }
    return true;
  }

  // Event Card selection
  eventTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      eventTypeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      widgetState.eventType = card.dataset.value;
      
      // Auto advance to Step 2 for high converting UX
      setTimeout(() => {
        if (widgetState.step === 1) {
          widgetState.step = 2;
          updateWidgetUI();
        }
      }, 300);
    });
  });

  // Slider change
  guestSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    widgetState.guests = val;
    guestValOutput.textContent = val === 300 ? '300+' : val;
    evaluateRoomConstraints(val);
  });

  // Highlight only possible rooms based on guest capacity
  function evaluateRoomConstraints(guestCount) {
    roomCards.forEach(card => {
      const maxCap = parseInt(card.dataset.max);
      if (guestCount > maxCap) {
        card.classList.add('disabled');
        if (card.classList.contains('selected')) {
          card.classList.remove('selected');
          widgetState.preferredRoom = '';
        }
      } else {
        card.classList.remove('disabled');
      }
    });
  }

  // Room Select Card
  roomCards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('disabled')) return;
      roomCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      widgetState.preferredRoom = card.dataset.value;
    });
  });

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
    // Transition to Success panel
    const panelsWrapper = document.querySelector('.step-panels-wrapper');
    const navBtns = document.querySelector('.widget-nav-buttons');
    
    // Clear height limit
    panelsWrapper.style.minHeight = 'auto';
    navBtns.style.display = 'none';

    stepPanels.forEach(panel => panel.classList.remove('active'));
    
    const successPanel = document.createElement('div');
    successPanel.className = 'success-panel';
    successPanel.innerHTML = `
      <div class="success-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 36px; height: 36px; stroke-linecap: round; stroke-linejoin: round;"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
      <h3>Proposal Request Sent!</h3>
      <p>Thank you, <strong>${widgetState.name}</strong>. We've locked in your requested date of <strong>${widgetState.date}</strong> in our review calendar.</p>
      <p>Our team will email a custom quote for your <strong>${widgetState.eventType.toUpperCase()}</strong> event within 2-4 business hours.</p>
      <button class="btn btn-primary" style="margin-top: 10px;" onclick="window.location.reload()">Plan Another Event</button>
    `;
    panelsWrapper.appendChild(successPanel);
  }

  // Initialize widget
  updateWidgetUI();
  }

  /* ==========================================
     INTERACTIVE VENUE SHOWCASE (FLOOR PLAN)
     ========================================== */
  const roomTabBtns = document.querySelectorAll('.room-tab-btn');
  const roomInfoCards = document.querySelectorAll('.room-info-card');
  const svgRooms = document.querySelectorAll('.fp-room');
  const svgPartitions = document.querySelectorAll('.fp-partition');

  function selectRoom(roomId) {
    // 1. Update Tabs
    roomTabBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.room === roomId) btn.classList.add('active');
    });

    // 2. Update Room Description/Info Cards
    roomInfoCards.forEach(card => {
      card.classList.remove('active');
      if (card.id === `info-${roomId}`) card.classList.add('active');
    });

    // 3. Highlight SVG Room Group
    svgRooms.forEach(room => {
      room.classList.remove('selected');
      if (room.id === `fp-${roomId}`) {
        room.classList.add('selected');
      }
    });

    // 4. Handle Partition Openings (Partitions are: partition-ab, partition-bc, partition-cd)
    if (roomId === 'combined') {
      // Highlight ALL SVG rooms together
      svgRooms.forEach(room => room.classList.add('selected'));
      // Open all dividers
      svgPartitions.forEach(part => part.classList.add('open'));
    } else {
      // Close dividers
      svgPartitions.forEach(part => part.classList.remove('open'));
    }

    // 5. Update the bottom-left image slider
    initSlider(roomId);
  }

  // Bind tabs click
  roomTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectRoom(btn.dataset.room);
    });
  });

  // Bind SVG elements click
  svgRooms.forEach(room => {
    room.addEventListener('click', () => {
      const roomId = room.id.replace('fp-', '');
      selectRoom(roomId);
    });
  });

  /* ==========================================
     ROOM IMAGE SLIDER (BOTTOM LEFT)
     ========================================== */
  const roomImages = {
    a: [
      { src: 'assets/room_a_meeting.jpg', caption: 'Room A - Professional boardroom setup featuring polished timber wood tables.' },
      { src: 'assets/gallery_corp.jpg', caption: 'Room A - Seminar rows and screen setups.' },
      { src: 'assets/gallery_wedding.jpg', caption: 'Room A - Intimate banquet tables with floral centerpieces.' }
    ],
    b: [
      { src: 'assets/room_b_banquet.jpg', caption: 'Room B - Spacious social dinner setup with warm string lighting overhead.' },
      { src: 'assets/gallery_corp.jpg', caption: 'Room B - Corporate classroom presentation layout.' },
      { src: 'assets/hero.jpg', caption: 'Room B - Large ballroom banquet configuration.' }
    ],
    c: [
      { src: 'assets/gallery_corp.jpg', caption: 'Room C - Focused workshop presentation classroom setup.' },
      { src: 'assets/room_a_meeting.jpg', caption: 'Room C - Training table layout configurations.' },
      { src: 'assets/gallery_wedding.jpg', caption: 'Room C - Rehearsal dinners and bridal shower settings.' }
    ],
    d: [
      { src: 'assets/room_b_banquet.jpg', caption: 'Room D - Flexible cocktail party tall-tables configuration.' },
      { src: 'assets/hero.jpg', caption: 'Room D - Family reunion banquet layout.' },
      { src: 'assets/gallery_wedding.jpg', caption: 'Room D - Custom decor structure detail details.' }
    ],
    combined: [
      { src: 'assets/hero.jpg', caption: 'Combined Ballroom - Full capacity wedding reception banquet tables.' },
      { src: 'assets/gallery_corp.jpg', caption: 'Combined Ballroom - Grand scale conventions facing speaker stage.' },
      { src: 'assets/room_b_banquet.jpg', caption: 'Combined Ballroom - Grand gala social layout.' }
    ]
  };

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

  function initSlider(roomId) {
    currentSliderImages = roomImages[roomId] || [];
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

  // Select Room A by default
  if (roomTabBtns && roomTabBtns.length > 0) {
    selectRoom('a');
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
});
