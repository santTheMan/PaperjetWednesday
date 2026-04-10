/* ============================================
   PAPERJET WEDNESDAY — Premium Interactions
   Lenis smooth scroll, custom cursor, GSAP,
   text reveals, clip-path, magnetic buttons
   ============================================ */

// --- Lenis Smooth Scroll ---
class SmoothScroll {
  constructor() {
    this.lenis = null;
    this.init();
  }

  init() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
}

// --- Custom Cursor ---
class CustomCursor {
  constructor() {
    if (window.innerWidth < 768) return;

    this.cursor = document.createElement('div');
    this.cursor.className = 'cursor';
    this.cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
    document.body.appendChild(this.cursor);

    this.dot = this.cursor.querySelector('.cursor-dot');
    this.ring = this.cursor.querySelector('.cursor-ring');

    this.pos = { x: 0, y: 0 };
    this.dotPos = { x: 0, y: 0 };
    this.ringPos = { x: 0, y: 0 };

    document.addEventListener('mousemove', (e) => {
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
    });

    this.bindHovers();
    this.animate();
  }

  bindHovers() {
    const hoverEls = document.querySelectorAll('a, button, .btn, .service-card, .work-item, .magnetic, input, textarea, select');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => this.cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => this.cursor.classList.remove('hovering'));
    });
  }

  animate() {
    this.dotPos.x += (this.pos.x - this.dotPos.x) * 0.85;
    this.dotPos.y += (this.pos.y - this.dotPos.y) * 0.85;
    this.ringPos.x += (this.pos.x - this.ringPos.x) * 0.12;
    this.ringPos.y += (this.pos.y - this.ringPos.y) * 0.12;

    this.dot.style.left = this.dotPos.x + 'px';
    this.dot.style.top = this.dotPos.y + 'px';
    this.ring.style.left = this.ringPos.x + 'px';
    this.ring.style.top = this.ringPos.y + 'px';

    requestAnimationFrame(() => this.animate());
  }
}

// --- Magnetic Buttons ---
class MagneticElements {
  constructor() {
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { el.style.transition = ''; }, 600);
      });
    });
  }
}

// --- Text Split & Reveal ---
class TextRevealer {
  constructor() {
    this.splitWords();
    this.splitChars();
  }

  splitWords() {
    document.querySelectorAll('.hero-title, .cta-title').forEach(el => {
      if (el.querySelector('.word-reveal')) return;

      const lines = el.innerHTML.split('<br>');
      el.innerHTML = lines.map(line => {
        const temp = document.createElement('div');
        temp.innerHTML = line.trim();
        const text = temp.textContent;
        const htmlContent = temp.innerHTML;

        // Wrap each word
        const words = htmlContent.split(/(\s+)/);
        return words.map(w => {
          if (w.match(/^\s+$/)) return w;
          return `<span class="word-reveal"><span class="word-inner">${w}</span></span>`;
        }).join('');
      }).join('<br>');
    });
  }

  splitChars() {
    document.querySelectorAll('.char-reveal').forEach(el => {
      if (el.querySelector('.char')) return;
      const text = el.textContent;
      el.innerHTML = text.split('').map((ch, i) =>
        ch === ' ' ? ' ' : `<span class="char" style="transition-delay: ${i * 30}ms">${ch}</span>`
      ).join('');
    });
  }
}

// --- Scroll Reveal System ---
class ScrollRevealer {
  constructor() {
    this.initReveals();
    this.initStagger();
    this.initClipReveals();
    this.initCounters();
    this.initParallax();
  }

  initReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-fade, .word-reveal, .char-reveal, .hero-line, .hero-description, .hero-cta').forEach(el => {
      observer.observe(el);
    });
  }

  initStagger() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(entry.target.children).forEach((child, i) => {
            setTimeout(() => {
              child.classList.add('revealed');
              if (typeof gsap !== 'undefined') {
                gsap.to(child, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' });
              }
            }, i * 80);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stagger-children').forEach(el => observer.observe(el));
  }

  initClipReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.clip-reveal').forEach(el => observer.observe(el));
  }

  initCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count) || 0;
          const suffix = el.dataset.suffix || '';
          const duration = 2000;
          const start = performance.now();

          const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
  }

  initParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.parallax-img').forEach(el => {
      gsap.to(el, {
        y: -60,
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });

    // Horizontal scroll for portfolio
    const hSection = document.querySelector('.horizontal-section');
    if (hSection) {
      const track = hSection.querySelector('.horizontal-track');
      if (track) {
        const scrollWidth = track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: hSection,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
          },
        });
      }
    }
  }
}

// --- Navigation ---
class Navigation {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.toggle = document.querySelector('.nav-toggle');
    this.links = document.querySelector('.nav-center');

    window.addEventListener('scroll', () => {
      this.nav.classList.toggle('scrolled', window.scrollY > 80);
    });

    if (this.toggle) {
      this.toggle.addEventListener('click', () => {
        this.toggle.classList.toggle('active');
        this.links.classList.toggle('open');
      });

      this.links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.toggle.classList.remove('active');
          this.links.classList.remove('open');
        });
      });
    }
  }
}

// --- Page Loader ---
class PageLoader {
  constructor(onComplete) {
    this.loader = document.querySelector('.page-loader');
    this.counter = document.querySelector('.loader-counter');
    this.onComplete = onComplete;

    if (!this.loader) { onComplete(); return; }

    this.count = 0;
    this.animateCounter();
  }

  animateCounter() {
    const interval = setInterval(() => {
      this.count += Math.floor(Math.random() * 8) + 2;
      if (this.count >= 100) {
        this.count = 100;
        clearInterval(interval);
        if (this.counter) this.counter.textContent = '100';

        setTimeout(() => {
          this.loader.classList.add('hiding');
          document.body.classList.remove('loading');
          setTimeout(() => {
            this.loader.style.display = 'none';
            this.onComplete();
          }, 1000);
        }, 400);
        return;
      }
      if (this.counter) this.counter.textContent = this.count;
    }, 60);
  }
}

// --- Page Transitions ---
class PageTransitions {
  constructor() {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;

        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.4s ease';
        setTimeout(() => { window.location.href = href; }, 400);
      });
    });
  }
}

// --- Contact Form ---
class ContactForm {
  constructor() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      const text = btn.querySelector('.btn-text');
      const originalHTML = text.innerHTML;
      text.innerHTML = 'Sending...';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        text.innerHTML = 'Message Sent &#10003;';
        btn.querySelector('.btn-fill').style.transform = 'scaleY(1)';
        btn.querySelector('.btn-fill').style.background = '#27ae60';
        form.reset();

        setTimeout(() => {
          text.innerHTML = originalHTML;
          btn.style.pointerEvents = '';
          btn.querySelector('.btn-fill').style.transform = '';
          btn.querySelector('.btn-fill').style.background = '';
        }, 3000);
      }, 1500);
    });
  }
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  // Body fade in
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });

  new Navigation();
  new PageTransitions();
  new ContactForm();

  new PageLoader(() => {
    new TextRevealer();
    new CustomCursor();
    new MagneticElements();

    // Trigger hero reveals after a brief moment
    setTimeout(() => {
      document.querySelectorAll('.word-reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 100);
      });
    }, 200);

    new ScrollRevealer();
  });
});

// Load Lenis after DOM
window.addEventListener('load', () => {
  if (typeof Lenis !== 'undefined') {
    new SmoothScroll();
  }
});
