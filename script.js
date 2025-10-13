document.addEventListener('DOMContentLoaded', function() {
    initWalletConnection();
    initWaitlistForm();
    initFAQ();
});

// Wallet Connection
function initWalletConnection() {
    const connectBtn = document.getElementById('connectWallet');
    
    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
    }
}

async function connectWallet() {
    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    
    if (!isPhantomInstalled) {
        alert('Phantom wallet not detected. Please install it from phantom.app');
        window.open('https://phantom.app/', '_blank');
        return;
    }
    
    try {
        const resp = await window.solana.connect();
        const publicKey = resp.publicKey.toString();
        const shortKey = publicKey.slice(0, 4) + '...' + publicKey.slice(-4);
        
        document.getElementById('connectWallet').innerHTML = `<span class="wallet-icon">✅</span> ${shortKey}`;
        alert('Wallet connected! 🎉');
        
    } catch (err) {
        console.error('Wallet connection failed:', err);
        alert('Failed to connect wallet. Please try again.');
    }
}

// Waitlist Form
function initWaitlistForm() {
    const form = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('successMessage');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('emailInput').value;
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Save to localStorage
            const waitlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
            waitlist.push({ email, date: new Date().toISOString() });
            localStorage.setItem('waitlist', JSON.stringify(waitlist));
            
            // Show success
            form.style.display = 'none';
            successMessage.classList.add('active');
            
            alert('Successfully joined the waitlist! 🎉');
        });
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            item.classList.toggle('active');
        });
    });
}

// Scroll to Waitlist
window.scrollToWaitlist = function() {
    const waitlist = document.getElementById('waitlist');
    if (waitlist) {
        waitlist.scrollIntoView({ behavior: 'smooth' });
    }
};