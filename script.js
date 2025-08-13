// EMEA FTO Offsite Website - Simplified Working Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully');
    
    // Initialize functionality
    initializeButtons();
    initializeColorPickers();
    initializeDragAndDrop();
    initializeAddActivityButtons();
    loadSavedData();
    
    // Auto-save every 30 seconds
    setInterval(saveAllData, 30000);
});

// Initialize all button functionality
function initializeButtons() {
    console.log('Initializing buttons...');
    
    // Edit Mode Button
    const editModeBtn = document.getElementById('edit-mode-btn');
    if (editModeBtn) {
        editModeBtn.addEventListener('click', toggleEditMode);
        console.log('Edit mode button initialized');
    }
    
    // Add Activity Button
    const addActivityBtn = document.getElementById('add-activity-btn');
    if (addActivityBtn) {
        addActivityBtn.addEventListener('click', showAddActivityModal);
        console.log('Add activity button initialized');
    }
    
    // Export Agenda Button
    const exportAgendaBtn = document.getElementById('export-agenda-btn');
    if (exportAgendaBtn) {
        exportAgendaBtn.addEventListener('click', exportAgenda);
        console.log('Export agenda button initialized');
    }
    
    // Color Mode Button
    const colorModeBtn = document.getElementById('color-mode-btn');
    if (colorModeBtn) {
        colorModeBtn.addEventListener('click', toggleColorMode);
        console.log('Color mode button initialized');
    }
    
    // Participant buttons
    const addParticipantBtn = document.getElementById('add-participant-btn');
    if (addParticipantBtn) {
        addParticipantBtn.addEventListener('click', addParticipant);
    }
    
    const exportParticipantsBtn = document.getElementById('export-participants-btn');
    if (exportParticipantsBtn) {
        exportParticipantsBtn.addEventListener('click', exportParticipants);
    }
    
    const saveDataBtn = document.getElementById('save-data-btn');
    if (saveDataBtn) {
        saveDataBtn.addEventListener('click', saveAllData);
    }
}

// Global variables
let editMode = false;
let colorMode = false;
let draggedElement = null;

// Toggle Edit Mode
function toggleEditMode() {
    editMode = !editMode;
    const btn = document.getElementById('edit-mode-btn');
    
    if (editMode) {
        btn.textContent = '✅ Exit Edit';
        btn.style.background = '#dc3545';
        enableEditing();
        showMessage('Edit mode enabled. Click on any text to edit it.', 'success');
    } else {
        btn.textContent = '✏️ Edit Mode';
        btn.style.background = '#FF9900';
        disableEditing();
        showMessage('Edit mode disabled.', 'success');
    }
}

// Enable editing for all agenda items
function enableEditing() {
    // Make all agenda text editable
    document.querySelectorAll('.time-slot .time, .time-slot h4, .time-slot p').forEach(element => {
        element.contentEditable = true;
        element.classList.add('editable-active');
        element.addEventListener('blur', saveAllData);
    });
    
    // Add visual indicators
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.add('edit-mode-active');
    });
}

// Disable editing
function disableEditing() {
    document.querySelectorAll('.time-slot .time, .time-slot h4, .time-slot p').forEach(element => {
        element.contentEditable = false;
        element.classList.remove('editable-active');
        element.removeEventListener('blur', saveAllData);
    });
    
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('edit-mode-active');
    });
}

// Toggle Color Mode
function toggleColorMode() {
    colorMode = !colorMode;
    const btn = document.getElementById('color-mode-btn');
    
    if (colorMode) {
        btn.textContent = '🎨 Exit Color';
        btn.style.background = '#8C4FFF';
        showColorPickers();
        showMessage('Color mode enabled. Click on activities to change colors.', 'success');
    } else {
        btn.textContent = '🎨 Color Mode';
        btn.style.background = '#FF9900';
        hideColorPickers();
        showMessage('Color mode disabled.', 'success');
    }
}

// Show color picker buttons
function showColorPickers() {
    document.querySelectorAll('.time-slot').forEach(slot => {
        if (!slot.querySelector('.color-picker-btn-inline')) {
            const colorBtn = document.createElement('button');
            colorBtn.className = 'color-picker-btn-inline';
            colorBtn.innerHTML = '🎨';
            colorBtn.onclick = (e) => {
                e.stopPropagation();
                openColorPickerForActivity(slot);
            };
            slot.appendChild(colorBtn);
        }
    });
}

// Hide color picker buttons
function hideColorPickers() {
    document.querySelectorAll('.color-picker-btn-inline').forEach(btn => {
        btn.remove();
    });
}

// Open color picker for specific activity
function openColorPickerForActivity(timeSlot) {
    const activityTitle = timeSlot.querySelector('h4')?.textContent || 'Activity';
    
    const colors = [
        '#4B9CD3', '#FF9900', '#8C4FFF', '#FF6B6B', 
        '#4ECDC4', '#95E1D3', '#FFA726', '#E74C3C',
        '#9B59B6', '#2ECC71', '#F39C12', '#34495E'
    ];
    
    const modal = document.createElement('div');
    modal.className = 'color-modal';
    modal.innerHTML = `
        <div class="color-modal-content">
            <h3>Choose color for "${activityTitle}"</h3>
            <div class="color-grid">
                ${colors.map(color => `
                    <div class="color-option" style="background: ${color}" onclick="applyColor('${color}', this)"></div>
                `).join('')}
            </div>
            <div class="modal-buttons">
                <button onclick="closeColorModal()" class="btn-secondary">Cancel</button>
                <button onclick="resetActivityColor()" class="btn-danger">Reset</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Store reference to current time slot
    window.currentTimeSlot = timeSlot;
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeColorModal();
        }
    });
}

// Apply color to activity
function applyColor(color, element) {
    if (window.currentTimeSlot) {
        window.currentTimeSlot.style.borderLeftColor = color;
        window.currentTimeSlot.style.borderLeftWidth = '6px';
        window.currentTimeSlot.style.borderLeftStyle = 'solid';
        
        // Save the color
        const activityId = window.currentTimeSlot.dataset.activity || generateActivityId();
        window.currentTimeSlot.dataset.activity = activityId;
        
        saveActivityColor(activityId, color);
        showMessage('Color applied successfully!', 'success');
    }
    closeColorModal();
}

// Reset activity color
function resetActivityColor() {
    if (window.currentTimeSlot) {
        window.currentTimeSlot.style.borderLeftColor = '';
        window.currentTimeSlot.style.borderLeftWidth = '';
        window.currentTimeSlot.style.borderLeftStyle = '';
        
        const activityId = window.currentTimeSlot.dataset.activity;
        if (activityId) {
            removeActivityColor(activityId);
        }
        showMessage('Color reset to default!', 'success');
    }
    closeColorModal();
}

// Close color modal
function closeColorModal() {
    const modal = document.querySelector('.color-modal');
    if (modal) {
        modal.remove();
    }
    window.currentTimeSlot = null;
}

// Initialize color pickers for legend
function initializeColorPickers() {
    // Add color picker functionality to legend items
    document.querySelectorAll('.legend-item').forEach(item => {
        const colorBtn = document.createElement('button');
        colorBtn.className = 'legend-color-btn';
        colorBtn.innerHTML = '🎨';
        colorBtn.onclick = (e) => {
            e.stopPropagation();
            openLegendColorPicker(item);
        };
        item.appendChild(colorBtn);
    });
}

// Open color picker for legend items
function openLegendColorPicker(legendItem) {
    const typeName = legendItem.querySelector('.legend-text')?.textContent || 'Activity Type';
    const typeClass = legendItem.className.split(' ').find(cls => cls !== 'legend-item');
    
    const colors = [
        '#4B9CD3', '#FF9900', '#8C4FFF', '#FF6B6B', 
        '#4ECDC4', '#95E1D3', '#FFA726', '#E74C3C',
        '#9B59B6', '#2ECC71', '#F39C12', '#34495E'
    ];
    
    const modal = document.createElement('div');
    modal.className = 'color-modal';
    modal.innerHTML = `
        <div class="color-modal-content">
            <h3>Choose color for "${typeName}"</h3>
            <div class="color-grid">
                ${colors.map(color => `
                    <div class="color-option" style="background: ${color}" onclick="applyLegendColor('${color}', '${typeClass}')"></div>
                `).join('')}
            </div>
            <div class="modal-buttons">
                <button onclick="closeColorModal()" class="btn-secondary">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeColorModal();
        }
    });
}

// Apply color to legend and all activities of that type
function applyLegendColor(color, typeClass) {
    // Update legend item
    const legendItem = document.querySelector(`.legend-item.${typeClass}`);
    if (legendItem) {
        legendItem.style.background = color;
    }
    
    // Update all time slots of this type
    document.querySelectorAll(`.time-slot.${typeClass}`).forEach(slot => {
        slot.style.borderLeftColor = color;
        slot.style.borderLeftWidth = '4px';
        slot.style.borderLeftStyle = 'solid';
    });
    
    saveLegendColor(typeClass, color);
    showMessage(`Color updated for ${typeClass} activities!`, 'success');
    closeColorModal();
}

// Initialize drag and drop for reordering
function initializeDragAndDrop() {
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.draggable = true;
        slot.addEventListener('dragstart', handleDragStart);
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('drop', handleDrop);
        slot.addEventListener('dragend', handleDragEnd);
    });
}

// Drag and drop handlers
function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const parent = this.parentNode;
        const draggedIndex = Array.from(parent.children).indexOf(draggedElement);
        const targetIndex = Array.from(parent.children).indexOf(this);
        
        if (draggedIndex < targetIndex) {
            parent.insertBefore(draggedElement, this.nextSibling);
        } else {
            parent.insertBefore(draggedElement, this);
        }
        
        saveAllData();
        showMessage('Activity order updated!', 'success');
    }
    
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    draggedElement = null;
}

// Initialize + buttons for adding activities to each day
function initializeAddActivityButtons() {
    document.querySelectorAll('.day-column').forEach(dayColumn => {
        const addBtn = document.createElement('button');
        addBtn.className = 'add-activity-day-btn';
        addBtn.innerHTML = '➕ Add Activity';
        addBtn.onclick = () => addActivityToDay(dayColumn);
        
        // Insert before the first time-slot or at the end
        const firstTimeSlot = dayColumn.querySelector('.time-slot');
        if (firstTimeSlot) {
            dayColumn.insertBefore(addBtn, firstTimeSlot);
        } else {
            dayColumn.appendChild(addBtn);
        }
    });
}

// Add activity to specific day
function addActivityToDay(dayColumn) {
    const dayTitle = dayColumn.querySelector('h3')?.textContent || 'Unknown Day';
    
    const modal = document.createElement('div');
    modal.className = 'add-activity-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add Activity to ${dayTitle}</h3>
            <form id="addActivityForm">
                <div class="form-group">
                    <label>Activity Title:</label>
                    <input type="text" id="activityTitle" required>
                </div>
                <div class="form-group">
                    <label>Time:</label>
                    <input type="text" id="activityTime" placeholder="e.g., 9:00 AM - 10:00 AM" required>
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <textarea id="activityDescription" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Activity Type:</label>
                    <select id="activityType">
                        <option value="meeting">🏢 Meeting</option>
                        <option value="workshop">🛠️ Workshop</option>
                        <option value="demo">💻 Demo</option>
                        <option value="social">🍽️ Social</option>
                        <option value="break">☕ Break</option>
                        <option value="free">🆓 Free Time</option>
                    </select>
                </div>
                <div class="modal-buttons">
                    <button type="button" onclick="closeAddActivityModal()" class="btn-secondary">Cancel</button>
                    <button type="submit" class="btn-primary">Add Activity</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('addActivityForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('activityTitle').value;
        const time = document.getElementById('activityTime').value;
        const description = document.getElementById('activityDescription').value;
        const type = document.getElementById('activityType').value;
        
        createNewActivity(dayColumn, title, time, description, type);
        closeAddActivityModal();
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAddActivityModal();
        }
    });
}

// Create new activity element
function createNewActivity(dayColumn, title, time, description, type) {
    const newActivity = document.createElement('div');
    newActivity.className = `time-slot ${type}`;
    newActivity.draggable = true;
    newActivity.dataset.activity = generateActivityId();
    
    newActivity.innerHTML = `
        <div class="time">${time}</div>
        <div class="session">
            <h4>${title}</h4>
            ${description ? `<p>${description}</p>` : ''}
        </div>
    `;
    
    // Add event listeners
    newActivity.addEventListener('dragstart', handleDragStart);
    newActivity.addEventListener('dragover', handleDragOver);
    newActivity.addEventListener('drop', handleDrop);
    newActivity.addEventListener('dragend', handleDragEnd);
    
    // Insert before the add button
    const addBtn = dayColumn.querySelector('.add-activity-day-btn');
    dayColumn.insertBefore(newActivity, addBtn.nextSibling);
    
    saveAllData();
    showMessage(`Activity "${title}" added successfully!`, 'success');
}

// Close add activity modal
function closeAddActivityModal() {
    const modal = document.querySelector('.add-activity-modal');
    if (modal) {
        modal.remove();
    }
}

// Show add activity modal (for main button)
function showAddActivityModal() {
    const modal = document.createElement('div');
    modal.className = 'add-activity-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add New Activity</h3>
            <p>Choose a day to add your activity:</p>
            <div class="day-selection">
                <button onclick="selectDay('October 14th')" class="day-btn">October 14th</button>
                <button onclick="selectDay('October 15th')" class="day-btn">October 15th</button>
                <button onclick="selectDay('October 16th')" class="day-btn">October 16th</button>
                <button onclick="selectDay('October 17th')" class="day-btn">October 17th</button>
            </div>
            <div class="modal-buttons">
                <button onclick="closeAddActivityModal()" class="btn-secondary">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAddActivityModal();
        }
    });
}

// Select day for new activity
function selectDay(dayName) {
    closeAddActivityModal();
    
    const dayColumn = Array.from(document.querySelectorAll('.day-column')).find(col => 
        col.querySelector('h3')?.textContent.includes(dayName.split(' ')[1])
    );
    
    if (dayColumn) {
        addActivityToDay(dayColumn);
    }
}

// Utility functions
function generateActivityId() {
    return 'activity-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function showMessage(text, type = 'success') {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at top of main content
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(message, main.firstChild);
    }
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Export functions
function exportAgenda() {
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

    downloadFile(agenda, 'emea-fto-agenda.txt', 'text/plain');
    showMessage('Agenda exported successfully!', 'success');
}

function addParticipant() {
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
    
    // Focus on the first cell
    const firstCell = newRow.querySelector('td[contenteditable="true"]');
    if (firstCell) {
        firstCell.focus();
        firstCell.select();
    }
    
    saveAllData();
    showMessage('New participant added', 'success');
}

function exportParticipants() {
    const table = document.getElementById('participantsTable');
    if (!table) return;

    let csv = 'Participant,Dietary Restrictions,Arrival Time,Departure Time,Hotel\n';
    
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            const rowData = [
                escapeCsv(cells[0].textContent),
                escapeCsv(cells[1].textContent),
                escapeCsv(cells[2].textContent),
                escapeCsv(cells[3].textContent),
                escapeCsv(cells[4].textContent)
            ];
            csv += rowData.join(',') + '\n';
        }
    });

    downloadFile(csv, 'emea-fto-participants.csv', 'text/csv');
    showMessage('Participants exported successfully', 'success');
}

function deleteParticipant(button) {
    if (confirm('Are you sure you want to remove this participant?')) {
        const row = button.closest('tr');
        row.remove();
        saveAllData();
        showMessage('Participant removed', 'success');
    }
}

// Save and load functions
function saveAllData() {
    const data = {
        agenda: getAgendaData(),
        participants: getParticipantsData(),
        colors: getColorData(),
        lastModified: new Date().toISOString()
    };
    
    localStorage.setItem('emea-fto-offsite-data', JSON.stringify(data));
    console.log('Data saved successfully');
}

function loadSavedData() {
    const saved = localStorage.getItem('emea-fto-offsite-data');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.colors) {
                loadColorData(data.colors);
            }
            console.log('Data loaded successfully');
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

function getAgendaData() {
    const agenda = {};
    document.querySelectorAll('.day-column').forEach((dayCol, index) => {
        const dayTitle = dayCol.querySelector('h3')?.textContent || `Day ${index + 1}`;
        const activities = [];
        
        dayCol.querySelectorAll('.time-slot').forEach(slot => {
            activities.push({
                time: slot.querySelector('.time')?.textContent || '',
                title: slot.querySelector('h4')?.textContent || '',
                description: slot.querySelector('p')?.textContent || '',
                type: slot.className.split(' ').find(cls => cls !== 'time-slot') || 'meeting',
                id: slot.dataset.activity || generateActivityId()
            });
        });
        
        agenda[dayTitle] = activities;
    });
    
    return agenda;
}

function getParticipantsData() {
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

function getColorData() {
    const colors = {
        activities: {},
        legend: {}
    };
    
    // Save individual activity colors
    document.querySelectorAll('.time-slot[data-activity]').forEach(slot => {
        const id = slot.dataset.activity;
        const color = slot.style.borderLeftColor;
        if (color) {
            colors.activities[id] = color;
        }
    });
    
    // Save legend colors
    document.querySelectorAll('.legend-item').forEach(item => {
        const typeClass = item.className.split(' ').find(cls => cls !== 'legend-item');
        const color = item.style.background;
        if (color && typeClass) {
            colors.legend[typeClass] = color;
        }
    });
    
    return colors;
}

function loadColorData(colors) {
    // Load individual activity colors
    if (colors.activities) {
        Object.keys(colors.activities).forEach(activityId => {
            const slot = document.querySelector(`[data-activity="${activityId}"]`);
            if (slot) {
                slot.style.borderLeftColor = colors.activities[activityId];
                slot.style.borderLeftWidth = '6px';
                slot.style.borderLeftStyle = 'solid';
            }
        });
    }
    
    // Load legend colors
    if (colors.legend) {
        Object.keys(colors.legend).forEach(typeClass => {
            const legendItem = document.querySelector(`.legend-item.${typeClass}`);
            if (legendItem) {
                legendItem.style.background = colors.legend[typeClass];
            }
            
            // Apply to all activities of this type
            document.querySelectorAll(`.time-slot.${typeClass}`).forEach(slot => {
                if (!slot.dataset.activity || !colors.activities[slot.dataset.activity]) {
                    slot.style.borderLeftColor = colors.legend[typeClass];
                    slot.style.borderLeftWidth = '4px';
                    slot.style.borderLeftStyle = 'solid';
                }
            });
        });
    }
}

function saveActivityColor(activityId, color) {
    const data = JSON.parse(localStorage.getItem('emea-fto-offsite-data') || '{}');
    if (!data.colors) data.colors = { activities: {}, legend: {} };
    data.colors.activities[activityId] = color;
    localStorage.setItem('emea-fto-offsite-data', JSON.stringify(data));
}

function removeActivityColor(activityId) {
    const data = JSON.parse(localStorage.getItem('emea-fto-offsite-data') || '{}');
    if (data.colors && data.colors.activities) {
        delete data.colors.activities[activityId];
        localStorage.setItem('emea-fto-offsite-data', JSON.stringify(data));
    }
}

function saveLegendColor(typeClass, color) {
    const data = JSON.parse(localStorage.getItem('emea-fto-offsite-data') || '{}');
    if (!data.colors) data.colors = { activities: {}, legend: {} };
    data.colors.legend[typeClass] = color;
    localStorage.setItem('emea-fto-offsite-data', JSON.stringify(data));
}

// Utility functions
function downloadFile(content, filename, mimeType) {
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

function escapeCsv(text) {
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
        return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
}

// Make functions globally available
window.deleteParticipant = deleteParticipant;
window.applyColor = applyColor;
window.resetActivityColor = resetActivityColor;
window.closeColorModal = closeColorModal;
window.applyLegendColor = applyLegendColor;
window.closeAddActivityModal = closeAddActivityModal;
window.selectDay = selectDay;

console.log('All functionality initialized successfully!');
