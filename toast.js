// Sistema de Notificações Toast
class Toast {
    static show(message, type = 'info', duration = 3000) {
        const container = this.getContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' 
            ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="3">
                <path d="M20 6L9 17l-5-5"></path>
            </svg>`
            : type === 'error'
            ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#f44336" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>`
            : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#00BCD4" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`;
        
        toast.innerHTML = `
            ${icon}
            <div class="toast-content">
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Auto remover
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.add('hiding');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
        
        return toast;
    }
    
    static getContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }
    
    static success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }
    
    static error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    }
    
    static info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
}
