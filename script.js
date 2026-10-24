/* =============================================
   SHIWAM KUMAR PORTFOLIO — JAVASCRIPT
   Interactive Behaviors, Project Modal & Recruiter Utilities
   ============================================= */

// Automatically strip tracking/referral parameters (?utm_source=chatgpt.com, etc.) from address bar
if (window.location.search && (window.location.search.includes('utm_') || window.location.search.includes('chatgpt'))) {
  try {
    const cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
    window.history.replaceState(null, document.title, cleanUrl);
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // REDUCED MOTION CHECK
  // =============================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =============================================
  // CUSTOM CURSOR (desktop only, respects reduced motion)
  // =============================================
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  if (!isTouchDevice && !prefersReducedMotion) {
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

    // Cursor scale on interactive elements
    const updateCursorListeners = () => {
      const interactives = document.querySelectorAll('a, button, .tab, .skill-tag, .btn-details, .btn-copy-email, .noise-btn');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorFollower.style.width = '52px';
          cursorFollower.style.height = '52px';
          cursorFollower.style.borderColor = 'rgba(184, 134, 11, 0.7)';
        });
        el.addEventListener('mouseleave', () => {
          cursorFollower.style.width = '32px';
          cursorFollower.style.height = '32px';
          cursorFollower.style.borderColor = 'rgba(184, 134, 11, 0.4)';
        });
      });
    };
    updateCursorListeners();
  } else {
    document.body.style.cursor = 'auto';
  }

  // =============================================
  // NAVIGATION SCROLL EFFECT & ACTIVE SPY
  // =============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy for current section
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.style.color = 'var(--text-primary)';
      } else {
        link.style.color = '';
      }
    });
  }, { passive: true });

  // =============================================
  // MOBILE MENU TOGGLE & ACCESSIBILITY
  // =============================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  const toggleMobileMenu = (open) => {
    menuOpen = (open !== undefined) ? open : !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    mobileMenu.setAttribute('aria-hidden', !menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    mobileToggle.setAttribute('aria-expanded', menuOpen);

    const spans = mobileToggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  };

  mobileToggle.addEventListener('click', () => toggleMobileMenu());

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) {
      toggleMobileMenu(false);
    }
  });

  // =============================================
  // SCROLL REVEAL ANIMATIONS
  // =============================================
  const reveals = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // =============================================
  // TABS — WHAT I BRING TO THE TEAM
  // =============================================
  const tabData = {
    analyze: {
      title: 'Turn raw data into clarity.',
      body: 'Data cleaning, exploratory data analysis, and schema transformation that turn messy, fragmented datasets into reliable business intelligence using Python, SQL, and Power BI.'
    },
    build: {
      title: 'Build models that predict churn and trends.',
      body: 'Supervised machine learning pipelines, feature engineering, and classification models (e.g. 80% accuracy churn prediction) to proactively surface business risks and retention opportunities.'
    },
    connect: {
      title: 'Communicate actionable business insights.',
      body: 'Interactive Power BI and Excel dashboards, DAX KPI metrics, and stakeholder reporting that bridge technical SQL/Python findings with executive strategic decisions.'
    }
  };

  const tabs = document.querySelectorAll('.tab');
  const tabTitle = document.querySelector('.tab-title');
  const tabBody = document.querySelector('.tab-body');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const key = tab.dataset.tab;
      const data = tabData[key];

      if (!data) return;

      if (prefersReducedMotion) {
        tabTitle.textContent = data.title;
        tabBody.textContent = data.body;
        return;
      }

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
      }, 180);
    });
  });

  // =============================================
  // MOTION TOGGLE BUTTON
  // =============================================
  const noiseBtn = document.getElementById('noise-btn');
  let motionState = !prefersReducedMotion;

  if (noiseBtn) {
    const label = noiseBtn.querySelector('span');
    label.textContent = motionState ? 'MOTION ON' : 'MOTION OFF';

    noiseBtn.addEventListener('click', () => {
      motionState = !motionState;
      label.textContent = motionState ? 'MOTION ON' : 'MOTION OFF';
      document.body.classList.toggle('reduce-motion', !motionState);
    });

    noiseBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        noiseBtn.click();
      }
    });
  }

  // =============================================
  // BAR CHART ANIMATION
  // =============================================
  const chartBars = document.querySelectorAll('.mockup-chart-bar');
  if (chartBars.length > 0 && 'IntersectionObserver' in window) {
    chartBars.forEach(bar => { bar.style.height = '4px'; });

    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chartBars.forEach((bar, i) => {
            setTimeout(() => {
              bar.style.height = bar.style.getPropertyValue('--h');
            }, prefersReducedMotion ? 0 : i * 70);
          });
          chartObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const p1Content = document.querySelector('.p1-content');
    if (p1Content) chartObserver.observe(p1Content);
  }

  // =============================================
  // SMOOTH ANCHOR SCROLLING
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        // Set focus to target for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // =============================================
  // PROJECT DETAILS MODAL & DATA STORE
  // =============================================
  const projectDetailsData = {
    p1: {
      category: 'E-Commerce & Product Analytics',
      title: 'Product Funnel, Conversion & Retention Analytics',
      stack: ['Python', 'Pandas', 'PostgreSQL', 'Power BI', 'Excel'],
      repoUrl: 'https://github.com/Shiwam-26',
      problem: 'Digital storefronts experience significant revenue leakage across checkout stages without clear attribution of user drop-offs, retention cohorts, or acquisition-channel performance.',
      solution: 'Analyzed 3,040 users and 15,942 events using Python and SQL. Mapped user journeys, calculated funnel drop-offs and conversion rates, evaluated cohort-based customer retention, and built an interactive Power BI dashboard supporting data-driven product decisions.',
      metrics: [
        { val: '3,040 Users', lbl: 'Active Users Modeled in Event Streams' },
        { val: '15,942 Events', lbl: 'Analyzed Across Funnel Conversion Stages' },
        { val: 'A/B Test', lbl: 'Proposed with Success & Guardrail Metrics' }
      ],
      findings: [
        'Analyzed 3,040 users and 15,942 events to evaluate funnel conversion, customer retention, and acquisition-channel performance using Python and SQL.',
        'Used SQL to analyze user journeys, funnel drop-offs, conversion rates, and cohort-based customer retention to identify opportunities for product improvement.',
        'Built an interactive Power BI dashboard to track conversion rates, funnel performance, and cohort retention, supporting data-driven product decisions.',
        'Proposed an A/B test to improve the highest-drop-off funnel stage, defining success metrics and guardrail metrics.'
      ]
    },
    p2: {
      category: 'Retail Analytics & Customer Intelligence',
      title: 'Customer Shopping Behavior Analysis',
      stack: ['Python', 'SQL', 'Power BI', 'Pandas', 'Advanced Excel'],
      repoUrl: 'https://github.com/Shiwam-26',
      problem: 'Retail managers require actionable visibility into purchasing patterns, discount elasticity, payment channel adoption, and subscription behavior to optimize promotional spend and increase customer lifetime value.',
      solution: 'Analyzed 3,900+ customer records from customer_shopping_behavior.csv. Authored 20+ analytical SQL queries using subqueries, multi-table joins, and window aggregations to segment customers by spending volume, discount sensitivity, shipping preferences, and subscription status. Built an interactive Power BI KPI dashboard tracking revenue by demographic and product category.',
      metrics: [
        { val: '3,900+', lbl: 'Customer Transaction Records Analyzed' },
        { val: '20+ Queries', lbl: 'SQL Queries for Segment & Revenue Profiling' },
        { val: 'Interactive BI', lbl: 'Power BI Dashboard Tracking Revenue & Ratings' }
      ],
      findings: [
        'Demonstrated that subscribed customers generate consistent repeat purchasing volume and higher lifetime revenue compared to non-subscribers.',
        'Identified high-performing product categories that maintained top average review ratings (>4.2/5.0).',
        'Demonstrated that unmonitored discount applications on staple items lowered profit margins without increasing repeat visit frequency, leading to recommendations for threshold-based discounting.'
      ]
    },
    p3: {
      category: 'Machine Learning & Predictive Analytics',
      title: 'Customer Churn Prediction & Retention Analysis',
      stack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
      repoUrl: 'https://github.com/Shiwam-26',
      problem: 'Customer churn severely impacts subscription revenues and recurring business models. Acquiring new customers requires significantly higher marketing spend than retaining existing ones; early detection of high-risk accounts allows teams to intervene proactively.',
      solution: 'Executed an end-to-end predictive machine learning pipeline on 7,043 customer accounts covering demographic data, contract terms, service usage, and monthly billing history. Conducted exploratory data analysis, handled outliers and missing values, encoded categorical variables, and trained a standardized Logistic Regression classifier.',
      metrics: [
        { val: '7,043', lbl: 'Customer Records Modeled in Dataset' },
        { val: '80%', lbl: 'Model Accuracy Achieved in Churn Classification' },
        { val: 'Early Risk', lbl: 'Identified Key Churn Indicators (Contract & Charges)' }
      ],
      findings: [
        'Achieved 80% accuracy in predicting whether a customer is at imminent risk of churning.',
        'Discovered that customers on month-to-month contracts with high monthly charges and no tech support services had the highest probability of churn.',
        'Recommended targeted customer success retention workflows: offering 12-month contract incentives and tech-support bundling for accounts reaching month 6.'
      ]
    },
    p4: {
      category: 'Generative AI & Autonomous Agents',
      title: 'ResearchPilot AI — Multi-Agent Research System',
      stack: ['Python', 'LangChain', 'Mistral AI', 'Web Scraping', 'Multi-Agent Architecture'],
      repoUrl: 'https://github.com/Shiwam-26/researchpilot-ai',
      problem: 'Conducting in-depth technical and market research requires searching across disparate web sources, reading long articles, filtering out bias or low-quality content, and summarizing findings without hallucinations.',
      solution: 'Built a modular, autonomous multi-agent research pipeline using LangChain and Mistral AI (codestral-2508). Orchestrated specialized agent nodes: a Search Agent for discovering top authoritative sources, a Reader Agent for automated web scraping and document extraction, a Writer Agent for drafting synthesized reports, and a Critic Agent for factual validation.',
      metrics: [
        { val: '4 Agents', lbl: 'Specialized Agents (Search, Scrape, Write, Critic)' },
        { val: 'Codestral', lbl: 'Powered by Mistral AI LLM Integration' },
        { val: 'Open Code', lbl: 'Verified GitHub Repository & Working Architecture' }
      ],
      findings: [
        'Automated multi-step web research synthesis, reducing manual article review time by over 70%.',
        'Implemented iterative critic feedback loops to catch factual contradictions and refine document citations.',
        'Clean, modular Python architecture in agent.py, pipeline.py, and app.py ready for LLM API extensions.'
      ]
    }
  };

  const modal = document.getElementById('project-modal');
  const modalContainer = modal ? modal.querySelector('.modal-container') : null;
  const modalContent = document.getElementById('modal-dynamic-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  let lastActiveElement = null;

  const openProjectModal = (projectId) => {
    const data = projectDetailsData[projectId];
    if (!data || !modal || !modalContent) return;

    lastActiveElement = document.activeElement;

    modalContent.innerHTML = `
      <div class="modal-header">
        <div class="modal-category">${data.category}</div>
        <h3 class="modal-title" id="modal-heading">${data.title}</h3>
        <div class="modal-stack">
          ${data.stack.map(s => `<span class="modal-stack-pill">${s}</span>`).join('')}
        </div>
      </div>

      <div class="modal-section">
        <h4 class="modal-section-title">Business Problem &amp; Objective</h4>
        <p class="modal-body-text">${data.problem}</p>
      </div>

      <div class="modal-section">
        <h4 class="modal-section-title">Analytical Approach &amp; Implemented Solution</h4>
        <p class="modal-body-text">${data.solution}</p>
      </div>

      <div class="modal-section">
        <h4 class="modal-section-title">Key Verified Metrics</h4>
        <div class="modal-metrics-box">
          ${data.metrics.map(m => `
            <div class="modal-metric-card">
              <div class="modal-metric-val">${m.val}</div>
              <div class="modal-metric-lbl">${m.lbl}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="modal-section">
        <h4 class="modal-section-title">Key Findings &amp; Business Impact</h4>
        <div class="modal-points-list">
          ${data.findings.map(f => `
            <div class="modal-point-item">
              <span>✦</span>
              <p>${f}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="modal-actions">
        <a href="${data.repoUrl}" class="btn-primary" target="_blank" rel="noopener">View Repository on GitHub ↗</a>
        <button class="btn-outline" id="modal-inner-close">Close Details</button>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-labelledby', 'modal-heading');
    document.body.style.overflow = 'hidden';

    // Trap focus inside modal
    setTimeout(() => {
      if (modalCloseBtn) modalCloseBtn.focus();
    }, 50);

    // Inner close button
    const innerClose = document.getElementById('modal-inner-close');
    if (innerClose) {
      innerClose.addEventListener('click', closeProjectModal);
    }
  };

  const closeProjectModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  // Attach button click listeners
  document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.dataset.project;
      openProjectModal(projId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  // Keyboard navigation for modal
  document.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeProjectModal();
      }
    }
  });

  // =============================================
  // COPY EMAIL TO CLIPBOARD WITH TOAST
  // =============================================
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  const showToast = (message) => {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 2800);
  };

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'shiwam808460@gmail.com';
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email)
          .then(() => {
            if (copyBtnText) copyBtnText.textContent = 'Copied!';
            showToast('Email copied to clipboard: ' + email);
            setTimeout(() => {
              if (copyBtnText) copyBtnText.textContent = 'Copy Email';
            }, 2500);
          })
          .catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }
    });
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      if (copyBtnText) copyBtnText.textContent = 'Copied!';
      showToast('Email copied to clipboard: ' + text);
      setTimeout(() => {
        if (copyBtnText) copyBtnText.textContent = 'Copy Email';
      }, 2500);
    } catch (err) {
      showToast('Email address: ' + text);
    }
    document.body.removeChild(tempInput);
  }

  // =============================================
  // RELIABLE RESUME DOWNLOAD HANDLER (BLOB STREAM + GITHUB FALLBACK)
  // =============================================
  const setupDownloadHandler = (btnId) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.style.opacity = '0.7';

      const githubPdfFallback = 'https://raw.githubusercontent.com/Shiwam-26/Shiwam_Portfolio/main/assets/resume.pdf';

      fetch('assets/resume.pdf')
        .then(res => {
          if (!res.ok) throw new Error('File not accessible on host');
          return res.blob();
        })
        .then(blob => {
          if (blob.type && !blob.type.includes('pdf') && blob.type.includes('html')) {
            throw new Error('Host returned HTML error page instead of PDF');
          }
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'Shiwam_Kumar_Data_Analyst_Resume.pdf';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            btn.style.opacity = '1';
          }, 300);
        })
        .catch(() => {
          // Fallback directly to verified GitHub raw PDF file
          window.open(githubPdfFallback, '_blank');
          btn.style.opacity = '1';
        });
    });
  };

  setupDownloadHandler('download-resume-btn');
  setupDownloadHandler('footer-resume-link');

  // =============================================
  // HOVER EFFECT — Project Cards (Desktop only)
  // =============================================
  if (!isTouchDevice && !prefersReducedMotion) {
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
  }

});

// =============================================
// CSS KEYFRAMES (injected)
// =============================================
const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = `
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
  
  @media (prefers-reduced-motion: reduce) {
    .hero-profile-img {
      animation: none !important;
    }
  }
`;
document.head.appendChild(dynamicStyle);
