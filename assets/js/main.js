/* ==========================================================================
   Dialysis Center - Global Interactions, Theme Toggle, Drawer & Forms
   ========================================================================== */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle (Light / Dark) with localStorage
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const savedTheme = localStorage.getItem('dialysis-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dialysis-theme', theme);
    themeToggles.forEach((btn) => {
      btn.innerHTML = theme === 'dark'
        ? '<i class="bi bi-sun-fill" aria-hidden="true"></i>'
        : '<i class="bi bi-moon-stars-fill" aria-hidden="true"></i>';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  };

  applyTheme(initialTheme);

  themeToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  // 2. RTL Toggle
  document.querySelectorAll('.rtl-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (isRtl) {
        document.documentElement.removeAttribute('dir');
        localStorage.setItem('dialysis-dir', 'ltr');
      } else {
        document.documentElement.setAttribute('dir', 'rtl');
        localStorage.setItem('dialysis-dir', 'rtl');
      }
    });
  });
  if (localStorage.getItem('dialysis-dir') === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  // 3. Sticky Navbar Scroll Effect
  const navbar = document.querySelector('.site-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 12);
    }, { passive: true });
  }

  // 4. Mobile Navigation Drawer
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const navToggles = document.querySelectorAll('.nav-toggle');
  const drawerCloses = document.querySelectorAll('.drawer-close');

  if (mobileDrawer && drawerOverlay) {
    const openDrawer = () => {
      mobileDrawer.classList.add('open');
      drawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      drawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    navToggles.forEach((el) => el.addEventListener('click', openDrawer));
    drawerCloses.forEach((el) => el.addEventListener('click', closeDrawer));
    drawerOverlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // 5. Password Visibility Toggle (Login & Register)
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    btn.addEventListener('click', () => {
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.innerHTML = isText
        ? '<i class="bi bi-eye" aria-hidden="true"></i>'
        : '<i class="bi bi-eye-slash" aria-hidden="true"></i>';
      btn.setAttribute('aria-label', isText ? 'Show password' : 'Hide password');
    });
  });

  // 6. Scroll Reveal Observer
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  // 7. Care Team Specialty Filter (care-team.html)
  const filterBtns = document.querySelectorAll('[data-team-filter]');
  const teamCards = document.querySelectorAll('[data-team-role]');
  if (filterBtns.length && teamCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.teamFilter;
        filterBtns.forEach((b) => b.classList.remove('active', 'btn-medical-primary'));
        filterBtns.forEach((b) => b.classList.add('btn-medical-outline'));
        btn.classList.remove('btn-medical-outline');
        btn.classList.add('active', 'btn-medical-primary');

        teamCards.forEach((card) => {
          const match = role === 'all' || card.dataset.teamRole === role;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  // 8. Generic Form Validation & Feedback (Contact, Login, Register)
  document.querySelectorAll('form[data-validate="true"]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const redirectUrl = form.dataset.redirect;
      const alertBox = form.querySelector('.form-feedback');
      if (alertBox) {
        alertBox.classList.remove('d-none', 'alert-danger');
        alertBox.classList.add('alert-success');
        alertBox.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>' + (form.dataset.successMsg || 'Submitted successfully.');
      }

      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 700);
      } else {
        form.reset();
        form.classList.remove('was-validated');
      }
    });
  });

  // 7. Always-visible Floating Top & Bottom Scroll Controls
  if (!document.querySelector('.scroll-nav-floating')) {
    const scrollNav = document.createElement('div');
    scrollNav.className = 'scroll-nav-floating';
    scrollNav.setAttribute('aria-label', 'Page scroll navigation');

    const topBtn = document.createElement('button');
    topBtn.type = 'button';
    topBtn.className = 'scroll-nav-btn';
    topBtn.setAttribute('aria-label', 'Scroll to top');
    topBtn.title = 'Back to Top';
    topBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const bottomBtn = document.createElement('button');
    bottomBtn.type = 'button';
    bottomBtn.className = 'scroll-nav-btn';
    bottomBtn.setAttribute('aria-label', 'Scroll to bottom');
    bottomBtn.title = 'Go to Bottom';
    bottomBtn.innerHTML = '<i class="bi bi-arrow-down"></i>';
    bottomBtn.addEventListener('click', () => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    });

    scrollNav.appendChild(topBtn);
    scrollNav.appendChild(bottomBtn);
    document.body.appendChild(scrollNav);
  }
});
