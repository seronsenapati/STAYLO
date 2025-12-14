// Main JavaScript file for Staylo

document.addEventListener('DOMContentLoaded', function() {
  // Form validation
  const forms = document.querySelectorAll('.needs-validation');
  
  Array.prototype.slice.call(forms).forEach(function(form) {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      form.classList.add('was-validated');
    }, false);
  });
  
  // Image preview for file uploads
  const imageInputs = document.querySelectorAll('input[type="file"][name*="image"]');
  
  imageInputs.forEach(function(input) {
    input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          // Find the closest form and look for image preview
          const form = input.closest('form');
          if (form) {
            const preview = form.querySelector('.image-preview');
            if (preview) {
              preview.innerHTML = `<img src="${e.target.result}" class="img-thumbnail rounded" style="max-height: 200px;">`;
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  });
  
  // Confirmation for delete actions
  const deleteButtons = document.querySelectorAll('form[action*="DELETE"] button[type="submit"]');
  
  deleteButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      const confirmation = confirm('Are you sure you want to delete this item? This action cannot be undone.');
      if (!confirmation) {
        e.preventDefault();
      }
    });
  });
  
  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#' && document.querySelector(targetId)) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Loading spinner for forms
  const submitButtons = document.querySelectorAll('button[type="submit"]');
  
  submitButtons.forEach(function(button) {
    const form = button.closest('form');
    if (form) {
      form.addEventListener('submit', function() {
        // Add loading state
        button.disabled = true;
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
        
        // Re-enable after 10 seconds if form hasn't submitted
        setTimeout(() => {
          button.disabled = false;
          button.innerHTML = originalText;
        }, 10000);
      });
    }
  });
  
  // Mobile menu toggle enhancement
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', function() {
      navbarCollapse.classList.toggle('show');
      
      // Change hamburger icon to close icon
      const icon = this.querySelector('.navbar-toggler-icon');
      if (navbarCollapse.classList.contains('show')) {
        this.innerHTML = '<i class="ri-close-line"></i>';
      } else {
        this.innerHTML = '<span class="navbar-toggler-icon"></span>';
      }
    });
  }
  
  // Auto-dismiss alerts after 5 seconds with animation
  const alerts = document.querySelectorAll('.alert');
  
  alerts.forEach(function(alert) {
    // Add hover pause functionality
    let timeoutId;
    
    function startTimeout() {
      timeoutId = setTimeout(function() {
        alert.style.transition = 'all 0.5s ease';
        alert.style.transform = 'translateX(100%)';
        alert.style.opacity = '0';
        setTimeout(function() {
          alert.remove();
        }, 500);
      }, 5000);
    }
    
    startTimeout();
    
    // Pause timeout on hover
    alert.addEventListener('mouseenter', function() {
      clearTimeout(timeoutId);
    });
    
    alert.addEventListener('mouseleave', startTimeout);
  });
  
  // Add to favorites functionality (if implemented)
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  
  favoriteButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const listingId = this.dataset.listingId;
      const icon = this.querySelector('i');
      
      // Toggle visual state with animation
      if (icon.classList.contains('ri-heart-line')) {
        icon.classList.remove('ri-heart-line');
        icon.classList.add('ri-heart-fill');
        this.classList.add('text-danger');
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 300);
        // Here you would typically make an AJAX call to save the favorite
      } else {
        icon.classList.remove('ri-heart-fill');
        icon.classList.add('ri-heart-line');
        this.classList.remove('text-danger');
        // Here you would typically make an AJAX call to remove the favorite
      }
    });
  });
  
  // Enhanced card hover effects
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    });
  });
  
  // Password visibility toggle
  const passwordToggles = document.querySelectorAll('.toggle-password');
  
  passwordToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      const targetId = this.dataset.target;
      const passwordInput = document.querySelector(targetId);
      const icon = this.querySelector('i');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('ri-eye-line');
        icon.classList.add('ri-eye-off-line');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('ri-eye-off-line');
        icon.classList.add('ri-eye-line');
      }
    });
  });
});

// Utility functions
function showLoadingSpinner(element) {
  element.innerHTML = '<div class="spinner"></div>';
}

function hideLoadingSpinner(element) {
  element.innerHTML = '';
}

// Debounce function for search/input optimization
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Helper function to truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Animation utilities
function fadeIn(element) {
  element.style.opacity = '0';
  element.style.transition = 'opacity 0.3s ease';
  
  setTimeout(() => {
    element.style.opacity = '1';
  }, 10);
}

function slideInFromBottom(element) {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'all 0.5s ease';
  
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 10);
}