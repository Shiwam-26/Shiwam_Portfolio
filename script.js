/* =============================================
   SHIWAM KUMAR PORTFOLIO — JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // CUSTOM CURSOR
  // =============================================
  const cursorDot = document.createElement('div');
  cursorDot.classList.add('cursor');
  const cursorFollower = document.createElement('div');
  cursorFollower.classList.add('cursor-follower');
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorFollower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Cursor grow on hover
  const interactives = document.querySelectorAll('a, button, .tab, .skill-tag, .stat-item');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.style.width = '56px';
      cursorFollower.style.height = '56px';
      cursorFollower.style.borderColor = 'rgba(184, 134, 11, 0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursorFollower.style.width = '32px';
      cursorFollower.style.height = '32px';
      cursorFollower.style.borderColor = 'rgba(184, 134, 11, 0.4)';
    });
  });

  // =============================================
  // NAVIGATION SCROLL EFFECT
  // =============================================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // =============================================
  // MOBILE MENU TOGGLE
  // =============================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  mobileToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    const spans = mobileToggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      const spans = mobileToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // =============================================
  // SCROLL REVEAL
  // =============================================
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keep observed for potential re-triggering
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // =============================================
  // COUNTER ANIMATION
  // =============================================
  const counters = document.querySelectorAll('.count');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const start = performance.now();

        function update(timestamp) {
          const progress = Math.min((timestamp - start) / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }

        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // =============================================
  // TABS
  // =============================================
  const tabData = {
    analyze: {
      title: 'Turn raw data into clarity.',
      body: 'Statistical analysis, data cleaning, and visualization that transforms messy datasets into actionable business intelligence.'
    },
    build: {
      title: 'Give ideas a structure.',
      body: 'ML models, automated pipelines, and analytical tools — products and interfaces that connect real needs to working software.'
    },
    connect: {
      title: 'Choose a perspective.',
      body: 'Bridging the gap between data teams and business stakeholders. Translating technical findings into executive-level narratives.'
    }
  };

  const tabs = document.querySelectorAll('.tab');
  const tabTitle = document.querySelector('.tab-title');
  const tabBody = document.querySelector('.tab-body');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.dataset.tab;
      const data = tabData[key];

      // Animate out
      tabTitle.style.opacity = '0';
      tabTitle.style.transform = 'translateY(6px)';
      tabBody.style.opacity = '0';
      tabBody.style.transform = 'translateY(6px)';

      setTimeout(() => {
        tabTitle.textContent = data.title;
        tabBody.textContent = data.body;

        tabTitle.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        tabBody.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        tabTitle.style.opacity = '1';
        tabTitle.style.transform = 'translateY(0)';
        tabBody.style.opacity = '1';
        tabBody.style.transform = 'translateY(0)';
      }, 200);
    });
  });

  // =============================================
  // NOISE / MOTION TOGGLE
  // =============================================
  const noiseBtn = document.getElementById('noise-btn');
  let motionEnabled = true;

  noiseBtn.addEventListener('click', () => {
    motionEnabled = !motionEnabled;
    const label = noiseBtn.querySelector('span');
    label.textContent = motionEnabled ? 'MOTION ON' : 'MOTION OFF';

    // Toggle box-art animation
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
      box.style.animation = motionEnabled ? '' : 'none';
    });
  });

  // =============================================
  // BOX ART ANIMATION
  // =============================================
  const boxArt = document.querySelector('.about-box-art');
  if (boxArt) {
    const boxes = boxArt.querySelectorAll('.box');
    boxes.forEach((box, i) => {
      box.style.animation = `rotateBox ${6 + i * 2}s ease-in-out infinite`;
      box.style.animationDelay = `${i * 0.8}s`;
    });
  }

  // =============================================
  // PARALLAX HERO
  // =============================================
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-desc');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroTitle && scrollY < window.innerHeight) {
      heroTitle.style.transform = `translateY(${scrollY * 0.12}px)`;
      if (heroDesc) heroDesc.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
  }, { passive: true });

  // =============================================
  // BAR CHART ANIMATION
  // =============================================
  const chartBars = document.querySelectorAll('.mockup-chart-bar');
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        chartBars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.height = bar.style.getPropertyValue('--h');
          }, i * 80);
        });
      }
    });
  }, { threshold: 0.3 });

  if (chartBars.length > 0) {
    // Initially set heights to 0
    chartBars.forEach(bar => { bar.style.height = '4px'; });
    chartObserver.observe(document.querySelector('.p1-content'));
  }

  // =============================================
  // SMOOTH ANCHOR SCROLLING
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =============================================
  // TYPING EFFECT — Hero Subtitle
  // =============================================
  const heroSub = document.querySelector('.hero-sub');
  if (heroSub) {
    const text = heroSub.textContent;
    heroSub.textContent = '';
    let i = 0;
    setTimeout(() => {
      const typeInterval = setInterval(() => {
        heroSub.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(typeInterval);
      }, 60);
    }, 600);
  }

  // =============================================
  // HOVER EFFECT — Project Cards
  // =============================================
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
      const mockup = card.querySelector('.project-mockup');
      if (mockup) {
        mockup.style.transform = `translateY(-6px) scale(1.01) rotateX(${-y}deg) rotateY(${x}deg)`;
        mockup.style.transition = 'transform 0.1s ease';
      }
    });

    card.addEventListener('mouseleave', () => {
      const mockup = card.querySelector('.project-mockup');
      if (mockup) {
        mockup.style.transform = '';
        mockup.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });
  });

});

// =============================================
// CSS KEYFRAMES FOR BOX ART (injected)
// =============================================
const style = document.createElement('style');
style.textContent = `
  @keyframes rotateBox {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(3deg) scale(1.02); }
    75% { transform: rotate(-3deg) scale(0.98); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  
  .hero-profile-img {
    animation: float 4s ease-in-out infinite;
  }
  
  .hero-profile-img:hover {
    animation-play-state: paused;
  }
`;
document.head.appendChild(style);
