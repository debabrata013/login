function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });
}

function scrollToMap() {
    document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement(
      {pageLanguage: 'en'},
      'google_translate_element'
    );
  }
  function submitFeedback() {
    const rating = document.querySelector('input[name="stars"]:checked');
    const feedback = document.getElementById('feedback').value;
    const messageElement = document.getElementById('message');

    // Reset message visibility
    messageElement.classList.remove('message-visible');

    if (!rating) {
        messageElement.textContent = 'Please select a rating.';
        messageElement.style.color = 'red';
        messageElement.classList.add('message-visible');
        return;
    }

    if (feedback.trim() === '') {
        messageElement.textContent = 'Please provide feedback.';
        messageElement.style.color = 'red';
        messageElement.classList.add('message-visible');
        return;
    }

    // Simulate form submission
    messageElement.textContent = 'Thank you for your feedback!';
    messageElement.style.color = 'green';
    messageElement.classList.add('message-visible');

    // Simulate sending data to the backend
    console.log(`Rating: ${rating.value}, Feedback: ${feedback}`);

    // Reset form fields after submission
    document.getElementById('feedbackForm').reset();

    // Automatically hide the message after a few seconds
    setTimeout(() => {
        messageElement.classList.remove('message-visible');
    }, 3000);
}
document.addEventListener('DOMContentLoaded', function () {
    // Hide Loading Spinner after 2 seconds
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.querySelector('.fuel-management-section').style.opacity = '1';
    }, 2000);

    // Function to handle Scroll-triggered Animations
    function handleScrollAnimations() {
        const fuelCards = document.querySelectorAll('.fuel-card');
        fuelCards.forEach((card) => {
            const cardPosition = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (cardPosition < windowHeight - 100) {
                card.classList.add('fade-in');
            }
        });
    }

    // Trigger animations on scroll
    window.addEventListener('scroll', handleScrollAnimations);
    // Initial check on page load
    handleScrollAnimations();
});

document.addEventListener('DOMContentLoaded', function () {
    // Hide Loading Spinner after 2 seconds
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.querySelector('.document-management-section').style.opacity = '1';
    }, 2000);

    // Function to handle Scroll-triggered Animations
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.document-card, .document-list');
        elements.forEach((element) => {
            const position = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (position < windowHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    }

    // Trigger animations on scroll
    window.addEventListener('scroll', handleScrollAnimations);
    // Initial check on page load
    handleScrollAnimations();
});

// Simulate file upload function
function uploadDocument() {
    const uploadStatus = document.getElementById('uploadStatus');
    uploadStatus.textContent = 'Uploading...';
    setTimeout(() => {
        uploadStatus.textContent = 'Document uploaded successfully!';
        uploadStatus.style.color = 'green';
    }, 2000);
}


function toggleSidebar() {
    const sidebar = document.getElementById('filters-sidebar');
    sidebar.classList.toggle('show');
  }
  
  // Example function to load truck data dynamically (placeholder)
  function loadTruckData() {
    const truckDetails = document.querySelector('.truck-details');
    truckDetails.innerHTML = `
      <div class="truck">
        <p>Truck 1 - Route A - Driver: John Doe - Fuel: 70%</p>
      </div>
      <div class="truck">
        <p>Truck 2 - Route B - Driver: Jane Smith - Fuel: 45%</p>
      </div>
    `;
  }
  
  // Load data on page load
  document.addEventListener('DOMContentLoaded', loadTruckData);
  
