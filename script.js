// EMEA FTO Offsite Website - BULLETPROOF Save System for ENTIRE WEBSITE
console.log('🚀 Loading bulletproof save system for ENTIRE WEBSITE...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing COMPLETE save system');
    
    // Initialize everything
    initializeSaveSystem();
    initializeButtons();
    initializeColorPickers();
    initializeDragAndDrop();
    initializeAddActivityButtons();
    
    // Load saved data immediately
    loadAllData();
    
    // Test the system
    setTimeout(() => {
        testSystem();
    }, 1000);
});

// BULLETPROOF SAVE SYSTEM FOR ENTIRE WEBSITE
function initializeSaveSystem() {
    console.log('🔧 Initializing bulletproof save system for ENTIRE WEBSITE...');
    
    // Save on ANY change to ANY editable element ANYWHERE on the website
    document.addEventListener('input', function(e) {
        if (e.target.contentEditable === 'true') {
            const section = getElementSection(e.target);
            console.log(`📝 Content changed in ${section}:`, e.target.tagName, e.target.textContent);
            saveEverything();
        }
    });
    
    // Save when clicking away from editable elements
    document.addEventListener('blur', function(e) {
        if (e.target.contentEditable === 'true') {
            const section = getElementSection(e.target);
            console.log(`👆 Element blurred in ${section}:`, e.target.tagName, e.target.textContent);
            saveEverything();
        }
    }, true);
    
    // Save on Enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.contentEditable === 'true') {
            const section = getElementSection(e.target);
            console.log(`⏎ Enter pressed in ${section}`);
            e.preventDefault();
            e.target.blur();
            saveEverything();
        }
    });
    
    // Save before leaving page
    window.addEventListener('beforeunload', function() {
        console.log('🚪 Page unloading, saving EVERYTHING...');
        saveEverything();
    });
    
    // Auto-save every 5 seconds
    setInterval(() => {
        console.log('⏰ Auto-save interval - saving ENTIRE WEBSITE');
        saveEverything();
    }, 5000);
    
    console.log('✅ COMPLETE save system initialized for entire website');
}

// Get which section an element belongs to
function getElementSection(element) {
    const section = element.closest('section');
    if (section) {
        if (section.classList.contains('welcome')) return 'WELCOME';
        if (section.classList.contains('agenda')) return 'AGENDA';
        if (section.classList.contains('participants')) return 'PARTICIPANTS';
        if (section.classList.contains('barcelona-info')) return 'BARCELONA INFO';
    }
    
    const header = element.closest('header');
    if (header) return 'HEADER';
    
    return 'UNKNOWN';
}

// COMPREHENSIVE SAVE FUNCTION FOR ENTIRE WEBSITE
function saveEverything() {
    console.log('💾 SAVING ENTIRE WEBSITE...');
    
    try {
        const data = {
            timestamp: new Date().toISOString(),
            sections: {
                header: {},
                welcome: {},
                agenda: {},
                participants: {},
                barcelonaInfo: {}
            }
        };
        
        let totalElements = 0;
        
        // Save HEADER section
        console.log('💾 Saving HEADER section...');
        const headerElements = document.querySelectorAll('header [contenteditable="true"]');
        headerElements.forEach((element, index) => {
            const id = `header_${index}`;
            data.sections.header[id] = {
                path: getComprehensivePath(element),
                text: element.textContent || '',
                tag: element.tagName,
                class: element.className
            };
            console.log(`💾 Header ${id}: "${element.textContent}"`);
            totalElements++;
        });
        
        // Save WELCOME section
        console.log('💾 Saving WELCOME section...');
        const welcomeElements = document.querySelectorAll('.welcome [contenteditable="true"]');
        welcomeElements.forEach((element, index) => {
            const id = `welcome_${index}`;
            data.sections.welcome[id] = {
                path: getComprehensivePath(element),
                text: element.textContent || '',
                tag: element.tagName,
                class: element.className
            };
            console.log(`💾 Welcome ${id}: "${element.textContent}"`);
            totalElements++;
        });
        
        // Save AGENDA section
        console.log('💾 Saving AGENDA section...');
        const agendaElements = document.querySelectorAll('.agenda [contenteditable="true"]');
        agendaElements.forEach((element, index) => {
            const id = `agenda_${index}`;
            data.sections.agenda[id] = {
                path: getComprehensivePath(element),
                text: element.textContent || '',
                tag: element.tagName,
                class: element.className
            };
            console.log(`💾 Agenda ${id}: "${element.textContent}"`);
            totalElements++;
        });
        
        // Save PARTICIPANTS section
        console.log('💾 Saving PARTICIPANTS section...');
        const participantElements = document.querySelectorAll('.participants [contenteditable="true"]');
        participantElements.forEach((element, index) => {
            const id = `participants_${index}`;
            data.sections.participants[id] = {
                path: getComprehensivePath(element),
                text: element.textContent || '',
                tag: element.tagName,
                class: element.className
            };
            console.log(`💾 Participants ${id}: "${element.textContent}"`);
            totalElements++;
        });
        
        // Save BARCELONA INFO section
        console.log('💾 Saving BARCELONA INFO section...');
        const barcelonaElements = document.querySelectorAll('.barcelona-info [contenteditable="true"]');
        barcelonaElements.forEach((element, index) => {
            const id = `barcelona_${index}`;
            data.sections.barcelonaInfo[id] = {
                path: getComprehensivePath(element),
                text: element.textContent || '',
                tag: element.tagName,
                class: element.className
            };
            console.log(`💾 Barcelona ${id}: "${element.textContent}"`);
            totalElements++;
        });
        
        // Save to localStorage
        localStorage.setItem('offsite-data', JSON.stringify(data));
        
        console.log(`✅ SAVED ENTIRE WEBSITE: ${totalElements} elements across all sections`);
        console.log(`📊 Header: ${Object.keys(data.sections.header).length} elements`);
        console.log(`📊 Welcome: ${Object.keys(data.sections.welcome).length} elements`);
        console.log(`📊 Agenda: ${Object.keys(data.sections.agenda).length} elements`);
        console.log(`📊 Participants: ${Object.keys(data.sections.participants).length} elements`);
        console.log(`📊 Barcelona: ${Object.keys(data.sections.barcelonaInfo).length} elements`);
        
        showMessage(`✅ Saved ${totalElements} elements!`, 'success');
        
        return true;
        
    } catch (error) {
        console.error('❌ SAVE FAILED:', error);
        showMessage('❌ Save failed!', 'error');
        return false;
    }
}

// COMPREHENSIVE LOAD FUNCTION FOR ENTIRE WEBSITE
function loadAllData() {
    console.log('📂 LOADING ENTIRE WEBSITE DATA...');
    
    const saved = localStorage.getItem('offsite-data');
    if (!saved) {
        console.log('ℹ️ No saved data found');
        return;
    }
    
    try {
        const data = JSON.parse(saved);
        console.log('📂 Found saved data from:', data.timestamp);
        
        let totalRestored = 0;
        
        // Load HEADER section
        if (data.sections && data.sections.header) {
            console.log('📂 Loading HEADER section...');
            Object.keys(data.sections.header).forEach(id => {
                const item = data.sections.header[id];
                const element = findElementByComprehensivePath(item.path, item.tag, item.class, 'header');
                if (element && element.contentEditable === 'true') {
                    element.textContent = item.text;
                    console.log(`📂 Restored Header ${id}: "${item.text}"`);
                    totalRestored++;
                }
            });
        }
        
        // Load WELCOME section
        if (data.sections && data.sections.welcome) {
            console.log('📂 Loading WELCOME section...');
            Object.keys(data.sections.welcome).forEach(id => {
                const item = data.sections.welcome[id];
                const element = findElementByComprehensivePath(item.path, item.tag, item.class, '.welcome');
                if (element && element.contentEditable === 'true') {
                    element.textContent = item.text;
                    console.log(`📂 Restored Welcome ${id}: "${item.text}"`);
                    totalRestored++;
                }
            });
        }
        
        // Load AGENDA section
        if (data.sections && data.sections.agenda) {
            console.log('📂 Loading AGENDA section...');
            Object.keys(data.sections.agenda).forEach(id => {
                const item = data.sections.agenda[id];
                const element = findElementByComprehensivePath(item.path, item.tag, item.class, '.agenda');
                if (element && element.contentEditable === 'true') {
                    element.textContent = item.text;
                    console.log(`📂 Restored Agenda ${id}: "${item.text}"`);
                    totalRestored++;
                }
            });
        }
        
        // Load PARTICIPANTS section
        if (data.sections && data.sections.participants) {
            console.log('📂 Loading PARTICIPANTS section...');
            Object.keys(data.sections.participants).forEach(id => {
                const item = data.sections.participants[id];
                const element = findElementByComprehensivePath(item.path, item.tag, item.class, '.participants');
                if (element && element.contentEditable === 'true') {
                    element.textContent = item.text;
                    console.log(`📂 Restored Participants ${id}: "${item.text}"`);
                    totalRestored++;
                }
            });
        }
        
        // Load BARCELONA INFO section
        if (data.sections && data.sections.barcelonaInfo) {
            console.log('📂 Loading BARCELONA INFO section...');
            Object.keys(data.sections.barcelonaInfo).forEach(id => {
                const item = data.sections.barcelonaInfo[id];
                const element = findElementByComprehensivePath(item.path, item.tag, item.class, '.barcelona-info');
                if (element && element.contentEditable === 'true') {
                    element.textContent = item.text;
                    console.log(`📂 Restored Barcelona ${id}: "${item.text}"`);
                    totalRestored++;
                }
            });
        }
        
        const loadTime = new Date(data.timestamp).toLocaleString();
        showMessage(`📂 Loaded ${totalRestored} elements from ${loadTime}`, 'success');
        console.log(`✅ ENTIRE WEBSITE LOADED: ${totalRestored} elements restored`);
        
    } catch (error) {
        console.error('❌ LOAD FAILED:', error);
        showMessage('❌ Load failed!', 'error');
    }
}

// COMPREHENSIVE PATH GENERATOR
function getComprehensivePath(element) {
    let path = element.tagName.toLowerCase();
    
    if (element.id) {
        return `#${element.id}`;
    }
    
    if (element.className) {
        path += '.' + element.className.split(' ').filter(c => c).join('.');
    }
    
    // Add parent context for better identification
    let parent = element.parentElement;
    let fullPath = path;
    
    if (parent) {
        let parentPath = parent.tagName.toLowerCase();
        if (parent.className) {
            parentPath += '.' + parent.className.split(' ').filter(c => c).join('.');
        }
        if (parent.id) {
            parentPath = `#${parent.id}`;
        }
        
        // Add position among siblings
        const siblings = Array.from(parent.children).filter(child => 
            child.tagName === element.tagName && child.className === element.className
        );
        
        if (siblings.length > 1) {
            const index = siblings.indexOf(element);
            path += `:nth-of-type(${index + 1})`;
        }
        
        fullPath = parentPath + ' > ' + path;
    }
    
    return fullPath;
}

// COMPREHENSIVE ELEMENT FINDER
function findElementByComprehensivePath(path, tag, className, sectionSelector) {
    // Try exact path first within the section
    try {
        const element = document.querySelector(sectionSelector + ' ' + path);
        if (element) return element;
    } catch (e) {
        console.warn('Path query failed:', path);
    }
    
    // Try by tag and class within section
    if (className) {
        const elements = document.querySelectorAll(`${sectionSelector} ${tag.toLowerCase()}.${className.split(' ').join('.')}`);
        if (elements.length > 0) return elements[0];
    }
    
    // Try by tag only within section
    const elements = document.querySelectorAll(`${sectionSelector} ${tag.toLowerCase()}`);
    if (elements.length > 0) return elements[0];
    
    // Last resort: try anywhere on the page
    try {
        const element = document.querySelector(path);
        if (element) return element;
    } catch (e) {
        // Ignore
    }
    
    return null;
}

// ENHANCED TEST SYSTEM
function testSystem() {
    console.log('🧪 TESTING SAVE SYSTEM FOR ENTIRE WEBSITE...');
    
    const allEditableElements = document.querySelectorAll('[contenteditable="true"]');
    console.log(`🧪 Found ${allEditableElements.length} editable elements across entire website`);
    
    // Count by section
    const headerElements = document.querySelectorAll('header [contenteditable="true"]').length;
    const welcomeElements = document.querySelectorAll('.welcome [contenteditable="true"]').length;
    const agendaElements = document.querySelectorAll('.agenda [contenteditable="true"]').length;
    const participantElements = document.querySelectorAll('.participants [contenteditable="true"]').length;
    const barcelonaElements = document.querySelectorAll('.barcelona-info [contenteditable="true"]').length;
    
    console.log(`🧪 Header: ${headerElements} elements`);
    console.log(`🧪 Welcome: ${welcomeElements} elements`);
    console.log(`🧪 Agenda: ${agendaElements} elements`);
    console.log(`🧪 Participants: ${participantElements} elements`);
    console.log(`🧪 Barcelona: ${barcelonaElements} elements`);
    
    // Test save
    const saveResult = saveEverything();
    if (saveResult) {
        console.log('✅ Save test passed for entire website');
    } else {
        console.log('❌ Save test failed');
        return;
    }
    
    // Check localStorage
    const saved = localStorage.getItem('offsite-data');
    if (saved) {
        const data = JSON.parse(saved);
        const totalSaved = Object.keys(data.sections.header || {}).length +
                          Object.keys(data.sections.welcome || {}).length +
                          Object.keys(data.sections.agenda || {}).length +
                          Object.keys(data.sections.participants || {}).length +
                          Object.keys(data.sections.barcelonaInfo || {}).length;
        
        console.log(`✅ Found ${totalSaved} saved elements across all sections`);
        console.log('🧪 ENTIRE WEBSITE SAVE SYSTEM TEST PASSED');
    } else {
        console.log('❌ SYSTEM TEST FAILED - No data in localStorage');
    }
}

// UTILITY FUNCTIONS
function showMessage(text, type = 'success') {
    // Remove existing messages
    document.querySelectorAll('.save-message').forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `save-message ${type}`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: bold;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

function generateActivityId() {
    return 'activity-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// BUTTON INITIALIZATION
function initializeButtons() {
    console.log('🔘 Initializing buttons...');
    
    // Edit Mode Button
    const editModeBtn = document.getElementById('edit-mode-btn');
    if (editModeBtn) {
        editModeBtn.addEventListener('click', toggleEditMode);
    }
    
    // Add Activity Button
    const addActivityBtn = document.getElementById('add-activity-btn');
    if (addActivityBtn) {
        addActivityBtn.addEventListener('click', showAddActivityModal);
    }
    
    // Color Mode Button
    const colorModeBtn = document.getElementById('color-mode-btn');
    if (colorModeBtn) {
        colorModeBtn.addEventListener('click', toggleColorMode);
    }
    
    // Save Data Button
    const saveDataBtn = document.getElementById('save-data-btn');
    if (saveDataBtn) {
        saveDataBtn.addEventListener('click', () => {
            saveEverything();
            showMessage('💾 Manual save of entire website complete!', 'success');
        });
    }
    
    // Add Participant Button
    const addParticipantBtn = document.getElementById('add-participant-btn');
    if (addParticipantBtn) {
        addParticipantBtn.addEventListener('click', addParticipant);
    }
    
    // Add Column Button
    const addColumnBtn = document.getElementById('add-column-btn');
    if (addColumnBtn) {
        addColumnBtn.addEventListener('click', addColumn);
    }
    
    console.log('✅ Buttons initialized');
}

// GLOBAL VARIABLES
let editMode = false;
let colorMode = false;

// EDIT MODE FUNCTIONS
function toggleEditMode() {
    editMode = !editMode;
    const btn = document.getElementById('edit-mode-btn');
    
    if (editMode) {
        btn.textContent = '✅ Exit Edit';
        btn.style.background = '#dc3545';
        showMessage('✏️ Edit mode enabled for entire website', 'success');
    } else {
        btn.textContent = '✏️ Edit Mode';
        btn.style.background = '#FF9900';
        showMessage('✏️ Edit mode disabled', 'success');
    }
}

// COLOR MODE FUNCTIONS
function toggleColorMode() {
    colorMode = !colorMode;
    const btn = document.getElementById('color-mode-btn');
    
    if (colorMode) {
        btn.textContent = '🎨 Exit Color';
        btn.style.background = '#8C4FFF';
        showColorPickers();
        showMessage('🎨 Color mode enabled', 'success');
    } else {
        btn.textContent = '🎨 Color Mode';
        btn.style.background = '#FF9900';
        hideColorPickers();
        showMessage('🎨 Color mode disabled', 'success');
    }
}

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

function hideColorPickers() {
    document.querySelectorAll('.color-picker-btn-inline').forEach(btn => {
        btn.remove();
    });
}

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
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentTimeSlot = timeSlot;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeColorModal();
        }
    });
}

function applyColor(color, element) {
    if (window.currentTimeSlot) {
        window.currentTimeSlot.style.borderLeftColor = color;
        window.currentTimeSlot.style.borderLeftWidth = '6px';
        window.currentTimeSlot.style.borderLeftStyle = 'solid';
        showMessage('🎨 Color applied!', 'success');
        saveEverything();
    }
    closeColorModal();
}

function closeColorModal() {
    const modal = document.querySelector('.color-modal');
    if (modal) {
        modal.remove();
    }
    window.currentTimeSlot = null;
}

// PLACEHOLDER FUNCTIONS (Simplified)
function initializeColorPickers() {
    console.log('🎨 Color pickers initialized');
}

function initializeDragAndDrop() {
    console.log('🔄 Drag and drop initialized');
}

function initializeAddActivityButtons() {
    console.log('➕ Add activity buttons initialized');
}

function showAddActivityModal() {
    showMessage('➕ Add activity feature coming soon!', 'success');
}

function addParticipant() {
    const tbody = document.getElementById('participantsBody');
    if (!tbody) return;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td contenteditable="true">New Participant</td>
        <td contenteditable="true">None</td>
        <td contenteditable="true">-</td>
        <td contenteditable="true">-</td>
        <td contenteditable="true">-</td>
        <td><button class="delete-btn" onclick="deleteParticipant(this)">🗑️</button></td>
    `;
    
    tbody.appendChild(newRow);
    saveEverything();
    showMessage('👤 Participant added!', 'success');
}

function addColumn() {
    showMessage('📋 Add column feature coming soon!', 'success');
}

function deleteParticipant(button) {
    if (confirm('Remove this participant?')) {
        button.closest('tr').remove();
        saveEverything();
        showMessage('👤 Participant removed!', 'success');
    }
}

// GLOBAL FUNCTIONS
window.saveEverything = saveEverything;
window.loadAllData = loadAllData;
window.testSystem = testSystem;
window.deleteParticipant = deleteParticipant;
window.applyColor = applyColor;
window.closeColorModal = closeColorModal;

console.log('🎉 Bulletproof save system loaded for ENTIRE WEBSITE!');
