// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initWalletConnection();
    initWaitlistForm();
    loadTopTraders();
    initSmoothScroll();
});

// Wallet Connection
function initWalletConnection() {
    const connectButtons = [
        document.getElementById('connectWallet'),
        document.getElementById('connectWalletHero')
    ];
    
    connectButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', async () => {
                if (window.solana && window.solana.isPhantom) {
                    try {
                        const response = await window.solana.connect();
                        const publicKey = response.publicKey.toString();
                        
                        connectButtons.forEach(btn => {
                            if (btn) {
                                btn.textContent = publicKey.substring(0, 4) + '...' + publicKey.substring(publicKey.length - 4);
                                btn.style.background = '#00D084';
                            }
                        });
                        
                        alert('✅ Wallet connected!\n' + publicKey.substring(0, 8) + '...');
                        
                    } catch (err) {
                        alert('❌ Failed to connect wallet');
                    }
                } else {
                    if (confirm('Phantom wallet not detected!\n\nInstall it?')) {
                        window.open('https://phantom.app/', '_blank');
                    }
                }
            });
        }
    });
}

// Waitlist Form
function initWaitlistForm() {
    const form = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('emailInput');
    const successMessage = document.getElementById('successMessage');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                alert('❌ Please enter a valid email');
                return;
            }
            
            const wallet = window.solana?.publicKey?.toString() || 'Not connected';
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Joining...';
            
            try {
                // Using GET with URL parameters (works with Google Sheets)
                const params = new URLSearchParams({
                    email: email,
                    wallet: wallet
                });
                
                await fetch(`https://script.google.com/macros/s/AKfycbxOgkeunlE5dA1XrWq2U5VyNNQCtH7FkjXhO1UPiJbbpkT_FBQSQyeGRGJ4rDkRGKzdOw/exec?${params}`, {
                    method: 'GET',
                    redirect: 'follow'
                });
                
                emailInput.value = '';
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                alert('🎉 Successfully joined the waitlist!');
                
                setTimeout(() => {
                    form.style.display = 'flex';
                    successMessage.style.display = 'none';
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 3000);
                
            } catch (error) {
                alert('❌ Something went wrong. Please try again!');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Load Top Traders
function loadTopTraders() {
    const traderGrid = document.querySelector('.trader-grid');
    if (!traderGrid) return;
    
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
    
    traderGrid.innerHTML = '';
    
    topTraders.forEach((trader, index) => {
        const card = document.createElement('div');
        card.className = 'trader-card';
        
        card.innerHTML = `
            <div class="trader-header">
                <h3>${trader.name} ${trader.verified ? '✓' : ''}</h3>
                <span class="trader-rank">#${index + 1}</span>
            </div>
            <div class="trader-wallet">
                <span>Wallet: ${trader.wallet}</span>
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
        
        traderGrid.appendChild(card);
    });
}

function mirrorTrader(wallet, name) {
    if (window.solana && window.solana.isConnected) {
        alert(`🎯 You've chosen to mirror ${name}\n\nWallet: ${wallet}\n\n✨ This feature will be available in beta!`);
    } else {
        if (confirm('⚠️ Please connect your Phantom wallet first!\n\nConnect now?')) {
            document.getElementById('connectWallet')?.click();
        }
    }
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

console.log('🔄 Mirror Sync loaded successfully!');
