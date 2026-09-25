/**
 * Sri Balajee Nagar - Community Portal Application Script
 * Features: WhatsApp Community Onboarding, Multi-step Admin Approval, Notices & Interactive Directory
 */

(function () {
  'use strict';

  // ==========================================
  // Storage & Default State
  // ==========================================
  const STORAGE_KEYS = {
    REQUESTS: 'sbnr_resident_requests_v5',
    SETTINGS: 'sbnr_portal_settings_v5',
    NOTICES: 'sbnr_notices_v5',
    ADMIN_SESSION: 'sbnr_admin_logged_in_v5'
  };

  const DEFAULT_SETTINGS = {
    adminPhone: '919000011297',
    adminPassword: 'SBN@Keesara#2026',
    groupInviteUrl: 'https://chat.whatsapp.com/IsVuuxNg49gIJYPj8uIZAU?s=sh&p=i&mlu=4&ilr=4',
    colonyName: 'Sri Balajee Nagar',
    colonyAddress: 'Survey No. 75 & 76, OPP Lead India Bharat Ratnas School, Ahmedguda, Keesara Mandal, Medchal Dist, Hyderabad - 501301',
    developerName: 'Naveen G Venkata',
    developerPhone: '+91 9000011297'
  };

  // No hardcoded notices as requested - admin can post when needed
  const DEFAULT_NOTICES = [];

  // No hardcoded requests - will be populated when residents submit
  const DEFAULT_REQUESTS = [];

  // ==========================================
  // Helper State Managers
  // ==========================================
  function getSettings() {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(saved);
    if (!parsed.groupInviteUrl || !parsed.groupInviteUrl.includes('s=sh') || parsed.groupInviteUrl.includes('sample-')) {
      parsed.groupInviteUrl = DEFAULT_SETTINGS.groupInviteUrl;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  }

  function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  function getRequests() {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(DEFAULT_REQUESTS));
      return DEFAULT_REQUESTS;
    }
    return JSON.parse(saved);
  }

  function saveRequests(requests) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }

  function getNotices() {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(DEFAULT_NOTICES));
      return DEFAULT_NOTICES;
    }
    return JSON.parse(saved);
  }

  function saveNotices(notices) {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }

  // ==========================================
  // UI Toast Engine
  // ==========================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="#22c55e" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="#ef4444" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 8v4m0 4h.01"/></svg>';
    } else {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="#f59e0b" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 16v-4m0-4h.01"/></svg>';
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================
  // Modal Control
  // ==========================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Setup Global Modal Close listeners
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Escape Key to close active modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
          m.classList.remove('active');
          document.body.style.overflow = '';
        });
      }
    });

    // Initialize Components
    initNavbar();
    initJoinWhatsAppFlow();
    initNotices();
    initAdminPortal();
    initGalleryLightbox();
  });

  // ==========================================
  // Navbar Logic
  // ==========================================
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
        });
      });
    }
  }

  // ==========================================
  // Join WhatsApp Group Modal & Approval Flow
  // ==========================================
  function initJoinWhatsAppFlow() {
    const openBtns = document.querySelectorAll('.trigger-join-wa');
    const joinModal = document.getElementById('joinGroupModal');
    const form = document.getElementById('joinGroupForm');
    const formStep = document.getElementById('joinFormStep');
    const successStep = document.getElementById('joinSuccessStep');
    const sendDirectWaBtn = document.getElementById('btnSendDirectWa');

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Reset form & steps
        if (form) form.reset();
        if (formStep && successStep) {
          formStep.style.display = 'block';
          successStep.style.display = 'none';
        }
        openModal('joinGroupModal');
      });
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('reqFullName').value.trim();
        const plotNumber = document.getElementById('reqPlotNumber').value.trim();
        let phone = document.getElementById('reqPhone').value.trim().replace(/\D/g, '');
        const residentType = document.getElementById('reqResidentType').value;
        const email = document.getElementById('reqEmail').value.trim();
        const notes = document.getElementById('reqNotes').value.trim();

        if (!fullName || !plotNumber || !phone) {
          showToast('Please fill in all mandatory fields (Name, House / Plot Number, Phone)', 'error');
          return;
        }

        if (phone.length < 10) {
          showToast('Please enter a valid 10-digit mobile number', 'error');
          return;
        }

        const settings = getSettings();
        const cleanAdminPhone = settings.adminPhone.replace(/\D/g, '');
        const requests = getRequests();

        // Generate unique Ref ID for every new submission
        let refNo;
        do {
          refNo = 'SBN-' + Math.floor(1000 + Math.random() * 9000);
        } while (requests.some(r => r.id === refNo));

        const newRequest = {
          id: refNo,
          fullName,
          plotNumber,
          phone,
          residentType,
          email,
          notes,
          status: 'pending',
          timestamp: new Date().toISOString()
        };

        // Save into local database (every submission captured with its unique ID)
        requests.unshift(newRequest);
        saveRequests(requests);

        // Build prefilled WhatsApp message to Admin for approval
        const waMessage = 
`🏛️ *SRI BALAJEE NAGAR - RESIDENT GROUP JOIN REQUEST*

👤 *Resident Name:* ${fullName}
🏡 *House / Plot No:* ${plotNumber}
📱 *WhatsApp Number:* +91 ${phone}
🏷️ *Resident Category:* ${residentType}
📧 *Email:* ${email || 'N/A'}
📝 *Notes:* ${notes || 'Resident of Sri Balajee Nagar'}
🔖 *Request Ref ID:* #${refNo}

-----------------------------
*To Colony Admin:*
Kindly review my house / plot details and approve adding me to the official Sri Balajee Nagar WhatsApp Community.`;

        const waUrl = `https://wa.me/${cleanAdminPhone}?text=${encodeURIComponent(waMessage)}`;

        // Update Success Step UI
        document.getElementById('successRefId').textContent = '#' + refNo;
        document.getElementById('successName').textContent = fullName;
        document.getElementById('successPlot').textContent = plotNumber;
        document.getElementById('successPhone').textContent = '+91 ' + phone;
        document.getElementById('successType').textContent = residentType;

        const joinGroupLinkBtn = document.getElementById('btnJoinGroupLink');
        if (joinGroupLinkBtn) {
          joinGroupLinkBtn.href = settings.groupInviteUrl;
        }

        if (sendDirectWaBtn) {
          sendDirectWaBtn.onclick = () => {
            window.open(waUrl, '_blank');
          };
        }

        // Auto-launch WhatsApp group link to join directly
        try {
          window.open(settings.groupInviteUrl, '_blank');
        } catch (err) {
          console.warn('Popup blocked, accessible via button', err);
        }

        // Show Success Step
        formStep.style.display = 'none';
        successStep.style.display = 'block';

        showToast(`Details recorded in admin portal (Ref ID: #${refNo})!`, 'success');

        // Refresh admin table if admin view is open
        renderAdminRequests();
      });
    }
  }

  // ==========================================
  // Notice Board Engine
  // ==========================================
  function initNotices() {
    renderNotices('all');

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');
        renderNotices(category);
      });
    });
  }

  function renderNotices(categoryFilter = 'all') {
    const container = document.getElementById('noticesGrid');
    if (!container) return;

    const notices = getNotices();
    const filtered = categoryFilter === 'all' 
      ? notices 
      : notices.filter(n => n.category === categoryFilter);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3.5rem 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass); color: var(--text-secondary);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">📢</div>
          <h4 style="color: #ffffff; font-size: 1.15rem; margin-bottom: 0.4rem;">No Active Circulars</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 450px; margin-inline: auto;">Official announcements and colony circulars will be published here by the association committee.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(notice => `
      <div class="notice-card ${notice.category}">
        <div class="notice-card-header">
          <span class="notice-category-badge ${notice.category}">${notice.category.toUpperCase()}</span>
          <span class="notice-date">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            ${notice.date}
          </span>
        </div>
        <h4 class="notice-title">${escapeHtml(notice.title)}</h4>
        <p class="notice-body">${escapeHtml(notice.content)}</p>
        <div class="notice-footer">
          <span class="notice-author">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            ${escapeHtml(notice.author)}
          </span>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // Admin Portal & Approval Management
  // ==========================================
  function initAdminPortal() {
    const adminTriggerBtns = document.querySelectorAll('.trigger-admin-portal');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminPortalModal = document.getElementById('adminPortalModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const btnToggleAdminPass = document.getElementById('btnToggleAdminPass');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    // Password show/hide toggle
    if (btnToggleAdminPass && adminPasswordInput) {
      btnToggleAdminPass.addEventListener('click', () => {
        const isPass = adminPasswordInput.getAttribute('type') === 'password';
        adminPasswordInput.setAttribute('type', isPass ? 'text' : 'password');
        btnToggleAdminPass.textContent = isPass ? '🙈' : '👁️';
      });
    }

    // Admin Navigation Tabs
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.style.display = 'none');

        btn.classList.add('active');
        const target = btn.getAttribute('data-tab');
        const activePane = document.getElementById(target);
        if (activePane) activePane.style.display = 'block';
      });
    });

    adminTriggerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isLoggedIn = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
        if (isLoggedIn) {
          openAdminDashboard();
        } else {
          if (adminPasswordInput) {
            adminPasswordInput.value = '';
            adminPasswordInput.setAttribute('type', 'password');
            if (btnToggleAdminPass) btnToggleAdminPass.textContent = '👁️';
          }
          openModal('adminLoginModal');
        }
      });
    });

    if (adminLoginForm) {
      adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = getSettings();
        const enteredPassword = adminPasswordInput ? adminPasswordInput.value.trim() : '';

        const validMaster = settings.adminPassword || 'SBN@Keesara#2026';
        if (enteredPassword === validMaster) {
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
          closeModal('adminLoginModal');
          openAdminDashboard();
          showToast('Welcome, Administrator! Access granted.', 'success');
        } else {
          showToast('Invalid Administrator Password. Access denied.', 'error');
        }
      });
    }

    if (adminLogoutBtn) {
      adminLogoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
        closeModal('adminPortalModal');
        showToast('Logged out of Admin Portal.', 'info');
      });
    }

    // Search filter for requests
    const searchInput = document.getElementById('adminSearchRequests');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderAdminRequests(searchInput.value);
      });
    }

    // Export CSV
    const exportBtn = document.getElementById('btnExportRequests');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportRequestsToCSV);
    }

    // Clear All Requests
    const clearBtn = document.getElementById('btnClearAllRequests');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const requests = getRequests();
        if (requests.length === 0) {
          showToast('No resident records to clear.', 'info');
          return;
        }
        if (!confirm('Are you sure you want to permanently clear ALL resident records from the portal?')) return;
        saveRequests([]);
        renderAdminRequests();
        showToast('All resident records have been cleared.', 'success');
      });
    }

    // Settings Form
    const settingsForm = document.getElementById('adminSettingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = getSettings();
        settings.adminPhone = document.getElementById('settingAdminPhone').value.trim();
        settings.groupInviteUrl = document.getElementById('settingGroupUrl').value.trim();
        const newPassword = document.getElementById('settingNewPassword').value.trim();
        if (newPassword) {
          if (newPassword.length < 8) {
            showToast('Admin password must be at least 8 characters long.', 'error');
            return;
          }
          settings.adminPassword = newPassword;
        }
        saveSettings(settings);
        showToast('Colony admin settings updated successfully!', 'success');
      });
    }

    // Add Notice Form
    const newNoticeForm = document.getElementById('adminNewNoticeForm');
    if (newNoticeForm) {
      newNoticeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('noticeTitleInput').value.trim();
        const category = document.getElementById('noticeCatInput').value;
        const author = document.getElementById('noticeAuthorInput').value.trim() || 'RWA Office';
        const content = document.getElementById('noticeContentInput').value.trim();

        if (!title || !content) {
          showToast('Please provide notice title and message content', 'error');
          return;
        }

        const notices = getNotices();
        notices.unshift({
          id: 'not-' + Date.now(),
          title,
          category,
          date: 'Just Now',
          author,
          content
        });

        saveNotices(notices);
        newNoticeForm.reset();
        renderNotices('all');
        showToast('New announcement posted to notice board!', 'success');
      });
    }
  }

  function openAdminDashboard() {
    renderAdminRequests();
    loadAdminSettingsValues();
    openModal('adminPortalModal');
  }

  function loadAdminSettingsValues() {
    const settings = getSettings();
    const phoneInput = document.getElementById('settingAdminPhone');
    const urlInput = document.getElementById('settingGroupUrl');
    const newPasswordInput = document.getElementById('settingNewPassword');

    if (phoneInput) phoneInput.value = settings.adminPhone;
    if (urlInput) urlInput.value = settings.groupInviteUrl;
    if (newPasswordInput) newPasswordInput.value = '';
  }

  function renderAdminRequests(searchTerm = '') {
    const tbody = document.getElementById('adminRequestsTbody');
    const pendingCountBadge = document.getElementById('adminPendingCount');
    if (!tbody) return;

    const requests = getRequests();
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    if (pendingCountBadge) {
      pendingCountBadge.textContent = pendingCount;
    }

    const term = searchTerm.toLowerCase();
    const filtered = requests.filter(r => 
      r.fullName.toLowerCase().includes(term) ||
      r.plotNumber.toLowerCase().includes(term) ||
      r.phone.includes(term) ||
      r.id.toLowerCase().includes(term)
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No resident requests found matching your search.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(req => {
      const isPending = req.status === 'pending';
      const isApproved = req.status === 'approved';

      return `
        <tr>
          <td>
            <span style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(req.id)}</span>
          </td>
          <td>
            <div class="resident-cell">
              <span class="r-name">${escapeHtml(req.fullName)}</span>
              <span class="r-sub">${escapeHtml(req.residentType)}</span>
            </div>
          </td>
          <td>
            <span class="plot-badge">${escapeHtml(req.plotNumber)}</span>
          </td>
          <td>
            <a href="tel:+91${escapeHtml(req.phone)}" style="color: #60a5fa; font-weight: 600;">+91 ${escapeHtml(req.phone)}</a>
          </td>
          <td>
            <span class="status-badge ${req.status}">${req.status}</span>
          </td>
          <td>
            <div class="admin-row-actions">
              ${isPending ? `
                <button class="btn-action-approve" onclick="window.sbnrPortal.approveResident('${req.id}')" title="Approve & Send WhatsApp Invite">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Approve & Send
                </button>
                <button class="btn-action-reject" onclick="window.sbnrPortal.rejectResident('${req.id}')" title="Reject Request">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              ` : isApproved ? `
                <button class="btn-action-approve" onclick="window.sbnrPortal.resendInvite('${req.id}')" title="Resend WhatsApp Invite">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  Resend Invite
                </button>
              ` : `
                <span style="font-size: 0.75rem; color: #94a3b8;">Archived</span>
              `}
              <button class="btn-action-delete" onclick="window.sbnrPortal.deleteResident('${req.id}')" title="Delete Request #${req.id}">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Global Exposed Functions for Table Button Actions
  window.sbnrPortal = {
    approveResident: function (reqId) {
      const requests = getRequests();
      const settings = getSettings();
      const index = requests.findIndex(r => r.id === reqId);

      if (index === -1) return;

      const req = requests[index];
      req.status = 'approved';
      req.approvedAt = new Date().toISOString();
      saveRequests(requests);

      renderAdminRequests();

      // Build Approval & Invite WhatsApp Message to Resident
      const inviteMsg = 
`🎉 *WELCOME TO SRI BALAJEE NAGAR COMMUNITY!*

Dear *${req.fullName}*,
Your request for *${req.plotNumber}* has been verified and *APPROVED* by the Sri Balajee Nagar Welfare Association! 🎊

👉 *Join the Official Resident WhatsApp Group here:*
${settings.groupInviteUrl}

Please save this link and join the group for daily colony updates, emergency alerts, and community discussions.

_Warm regards,_
*Sri Balajee Nagar Welfare Association*`;

      const residentPhone = req.phone.replace(/\D/g, '');
      const waUrl = `https://wa.me/91${residentPhone}?text=${encodeURIComponent(inviteMsg)}`;

      showToast(`Approved ${req.fullName}! Launching WhatsApp to send group invite...`, 'success');
      window.open(waUrl, '_blank');
    },

    rejectResident: function (reqId) {
      if (!confirm('Are you sure you want to reject this request?')) return;

      const requests = getRequests();
      const index = requests.findIndex(r => r.id === reqId);
      if (index === -1) return;

      requests[index].status = 'rejected';
      saveRequests(requests);
      renderAdminRequests();
      showToast('Request marked as rejected.', 'info');
    },

    deleteResident: function (reqId) {
      const requests = getRequests();
      const req = requests.find(r => r.id === reqId);
      const name = req ? req.fullName : 'this resident';
      if (!confirm(`Are you sure you want to permanently delete request #${reqId} (${name})?`)) return;

      const filtered = requests.filter(r => r.id !== reqId);
      saveRequests(filtered);
      renderAdminRequests();
      showToast(`Request #${reqId} deleted successfully.`, 'info');
    },

    resendInvite: function (reqId) {
      const requests = getRequests();
      const settings = getSettings();
      const req = requests.find(r => r.id === reqId);
      if (!req) return;

      const inviteMsg = 
`👋 *Sri Balajee Nagar WhatsApp Group Invite Reminder*

Dear *${req.fullName}* (${req.plotNumber}),
Here is your official WhatsApp group invite link:
${settings.groupInviteUrl}

_Sri Balajee Nagar Welfare Association_`;

      const residentPhone = req.phone.replace(/\D/g, '');
      const waUrl = `https://wa.me/91${residentPhone}?text=${encodeURIComponent(inviteMsg)}`;
      window.open(waUrl, '_blank');
    }
  };

  // ==========================================
  // Export CSV Feature
  // ==========================================
  function exportRequestsToCSV() {
    const requests = getRequests();
    if (requests.length === 0) {
      showToast('No resident records to export.', 'error');
      return;
    }

    const headers = ['Request ID', 'Full Name', 'House / Plot Number', 'Phone Number', 'Resident Type', 'Email', 'Status', 'Submitted At', 'Approved At'];
    const rows = requests.map(r => [
      `"${r.id}"`,
      `"${r.fullName}"`,
      `"${r.plotNumber}"`,
      `"${r.phone}"`,
      `"${r.residentType}"`,
      `"${r.email || ''}"`,
      `"${r.status}"`,
      `"${r.timestamp}"`,
      `"${r.approvedAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sri_Balajee_Nagar_Residents_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Resident directory exported to CSV!', 'success');
  }

  // ==========================================
  // Gallery Lightbox
  // ==========================================
  function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    if (!lightboxModal) return;

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption p');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          if (caption && lightboxCaption) {
            lightboxCaption.textContent = caption.textContent;
          }
          openModal('lightboxModal');
        }
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
