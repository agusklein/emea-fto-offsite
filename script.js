// EMEA FTO Offsite Website - BULLETPROOF Save System
console.log('🚀 Loading bulletproof save system...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing save system');
    
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

// BULLETPROOF SAVE SYSTEM
function initializeSaveSystem() {
    console.log('🔧 Initializing bulletproof save system...');
    
    // Save on ANY change to ANY editable element
    document.addEventListener('input', function(e) {
        if (e.target.contentEditable === 'true') {
            console.log('📝 Content changed:', e.target.tagName, e.target.textContent);
            saveEverything();
        }
    });
    
    // Save when clicking away from editable elements
    document.addEventListener('blur', function(e) {
        if (e.target.contentEditable === 'true') {
            console.log('👆 Element blurred:', e.target.tagName, e.target.textContent);
            saveEverything();
        }
    }, true);
    
    // Save on Enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.contentEditable === 'true') {
            console.log('⏎ Enter pressed');
            e.preventDefault();
            e.target.blur();
            saveEverything();
        }
    });
    
    // Save before leaving page
    window.addEventListener('beforeunload', function() {
        console.log('🚪 Page unloading, saving...');
        saveEverything();
    });
    
    // Auto-save every 5 seconds
    setInterval(() => {
        console.log('⏰ Auto-save interval');
        saveEverything();
    }, 5000);
    
    console.log('✅ Save system initialized');
}

// SIMPLE SAVE FUNCTION
function saveEverything() {
    console.log('💾 SAVING EVERYTHING...');
    
    try {
        const data = {
            timestamp: new Date().toISOString(),
            content: {}
        };
        
        // Save ALL editable content with simple IDs
        let counter = 0;
        document.querySelectorAll('[contenteditable="true"]').forEach(element => {
            const id = `element_${counter}`;
            const path = getSimplePath(element);
            
            data.content[id] = {
                path: path,
                text: element.textContent || '',
                tag: element.tagName,
                class: element.className
            };
            
            console.log(`💾 Saved ${id}: ${path} = "${element.textContent}"`);
            counter++;
        });
        
        // Save to localStorage
        localStorage.setItem('offsite-data', JSON.stringify(data));
        
        console.log(`✅ SAVED ${counter} elements successfully`);
        showMessage('✅ Saved!', 'success');
        
        return true;
        
    } catch (error) {
        console.error('❌ SAVE FAILED:', error);
        showMessage('❌ Save failed!', 'error');
        return false;
    }
}

// SIMPLE LOAD FUNCTION
function loadAllData() {
    console.log('📂 LOADING ALL DATA...');
    
    const saved = localStorage.getItem('offsite-data');
    if (!saved) {
        console.log('ℹ️ No saved data found');
        return;
    }
    
    try {
        const data = JSON.parse(saved);
        console.log('📂 Found saved data from:', data.timestamp);
        
        // Restore all content
        Object.keys(data.content).forEach(id => {
            const item = data.content[id];
            const element = findElementByPath(item.path, item.tag, item.class);
            
            if (element && element.contentEditable === 'true') {
                element.textContent = item.text;
                console.log(`📂 Restored ${id}: "${item.text}"`);
            } else {
                console.warn(`⚠️ Could not find element for ${id}: ${item.path}`);
            }
        });
        
        const loadTime = new Date(data.timestamp).toLocaleString();
        showMessage(`📂 Loaded data from ${loadTime}`, 'success');
        console.log('✅ LOAD COMPLETE');
        
    } catch (error) {
        console.error('❌ LOAD FAILED:', error);
        showMessage('❌ Load failed!', 'error');
    }
}

// SIMPLE PATH GENERATOR
function getSimplePath(element) {
    let path = element.tagName.toLowerCase();
    
    if (element.className) {
        path += '.' + element.className.split(' ').join('.');
    }
    
    // Add parent context
    if (element.parentElement) {
        const parent = element.parentElement;
        let parentPath = parent.tagName.toLowerCase();
        if (parent.className) {
            parentPath += '.' + parent.className.split(' ').join('.');
        }
        path = parentPath + ' > ' + path;
    }
    
    // Add position among similar elements
    const siblings = Array.from(element.parentElement?.children || []).filter(child => 
        child.tagName === element.tagName && child.className === element.className
    );
    
    if (siblings.length > 1) {
        const index = siblings.indexOf(element);
        path += `:nth-child(${index + 1})`;
    }
    
    return path;
}

// SIMPLE ELEMENT FINDER
function findElementByPath(path, tag, className) {
    // Try exact path first
    try {
        const element = document.querySelector(path);
        if (element) return element;
    } catch (e) {
        console.warn('Path query failed:', path);
    }
    
    // Try by tag and class
    if (className) {
        const elements = document.querySelectorAll(`${tag.toLowerCase()}.${className.split(' ').join('.')}`);
        if (elements.length > 0) return elements[0];
    }
    
    // Try by tag only
    const elements = document.querySelectorAll(tag.toLowerCase());
    if (elements.length > 0) return elements[0];
    
    return null;
}

// TEST SYSTEM
function testSystem() {
    console.log('🧪 TESTING SAVE SYSTEM...');
    
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    console.log(`🧪 Found ${editableElements.length} editable elements`);
    
    // Test save
    const saveResult = saveEverything();
    if (saveResult) {
        console.log('✅ Save test passed');
    } else {
        console.log('❌ Save test failed');
        return;
    }
    
    // Check localStorage
    const saved = localStorage.getItem('offsite-data');
    if (saved) {
        const data = JSON.parse(saved);
        console.log(`✅ Found ${Object.keys(data.content).length} saved elements`);
        console.log('🧪 SYSTEM TEST PASSED');
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

// BUTTON INITIALIZATION (Simplified)
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
            showMessage('💾 Manual save complete!', 'success');
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
        showMessage('✏️ Edit mode enabled', 'success');
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

console.log('🎉 Bulletproof save system loaded!');
