// Copy Program ID function
function copyProgramId() {
    const programId = '5vmm28K6SP6j8R4eBnprxaxHYhQtyqbXe8dbu17R1T3A';
    
    // Use modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(programId)
            .then(() => {
                alert('✅ Program ID copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                fallbackCopy(programId);
            });
    } else {
        // Fallback for older browsers
        fallbackCopy(programId);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('✅ Program ID copied to clipboard!');
    } catch (err) {
        alert('❌ Failed to copy. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// FAQ Toggle function
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item (only if it wasn't active)
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Get all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for links that just use # as placeholder
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate offset for sticky headers
                const headerOffset = 140; // Grant banner + header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Form submission handling (adds better UX)
document.addEventListener('DOMContentLoaded', function() {
    const waitlistForm = document.querySelector('.waitlist-form');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Change button text while submitting
            submitButton.textContent = 'Joining...';
            submitButton.disabled = true;
            
            // Note: Form will actually submit to Web3Forms
            // This is just for UX feedback
            
            // Re-enable after a delay (in case of issues)
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 3000);
        });
    }
});
