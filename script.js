// ==============================================
// MIRROR SYNC - Main JavaScript File
// ==============================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initWalletConnection();
    initWaitlistForm();
    loadTopTraders();
    initSmoothScroll();
});

// ==============================================
// 1. WALLET CONNECTION (Phantom)
// ==============================================
function initWalletConnection() {
    const connectButton = document.getElementById('connectWallet');
    
    if (connectButton) {
        connectButton.addEventListener('click', async () => {
            if (window.solana && window.solana.isPhantom) {
                try {
                    const response = await window.solana.connect();
                    const publicKey = response.publicKey.toString();
                    
                    // Update button text
                    connectButton.textContent = publicKey.substring(0, 4) + '...' + publicKey.substring(publicKey.length - 4);
                    connectButton.style.background = '#00D084';
                    
                    console.log('Connected to wallet:', publicKey);
                    alert('✅ Wallet connected!\n' + publicKey.substring(0, 8) + '...');
                    
                } catch (err) {
                    console.error('Connection failed:', err);
                    alert('❌ Failed to connect wallet. Please try again.');
                }
            } else {
                // Phantom not installed
                if (confirm('Phantom wallet not detected!\n\nWould you like to install it?')) {
                    window.open('https://phantom.app/', '_blank');
                }
            }
        });
    }
}

// ==============================================
// 2. WAITLIST FORM (Google Sheets Integration)
// ==============================================
function initWaitlistForm() {
    const form = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('emailInput');
    const successMessage = document.getElementById('successMessage');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            // Validate email
            if (!isValidEmail(email)) {
                alert('❌ Please enter a valid email address');
                return;
            }
            
            // Get connected wallet address (if any)
            const wallet = window.solana?.publicKey?.toString() || '';
            
            // Disable submit button
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Joining...';
            
            try {
                // Send to Google Sheets - UPDATED URL
                await fetch('https://script.google.com/macros/s/AKfycbxOgkeunlE5dA1XrWq2U5VyNNQCtH7FkjXhO1UPiJbbpkT_FBQSQyeGRGJ4rDkRGKzdOw/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        email: email,
                        wallet: wallet 
                    })
                });
                
                // Show success message
                emailInput.value = '';
                
                if (successMessage) {
                    form.style.display = 'none';
                    successMessage.classList.add('active');
                    successMessage.style.display = 'block';
                }
                
                alert('🎉 Successfully joined the waitlist!\n\nWe\'ll notify you when Mirror Sync launches!');
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    if (successMessage) {
                        form.style.display = 'flex';
                        successMessage.classList.remove('active');
                        successMessage.style.display = 'none';
                    }
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }, 3000);
                
            } catch (error) {
                console.error('Error submitting to waitlist:', error);
                alert('❌ Something went wrong. Please try again!');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ==============================================
// 3. TOP TRADERS SECTION (Mock Data)
// ==============================================
function loadTopTraders() {
    const traderGrid = document.querySelector('.trader-grid');
    
    if (!traderGrid) return;
    
    // Mock trader data
    const topTraders = [
        {
            name: '🐋 CryptoWhale',
            wallet: 'A1B2C3...X9Y0Z1',
            winRate: '87%',
            totalGains: '+342%',
            followers: '1,234',
            trades: '156',
            verified: true
        },
        {
            name: '👑 SolanaKing',
            wallet: 'D4E5F6...W2V3U4',
            winRate: '79%',
            totalGains: '+298%',
            followers: '892',
            trades: '203',
            verified: true
        },
        {
            name: '💎 DeFiPro',
            wallet: 'G7H8I9...T5S6R7',
            winRate: '91%',
            totalGains: '+456%',
            followers: '2,103',
            trades: '89',
            verified: true
        }
    ];
    
    // Clear existing content
    traderGrid.innerHTML = '';
    
    // Create trader cards
    topTraders.forEach((trader, index) => {
        const card = createTraderCard(trader, index);
        traderGrid.appendChild(card);
    });
}

function createTraderCard(trader, index) {
    const card = document.createElement('div');
    card.className = 'trader-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="trader-header">
            <h3>${trader.name} ${trader.verified ? '✓' : ''}</h3>
            <span class="trader-rank">#${index + 1}</span>
        </div>
        
        <div class="trader-wallet">
            <span class="wallet-label">Wallet:</span>
            <span class="wallet-address">${trader.wallet}</span>
        </div>
        
        <div class="trader-stats">
            <div class="stat">
                <span class="stat-label">Win Rate</span>
                <span class="stat-value success">${trader.winRate}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Total Gains</span>
                <span class="stat-value gains">${trader.totalGains}</span>
            </div>
        </div>
        
        <div class="trader-info">
            <div class="info-item">
                <span>👥 ${trader.followers} followers</span>
            </div>
            <div class="info-item">
                <span>📊 ${trader.trades} trades</span>
            </div>
        </div>
        
        <button class="mirror-button" onclick="mirrorTrader('${trader.wallet}', '${trader.name}')">
            🔄 Mirror This Trader
        </button>
    `;
    
    return card;
}

// Mirror trader action
function mirrorTrader(wallet, name) {
    if (window.solana && window.solana.isConnected) {
        alert(`🎯 You've chosen to mirror ${name}\n\nWallet: ${wallet}\n\n✨ This feature will be available in the beta launch!\n\nYou'll be notified when it's ready.`);
    } else {
        if (confirm('⚠️ Please connect your Phantom wallet first!\n\nWould you like to connect now?')) {
            document.getElementById('connectWallet')?.click();
        }
    }
}

// ==============================================
// 4. SMOOTH SCROLL FOR NAVIGATION
// ==============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==============================================
// 5. UTILITY FUNCTIONS
// ==============================================

// Check if Phantom wallet is installed
function checkPhantomInstalled() {
    return window.solana && window.solana.isPhantom;
}

// Format wallet address
function formatWalletAddress(address, chars = 4) {
    if (!address) return '';
    return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

// Console welcome message
console.log('%c🔄 Mirror Sync', 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%cGrow Together, Rich Together 💎', 'font-size: 14px; color: #764ba2;');
console.log('%cWebsite loaded successfully!', 'color: #00D084;');

// ==============================================
// END OF FILE
// ==============================================
