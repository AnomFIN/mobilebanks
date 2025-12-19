/**
 * UI JavaScript Helpers - CryptoApp
 * Accordion, Copy-to-clipboard, and other interactive components
 */

(function() {
    'use strict';

    // === ACCORDION ===
    window.initAccordions = function() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const expanded = this.getAttribute('aria-expanded') === 'true';
                const contentId = this.getAttribute('aria-controls');
                const content = document.getElementById(contentId);
                
                if (!content) return;
                
                // Toggle state
                this.setAttribute('aria-expanded', !expanded);
                content.hidden = expanded;
                
                // Animate
                if (!expanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            });
            
            // Initialize state
            const contentId = header.getAttribute('aria-controls');
            const content = document.getElementById(contentId);
            if (content && header.getAttribute('aria-expanded') !== 'true') {
                content.hidden = true;
            }
        });
    };

    // === COPY TO CLIPBOARD ===
    window.copyToClipboard = function(text, button) {
        if (!navigator.clipboard) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showCopySuccess(button);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
            document.body.removeChild(textArea);
        } else {
            navigator.clipboard.writeText(text).then(
                () => showCopySuccess(button),
                (err) => console.error('Failed to copy:', err)
            );
        }
    };

    function showCopySuccess(button) {
        if (!button) return;
        
        const originalText = button.textContent;
        button.classList.add('copied');
        button.textContent = 'Copied!';
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.textContent = originalText;
        }, 1500);
    }

    // === BANNER DISMISSAL ===
    window.dismissBanner = function(bannerId, storageKey) {
        const banner = document.getElementById(bannerId);
        if (banner) {
            banner.style.transition = 'opacity 200ms, transform 200ms';
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(-8px)';
            
            setTimeout(() => {
                banner.remove();
            }, 200);
            
            if (storageKey) {
                localStorage.setItem(storageKey, 'true');
            }
        }
    };

    // === SHOW TOAST ===
    window.showToast = function(type, title, message) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        const iconMap = {
            success: '<svg viewBox="0 0 20 20" fill="currentColor" style="color: var(--success);"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
            warning: '<svg viewBox="0 0 20 20" fill="currentColor" style="color: var(--warning);"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
            danger: '<svg viewBox="0 0 20 20" fill="currentColor" style="color: var(--danger);"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
            info: '<svg viewBox="0 0 20 20" fill="currentColor" style="color: var(--accent);"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${iconMap[type] || iconMap.info}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 250);
        }, 5000);
    };

    // === INITIALIZE ON LOAD ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccordions);
    } else {
        initAccordions();
    }
})();
