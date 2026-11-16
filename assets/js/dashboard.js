/* ==========================================================================
   Dialysis Center - Patient Dashboard Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Sidebar Toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const dashboardSidebar = document.getElementById('dashboardSidebar');

  if (sidebarToggle && dashboardSidebar) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dashboardSidebar.classList.toggle('open');
    });

    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        dashboardSidebar.classList.remove('open');
      });
    }

    document.addEventListener('click', (e) => {
      if (window.innerWidth < 1200 && dashboardSidebar.classList.contains('open')) {
        if (!dashboardSidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
          dashboardSidebar.classList.remove('open');
        }
      }
    });
  }

  // 2. Hash-based View Switching
  const views = Array.from(document.querySelectorAll('.dash-view'));
  const navLinks = Array.from(document.querySelectorAll('.dash-nav-link[data-view]'));
  const titleEl = document.getElementById('dashTitle');

  const activateView = (viewName) => {
    const target = views.find((v) => v.id === 'view-' + viewName) || views[0];
    if (!target) return;

    views.forEach((v) => v.classList.toggle('is-active', v === target));
    const activeName = target.id.replace('view-', '');

    navLinks.forEach((btn) => {
      const isActive = btn.dataset.view === activeName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    if (titleEl && target.dataset.title) {
      titleEl.textContent = target.dataset.title;
      document.title = target.dataset.title + ' | Dialysis Center';
    }

    if (dashboardSidebar && window.innerWidth < 1200) {
      dashboardSidebar.classList.remove('open');
    }
  };

  navLinks.forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.view;
      window.location.hash = name;
      activateView(name);
    });
  });

  document.querySelectorAll('[data-jump-view]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const name = el.dataset.jumpView;
      window.location.hash = name;
      activateView(name);
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) activateView(hash);
  });

  const initialHash = window.location.hash.replace('#', '');
  activateView(initialHash || 'overview');

  // 3. Schedule New Dialysis Session Form
  const scheduleForm = document.getElementById('scheduleSessionForm');
  const sessionsTableBody = document.getElementById('upcomingSessionsBody');
  const scheduleToast = document.getElementById('scheduleSuccessAlert');

  if (scheduleForm && sessionsTableBody) {
    scheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dateVal = document.getElementById('sessionDate').value;
      const shiftVal = document.getElementById('sessionShift').value;
      const typeVal = document.getElementById('sessionType').value;
      const clinicVal = document.getElementById('sessionUnit').value;

      if (!dateVal || !shiftVal || !typeVal) return;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="fw-semibold">${dateVal}</td>
        <td>${shiftVal}</td>
        <td>${typeVal}</td>
        <td>${clinicVal}</td>
        <td>Dr. Marcus Vance</td>
        <td><span class="status-pill scheduled"><i class="bi bi-calendar-check"></i> Scheduled</span></td>
        <td><button type="button" class="btn btn-sm btn-outline-danger cancel-appt-btn">Cancel</button></td>
      `;
      sessionsTableBody.prepend(row);

      if (scheduleToast) {
        scheduleToast.classList.remove('d-none');
        setTimeout(() => scheduleToast.classList.add('d-none'), 4000);
      }
      scheduleForm.reset();
    });

    sessionsTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.cancel-appt-btn');
      if (!btn) return;
      const row = btn.closest('tr');
      const statusCell = row.querySelector('.status-pill');
      if (statusCell) {
        statusCell.className = 'status-pill cancelled';
        statusCell.innerHTML = '<i class="bi bi-x-circle"></i> Cancelled';
      }
      btn.disabled = true;
      btn.textContent = 'Cancelled';
    });
  }

  // 4. Session History Filter
  const historyFilter = document.getElementById('historyFilter');
  const historyRows = document.querySelectorAll('#historyTableBody tr');
  if (historyFilter && historyRows.length) {
    historyFilter.addEventListener('change', () => {
      const val = historyFilter.value;
      historyRows.forEach((row) => {
        row.style.display = (val === 'all' || row.dataset.modality === val) ? '' : 'none';
      });
    });
  }

  // 5. Patient Profile Save
  const profileForm = document.getElementById('patientProfileForm');
  const profileAlert = document.getElementById('profileSaveAlert');
  if (profileForm && profileAlert) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      profileAlert.classList.remove('d-none');
      setTimeout(() => profileAlert.classList.add('d-none'), 3500);
    });
  }

  // 6. Mark All Notifications Read
  const markReadBtn = document.getElementById('markNotificationsRead');
  const notifBadge = document.getElementById('notifCountBadge');
  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      document.querySelectorAll('.notif-unread').forEach((el) => el.classList.remove('notif-unread', 'border-primary'));
      if (notifBadge) notifBadge.classList.add('d-none');
    });
  }
});

