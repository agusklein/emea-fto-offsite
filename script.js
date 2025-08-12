// EMEA FTO Offsite Website JavaScript
// Enhanced functionality for participant management and agenda interaction

class OffsiteManager {
    constructor() {
        this.participants = [];
        this.agenda = [];
        this.editMode = false;
        this.colorMode = false;
        this.autoSaveInterval = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.startAutoSave();
        this.updateLastModified();
        
        // Add fade-in animation to sections
        this.animateElements();
    }

    bindEvents() {
        // Participant management
        document.getElementById('add-participant-btn')?.addEventListener('click', () => this.addParticipant());
        document.getElementById('export-participants-btn')?.addEventListener('click', () => this.exportParticipants());
        document.getElementById('save-data-btn')?.addEventListener('click', () => this.saveData());

        // Agenda management
        document.getElementById('add-activity-btn')?.addEventListener('click', () => this.addActivity());
        document.getElementById('edit-mode-btn')?.addEventListener('click', () => this.toggleEditMode());
        document.getElementById('export-agenda-btn')?.addEventListener('click', () => this.exportAgenda());
        document.getElementById('color-mode-btn')?.addEventListener('click', () => this.toggleColorMode());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Auto-save on content changes
        document.addEventListener('input', (e) => {
            if (e.target.contentEditable === 'true') {
                this.scheduleAutoSave();
            }
        });

        // Handle participant table changes
        this.bindParticipantEvents();
        
        // Handle agenda interactions
        this.bindAgendaEvents();
    }

    bindParticipantEvents() {
        const table = document.getElementById('participantsTable');
        if (!table) return;

        // Handle cell editing
        table.addEventListener('blur', (e) => {
            if (e.target.contentEditable === 'true') {
                this.saveData();
                this.showMessage('Data saved automatically', 'success');
            }
        }, true);

        // Handle Enter key in cells
        table.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.contentEditable === 'true') {
                e.preventDefault();
                e.target.blur();
            }
        });
    }

    bindAgendaEvents() {
        // Agenda events are now handled in enableAgendaEditing/disableAgendaEditing
        // This function can be used for other agenda-related events if needed
    }

    addParticipant() {
        const tbody = document.getElementById('participantsBody');
        if (!tbody) return;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td contenteditable="true">New Participant</td>
            <td contenteditable="true">None</td>
            <td contenteditable="true" class="editable-field" placeholder="Click to add">-</td>
            <td contenteditable="true" class="editable-field" placeholder="Click to add">-</td>
            <td contenteditable="true" class="editable-field" placeholder="Click to add">-</td>
            <td><button class="delete-btn" onclick="deleteParticipant(this)">🗑️</button></td>
        `;
        
        tbody.appendChild(newRow);
        newRow.classList.add('fade-in');
        
        // Focus on the first cell
        const firstCell = newRow.querySelector('td[contenteditable="true"]');
        if (firstCell) {
            firstCell.focus();
            firstCell.select();
        }
        
        this.saveData();
        this.showMessage('New participant added', 'success');
    }

    addActivity() {
        // Create a modal or form for adding new activities
        const activity = prompt('Enter activity details (format: Day|Activity|Time|Owner):');
        if (!activity) return;

        const parts = activity.split('|');
        if (parts.length !== 4) {
            this.showMessage('Please use format: Day|Activity|Time|Owner', 'error');
            return;
        }

        // Add to appropriate day column
        this.addActivityToCalendar(parts[0], parts[1], parts[2], parts[3]);
        this.showMessage('Activity added successfully', 'success');
    }

    addActivityToCalendar(day, activity, time, owner) {
        // Find the appropriate day column
        const dayColumns = document.querySelectorAll('.day-column');
        let targetColumn = null;

        dayColumns.forEach(column => {
            const header = column.querySelector('.day-header h3');
            if (header && header.textContent.includes(day)) {
                targetColumn = column;
            }
        });

        if (!targetColumn) {
            this.showMessage('Day not found. Please check the day format.', 'error');
            return;
        }

        // Create new time slot
        const newSlot = document.createElement('div');
        newSlot.className = 'time-slot meeting';
        newSlot.innerHTML = `
            <div class="time">${time}</div>
            <div class="session">
                <h4>${activity}</h4>
                <p><strong>Owner:</strong> ${owner}</p>
            </div>
        `;

        targetColumn.appendChild(newSlot);
        newSlot.classList.add('fade-in');
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        const btn = document.getElementById('edit-mode-btn');
        
        if (this.editMode) {
            btn.textContent = '✅ Exit Edit';
            btn.style.background = '#ff4757';
            this.enableAgendaEditing();
            this.showMessage('Edit mode enabled. Click on times, titles, or details to edit directly.', 'success');
        } else {
            btn.textContent = '✏️ Edit Mode';
            btn.style.background = '#FF9900';
            this.disableAgendaEditing();
            this.showMessage('Edit mode disabled.', 'success');
        }
    }

    enableAgendaEditing() {
        // Make time slots editable
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.add('editable-mode');
            
            // Make time editable
            const timeElement = slot.querySelector('.time');
            if (timeElement) {
                timeElement.contentEditable = true;
                timeElement.classList.add('editable-field');
            }
            
            // Make session title editable
            const titleElement = slot.querySelector('.session h4');
            if (titleElement) {
                titleElement.contentEditable = true;
                titleElement.classList.add('editable-field');
            }
            
            // Make session details editable
            const detailElements = slot.querySelectorAll('.session p');
            detailElements.forEach(detail => {
                detail.contentEditable = true;
                detail.classList.add('editable-field');
            });
        });
        
        // Add save handlers
        document.querySelectorAll('.editable-field').forEach(field => {
            field.addEventListener('blur', () => {
                this.saveData();
                this.showMessage('Changes saved', 'success');
            });
            
            field.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    field.blur();
                }
            });
        });
    }

    disableAgendaEditing() {
        // Remove editable attributes
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('editable-mode');
            
            // Remove contentEditable from all elements
            const editableElements = slot.querySelectorAll('[contenteditable="true"]');
            editableElements.forEach(element => {
                element.contentEditable = false;
                element.classList.remove('editable-field');
            });
        });
    }

    toggleColorMode() {
        this.colorMode = !this.colorMode;
        const btn = document.getElementById('color-mode-btn');
        
        if (this.colorMode) {
            btn.textContent = '🎨 Exit Color';
            btn.style.background = '#8C4FFF';
            this.showColorPalette();
        } else {
            btn.textContent = '🎨 Color Mode';
            btn.style.background = '#FF9900';
            this.hideColorPalette();
        }
    }

    showColorPalette() {
        // Create color palette for activity categorization
        const palette = document.createElement('div');
        palette.id = 'color-palette';
        palette.className = 'color-palette';
        palette.innerHTML = `
            <h4>Click an activity, then choose a category:</h4>
            <div class="color-options">
                <button class="color-btn meeting" data-category="meeting">🏢 Meeting</button>
                <button class="color-btn workshop" data-category="workshop">🛠️ Workshop</button>
                <button class="color-btn demo" data-category="demo">💻 Demo</button>
                <button class="color-btn social" data-category="social">🍽️ Social</button>
                <button class="color-btn break" data-category="break">☕ Break</button>
                <button class="color-btn free" data-category="free">🆓 Free</button>
            </div>
        `;
        
        document.querySelector('.agenda').appendChild(palette);
        
        // Bind color selection events
        palette.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.applyColorToSelected(category);
            });
        });
    }

    hideColorPalette() {
        const palette = document.getElementById('color-palette');
        if (palette) {
            palette.remove();
        }
    }

    applyColorToSelected(category) {
        // This would apply to a selected time slot
        // For now, just show a message
        this.showMessage(`Color category "${category}" ready. Click on an activity to apply.`, 'success');
    }

    exportParticipants() {
        const table = document.getElementById('participantsTable');
        if (!table) return;

        let csv = 'Participant,Dietary Restrictions,Arrival Time,Departure Time,Hotel\n';
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                const rowData = [
                    this.escapeCsv(cells[0].textContent),
                    this.escapeCsv(cells[1].textContent),
                    this.escapeCsv(cells[2].textContent),
                    this.escapeCsv(cells[3].textContent),
                    this.escapeCsv(cells[4].textContent)
                ];
                csv += rowData.join(',') + '\n';
            }
        });

        this.downloadFile(csv, 'emea-fto-participants.csv', 'text/csv');
        this.showMessage('Participants exported successfully', 'success');
    }

    exportAgenda() {
        let agenda = 'EMEA FTO Offsite Agenda - October 2025\n\n';
        
        document.querySelectorAll('.day-column').forEach(dayCol => {
            const dayHeader = dayCol.querySelector('.day-header h3');
            if (dayHeader) {
                agenda += `${dayHeader.textContent}\n`;
                agenda += '='.repeat(dayHeader.textContent.length) + '\n\n';
                
                dayCol.querySelectorAll('.time-slot').forEach(slot => {
                    const time = slot.querySelector('.time')?.textContent || '';
                    const title = slot.querySelector('.session h4')?.textContent || '';
                    const details = slot.querySelector('.session p')?.textContent || '';
                    
                    agenda += `${time}: ${title}\n`;
                    if (details) {
                        agenda += `   ${details}\n`;
                    }
                    agenda += '\n';
                });
                
                agenda += '\n';
            }
        });

        this.downloadFile(agenda, 'emea-fto-agenda.txt', 'text/plain');
        this.showMessage('Agenda exported successfully', 'success');
    }

    saveData() {
        const data = {
            participants: this.getParticipantsData(),
            lastModified: new Date().toISOString(),
            version: '1.0'
        };
        
        localStorage.setItem('emea-fto-offsite-data', JSON.stringify(data));
        this.updateLastModified();
    }

    loadData() {
        const saved = localStorage.getItem('emea-fto-offsite-data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.participants = data.participants || [];
                // Load participants back to table if needed
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }

    getParticipantsData() {
        const table = document.getElementById('participantsTable');
        if (!table) return [];

        const participants = [];
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                participants.push({
                    name: cells[0].textContent.trim(),
                    dietary: cells[1].textContent.trim(),
                    arrival: cells[2].textContent.trim(),
                    departure: cells[3].textContent.trim(),
                    hotel: cells[4].textContent.trim()
                });
            }
        });
        
        return participants;
    }

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.saveData();
        }, 30000); // Auto-save every 30 seconds
    }

    scheduleAutoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveData();
        }, 2000); // Save 2 seconds after last change
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    this.saveData();
                    this.showMessage('Data saved manually', 'success');
                    break;
                case 'e':
                    e.preventDefault();
                    this.exportParticipants();
                    break;
            }
        }
    }

    updateLastModified() {
        const element = document.getElementById('lastUpdated');
        if (element) {
            element.textContent = new Date().toLocaleString();
        }
    }

    showMessage(text, type = 'success') {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());
        
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        // Insert after the first section
        const firstSection = document.querySelector('main section');
        if (firstSection) {
            firstSection.parentNode.insertBefore(message, firstSection.nextSibling);
        }
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    animateElements() {
        // Add fade-in animation to main sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('fade-in');
            }, index * 200);
        });
    }

    escapeCsv(text) {
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
            return '"' + text.replace(/"/g, '""') + '"';
        }
        return text;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Global function for delete buttons
function deleteParticipant(button) {
    if (confirm('Are you sure you want to remove this participant?')) {
        const row = button.closest('tr');
        row.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            row.remove();
            window.offsiteManager.saveData();
            window.offsiteManager.showMessage('Participant removed', 'success');
        }, 300);
    }
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(-100%); }
    }
    
    .color-palette {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        margin: 1rem 0;
        border-left: 4px solid var(--aws-orange);
    }
    
    .color-options {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 0.5rem;
    }
    
    .color-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.8rem;
        color: white;
        transition: transform 0.2s ease;
    }
    
    .color-btn:hover {
        transform: scale(1.05);
    }
    
    .color-btn.meeting { background: var(--meeting-color); }
    .color-btn.workshop { background: var(--workshop-color); }
    .color-btn.demo { background: var(--demo-color); }
    .color-btn.social { background: var(--social-color); }
    .color-btn.break { background: var(--break-color); }
    .color-btn.free { background: var(--free-color); }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.offsiteManager = new OffsiteManager();
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
