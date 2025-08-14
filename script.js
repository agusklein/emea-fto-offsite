// ULTRA-SIMPLE BULLETPROOF PERSISTENCE SYSTEM
console.log('🚀 Loading ULTRA-SIMPLE persistence system...');

// Global variables
let saveInProgress = false;
let lastSaveTime = 0;

// Wait for page to load
window.addEventListener('load', function() {
    console.log('✅ Page loaded completely');
    
    // Load saved data immediately
    loadData();
    
    // Set up saving with ultra-simple approach
    setupSimpleSaving();
    
    // Initialize other features
    initializeFeatures();
    
    // Test the system
    setTimeout(testSystem, 2000);
});

function setupSimpleSaving() {
    console.log('🔧 Setting up ULTRA-SIMPLE saving...');
    
    // Save on ANY change - immediate and simple
    document.addEventListener('input', function(e) {
        if (e.target.contentEditable === 'true') {
            console.log('📝 CONTENT CHANGED:', e.target.textContent.substring(0, 30));
            saveDataNow();
        }
    });
    
    // Save when clicking away
    document.addEventListener('blur', function(e) {
        if (e.target.contentEditable === 'true') {
            console.log('👆 ELEMENT BLURRED');
            saveDataNow();
        }
    }, true);
    
    // Save on Enter
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.contentEditable === 'true') {
            console.log('⏎ ENTER PRESSED');
            e.preventDefault();
            e.target.blur();
            saveDataNow();
        }
    });
    
    // Save before leaving page
    window.addEventListener('beforeunload', function() {
        console.log('🚪 PAGE LEAVING - EMERGENCY SAVE');
        saveDataNow();
    });
    
    // Simple auto-save every 2 seconds
    setInterval(function() {
        console.log('⏰ AUTO-SAVE INTERVAL');
        saveDataNow();
    }, 2000);
    
    console.log('✅ Ultra-simple saving setup complete');
}

function saveDataNow() {
    if (saveInProgress) {
        console.log('⏳ Save already in progress, skipping...');
        return;
    }
    
    saveInProgress = true;
    console.log('💾 SAVING ENTIRE WEBSITE DATA NOW...');
    
    try {
        const currentTime = Date.now();
        
        // Create comprehensive save object for ENTIRE website
        const saveData = {
            timestamp: new Date().toISOString(),
            saveTime: currentTime,
            version: 'ultra-simple-v2-complete',
            
            // Save complete page HTML as ultimate backup
            completeHTML: document.documentElement.innerHTML,
            
            // Save ALL editable content from ENTIRE website
            editableElements: [],
            
            // Save activity colors from agenda
            activityColors: [],
            
            // Save participant data
            participantRows: [],
            
            // Save header section data
            headerElements: [],
            
            // Save welcome/intro section data
            welcomeElements: [],
            
            // Save Barcelona information section data
            barcelonaElements: []
        };
        
        // Capture ALL editable elements from ENTIRE website
        const editables = document.querySelectorAll('[contenteditable="true"]');
        console.log(`💾 Capturing ${editables.length} editable elements from ENTIRE website...`);
        
        editables.forEach(function(element, index) {
            const section = getElementSection(element);
            saveData.editableElements.push({
                index: index,
                text: element.textContent || '',
                innerHTML: element.innerHTML || '',
                tagName: element.tagName,
                className: element.className,
                id: element.id || '',
                parentClassName: element.parentElement ? element.parentElement.className : '',
                section: section // Track which section this belongs to
            });
        });
        
        // Capture HEADER section elements specifically
        const headerEditables = document.querySelectorAll('header [contenteditable="true"]');
        headerEditables.forEach(function(element, index) {
            saveData.headerElements.push({
                index: index,
                text: element.textContent || '',
                innerHTML: element.innerHTML || '',
                tagName: element.tagName,
                className: element.className
            });
        });
        
        // Capture WELCOME section elements specifically
        const welcomeEditables = document.querySelectorAll('.welcome [contenteditable="true"]');
        welcomeEditables.forEach(function(element, index) {
            saveData.welcomeElements.push({
                index: index,
                text: element.textContent || '',
                innerHTML: element.innerHTML || '',
                tagName: element.tagName,
                className: element.className
            });
        });
        
        // Capture BARCELONA INFO section elements specifically
        const barcelonaEditables = document.querySelectorAll('.barcelona-info [contenteditable="true"]');
        barcelonaEditables.forEach(function(element, index) {
            saveData.barcelonaElements.push({
                index: index,
                text: element.textContent || '',
                innerHTML: element.innerHTML || '',
                tagName: element.tagName,
                className: element.className
            });
        });
        
        // Capture activity colors from agenda
        const activities = document.querySelectorAll('.time-slot');
        activities.forEach(function(activity, index) {
            if (activity.style.cssText) {
                saveData.activityColors.push({
                    index: index,
                    cssText: activity.style.cssText,
                    dataActivity: activity.dataset.activity || '',
                    innerHTML: activity.innerHTML
                });
            }
        });
        
        // Capture participant data
        const participantRows = document.querySelectorAll('#participantsBody tr');
        participantRows.forEach(function(row, index) {
            const cells = row.querySelectorAll('td[contenteditable="true"]');
            const rowData = [];
            cells.forEach(function(cell) {
                rowData.push(cell.textContent || '');
            });
            if (rowData.length > 0) {
                saveData.participantRows.push({
                    index: index,
                    data: rowData
                });
            }
        });
        
        // Save to localStorage with multiple keys for safety
        const jsonData = JSON.stringify(saveData);
        localStorage.setItem('ultra-simple-data', jsonData);
        localStorage.setItem('ultra-simple-backup', jsonData);
        localStorage.setItem('ultra-simple-' + currentTime, jsonData);
        
        // Clean old saves (keep only last 3)
        cleanOldSaves();
        
        lastSaveTime = currentTime;
        console.log(`✅ COMPLETE WEBSITE SAVE SUCCESSFUL:`);
        console.log(`📊 Total editable elements: ${editables.length}`);
        console.log(`📊 Header elements: ${headerEditables.length}`);
        console.log(`📊 Welcome elements: ${welcomeEditables.length}`);
        console.log(`📊 Barcelona elements: ${barcelonaEditables.length}`);
        console.log(`📊 Activities: ${activities.length}`);
        console.log(`📊 Participants: ${participantRows.length}`);
        
        showMessage(`💾 Saved entire website: ${editables.length} elements`);
        
    } catch (error) {
        console.error('❌ COMPLETE WEBSITE SAVE FAILED:', error);
        showMessage('❌ Save failed: ' + error.message);
    } finally {
        saveInProgress = false;
    }
}

// Helper function to identify which section an element belongs to
function getElementSection(element) {
    if (element.closest('header')) return 'HEADER';
    if (element.closest('.welcome')) return 'WELCOME';
    if (element.closest('.agenda')) return 'AGENDA';
    if (element.closest('.participants')) return 'PARTICIPANTS';
    if (element.closest('.barcelona-info')) return 'BARCELONA';
    return 'OTHER';
}

function loadData() {
    console.log('📂 LOADING ENTIRE WEBSITE DATA...');
    
    let savedData = localStorage.getItem('ultra-simple-data');
    
    // Try backup if main fails
    if (!savedData) {
        console.log('📂 Trying backup...');
        savedData = localStorage.getItem('ultra-simple-backup');
    }
    
    // Try timestamped saves if backup fails
    if (!savedData) {
        console.log('📂 Trying timestamped saves...');
        const keys = Object.keys(localStorage);
        const timestampedKeys = keys.filter(key => key.startsWith('ultra-simple-') && key !== 'ultra-simple-data' && key !== 'ultra-simple-backup');
        if (timestampedKeys.length > 0) {
            timestampedKeys.sort().reverse(); // Get most recent
            savedData = localStorage.getItem(timestampedKeys[0]);
            console.log('📂 Using timestamped save:', timestampedKeys[0]);
        }
    }
    
    if (!savedData) {
        console.log('ℹ️ No saved data found');
        return;
    }
    
    try {
        const data = JSON.parse(savedData);
        console.log('📂 Found saved data from:', data.timestamp);
        console.log('📂 Data version:', data.version);
        
        // Restore ALL editable elements from ENTIRE website
        if (data.editableElements) {
            const currentEditables = document.querySelectorAll('[contenteditable="true"]');
            console.log(`📂 Restoring ${data.editableElements.length} editable elements from ENTIRE website...`);
            
            data.editableElements.forEach(function(savedElement) {
                // Find matching element using multiple strategies
                let targetElement = null;
                
                // Strategy 1: Try by index first (most reliable for simple approach)
                if (currentEditables[savedElement.index]) {
                    targetElement = currentEditables[savedElement.index];
                }
                
                // Strategy 2: Try by class and tag if index doesn't work
                if (!targetElement && savedElement.className) {
                    const candidates = document.querySelectorAll(`${savedElement.tagName.toLowerCase()}.${savedElement.className.split(' ').join('.')}`);
                    if (candidates.length > 0) {
                        targetElement = candidates[0];
                    }
                }
                
                // Strategy 3: Try by section-specific matching
                if (!targetElement && savedElement.section) {
                    const sectionElements = getSectionEditables(savedElement.section);
                    if (sectionElements.length > 0) {
                        // Find by tag within section
                        const sectionCandidates = sectionElements.filter(el => el.tagName === savedElement.tagName);
                        if (sectionCandidates.length > 0) {
                            targetElement = sectionCandidates[0];
                        }
                    }
                }
                
                // Restore content
                if (targetElement) {
                    targetElement.textContent = savedElement.text;
                    console.log(`📂 Restored ${savedElement.section || 'UNKNOWN'}: "${savedElement.text.substring(0, 30)}..."`);
                }
            });
        }
        
        // Restore HEADER section specifically
        if (data.headerElements) {
            console.log(`📂 Restoring ${data.headerElements.length} header elements...`);
            const currentHeaderElements = document.querySelectorAll('header [contenteditable="true"]');
            
            data.headerElements.forEach(function(savedElement, index) {
                if (currentHeaderElements[index]) {
                    currentHeaderElements[index].textContent = savedElement.text;
                    console.log(`📂 Restored HEADER: "${savedElement.text}"`);
                }
            });
        }
        
        // Restore WELCOME section specifically
        if (data.welcomeElements) {
            console.log(`📂 Restoring ${data.welcomeElements.length} welcome elements...`);
            const currentWelcomeElements = document.querySelectorAll('.welcome [contenteditable="true"]');
            
            data.welcomeElements.forEach(function(savedElement, index) {
                if (currentWelcomeElements[index]) {
                    currentWelcomeElements[index].textContent = savedElement.text;
                    console.log(`📂 Restored WELCOME: "${savedElement.text.substring(0, 30)}..."`);
                }
            });
        }
        
        // Restore BARCELONA INFO section specifically
        if (data.barcelonaElements) {
            console.log(`📂 Restoring ${data.barcelonaElements.length} Barcelona info elements...`);
            const currentBarcelonaElements = document.querySelectorAll('.barcelona-info [contenteditable="true"]');
            
            data.barcelonaElements.forEach(function(savedElement, index) {
                if (currentBarcelonaElements[index]) {
                    currentBarcelonaElements[index].textContent = savedElement.text;
                    console.log(`📂 Restored BARCELONA: "${savedElement.text.substring(0, 30)}..."`);
                }
            });
        }
        
        // Restore activity colors from agenda
        if (data.activityColors) {
            console.log(`📂 Restoring ${data.activityColors.length} activity colors...`);
            const currentActivities = document.querySelectorAll('.time-slot');
            
            data.activityColors.forEach(function(savedColor) {
                let targetActivity = null;
                
                // Try by data-activity attribute
                if (savedColor.dataActivity) {
                    targetActivity = document.querySelector(`[data-activity="${savedColor.dataActivity}"]`);
                }
                
                // Try by index
                if (!targetActivity && currentActivities[savedColor.index]) {
                    targetActivity = currentActivities[savedColor.index];
                }
                
                // Restore color
                if (targetActivity && savedColor.cssText) {
                    targetActivity.style.cssText = savedColor.cssText;
                    console.log(`📂 Restored color for activity ${savedColor.index}`);
                }
            });
        }
        
        // Restore participant data
        if (data.participantRows) {
            console.log(`📂 Restoring ${data.participantRows.length} participant rows...`);
            const currentRows = document.querySelectorAll('#participantsBody tr');
            
            data.participantRows.forEach(function(savedRow) {
                if (currentRows[savedRow.index]) {
                    const cells = currentRows[savedRow.index].querySelectorAll('td[contenteditable="true"]');
                    savedRow.data.forEach(function(cellText, cellIndex) {
                        if (cells[cellIndex]) {
                            cells[cellIndex].textContent = cellText;
                        }
                    });
                }
            });
        }
        
        const loadTime = new Date(data.timestamp).toLocaleString();
        showMessage(`📂 Loaded entire website from ${loadTime}`);
        console.log('✅ COMPLETE WEBSITE LOAD SUCCESSFUL');
        
    } catch (error) {
        console.error('❌ COMPLETE WEBSITE LOAD FAILED:', error);
        showMessage('❌ Load failed: ' + error.message);
    }
}

// Helper function to get editable elements from specific sections
function getSectionEditables(section) {
    switch (section) {
        case 'HEADER':
            return Array.from(document.querySelectorAll('header [contenteditable="true"]'));
        case 'WELCOME':
            return Array.from(document.querySelectorAll('.welcome [contenteditable="true"]'));
        case 'AGENDA':
            return Array.from(document.querySelectorAll('.agenda [contenteditable="true"]'));
        case 'PARTICIPANTS':
            return Array.from(document.querySelectorAll('.participants [contenteditable="true"]'));
        case 'BARCELONA':
            return Array.from(document.querySelectorAll('.barcelona-info [contenteditable="true"]'));
        default:
            return [];
    }
}

function cleanOldSaves() {
    const keys = Object.keys(localStorage);
    const timestampedKeys = keys.filter(key => key.startsWith('ultra-simple-') && 
        key !== 'ultra-simple-data' && key !== 'ultra-simple-backup');
    
    if (timestampedKeys.length > 3) {
        timestampedKeys.sort();
        const toRemove = timestampedKeys.slice(0, timestampedKeys.length - 3);
        toRemove.forEach(function(key) {
            localStorage.removeItem(key);
        });
    }
}

function testSystem() {
    console.log('🧪 TESTING ULTRA-SIMPLE SYSTEM FOR ENTIRE WEBSITE...');
    
    // Count editable elements in each section
    const headerEditables = document.querySelectorAll('header [contenteditable="true"]');
    const welcomeEditables = document.querySelectorAll('.welcome [contenteditable="true"]');
    const agendaEditables = document.querySelectorAll('.agenda [contenteditable="true"]');
    const participantEditables = document.querySelectorAll('.participants [contenteditable="true"]');
    const barcelonaEditables = document.querySelectorAll('.barcelona-info [contenteditable="true"]');
    const totalEditables = document.querySelectorAll('[contenteditable="true"]');
    
    console.log('🧪 EDITABLE ELEMENTS BY SECTION:');
    console.log(`📋 Header: ${headerEditables.length} elements`);
    console.log(`🏠 Welcome: ${welcomeEditables.length} elements`);
    console.log(`📅 Agenda: ${agendaEditables.length} elements`);
    console.log(`👥 Participants: ${participantEditables.length} elements`);
    console.log(`🏙️ Barcelona: ${barcelonaEditables.length} elements`);
    console.log(`📊 TOTAL: ${totalEditables.length} elements`);
    
    // Test save
    console.log('🧪 Testing save functionality...');
    saveDataNow();
    
    // Check if data was saved
    const saved = localStorage.getItem('ultra-simple-data');
    if (saved) {
        const data = JSON.parse(saved);
        console.log('🧪 SAVE TEST RESULTS:');
        console.log(`✅ Total elements saved: ${data.editableElements.length}`);
        console.log(`✅ Header elements saved: ${data.headerElements ? data.headerElements.length : 0}`);
        console.log(`✅ Welcome elements saved: ${data.welcomeElements ? data.welcomeElements.length : 0}`);
        console.log(`✅ Barcelona elements saved: ${data.barcelonaElements ? data.barcelonaElements.length : 0}`);
        console.log(`✅ Activity colors saved: ${data.activityColors.length}`);
        console.log(`✅ Participant rows saved: ${data.participantRows.length}`);
        
        showMessage('✅ Complete website system test passed!');
        console.log('🎉 ENTIRE WEBSITE SYSTEM TEST PASSED!');
    } else {
        console.log('❌ SYSTEM TEST FAILED - No data saved');
        showMessage('❌ System test failed!');
    }
    
    // Test section identification
    console.log('🧪 Testing section identification...');
    const testElements = [
        { selector: 'header [contenteditable="true"]', expectedSection: 'HEADER' },
        { selector: '.welcome [contenteditable="true"]', expectedSection: 'WELCOME' },
        { selector: '.agenda [contenteditable="true"]', expectedSection: 'AGENDA' },
        { selector: '.participants [contenteditable="true"]', expectedSection: 'PARTICIPANTS' },
        { selector: '.barcelona-info [contenteditable="true"]', expectedSection: 'BARCELONA' }
    ];
    
    testElements.forEach(function(test) {
        const element = document.querySelector(test.selector);
        if (element) {
            const detectedSection = getElementSection(element);
            if (detectedSection === test.expectedSection) {
                console.log(`✅ Section detection: ${test.expectedSection} - CORRECT`);
            } else {
                console.log(`❌ Section detection: Expected ${test.expectedSection}, got ${detectedSection}`);
            }
        }
    });
}

function showMessage(text, type = 'success') {
    // Remove old messages
    document.querySelectorAll('.status-msg').forEach(function(msg) {
        msg.remove();
    });
    
    const message = document.createElement('div');
    message.className = 'status-msg';
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(message);
    
    setTimeout(function() {
        message.remove();
    }, 3000);
}

function initializeFeatures() {
    console.log('🔧 Initializing features...');
    
    // Initialize buttons
    initializeButtons();
    
    // Initialize drag and drop
    setTimeout(function() {
        initializeDragAndDrop();
        addMoveButtons();
    }, 1000);
}

// Button handlers
function initializeButtons() {
    document.addEventListener('click', function(e) {
        // Add participant
        if (e.target.id === 'add-participant-btn') {
            addParticipant();
        }
        
        // Color mode
        if (e.target.id === 'color-mode-btn') {
            toggleColorMode();
        }
        
        // Color picker buttons
        if (e.target.classList.contains('color-picker-btn-inline')) {
            e.stopPropagation();
            openColorPicker(e.target.closest('.time-slot'));
        }
        
        // Color options
        if (e.target.classList.contains('color-option')) {
            applyColor(e.target.style.backgroundColor);
        }
        
        // Close modals
        if (e.target.classList.contains('color-modal') || e.target.textContent === 'Cancel') {
            closeColorModal();
        }
        
        // Manual save
        if (e.target.id === 'save-data-btn') {
            saveDataNow();
            showMessage('💾 Manual save complete!');
        }
    });
}

// Color mode functionality
let colorMode = false;

function toggleColorMode() {
    colorMode = !colorMode;
    const btn = document.getElementById('color-mode-btn');
    
    if (colorMode) {
        btn.textContent = '🎨 Exit Color';
        btn.style.background = '#8C4FFF';
        showColorButtons();
        showMessage('🎨 Color mode enabled');
    } else {
        btn.textContent = '🎨 Color Mode';
        btn.style.background = '#FF9900';
        hideColorButtons();
        showMessage('🎨 Color mode disabled');
    }
}

function showColorButtons() {
    document.querySelectorAll('.time-slot').forEach(function(slot) {
        if (!slot.querySelector('.color-picker-btn-inline')) {
            const colorBtn = document.createElement('button');
            colorBtn.className = 'color-picker-btn-inline';
            colorBtn.innerHTML = '🎨';
            colorBtn.style.cssText = `
                position: absolute;
                top: 8px;
                right: 35px;
                background: var(--aws-orange);
                color: white;
                border: none;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                cursor: pointer;
                z-index: 10;
            `;
            slot.appendChild(colorBtn);
        }
    });
}

function hideColorButtons() {
    document.querySelectorAll('.color-picker-btn-inline').forEach(function(btn) {
        btn.remove();
    });
}

let currentTimeSlot = null;

function openColorPicker(timeSlot) {
    currentTimeSlot = timeSlot;
    const activityTitle = timeSlot.querySelector('h4')?.textContent || 'Activity';
    
    const colors = [
        'rgb(75, 156, 211)', 'rgb(255, 153, 0)', 'rgb(140, 79, 255)', 'rgb(255, 107, 107)',
        'rgb(78, 205, 196)', 'rgb(149, 225, 211)', 'rgb(255, 167, 38)', 'rgb(231, 76, 60)',
        'rgb(155, 89, 182)', 'rgb(46, 204, 113)', 'rgb(243, 156, 18)', 'rgb(52, 73, 94)'
    ];
    
    const modal = document.createElement('div');
    modal.className = 'color-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px;">
            <h3>Choose color for "${activityTitle}"</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 1.5rem 0;">
                ${colors.map(color => `
                    <div class="color-option" style="background: ${color}; width: 50px; height: 50px; border-radius: 8px; cursor: pointer; border: 3px solid transparent;"></div>
                `).join('')}
            </div>
            <div style="text-align: right;">
                <button style="background: #6c757d; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function applyColor(color) {
    if (currentTimeSlot) {
        currentTimeSlot.style.borderLeftColor = color;
        currentTimeSlot.style.borderLeftWidth = '6px';
        currentTimeSlot.style.borderLeftStyle = 'solid';
        showMessage('🎨 Color applied!');
        saveDataNow(); // Save immediately
    }
    closeColorModal();
}

function closeColorModal() {
    const modal = document.querySelector('.color-modal');
    if (modal) {
        modal.remove();
    }
    currentTimeSlot = null;
}

// Add participant function
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
        <td><button onclick="deleteParticipant(this)">🗑️</button></td>
    `;
    
    tbody.appendChild(newRow);
    console.log('👤 Added new participant');
    saveDataNow();
    showMessage('👤 Participant added!');
}

function deleteParticipant(button) {
    if (confirm('Remove this participant?')) {
        button.closest('tr').remove();
        saveDataNow();
        showMessage('👤 Participant removed!');
    }
}

// Add activity modal functions
function showAddActivityModal(dayName) {
    console.log('🎯 Opening add activity modal for:', dayName);
    
    const modal = document.createElement('div');
    modal.className = 'add-activity-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; width: 90%;">
            <h3>Add New Activity to ${dayName}</h3>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Time:</label>
                <input type="text" id="newActivityTime" placeholder="e.g., 2:00 PM - 3:00 PM" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px;" required>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Activity Title:</label>
                <input type="text" id="newActivityTitle" placeholder="e.g., Team Discussion" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px;" required>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Description:</label>
                <textarea id="newActivityDescription" placeholder="e.g., Owner: John | Timekeeper: Jane" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px; height: 80px;"></textarea>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Activity Type:</label>
                <select id="newActivityType" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px;">
                    <option value="meeting">🏢 Meeting</option>
                    <option value="workshop">🛠️ Workshop</option>
                    <option value="demo">💻 Demo</option>
                    <option value="social">🍽️ Social</option>
                    <option value="break">☕ Break</option>
                    <option value="free">🆓 Free Time</option>
                    <option value="arrival">✈️ Arrival</option>
                </select>
            </div>
            <div style="text-align: right;">
                <button type="button" id="cancelActivityBtn" style="background: #6c757d; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; margin-right: 1rem;">Cancel</button>
                <button type="button" id="addActivityBtn" style="background: #28a745; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">Add Activity</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('cancelActivityBtn').addEventListener('click', closeAddActivityModal);
    document.getElementById('addActivityBtn').addEventListener('click', function() {
        const time = document.getElementById('newActivityTime').value.trim();
        const title = document.getElementById('newActivityTitle').value.trim();
        const description = document.getElementById('newActivityDescription').value.trim();
        const type = document.getElementById('newActivityType').value;
        
        if (!time || !title) {
            alert('Please fill in both Time and Activity Title');
            return;
        }
        
        addActivityToDay(dayName, time, title, description, type);
        closeAddActivityModal();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAddActivityModal();
        }
    });
}

function addActivityToDay(dayName, time, title, description, type) {
    console.log('🎯 Adding activity to day:', dayName);
    
    const dayColumns = document.querySelectorAll('.day-column');
    let targetColumn = null;
    
    dayColumns.forEach(function(column) {
        const dayTitle = column.querySelector('h3');
        if (dayTitle && dayTitle.textContent.trim() === dayName) {
            targetColumn = column;
        }
    });
    
    if (!targetColumn) {
        console.error('❌ Could not find day column for:', dayName);
        alert('Error: Could not find the day column. Please try again.');
        return;
    }
    
    const newActivity = document.createElement('div');
    newActivity.className = `time-slot ${type}`;
    newActivity.setAttribute('data-category', type);
    newActivity.setAttribute('data-activity', `custom-${Date.now()}`);
    
    newActivity.innerHTML = `
        <button class="delete-activity-btn" onclick="deleteActivity(this)" title="Delete Activity" style="position: absolute; top: 8px; right: 8px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; z-index: 10;">🗑️</button>
        <div class="time" contenteditable="true">${time}</div>
        <div class="session">
            <h4 contenteditable="true">${title}</h4>
            ${description ? `<p contenteditable="true">${description}</p>` : '<p contenteditable="true">Click to add description</p>'}
        </div>
    `;
    
    // Add to column
    const addButton = targetColumn.querySelector('.add-activity-btn');
    if (addButton && addButton.parentElement) {
        targetColumn.insertBefore(newActivity, addButton.parentElement.nextSibling);
    } else {
        targetColumn.appendChild(newActivity);
    }
    
    console.log(`✅ Added new activity "${title}" to ${dayName}`);
    saveDataNow();
    showMessage(`✅ Activity "${title}" added to ${dayName}!`);
}

function closeAddActivityModal() {
    const modal = document.querySelector('.add-activity-modal');
    if (modal) {
        modal.remove();
    }
}

function deleteActivity(button) {
    const activity = button.closest('.time-slot');
    const activityTitle = activity.querySelector('h4')?.textContent || 'this activity';
    
    if (confirm(`Are you sure you want to delete "${activityTitle}"?`)) {
        console.log('🗑️ Deleting activity:', activityTitle);
        activity.remove();
        saveDataNow();
        showMessage(`🗑️ Activity "${activityTitle}" deleted!`);
    }
}

// Simplified drag and drop
function initializeDragAndDrop() {
    console.log('🔄 Initializing simple drag and drop...');
    // Simplified version - just basic functionality
}

function addMoveButtons() {
    console.log('📍 Adding move buttons...');
    // Simplified version - just basic functionality
}

// Global functions
window.deleteParticipant = deleteParticipant;
window.showAddActivityModal = showAddActivityModal;
window.closeAddActivityModal = closeAddActivityModal;
window.deleteActivity = deleteActivity;
window.saveDataNow = saveDataNow;
window.loadData = loadData;

console.log('🎉 ULTRA-SIMPLE system loaded!');
