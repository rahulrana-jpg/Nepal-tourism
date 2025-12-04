// Escrow System JavaScript

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  initializeEscrowSystem();
});

// Escrow data storage (in production, this would be a backend database)
let escrowBookings = JSON.parse(localStorage.getItem('escrowBookings')) || [];
let bookingIdCounter = parseInt(localStorage.getItem('bookingIdCounter')) || 1;

function initializeEscrowSystem() {
  // Tab switching
  const tabs = document.querySelectorAll('.escrow-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });

  // Form submission
  const escrowForm = document.getElementById('escrow-form');
  if (escrowForm) {
    escrowForm.addEventListener('submit', handleFormSubmit);
  }

  // Search and filter
  const searchInput = document.getElementById('search-bookings');
  const filterSelect = document.getElementById('filter-status');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterBookings);
  }
  
  if (filterSelect) {
    filterSelect.addEventListener('change', filterBookings);
  }

  // Modal close
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.querySelector('.modal-close');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }
  
  if (modal) {
    window.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  // Set minimum date to today
  const startDateInput = document.getElementById('start-date');
  if (startDateInput) {
    const today = new Date().toISOString().split('T')[0];
    startDateInput.setAttribute('min', today);
  }

  // Load bookings if on manage tab
  displayBookings();
}

function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.escrow-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // Update content
  document.querySelectorAll('.escrow-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`${tabName}-tab`).classList.add('active');

  // Reload bookings if switching to manage tab
  if (tabName === 'manage') {
    displayBookings();
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(e.target);
  const booking = {
    id: `ESC-${String(bookingIdCounter).padStart(6, '0')}`,
    serviceType: formData.get('serviceType'),
    buyerName: formData.get('buyerName'),
    buyerEmail: formData.get('buyerEmail'),
    providerName: formData.get('providerName'),
    providerEmail: formData.get('providerEmail'),
    amount: parseFloat(formData.get('amount')),
    startDate: formData.get('startDate'),
    description: formData.get('description'),
    terms: formData.get('terms'),
    status: 'pending',
    createdAt: new Date().toISOString(),
    buyerConfirmed: false,
    providerConfirmed: false,
    fundedAmount: 0,
    timeline: [
      {
        date: new Date().toISOString(),
        action: 'Booking created',
        status: 'pending'
      }
    ]
  };

  // Save booking
  escrowBookings.push(booking);
  bookingIdCounter++;
  
  localStorage.setItem('escrowBookings', JSON.stringify(escrowBookings));
  localStorage.setItem('bookingIdCounter', bookingIdCounter.toString());

  // Show success message
  showMessage('success', `Booking created successfully! Your booking ID is ${booking.id}`);

  // Reset form
  e.target.reset();

  // Switch to manage tab after 2 seconds
  setTimeout(() => {
    switchTab('manage');
  }, 2000);
}

function displayBookings() {
  const bookingsList = document.getElementById('bookings-list');
  if (!bookingsList) return;

  if (escrowBookings.length === 0) {
    bookingsList.innerHTML = '<p class="no-bookings">No bookings found. Create your first booking to get started!</p>';
    return;
  }

  // Apply filters
  const searchTerm = document.getElementById('search-bookings')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('filter-status')?.value || 'all';

  let filteredBookings = escrowBookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.id.toLowerCase().includes(searchTerm) ||
      booking.buyerName.toLowerCase().includes(searchTerm) ||
      booking.providerName.toLowerCase().includes(searchTerm) ||
      booking.serviceType.toLowerCase().includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (filteredBookings.length === 0) {
    bookingsList.innerHTML = '<p class="no-bookings">No bookings match your search criteria.</p>';
    return;
  }

  // Sort by created date (newest first)
  filteredBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  bookingsList.innerHTML = filteredBookings.map(booking => createBookingCard(booking)).join('');

  // Add event listeners to buttons
  attachBookingEventListeners();
}

function createBookingCard(booking) {
  const serviceTypeNames = {
    trekking: 'Trekking Package',
    cultural: 'Cultural Tour',
    wildlife: 'Wildlife Safari',
    wellness: 'Wellness & Meditation',
    adventure: 'Adventure Sports',
    custom: 'Custom Package'
  };

  return `
    <div class="booking-card" data-booking-id="${booking.id}">
      <div class="booking-header">
        <div>
          <div class="booking-id">${booking.id}</div>
          <h3>${serviceTypeNames[booking.serviceType]}</h3>
        </div>
        <span class="status-badge ${booking.status}">${booking.status}</span>
      </div>
      
      <div class="booking-info">
        <div class="info-item">
          <span class="info-label">Buyer</span>
          <span class="info-value">${booking.buyerName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Provider</span>
          <span class="info-value">${booking.providerName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Amount</span>
          <span class="info-value">NPR ${booking.amount.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Start Date</span>
          <span class="info-value">${formatDate(booking.startDate)}</span>
        </div>
      </div>
      
      <div class="booking-description">
        ${booking.description.substring(0, 150)}${booking.description.length > 150 ? '...' : ''}
      </div>
      
      <div class="booking-actions">
        <button class="btn-view" onclick="viewBookingDetail('${booking.id}')">View Details</button>
        ${getActionButtons(booking)}
      </div>
    </div>
  `;
}

function getActionButtons(booking) {
  let buttons = '';
  
  switch (booking.status) {
    case 'pending':
      buttons = '<button class="btn-fund" onclick="fundEscrow(\'' + booking.id + '\')">Fund Escrow</button>';
      buttons += '<button class="btn-cancel" onclick="cancelBooking(\'' + booking.id + '\')">Cancel</button>';
      break;
    case 'funded':
      buttons = '<button class="btn-confirm" onclick="confirmCompletion(\'' + booking.id + '\', \'buyer\')">Confirm (Buyer)</button>';
      buttons += '<button class="btn-confirm" onclick="confirmCompletion(\'' + booking.id + '\', \'provider\')">Confirm (Provider)</button>';
      buttons += '<button class="btn-dispute" onclick="raiseDispute(\'' + booking.id + '\')">Raise Dispute</button>';
      break;
    case 'disputed':
      buttons = '<button class="btn-view" disabled>Under Mediation</button>';
      break;
    case 'completed':
      buttons = '<button class="btn-view" disabled>Payment Released</button>';
      break;
    case 'cancelled':
      buttons = '<button class="btn-view" disabled>Booking Cancelled</button>';
      break;
  }
  
  return buttons;
}

function viewBookingDetail(bookingId) {
  const booking = escrowBookings.find(b => b.id === bookingId);
  if (!booking) return;

  const serviceTypeNames = {
    trekking: 'Trekking Package',
    cultural: 'Cultural Tour',
    wildlife: 'Wildlife Safari',
    wellness: 'Wellness & Meditation',
    adventure: 'Adventure Sports',
    custom: 'Custom Package'
  };

  const modalContent = `
    <h2>Booking Details - ${booking.id}</h2>
    
    <div class="detail-section">
      <h3>Service Information</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <strong>Service Type</strong>
          <div>${serviceTypeNames[booking.serviceType]}</div>
        </div>
        <div class="detail-item">
          <strong>Status</strong>
          <span class="status-badge ${booking.status}">${booking.status}</span>
        </div>
        <div class="detail-item">
          <strong>Amount</strong>
          <div>NPR ${booking.amount.toLocaleString()}</div>
        </div>
        <div class="detail-item">
          <strong>Start Date</strong>
          <div>${formatDate(booking.startDate)}</div>
        </div>
      </div>
      <div class="detail-item" style="margin-top: 1em;">
        <strong>Description</strong>
        <div style="margin-top: 0.5em;">${booking.description}</div>
      </div>
    </div>
    
    <div class="detail-section">
      <h3>Parties Involved</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <strong>Buyer Name</strong>
          <div>${booking.buyerName}</div>
        </div>
        <div class="detail-item">
          <strong>Buyer Email</strong>
          <div>${booking.buyerEmail}</div>
        </div>
        <div class="detail-item">
          <strong>Provider Name</strong>
          <div>${booking.providerName}</div>
        </div>
        <div class="detail-item">
          <strong>Provider Email</strong>
          <div>${booking.providerEmail}</div>
        </div>
      </div>
    </div>
    
    <div class="detail-section">
      <h3>Terms & Conditions</h3>
      <div style="background: var(--bg-alt); padding: 1em; border-radius: 0.5em;">
        ${booking.terms}
      </div>
    </div>
    
    ${booking.status === 'funded' || booking.status === 'completed' ? `
      <div class="confirmation-section">
        <h3>Confirmation Status</h3>
        <div class="confirmation-status">
          <div class="confirmation-party">
            <strong>Buyer</strong>
            <div class="status ${booking.buyerConfirmed ? 'confirmed' : 'pending'}">
              ${booking.buyerConfirmed ? '✓ Confirmed' : '⏳ Pending'}
            </div>
          </div>
          <div class="confirmation-party">
            <strong>Provider</strong>
            <div class="status ${booking.providerConfirmed ? 'confirmed' : 'pending'}">
              ${booking.providerConfirmed ? '✓ Confirmed' : '⏳ Pending'}
            </div>
          </div>
        </div>
      </div>
    ` : ''}
    
    <div class="detail-section">
      <h3>Timeline</h3>
      <div style="background: var(--bg-alt); padding: 1em; border-radius: 0.5em;">
        ${booking.timeline.map(event => `
          <div style="margin-bottom: 0.8em; padding-bottom: 0.8em; border-bottom: 1px solid #ddd;">
            <strong>${formatDateTime(event.date)}</strong><br>
            ${event.action}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('booking-detail').innerHTML = modalContent;
  document.getElementById('booking-modal').style.display = 'block';
}

function fundEscrow(bookingId) {
  if (!confirm('Are you sure you want to fund this escrow booking? The amount will be held securely until service completion.')) {
    return;
  }

  const booking = escrowBookings.find(b => b.id === bookingId);
  if (!booking) return;

  booking.status = 'funded';
  booking.fundedAmount = booking.amount;
  booking.timeline.push({
    date: new Date().toISOString(),
    action: 'Escrow funded by buyer',
    status: 'funded'
  });

  saveBookings();
  showMessage('success', 'Escrow funded successfully! The provider can now begin service delivery.');
  displayBookings();
}

function confirmCompletion(bookingId, party) {
  const booking = escrowBookings.find(b => b.id === bookingId);
  if (!booking) return;

  const confirmMsg = party === 'buyer' 
    ? 'Are you confirming that the service has been delivered satisfactorily?'
    : 'Are you confirming that you have completed the service delivery?';

  if (!confirm(confirmMsg)) {
    return;
  }

  if (party === 'buyer') {
    booking.buyerConfirmed = true;
    booking.timeline.push({
      date: new Date().toISOString(),
      action: 'Buyer confirmed service completion',
      status: 'funded'
    });
  } else {
    booking.providerConfirmed = true;
    booking.timeline.push({
      date: new Date().toISOString(),
      action: 'Provider confirmed service delivery',
      status: 'funded'
    });
  }

  // If both parties confirmed, release payment
  if (booking.buyerConfirmed && booking.providerConfirmed) {
    booking.status = 'completed';
    booking.timeline.push({
      date: new Date().toISOString(),
      action: `Payment of NPR ${booking.amount.toLocaleString()} released to provider`,
      status: 'completed'
    });
    showMessage('success', 'Both parties confirmed! Payment has been released to the provider.');
  } else {
    showMessage('info', `${party === 'buyer' ? 'Buyer' : 'Provider'} confirmation recorded. Waiting for other party to confirm.`);
  }

  saveBookings();
  displayBookings();
}

function raiseDispute(bookingId) {
  const reason = prompt('Please describe the reason for raising this dispute:');
  if (!reason) return;

  const booking = escrowBookings.find(b => b.id === bookingId);
  if (!booking) return;

  booking.status = 'disputed';
  booking.timeline.push({
    date: new Date().toISOString(),
    action: `Dispute raised: ${reason}`,
    status: 'disputed'
  });

  saveBookings();
  showMessage('info', 'Dispute raised. The case will be reviewed by our mediation team. Funds will remain in escrow until resolution.');
  displayBookings();
}

function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
    return;
  }

  const booking = escrowBookings.find(b => b.id === bookingId);
  if (!booking) return;

  if (booking.status !== 'pending') {
    alert('Only pending bookings can be cancelled. Please raise a dispute if there are issues.');
    return;
  }

  booking.status = 'cancelled';
  booking.timeline.push({
    date: new Date().toISOString(),
    action: 'Booking cancelled',
    status: 'cancelled'
  });

  saveBookings();
  showMessage('info', 'Booking cancelled successfully.');
  displayBookings();
}

function filterBookings() {
  displayBookings();
}

function attachBookingEventListeners() {
  // Event listeners are attached via onclick attributes in the HTML
  // This function is here for any additional dynamic listeners needed
}

function saveBookings() {
  localStorage.setItem('escrowBookings', JSON.stringify(escrowBookings));
}

function showMessage(type, message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  const formContainer = document.querySelector('.escrow-form-container') || document.querySelector('.bookings-container');
  if (formContainer) {
    formContainer.insertBefore(messageDiv, formContainer.firstChild);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Make functions globally available
window.viewBookingDetail = viewBookingDetail;
window.fundEscrow = fundEscrow;
window.confirmCompletion = confirmCompletion;
window.raiseDispute = raiseDispute;
window.cancelBooking = cancelBooking;
