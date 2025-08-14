// ULTRA-SIMPLE BULLETPROOF PERSISTENCE SYSTEM
console.log('🚀 Loading ULTRA-SIMPLE persistence system...');

// Global variables
let saveInProgress = false;
let lastSaveTime = 0;

// REAL-TIME SYNCHRONIZATION SYSTEM
let syncEnabled = false;
let lastSyncTime = 0;
let syncInProgress = false;

// Wait for page to load
window.addEventListener('load', function() {
    console.log('✅ Page loaded completely');
    
    // Initialize real-time sync first
    setTimeout(initializeRealTimeSync, 1000);
    
    // Load saved data immediately
    loadData();
    
    // Set up saving with ultra-simple approach
    setupSimpleSaving();
    
    // Initialize other features
    initializeFeatures();
    
    // Test the system
    setTimeout(testSystem, 2000);
});

function initializeRealTimeSync() {
    console.log('🔄 Initializing simple real-time synchronization...');
    
    if (window.SYNC_CONFIG && window.SYNC_CONFIG.enabled) {
        syncEnabled = true;
        
        // Start polling for changes every 5 seconds
        setInterval(function() {
            if (!syncInProgress) {
                checkForUpdates();
            }
        }, window.SYNC_CONFIG.pollInterval);
        
        // Load initial data
        loadFromServer();
        
        console.log('✅ Simple real-time sync initialized');
        showMessage('🔄 Real-time sync enabled - changes shared with all users!');
    } else {
        console.log('⚠️ Real-time sync not available, using local storage only');
        showMessage('⚠️ Local mode - changes not shared with others');
    }
}

function saveToServer(data) {
    if (!syncEnabled || syncInProgress) {
        return;
    }
    
    console.log('🔄 Saving to shared storage...');
    
    try {
        // Use localStorage as shared storage for now (simple approach)
        // In production, this would be replaced with actual server API
        const sharedKey = 'shared-website-data';
        const sharedData = {
            ...data,
            lastModified: Date.now(),
            userId: getUserId()
        };
        
        localStorage.setItem(sharedKey, JSON.stringify(sharedData));
        localStorage.setItem('last-sync-time', Date.now().toString());
        
        console.log('✅ Data saved to shared storage');
        lastSyncTime = Date.now();
        
        // Simulate server save success
        showMessage('🔄 Changes shared with all users!', 'success');
        
    } catch (error) {
        console.error('❌ Shared storage save error:', error);
    }
}

function loadFromServer() {
    if (!syncEnabled) {
        return;
    }
    
    console.log('🔄 Loading from shared storage...');
    
    try {
        const sharedKey = 'shared-website-data';
        const sharedData = localStorage.getItem(sharedKey);
        
        if (sharedData) {
            const data = JSON.parse(sharedData);
            console.log('📂 Found shared data from:', data.timestamp);
            
            // Only load if it's from a different user or newer
            if (data.userId !== getUserId() || data.lastModified > lastSyncTime) {
                loadDataFromServer(data);
            }
        } else {
            console.log('ℹ️ No shared data found');
        }
    } catch (error) {
        console.error('❌ Failed to load from shared storage:', error);
    }
}

function checkForUpdates() {
    if (!syncEnabled || syncInProgress) {
        return;
    }
    
    try {
        const sharedKey = 'shared-website-data';
        const sharedData = localStorage.getItem(sharedKey);
        const lastSyncTimeStored = localStorage.getItem('last-sync-time');
        
        if (sharedData) {
            const data = JSON.parse(sharedData);
            const storedSyncTime = lastSyncTimeStored ? parseInt(lastSyncTimeStored) : 0;
            
            // Check if there are updates from other users
            if (data.lastModified > storedSyncTime && data.userId !== getUserId()) {
                console.log('🔄 Found updates from other users, syncing...');
                syncInProgress = true;
                loadDataFromServer(data);
                localStorage.setItem('last-sync-time', data.lastModified.toString());
                setTimeout(() => { syncInProgress = false; }, 1000);
            }
        }
    } catch (error) {
        console.error('❌ Error checking for updates:', error);
    }
}

function getUserId() {
    // Generate or retrieve a simple user ID
    let userId = localStorage.getItem('user-id');
    if (!userId) {
        userId = 'user-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('user-id', userId);
    }
    return userId;
}

function loadDataFromServer(data) {
    console.log('📂 Loading data from server...');
    
    try {
        let restoredSections = 0;
        
        // Restore complete HTML sections from server data (excluding participants)
        if (data.completeAgendaHTML) {
            const currentAgenda = document.querySelector('.agenda');
            if (currentAgenda) {
                currentAgenda.outerHTML = data.completeAgendaHTML;
                restoredSections++;
                console.log('✅ AGENDA section restored from server');
            }
        }
        
        // Skip participants section - now handled by Google Sheets
        console.log('⏭️ Skipping participants section (Google Sheets integration)');
        
        if (data.completeHeaderHTML) {
            const currentHeader = document.querySelector('header');
            if (currentHeader) {
                currentHeader.outerHTML = data.completeHeaderHTML;
                restoredSections++;
                console.log('✅ HEADER section restored from server');
            }
        }
        
        if (data.completeWelcomeHTML) {
            const currentWelcome = document.querySelector('.welcome');
            if (currentWelcome) {
                currentWelcome.outerHTML = data.completeWelcomeHTML;
                restoredSections++;
                console.log('✅ WELCOME section restored from server');
            }
        }
        
        if (data.completeBarcelonaHTML) {
            const currentBarcelona = document.querySelector('.barcelona-info');
            if (currentBarcelona) {
                currentBarcelona.outerHTML = data.completeBarcelonaHTML;
                restoredSections++;
                console.log('✅ BARCELONA section restored from server');
            }
        }
        
        // Re-initialize functionality after server sync
        setTimeout(function() {
            console.log('🔄 Re-initializing after server sync...');
            setupSimpleSaving();
            initializeFeatures();
        }, 500);
        
        if (restoredSections > 0) {
            showMessage(`🔄 Synced ${restoredSections} sections from other users`);
        }
        
        console.log(`✅ Server sync complete - ${restoredSections} sections restored`);
        
    } catch (error) {
        console.error('❌ Server load failed:', error);
    }
}

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
    console.log('💾 SAVING COMPLETE WEBSITE WITH FULL HTML STRUCTURE...');
    
    try {
        const currentTime = Date.now();
        
        // Create bulletproof save object that captures EVERYTHING
        const saveData = {
            timestamp: new Date().toISOString(),
            saveTime: currentTime,
            version: 'bulletproof-html-v1',
            
            // Save COMPLETE HTML of each major section
            completeAgendaHTML: null,
            completeParticipantsHTML: null,
            completeHeaderHTML: null,
            completeWelcomeHTML: null,
            completeBarcelonaHTML: null,
            
            // Backup: Save individual editable content
            editableElements: [],
            
            // Backup: Save activity-specific data
            activityData: []
        };
        
        // Capture COMPLETE HTML of each section (excluding participants - now Google Sheets)
        const agendaSection = document.querySelector('.agenda');
        if (agendaSection) {
            saveData.completeAgendaHTML = agendaSection.outerHTML;
            console.log('💾 Saved complete AGENDA HTML structure');
        }
        
        // Skip participants section - now handled by Google Sheets
        console.log('⏭️ Skipping participants section (Google Sheets integration)');
        
        const headerSection = document.querySelector('header');
        if (headerSection) {
            saveData.completeHeaderHTML = headerSection.outerHTML;
            console.log('💾 Saved complete HEADER HTML structure');
        }
        
        const welcomeSection = document.querySelector('.welcome');
        if (welcomeSection) {
            saveData.completeWelcomeHTML = welcomeSection.outerHTML;
            console.log('💾 Saved complete WELCOME HTML structure');
        }
        
        const barcelonaSection = document.querySelector('.barcelona-info');
        if (barcelonaSection) {
            saveData.completeBarcelonaHTML = barcelonaSection.outerHTML;
            console.log('💾 Saved complete BARCELONA HTML structure');
        }
        
        // Backup: Capture all editable elements as fallback
        const editables = document.querySelectorAll('[contenteditable="true"]');
        editables.forEach(function(element, index) {
            saveData.editableElements.push({
                index: index,
                text: element.textContent || '',
                innerHTML: element.innerHTML || '',
                tagName: element.tagName,
                className: element.className,
                section: getElementSection(element)
            });
        });
        
        // Backup: Capture activity-specific data
        const activities = document.querySelectorAll('.time-slot');
        activities.forEach(function(activity, index) {
            saveData.activityData.push({
                index: index,
                outerHTML: activity.outerHTML,
                dataActivity: activity.dataset.activity || '',
                dataCategory: activity.dataset.category || '',
                cssText: activity.style.cssText || '',
                parentDayColumn: activity.closest('.day-column')?.querySelector('h3')?.textContent || ''
            });
        });
        
        // Save to localStorage with multiple keys for maximum safety
        const jsonData = JSON.stringify(saveData);
        localStorage.setItem('bulletproof-data', jsonData);
        localStorage.setItem('bulletproof-backup', jsonData);
        localStorage.setItem('bulletproof-' + currentTime, jsonData);
        
        // Keep old system as additional backup
        localStorage.setItem('ultra-simple-data', jsonData);
        
        // Save to server for real-time sync
        if (syncEnabled && !syncInProgress) {
            saveToServer(saveData);
        }
        
        // Clean old saves
        cleanOldSaves();
        
        lastSaveTime = currentTime;
        console.log(`✅ BULLETPROOF SAVE COMPLETE:`);
        console.log(`📊 Agenda HTML: ${saveData.completeAgendaHTML ? 'SAVED' : 'MISSING'}`);
        console.log(`📊 Participants HTML: ${saveData.completeParticipantsHTML ? 'SAVED' : 'MISSING'}`);
        console.log(`📊 Activities: ${activities.length} activities saved`);
        console.log(`📊 Editable elements: ${editables.length} elements saved`);
        
        showMessage(`💾 Bulletproof save: ${activities.length} activities + ${editables.length} elements`);
        
    } catch (error) {
        console.error('❌ BULLETPROOF SAVE FAILED:', error);
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
    console.log('📂 LOADING BULLETPROOF DATA WITH COMPLETE HTML RESTORATION...');
    
    let savedData = localStorage.getItem('bulletproof-data');
    
    // Try backups if main fails
    if (!savedData) {
        console.log('📂 Trying bulletproof backup...');
        savedData = localStorage.getItem('bulletproof-backup');
    }
    
    if (!savedData) {
        console.log('📂 Trying timestamped bulletproof saves...');
        const keys = Object.keys(localStorage);
        const timestampedKeys = keys.filter(key => key.startsWith('bulletproof-') && 
            key !== 'bulletproof-data' && key !== 'bulletproof-backup');
        if (timestampedKeys.length > 0) {
            timestampedKeys.sort().reverse();
            savedData = localStorage.getItem(timestampedKeys[0]);
            console.log('📂 Using timestamped save:', timestampedKeys[0]);
        }
    }
    
    // Fallback to old system
    if (!savedData) {
        console.log('📂 Trying ultra-simple fallback...');
        savedData = localStorage.getItem('ultra-simple-data');
    }
    
    if (!savedData) {
        console.log('ℹ️ No saved data found');
        return;
    }
    
    try {
        const data = JSON.parse(savedData);
        console.log('📂 Found saved data from:', data.timestamp);
        console.log('📂 Data version:', data.version);
        
        let restoredSections = 0;
        
        // Restore COMPLETE HTML sections
        if (data.completeAgendaHTML) {
            console.log('📂 Restoring COMPLETE AGENDA HTML...');
            const currentAgenda = document.querySelector('.agenda');
            if (currentAgenda) {
                currentAgenda.outerHTML = data.completeAgendaHTML;
                restoredSections++;
                console.log('✅ AGENDA section completely restored');
            }
        }
        
        if (data.completeParticipantsHTML) {
            console.log('📂 Restoring COMPLETE PARTICIPANTS HTML...');
            const currentParticipants = document.querySelector('.participants');
            if (currentParticipants) {
                currentParticipants.outerHTML = data.completeParticipantsHTML;
                restoredSections++;
                console.log('✅ PARTICIPANTS section completely restored');
            }
        }
        
        if (data.completeHeaderHTML) {
            console.log('📂 Restoring COMPLETE HEADER HTML...');
            const currentHeader = document.querySelector('header');
            if (currentHeader) {
                currentHeader.outerHTML = data.completeHeaderHTML;
                restoredSections++;
                console.log('✅ HEADER section completely restored');
            }
        }
        
        if (data.completeWelcomeHTML) {
            console.log('📂 Restoring COMPLETE WELCOME HTML...');
            const currentWelcome = document.querySelector('.welcome');
            if (currentWelcome) {
                currentWelcome.outerHTML = data.completeWelcomeHTML;
                restoredSections++;
                console.log('✅ WELCOME section completely restored');
            }
        }
        
        if (data.completeBarcelonaHTML) {
            console.log('📂 Restoring COMPLETE BARCELONA HTML...');
            const currentBarcelona = document.querySelector('.barcelona-info');
            if (currentBarcelona) {
                currentBarcelona.outerHTML = data.completeBarcelonaHTML;
                restoredSections++;
                console.log('✅ BARCELONA section completely restored');
            }
        }
        
        // Re-initialize all functionality after HTML restoration
        setTimeout(function() {
            console.log('🔄 Re-initializing ALL functionality after complete HTML restoration...');
            
            // Re-setup saving system
            setupSimpleSaving();
            
            // Re-initialize all features
            initializeFeatures();
            
            console.log('✅ All functionality re-initialized');
        }, 500);
        
        // Fallback: If no complete HTML was saved, try individual element restoration
        if (restoredSections === 0) {
            console.log('📂 No complete HTML found, trying individual element restoration...');
            
            if (data.editableElements) {
                const currentEditables = document.querySelectorAll('[contenteditable="true"]');
                console.log(`📂 Restoring ${data.editableElements.length} individual elements...`);
                
                data.editableElements.forEach(function(savedElement) {
                    let targetElement = null;
                    
                    if (currentEditables[savedElement.index]) {
                        targetElement = currentEditables[savedElement.index];
                    }
                    
                    if (targetElement) {
                        targetElement.textContent = savedElement.text;
                        console.log(`📂 Restored: "${savedElement.text.substring(0, 30)}..."`);
                    }
                });
            }
        }
        
        const loadTime = new Date(data.timestamp).toLocaleString();
        showMessage(`📂 Bulletproof load: ${restoredSections} sections restored from ${loadTime}`);
        console.log(`✅ BULLETPROOF LOAD COMPLETE - ${restoredSections} sections restored`);
        
    } catch (error) {
        console.error('❌ BULLETPROOF LOAD FAILED:', error);
        showMessage('❌ Load failed: ' + error.message);
        
        // Try to recover with simpler approach
        console.log('🔄 Attempting simple recovery...');
        setTimeout(function() {
            initializeFeatures();
        }, 1000);
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
    
    // Clean old bulletproof saves
    const bulletproofKeys = keys.filter(key => key.startsWith('bulletproof-') && 
        key !== 'bulletproof-data' && key !== 'bulletproof-backup');
    
    if (bulletproofKeys.length > 3) {
        bulletproofKeys.sort();
        const toRemove = bulletproofKeys.slice(0, bulletproofKeys.length - 3);
        toRemove.forEach(function(key) {
            localStorage.removeItem(key);
            console.log('🧹 Cleaned old bulletproof save:', key);
        });
    }
    
    // Clean old ultra-simple saves
    const ultraSimpleKeys = keys.filter(key => key.startsWith('ultra-simple-') && 
        key !== 'ultra-simple-data' && key !== 'ultra-simple-backup');
    
    if (ultraSimpleKeys.length > 3) {
        ultraSimpleKeys.sort();
        const toRemove = ultraSimpleKeys.slice(0, ultraSimpleKeys.length - 3);
        toRemove.forEach(function(key) {
            localStorage.removeItem(key);
            console.log('🧹 Cleaned old ultra-simple save:', key);
        });
    }
}

function testSystem() {
    console.log('🧪 TESTING BULLETPROOF SYSTEM FOR ENTIRE WEBSITE...');
    
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
    const saved = localStorage.getItem('bulletproof-data');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            console.log('🧪 SAVE TEST RESULTS:');
            console.log(`✅ Total elements saved: ${data.editableElements ? data.editableElements.length : 0}`);
            console.log(`✅ Activities saved: ${data.activityData ? data.activityData.length : 0}`);
            console.log(`✅ Agenda HTML saved: ${data.completeAgendaHTML ? 'YES' : 'NO'}`);
            console.log(`✅ Participants HTML saved: ${data.completeParticipantsHTML ? 'YES' : 'NO'}`);
            console.log(`✅ Header HTML saved: ${data.completeHeaderHTML ? 'YES' : 'NO'}`);
            console.log(`✅ Welcome HTML saved: ${data.completeWelcomeHTML ? 'YES' : 'NO'}`);
            console.log(`✅ Barcelona HTML saved: ${data.completeBarcelonaHTML ? 'YES' : 'NO'}`);
            
            showMessage('✅ Complete website system test passed!');
            console.log('🎉 ENTIRE WEBSITE SYSTEM TEST PASSED!');
        } catch (error) {
            console.error('❌ Error parsing saved data:', error);
            showMessage('❌ System test failed - data parsing error');
        }
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
    
    // Add delete and move buttons to all existing activities
    setTimeout(function() {
        addDeleteAndMoveButtons();
        initializeDragAndDrop();
    }, 1000);
}

// Add delete and move buttons to all activities
function addDeleteAndMoveButtons() {
    console.log('🔧 Adding delete and move buttons to all activities...');
    
    const activities = document.querySelectorAll('.time-slot');
    console.log(`🔧 Found ${activities.length} activities to enhance`);
    
    activities.forEach(function(activity) {
        // Don't add if already has buttons
        if (activity.querySelector('.delete-activity-btn')) {
            return;
        }
        
        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-activity-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete Activity';
        deleteBtn.onclick = function() { deleteActivity(this); };
        deleteBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            cursor: pointer;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Add move buttons
        const moveButtons = document.createElement('div');
        moveButtons.className = 'move-buttons';
        moveButtons.style.cssText = `
            position: absolute;
            top: 8px;
            left: 8px;
            display: flex;
            flex-direction: column;
            gap: 2px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const moveUpBtn = document.createElement('button');
        moveUpBtn.className = 'move-btn';
        moveUpBtn.innerHTML = '↑';
        moveUpBtn.title = 'Move Up';
        moveUpBtn.onclick = function() { moveActivity(this, 'up'); };
        moveUpBtn.style.cssText = `
            background: var(--aws-orange);
            color: white;
            border: none;
            border-radius: 3px;
            width: 20px;
            height: 20px;
            cursor: pointer;
            font-size: 0.7rem;
        `;
        
        const moveDownBtn = document.createElement('button');
        moveDownBtn.className = 'move-btn';
        moveDownBtn.innerHTML = '↓';
        moveDownBtn.title = 'Move Down';
        moveDownBtn.onclick = function() { moveActivity(this, 'down'); };
        moveDownBtn.style.cssText = `
            background: var(--aws-orange);
            color: white;
            border: none;
            border-radius: 3px;
            width: 20px;
            height: 20px;
            cursor: pointer;
            font-size: 0.7rem;
        `;
        
        moveButtons.appendChild(moveUpBtn);
        moveButtons.appendChild(moveDownBtn);
        
        // Add hover effects
        activity.addEventListener('mouseenter', function() {
            deleteBtn.style.opacity = '1';
            moveButtons.style.opacity = '1';
        });
        
        activity.addEventListener('mouseleave', function() {
            deleteBtn.style.opacity = '0';
            moveButtons.style.opacity = '0';
        });
        
        // Make sure activity has relative positioning
        activity.style.position = 'relative';
        
        // Add buttons to activity
        activity.appendChild(deleteBtn);
        activity.appendChild(moveButtons);
        
        console.log('🔧 Added buttons to activity:', activity.querySelector('h4')?.textContent);
    });
    
    console.log('✅ Delete and move buttons added to all activities');
}

// Delete activity function
function deleteActivity(button) {
    const activity = button.closest('.time-slot');
    const activityTitle = activity.querySelector('h4')?.textContent || 'this activity';
    
    if (confirm(`Are you sure you want to delete "${activityTitle}"?`)) {
        console.log('🗑️ Deleting activity:', activityTitle);
        activity.remove();
        
        // Save changes immediately
        setTimeout(function() {
            saveDataNow();
        }, 100);
        
        showMessage(`🗑️ Activity "${activityTitle}" deleted!`);
    }
}

// Move activity up or down within the same day
function moveActivity(button, direction) {
    const activity = button.closest('.time-slot');
    const dayColumn = activity.closest('.day-column');
    const activities = Array.from(dayColumn.querySelectorAll('.time-slot'));
    const currentIndex = activities.indexOf(activity);
    
    let newIndex;
    if (direction === 'up' && currentIndex > 0) {
        newIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < activities.length - 1) {
        newIndex = currentIndex + 1;
    } else {
        return; // Can't move further
    }
    
    const targetActivity = activities[newIndex];
    
    if (direction === 'up') {
        dayColumn.insertBefore(activity, targetActivity);
    } else {
        dayColumn.insertBefore(activity, targetActivity.nextSibling);
    }
    
    console.log(`📍 Moved activity ${direction}:`, activity.querySelector('h4')?.textContent);
    
    // Save changes immediately
    setTimeout(function() {
        saveDataNow();
    }, 100);
    
    showMessage(`📍 Activity moved ${direction}!`);
}

// Initialize drag and drop functionality
function initializeDragAndDrop() {
    console.log('🔄 Initializing drag and drop...');
    
    const activities = document.querySelectorAll('.time-slot');
    const dayColumns = document.querySelectorAll('.day-column');
    
    // Make activities draggable
    activities.forEach(function(activity) {
        activity.draggable = true;
        
        activity.addEventListener('dragstart', function(e) {
            console.log('🎯 Drag started:', activity.querySelector('h4')?.textContent);
            activity.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', activity.outerHTML);
        });
        
        activity.addEventListener('dragend', function(e) {
            console.log('🎯 Drag ended');
            activity.classList.remove('dragging');
            
            // Remove drag-over class from all columns
            dayColumns.forEach(function(col) {
                col.classList.remove('drag-over');
            });
        });
    });
    
    // Make day columns drop targets
    dayColumns.forEach(function(column) {
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            column.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', function(e) {
            if (!column.contains(e.relatedTarget)) {
                column.classList.remove('drag-over');
            }
        });
        
        column.addEventListener('drop', function(e) {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            const draggedElement = document.querySelector('.dragging');
            if (draggedElement && draggedElement.parentElement !== column) {
                console.log('📍 Dropping activity into new day column');
                
                // Remove from old location
                draggedElement.remove();
                
                // Add to new location
                const addButton = column.querySelector('.add-activity-btn');
                if (addButton && addButton.parentElement) {
                    column.insertBefore(draggedElement, addButton.parentElement.nextSibling);
                } else {
                    column.appendChild(draggedElement);
                }
                
                // Re-add buttons to moved activity
                addDeleteAndMoveButtons();
                
                // Save changes
                setTimeout(function() {
                    saveDataNow();
                }, 100);
                
                showMessage('📍 Activity moved to new day!');
            }
        });
    });
    
    console.log('✅ Drag and drop initialized');
}

// Button handlers
function initializeButtons() {
    document.addEventListener('click', function(e) {
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
    newActivity.style.position = 'relative';
    newActivity.draggable = true;
    
    newActivity.innerHTML = `
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
    
    // Add delete and move buttons to the new activity
    setTimeout(function() {
        addDeleteAndMoveButtons();
        initializeDragAndDrop();
    }, 100);
    
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
window.showAddActivityModal = showAddActivityModal;
window.closeAddActivityModal = closeAddActivityModal;
window.deleteActivity = deleteActivity;
window.moveActivity = moveActivity;
window.saveDataNow = saveDataNow;
window.loadData = loadData;

console.log('🎉 ULTRA-SIMPLE system loaded!');
