/* ============================================
   PRINTCRAFT – PRINTING & PACKAGING COMPANY
   JavaScript File
   ============================================ */

"use strict";

// ============================
// UTILITY FUNCTIONS
// ============================

/**
 * Throttle function to limit how often a function fires
 * @param {Function} fn - The function to throttle
 * @param {number} delay - Milliseconds to wait
 */
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Debounce function to delay execution after last call
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Milliseconds to wait
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Get element(s) by selector - shorthand
 */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ============================
// 1. PRELOADER
// ============================
(function initPreloader() {
  const preloader = $("#preloader");
  if (!preloader) return;

  // Hide preloader after 2s (loader animation completes)
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("hide");
      // Trigger hero animations after preloader
      document.body.classList.add("loaded");
      animateCounters();
    }, 2000);
  });
})();

// ============================
// 2. NAVBAR
// ============================
(function initNavbar() {
  const navbar = $("#navbar");
  const hamburger = $("#hamburger");
  const navLinks = $("#navLinks");

  if (!navbar) return;

  // Scroll handler: add 'scrolled' class
  const handleScroll = throttle(() => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    updateActiveNavLink();
  }, 100);

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Run on init

  // Mobile hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
  }

  // Close mobile menu when a link is clicked
  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  // Smooth scroll for anchor links
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = $(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

// ============================
// 3. ACTIVE NAV LINK ON SCROLL
// ============================
function updateActiveNavLink() {
  const sections = $$("section[id]");
  const navLinks = $$(".nav-link");
  const navbar = $("#navbar");
  const offset = (navbar?.offsetHeight || 80) + 40;

  let currentSection = "";

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top;
    if (top <= offset) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

// ============================
// 4. ANIMATED COUNTERS (Hero Stats)
// ============================
function animateCounters() {
  const counters = $$(".stat-num");

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    const duration = 2000; // ms
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3); // Cubic ease-out

    const timer = setInterval(() => {
      step++;
      const progress = easeOut(step / steps);
      current = Math.min(Math.round(target * progress), target);
      counter.textContent = current.toLocaleString();

      if (step >= steps) {
        counter.textContent = target.toLocaleString();
        clearInterval(timer);
      }
    }, duration / steps);
  });
}

// ============================
// 5. SCROLL REVEAL ANIMATIONS
// ============================
(function initScrollReveal() {
  // Add 'reveal' class to all sections and cards
  const revealSelectors = [
    ".section-header",
    ".service-card",
    ".product-card",
    ".step",
    ".port-item",
    ".info-card",
    ".about-content",
    ".about-visual",
    ".contact-form-wrap",
    ".testimonial-card",
    ".cta-content",
  ];

  revealSelectors.forEach((selector) => {
    $$(selector).forEach((el, index) => {
      el.classList.add("reveal");
      // Stagger delay based on index within parent
      const delay = (index % 4) * 100;
      el.style.transitionDelay = `${delay}ms`;
    });
  });

  // IntersectionObserver to trigger animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  $$(".reveal").forEach((el) => observer.observe(el));
})();

// ============================
// 6. PRODUCT FILTER TABS
// ============================
(function initProductFilter() {
  const filterBtns = $$(".filter-btn");
  const productCards = $$(".product-card");

  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      // Filter product cards with animation
      productCards.forEach((card, index) => {
        const category = card.getAttribute("data-category");
        const isVisible = filter === "all" || category === filter;

        if (isVisible) {
          card.classList.remove("hidden");
          // Stagger re-entry animation
          card.style.animation = "none";
          card.offsetHeight; // Force reflow
          card.style.animation = `fadeInUp 0.4s ease ${index * 50}ms forwards`;
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // Add fadeInUp keyframe dynamically
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

// ============================
// 7. TESTIMONIAL SLIDER
// ============================
(function initTestimonialSlider() {
  const track = $("#testimonialTrack");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const dotsContainer = $("#sliderDots");

  if (!track) return;

  const cards = track.querySelectorAll(".testimonial-card");
  const totalSlides = cards.length;
  let currentIndex = 0;
  let autoPlayTimer = null;

  // Calculate slides visible (2 on desktop, 1 on mobile)
  function getSlidesVisible() {
    return window.innerWidth <= 768 ? 1 : 2;
  }

  function getMaxIndex() {
    return totalSlides - getSlidesVisible();
  }

  // Build dots
  function buildDots() {
    dotsContainer.innerHTML = "";
    const count = getMaxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("button");
      dot.className = "slider-dot" + (i === currentIndex ? " active" : "");
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Move to index
  function goTo(index) {
    const max = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, max));

    const cardWidth = cards[0].offsetWidth + 24; // 24 = gap
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Update dots
    $$(".slider-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function goNext() {
    goTo(currentIndex >= getMaxIndex() ? 0 : currentIndex + 1);
  }

  function goPrev() {
    goTo(currentIndex <= 0 ? getMaxIndex() : currentIndex - 1);
  }

  // Auto-play
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(goNext, 4500);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Button click events
  if (nextBtn) nextBtn.addEventListener("click", () => { goNext(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { goPrev(); startAutoPlay(); });

  // Touch/Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    startAutoPlay();
  });

  // Pause on hover
  track.addEventListener("mouseenter", stopAutoPlay);
  track.addEventListener("mouseleave", startAutoPlay);

  // Recalculate on resize
  window.addEventListener("resize", debounce(() => {
    buildDots();
    goTo(Math.min(currentIndex, getMaxIndex()));
  }, 200));

  // Init
  buildDots();
  startAutoPlay();
})();

// ============================
// 8. BACK TO TOP BUTTON
// ============================
(function initBackToTop() {
  const btn = $("#backToTop");
  if (!btn) return;

  const handleScroll = throttle(() => {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, 100);

  window.addEventListener("scroll", handleScroll);

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

// ============================
// 9. CONTACT FORM VALIDATION & SUBMISSION
// ============================
(function initContactForm() {
  const form = $("#contactForm");
  if (!form) return;

  const fields = {
    name: {
      el: $("#name"),
      error: $("#nameError"),
      validate: (v) => {
        if (!v.trim()) return "Full name is required.";
        if (v.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      },
    },
    email: {
      el: $("#email"),
      error: $("#emailError"),
      validate: (v) => {
        if (!v.trim()) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Please enter a valid email address.";
        return "";
      },
    },
    service: {
      el: $("#service"),
      error: $("#serviceError"),
      validate: (v) => {
        if (!v) return "Please select a service.";
        return "";
      },
    },
    message: {
      el: $("#message"),
      error: $("#messageError"),
      validate: (v) => {
        if (!v.trim()) return "Project details are required.";
        if (v.trim().length < 20) return "Please provide at least 20 characters of detail.";
        return "";
      },
    },
  };

  // Real-time validation on blur
  Object.values(fields).forEach(({ el, error, validate }) => {
    if (!el) return;
    el.addEventListener("blur", () => {
      const msg = validate(el.value);
      error.textContent = msg;
      el.classList.toggle("error", !!msg);
    });
    el.addEventListener("input", () => {
      if (el.classList.contains("error")) {
        const msg = validate(el.value);
        error.textContent = msg;
        el.classList.toggle("error", !!msg);
      }
    });
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    Object.values(fields).forEach(({ el, error, validate }) => {
      if (!el) return;
      const msg = validate(el.value);
      error.textContent = msg;
      el.classList.toggle("error", !!msg);
      if (msg) isValid = false;
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector(".error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        firstError.focus();
      }
      return;
    }

    // Simulate form submission
    const btnText = $("#btnText");
    const btnLoading = $("#btnLoading");
    const submitBtn = $("#submitBtn");
    const formSuccess = $("#formSuccess");

    submitBtn.disabled = true;
    if (btnText) btnText.style.display = "none";
    if (btnLoading) btnLoading.style.display = "flex";

    // Simulate async API call (replace with actual fetch in production)
    setTimeout(() => {
      submitBtn.style.display = "none";
      if (formSuccess) formSuccess.style.display = "flex";
      form.reset();

      // Reset after 6 seconds
      setTimeout(() => {
        submitBtn.style.display = "flex";
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = "flex";
        if (btnLoading) btnLoading.style.display = "none";
        if (formSuccess) formSuccess.style.display = "none";
      }, 6000);
    }, 2000);
  });
})();

// ============================
// 10. PORTFOLIO HOVER EFFECT
// ============================
(function initPortfolio() {
  const portItems = $$(".port-item");

  portItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.querySelector(".port-placeholder").style.transform = "scale(1.05)";
    });
    item.addEventListener("mouseleave", function () {
      this.querySelector(".port-placeholder").style.transform = "scale(1)";
    });
  });
})();

// ============================
// 11. STICKY HEADER COLOR CHANGE ON DARK/LIGHT SECTIONS
// ============================
(function initSectionColorObserver() {
  const navbar = $("#navbar");
  if (!navbar) return;

  // Track if user is within a dark section
  const darkSections = $$(".dark-section, .hero, #home");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && window.scrollY < 100) {
          navbar.classList.remove("scrolled");
        }
      });
    },
    { threshold: 0.3 }
  );

  darkSections.forEach((s) => observer.observe(s));
})();

// ============================
// 12. MARQUEE PAUSE ON HOVER
// ============================
(function initMarquee() {
  const track = $(".marquee-track");
  if (!track) return;

  track.addEventListener("mouseenter", () => {
    track.style.animationPlayState = "paused";
  });
  track.addEventListener("mouseleave", () => {
    track.style.animationPlayState = "running";
  });
})();

// ============================
// 13. SERVICE CARD ENTRANCE ANIMATION
// ============================
(function initServiceCards() {
  const cards = $$(".service-card");
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute("data-delay") || 0, 10);
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });
})();

// ============================
// 14. KEYBOARD ACCESSIBILITY
// ============================
(function initKeyboardAccessibility() {
  // Close mobile nav on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const hamburger = $("#hamburger");
      const navLinks = $("#navLinks");
      if (hamburger && navLinks) {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
      }
    }
    // Slider keyboard navigation
    if (e.key === "ArrowRight") {
      const nextBtn = $("#nextBtn");
      if (nextBtn) nextBtn.click();
    }
    if (e.key === "ArrowLeft") {
      const prevBtn = $("#prevBtn");
      if (prevBtn) prevBtn.click();
    }
  });
})();

// ============================
// 15. LAZY LOADING IMAGES
// (For when real images replace placeholders)
// ============================
(function initLazyLoad() {
  const lazyImages = $$("img[data-src]");
  if (!lazyImages.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => observer.observe(img));
})();

// ============================
// 16. CURRENT YEAR IN FOOTER
// ============================
(function setCurrentYear() {
  const yearEls = $$(".current-year");
  const year = new Date().getFullYear();
  yearEls.forEach((el) => (el.textContent = year));
})();

// ============================
// LOG INIT
// ============================
console.log(
  "%c PrintCraft Website Loaded ✓",
  "color: #D4500A; font-size: 14px; font-weight: bold;"
);