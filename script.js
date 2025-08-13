// EMEA FTO Offsite Website JavaScript
// Enhanced functionality for participant management and agenda interaction

class OffsiteManager {
    constructor() {
        this.participants = [];
        this.agenda = [];
        this.editMode = false;
        this.colorMode = false;
        this.autoSaveInterval = null;
        this.activityTypes = {
            meeting: { name: '🏢 Meetings', color: '#4B9CD3' },
            workshop: { name: '🛠️ Workshops', color: '#FF9900' },
            demo: { name: '💻 Demos', color: '#8C4FFF' },
            social: { name: '🍽️ Social', color: '#FF6B6B' },
            break: { name: '☕ Breaks', color: '#4ECDC4' },
            free: { name: '🆓 Free Time', color: '#95E1D3' },
            arrival: { name: '✈️ Arrival', color: '#FFA726' }
        };
        this.individualActivityColors = {}; // Track individual activity colors
        
        this.init();
    }
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.startAutoSave();
        this.updateLastModified();
        this.updateActivityTypeStyles();
        
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

        // New functionality
        document.getElementById('add-activity-type-btn')?.addEventListener('click', () => this.addActivityType());
        document.getElementById('customize-legend-btn')?.addEventListener('click', () => this.customizeLegend());

        // Color picker buttons and activity interactions
        document.addEventListener('click', (e) => {
            // Handle activity type color picker buttons (in legend)
            if (e.target.classList.contains('color-picker-btn')) {
                const activityType = e.target.dataset.type;
                this.openColorPicker(activityType);
                return;
            }
            
            // Handle individual activity color picker buttons
            if (e.target.classList.contains('activity-color-btn')) {
                e.preventDefault();
                e.stopPropagation(); // Prevent time-slot click
                const activityId = e.target.dataset.activity;
                console.log('Activity color button clicked:', activityId); // Debug log
                this.openActivityColorPicker(activityId, e.target);
                return;
            }
            
            // Handle time-slot clicks for edit mode (only if not clicking on color button)
            if (e.target.closest('.time-slot') && this.editMode && !e.target.classList.contains('activity-color-btn')) {
                // Allow normal editing functionality
                return;
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Auto-save on content changes for ALL editable elements
        document.addEventListener('input', (e) => {
            if (e.target.contentEditable === 'true') {
                this.scheduleAutoSave();
            }
        });

        // Auto-save when losing focus on editable elements (but not agenda items in edit mode)
        document.addEventListener('blur', (e) => {
            if (e.target.contentEditable === 'true') {
                // Skip if this is an agenda item being handled by edit mode
                if (e.target.closest('.time-slot') && this.editMode) {
                    return; // Let edit mode handle this
                }
                
                this.saveData();
                this.showMessage('Changes saved automatically', 'success');
            }
        }, true);

        // Handle Enter key in editable elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.contentEditable === 'true') {
                // Skip if this is an agenda item being handled by edit mode
                if (e.target.closest('.time-slot') && this.editMode) {
                    return; // Let edit mode handle this
                }
                
                // Allow Enter in paragraph elements, but blur for titles
                if (e.target.tagName === 'H1' || e.target.tagName === 'H2' || 
                    e.target.tagName === 'H3' || e.target.tagName === 'H4' || 
                    e.target.classList.contains('day-subtitle') ||
                    e.target.tagName === 'TH') {
                    e.preventDefault();
                    e.target.blur();
                }
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
        
        // Add save handlers for agenda items
        document.querySelectorAll('.time-slot .editable-field').forEach(field => {
            // Remove existing listeners to avoid duplicates
            field.removeEventListener('blur', this.agendaBlurHandler);
            field.removeEventListener('keydown', this.agendaKeydownHandler);
            
            // Add new listeners
            field.addEventListener('blur', this.agendaBlurHandler.bind(this));
            field.addEventListener('keydown', this.agendaKeydownHandler.bind(this));
        });
    }

    agendaBlurHandler(e) {
        this.saveData();
        this.showMessage('Agenda changes saved', 'success');
    }

    agendaKeydownHandler(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
        }
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
        
        // Remove event listeners
        document.querySelectorAll('.time-slot .editable-field').forEach(field => {
            field.removeEventListener('blur', this.agendaBlurHandler);
            field.removeEventListener('keydown', this.agendaKeydownHandler);
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

    addActivityType() {
        const name = prompt('Enter new activity type name (with emoji):');
        if (!name) return;

        const typeId = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (this.activityTypes[typeId]) {
            this.showMessage('Activity type already exists', 'error');
            return;
        }

        // Add new activity type with default color
        this.activityTypes[typeId] = {
            name: name,
            color: '#6C757D' // Default gray color
        };

        this.updateLegendDisplay();
        this.updateActivityTypeStyles();
        this.saveData();
        this.showMessage('New activity type added', 'success');
    }

    customizeLegend() {
        this.showMessage('Click on the 🎨 buttons next to each activity type to change colors, or edit the text directly!', 'success');
    }

    openColorPicker(activityType) {
        const modal = this.createColorPickerModal(activityType);
        document.body.appendChild(modal);
    }

    createColorPickerModal(activityType) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'color-picker-modal';
        
        const currentType = this.activityTypes[activityType];
        
        modal.innerHTML = `
            <h3>Choose Color for ${currentType.name}</h3>
            <div class="color-options">
                <div class="color-option" style="background: #4B9CD3" data-color="#4B9CD3"></div>
                <div class="color-option" style="background: #FF9900" data-color="#FF9900"></div>
                <div class="color-option" style="background: #8C4FFF" data-color="#8C4FFF"></div>
                <div class="color-option" style="background: #FF6B6B" data-color="#FF6B6B"></div>
                <div class="color-option" style="background: #4ECDC4" data-color="#4ECDC4"></div>
                <div class="color-option" style="background: #95E1D3" data-color="#95E1D3"></div>
                <div class="color-option" style="background: #FFA726" data-color="#FFA726"></div>
                <div class="color-option" style="background: #E74C3C" data-color="#E74C3C"></div>
                <div class="color-option" style="background: #9B59B6" data-color="#9B59B6"></div>
                <div class="color-option" style="background: #2ECC71" data-color="#2ECC71"></div>
                <div class="color-option" style="background: #F39C12" data-color="#F39C12"></div>
                <div class="color-option" style="background: #34495E" data-color="#34495E"></div>
            </div>
            <div class="modal-buttons">
                <button class="modal-btn secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="modal-btn primary" id="apply-color-btn">Apply</button>
            </div>
        `;

        let selectedColor = currentType.color;

        // Handle color selection
        modal.querySelectorAll('.color-option').forEach(option => {
            if (option.dataset.color === currentType.color) {
                option.classList.add('selected');
            }
            
            option.addEventListener('click', () => {
                modal.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedColor = option.dataset.color;
            });
        });

        // Handle apply button
        modal.querySelector('#apply-color-btn').addEventListener('click', () => {
            this.updateActivityTypeColor(activityType, selectedColor);
            overlay.remove();
        });

        // Handle overlay click to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        overlay.appendChild(modal);
        return overlay;
    }

    updateActivityTypeColor(activityType, newColor) {
        this.activityTypes[activityType].color = newColor;
        this.updateLegendDisplay();
        this.updateActivityTypeStyles();
        this.saveData();
        this.showMessage(`Color updated for ${this.activityTypes[activityType].name}`, 'success');
    }

    updateLegendDisplay() {
        const legendItems = document.getElementById('legendItems');
        if (!legendItems) return;

        legendItems.innerHTML = '';
        
        Object.keys(this.activityTypes).forEach(typeId => {
            const type = this.activityTypes[typeId];
            const item = document.createElement('span');
            item.className = `legend-item ${typeId}`;
            item.dataset.type = typeId;
            item.style.background = type.color;
            
            item.innerHTML = `
                <span class="legend-text" contenteditable="true">${type.name}</span>
                <button class="color-picker-btn" data-type="${typeId}">🎨</button>
            `;
            
            legendItems.appendChild(item);
        });
    }

    openActivityColorPicker(activityId, buttonElement) {
        console.log('Opening color picker for activity:', activityId); // Debug log
        
        const timeSlot = buttonElement.closest('.time-slot');
        if (!timeSlot) {
            console.error('Could not find time-slot element');
            return;
        }
        
        const activityTitle = timeSlot.querySelector('h4')?.textContent || 'Unknown Activity';
        console.log('Activity title:', activityTitle); // Debug log
        
        const modal = this.createActivityColorPickerModal(activityId, activityTitle, timeSlot);
        document.body.appendChild(modal);
        
        this.showMessage(`Opening color picker for "${activityTitle}"`, 'success');
    }

    createActivityColorPickerModal(activityId, activityTitle, timeSlot) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'color-picker-modal';
        
        const currentColor = this.individualActivityColors[activityId] || 
                           this.getDefaultColorForActivity(timeSlot);
        
        modal.innerHTML = `
            <h3>Choose Color for "${activityTitle}"</h3>
            <div class="color-options">
                <div class="color-option" style="background: #4B9CD3" data-color="#4B9CD3"></div>
                <div class="color-option" style="background: #FF9900" data-color="#FF9900"></div>
                <div class="color-option" style="background: #8C4FFF" data-color="#8C4FFF"></div>
                <div class="color-option" style="background: #FF6B6B" data-color="#FF6B6B"></div>
                <div class="color-option" style="background: #4ECDC4" data-color="#4ECDC4"></div>
                <div class="color-option" style="background: #95E1D3" data-color="#95E1D3"></div>
                <div class="color-option" style="background: #FFA726" data-color="#FFA726"></div>
                <div class="color-option" style="background: #E74C3C" data-color="#E74C3C"></div>
                <div class="color-option" style="background: #9B59B6" data-color="#9B59B6"></div>
                <div class="color-option" style="background: #2ECC71" data-color="#2ECC71"></div>
                <div class="color-option" style="background: #F39C12" data-color="#F39C12"></div>
                <div class="color-option" style="background: #34495E" data-color="#34495E"></div>
            </div>
            <div class="modal-buttons">
                <button class="modal-btn secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="modal-btn" style="background: #dc3545; color: white;" id="reset-color-btn">Reset to Default</button>
                <button class="modal-btn primary" id="apply-activity-color-btn">Apply</button>
            </div>
        `;

        let selectedColor = currentColor;

        // Handle color selection
        modal.querySelectorAll('.color-option').forEach(option => {
            if (option.dataset.color === currentColor) {
                option.classList.add('selected');
            }
            
            option.addEventListener('click', () => {
                modal.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedColor = option.dataset.color;
            });
        });

        // Handle apply button
        modal.querySelector('#apply-activity-color-btn').addEventListener('click', () => {
            this.updateIndividualActivityColor(activityId, selectedColor, timeSlot);
            overlay.remove();
        });

        // Handle reset button
        modal.querySelector('#reset-color-btn').addEventListener('click', () => {
            this.resetIndividualActivityColor(activityId, timeSlot);
            overlay.remove();
        });

        // Handle overlay click to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        overlay.appendChild(modal);
        return overlay;
    }

    getDefaultColorForActivity(timeSlot) {
        const category = timeSlot.dataset.category;
        return this.activityTypes[category]?.color || '#6C757D';
    }

    updateIndividualActivityColor(activityId, newColor, timeSlot) {
        this.individualActivityColors[activityId] = newColor;
        this.applyIndividualActivityColor(activityId, newColor, timeSlot);
        this.saveData();
        this.showMessage('Activity color updated successfully', 'success');
    }

    resetIndividualActivityColor(activityId, timeSlot) {
        delete this.individualActivityColors[activityId];
        const defaultColor = this.getDefaultColorForActivity(timeSlot);
        this.applyIndividualActivityColor(activityId, defaultColor, timeSlot);
        this.saveData();
        this.showMessage('Activity color reset to default', 'success');
    }

    applyIndividualActivityColor(activityId, color, timeSlot) {
        // Apply the color directly to the time slot
        timeSlot.style.borderLeftColor = color;
        timeSlot.style.borderLeftWidth = '4px';
        timeSlot.style.borderLeftStyle = 'solid';
    }

    updateActivityTypeStyles() {
        // Create or update dynamic styles for activity types
        let styleElement = document.getElementById('dynamic-activity-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'dynamic-activity-styles';
            document.head.appendChild(styleElement);
        }

        let css = '';
        Object.keys(this.activityTypes).forEach(typeId => {
            const color = this.activityTypes[typeId].color;
            css += `
                .legend-item.${typeId} { background: ${color} !important; }
                .time-slot.${typeId} { border-left: 4px solid ${color} !important; }
            `;
        });

        // Add individual activity colors
        Object.keys(this.individualActivityColors).forEach(activityId => {
            const color = this.individualActivityColors[activityId];
            css += `
                .time-slot[data-activity="${activityId}"] { border-left: 4px solid ${color} !important; }
            `;
        });

        styleElement.textContent = css;
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
            editableContent: this.getAllEditableContent(),
            activityTypes: this.activityTypes,
            individualActivityColors: this.individualActivityColors,
            lastModified: new Date().toISOString(),
            version: '1.0'
        };
        
        localStorage.setItem('emea-fto-offsite-data', JSON.stringify(data));
        this.updateLastModified();
    }

    getAllEditableContent() {
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        const content = {};
        
        editableElements.forEach((element, index) => {
            // Create a unique identifier for each editable element
            const id = element.id || `editable-${index}`;
            content[id] = {
                tagName: element.tagName,
                className: element.className,
                innerHTML: element.innerHTML,
                textContent: element.textContent
            };
        });
        
        return content;
    }

    loadData() {
        const saved = localStorage.getItem('emea-fto-offsite-data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.participants = data.participants || [];
                if (data.activityTypes) {
                    this.activityTypes = { ...this.activityTypes, ...data.activityTypes };
                }
                if (data.individualActivityColors) {
                    this.individualActivityColors = data.individualActivityColors;
                    // Apply individual colors after loading
                    setTimeout(() => this.applyLoadedIndividualColors(), 100);
                }
                // Load participants back to table if needed
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }

    applyLoadedIndividualColors() {
        Object.keys(this.individualActivityColors).forEach(activityId => {
            const color = this.individualActivityColors[activityId];
            const timeSlot = document.querySelector(`[data-activity="${activityId}"]`);
            if (timeSlot) {
                this.applyIndividualActivityColor(activityId, color, timeSlot);
            }
        });
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
