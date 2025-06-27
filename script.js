document.addEventListener("DOMContentLoaded", function() {
  // Menu toggle logic
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function(e) {
      mainNav.classList.toggle('open');
      menuToggle.setAttribute(
        'aria-expanded',
        mainNav.classList.contains('open') ? 'true' : 'false'
      );
      e.stopPropagation();
    });

    // Close nav on outside click (mobile)
    document.addEventListener('click', function(e) {
      if (
        mainNav.classList.contains('open') &&
        !mainNav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Smooth scroll for anchor links
    mainNav.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        console.log('Clicked:', targetId, targetSection); // Debug line
        if (targetSection) {
          e.preventDefault();
          targetSection.scrollIntoView({ behavior: "smooth" });
          mainNav.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Contact form validation (simple)
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const message = this.message.value.trim();
    const formMessage = document.getElementById('form-message');
    if (!name || !email || !message) {
      formMessage.textContent = 'Please fill out all fields.';
      formMessage.style.color = "#e74c3c";
      return;
    }
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      formMessage.textContent = 'Please enter a valid email address.';
      formMessage.style.color = "#e74c3c";
      return;
    }
    // Simulate send
    formMessage.textContent = 'Thank you for contacting us!';
    formMessage.style.color = "#136a49";
    this.reset();
  });

  

  // Add .slide-in to all cards you want animated
  document.querySelectorAll('.card').forEach(card => card.classList.add('slide-in'));

  // Card animation logic
  const cards = document.querySelectorAll('.slide-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('slide-in-animate'); // Remove to restart
        void entry.target.offsetWidth; // Force reflow
        entry.target.classList.add('slide-in-animate');
      } else {
        entry.target.classList.remove('slide-in-animate');
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => {
    observer.observe(card);
  });

  // Show image tooltip on map point hover
  document.querySelectorAll('.map-point').forEach(point => {
    point.addEventListener('mouseenter', function() {
      let tooltip = document.createElement('div');
      tooltip.className = 'map-tooltip';
      tooltip.innerHTML = `<img src="${this.getAttribute('data-img')}" alt="" />`;
      this.appendChild(tooltip);
    });
    point.addEventListener('mouseleave', function() {
      let tooltip = this.querySelector('.map-tooltip');
      if (tooltip) tooltip.remove();
    });
  });
});
