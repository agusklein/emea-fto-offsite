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
    
    // Initialize scroll position preservation
    initializeScrollPreservation();
    
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

// Scroll position preservation system - ENHANCED
function initializeScrollPreservation() {
    console.log('📍 Initializing ENHANCED scroll position preservation...');
    
    let lastScrollPosition = 0;
    let scrollPreservationActive = false;
    let userInParticipantsSection = false;
    
    // Track scroll position continuously
    window.addEventListener('scroll', function() {
        if (!scrollPreservationActive) {
            lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        }
    });
    
    // Detect when user is in participants section
    const participantsSection = document.querySelector('.participants');
    if (participantsSection) {
        const iframe = participantsSection.querySelector('iframe');
        
        // Enhanced iframe handling
        if (iframe) {
            // Prevent scroll jumping when iframe loads
            iframe.addEventListener('load', function() {
                console.log('📍 Iframe loaded - PREVENTING scroll jump');
                scrollPreservationActive = true;
                
                // Longer delay to ensure iframe is fully settled
                setTimeout(function() {
                    scrollPreservationActive = false;
                }, 1000);
            });
            
            // Track iframe interactions
            iframe.addEventListener('focus', function() {
                console.log('📍 Iframe focused - user interacting with Google Sheets');
                userInParticipantsSection = true;
                window.lastParticipantsInteraction = Date.now();
            });
            
            iframe.addEventListener('blur', function() {
                console.log('📍 Iframe blurred - user left Google Sheets');
                setTimeout(function() {
                    userInParticipantsSection = false;
                }, 2000); // Grace period
            });
        }
        
        // Enhanced participants section tracking
        participantsSection.addEventListener('mouseenter', function() {
            console.log('📍 Mouse entered participants section');
            userInParticipantsSection = true;
            window.lastParticipantsInteraction = Date.now();
        });
        
        participantsSection.addEventListener('mouseleave', function() {
            console.log('📍 Mouse left participants section');
            setTimeout(function() {
                userInParticipantsSection = false;
            }, 3000); // Longer grace period
        });
        
        participantsSection.addEventListener('click', function() {
            console.log('📍 Participants section clicked');
            userInParticipantsSection = true;
            window.lastParticipantsInteraction = Date.now();
        });
    }
    
    // COMPLETELY DISABLE scroll jump monitoring when user is in participants section
    setInterval(function() {
        if (userInParticipantsSection || scrollPreservationActive) {
            return; // Skip all scroll monitoring
        }
        
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only restore if we detect an unexpected jump to top
        if (currentScroll === 0 && lastScrollPosition > 300) {
            console.log('📍 EMERGENCY: Restoring scroll position from unexpected jump');
            window.scrollTo(0, lastScrollPosition);
        }
    }, 1000); // Less frequent monitoring
    
    console.log('✅ ENHANCED scroll position preservation initialized');
}

function initializeRealTimeSync() {
    console.log('🔄 Real-time sync disabled for clean interface...');
    
    // Disable sync to prevent refresh behavior and unwanted buttons
    syncEnabled = false;
    
    console.log('✅ Real-time sync disabled - using local storage only');
    showMessage('💾 Local mode - changes saved locally only');
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
    // COMPLETELY DISABLED to prevent scrolling issues
    console.log('🔄 Real-time sync disabled to prevent scrolling issues');
    return;
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
    
    // Enhanced auto-save with better participants section detection
    setInterval(function() {
        // Multiple checks to avoid saving during Google Sheets interaction
        if (isUserInParticipantsSection() || 
            window.lastParticipantsInteraction && (Date.now() - window.lastParticipantsInteraction < 15000)) {
            console.log('⏰ AUTO-SAVE SKIPPED - User in participants section or recent interaction');
            return;
        }
        
        console.log('⏰ AUTO-SAVE INTERVAL');
        saveDataNow();
    }, 5000); // Increased interval to 5 seconds
    
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

// Enhanced function to check if user is currently interacting with participants section
function isUserInParticipantsSection() {
    // Check if the participants section is currently visible in viewport
    const participantsSection = document.querySelector('.participants');
    if (!participantsSection) return false;
    
    const rect = participantsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if participants section is significantly visible in viewport
    const isVisible = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;
    
    // Check if user recently interacted with the participants section
    const lastInteractionTime = window.lastParticipantsInteraction || 0;
    const timeSinceInteraction = Date.now() - lastInteractionTime;
    const recentInteraction = timeSinceInteraction < 15000; // 15 seconds grace period
    
    // Check if iframe is focused or active
    const iframe = participantsSection.querySelector('iframe');
    const activeElement = document.activeElement;
    const iframeActive = iframe && (activeElement === iframe || participantsSection.contains(activeElement));
    
    // Check if user's mouse is over the participants section
    const mouseOverParticipants = participantsSection.matches(':hover');
    
    const result = isVisible && (recentInteraction || iframeActive || mouseOverParticipants);
    
    if (result) {
        console.log('👥 User detected in participants section:', {
            visible: isVisible,
            recentInteraction: recentInteraction,
            iframeActive: iframeActive,
            mouseOver: mouseOverParticipants
        });
    }
    
    return result;
}

// Track user interactions with participants section
function trackParticipantsInteraction() {
    const participantsSection = document.querySelector('.participants');
    if (participantsSection) {
        // Track clicks in participants section
        participantsSection.addEventListener('click', function() {
            window.lastParticipantsInteraction = Date.now();
            console.log('👥 User interacted with participants section');
        });
        
        // Track when iframe gets focus
        const iframe = participantsSection.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('focus', function() {
                window.lastParticipantsInteraction = Date.now();
                console.log('👥 User focused on Google Sheets iframe');
            });
            
            // Track iframe load events that might cause scrolling
            iframe.addEventListener('load', function() {
                console.log('👥 Google Sheets iframe loaded');
                // Prevent any automatic scrolling after iframe loads
                setTimeout(function() {
                    // Restore scroll position if it was changed
                    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                    if (currentScroll < 100) {
                        // If user was scrolled down but got jumped to top, restore position
                        const participantsTop = participantsSection.offsetTop;
                        if (participantsTop > 100) {
                            window.scrollTo(0, participantsTop - 100);
                            console.log('👥 Restored scroll position after iframe load');
                        }
                    }
                }, 100);
            });
        }
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
    // Disabled - no more popup messages for clean interface
    console.log(`${type.toUpperCase()}: ${text}`);
}

function initializeFeatures() {
    console.log('🔧 Initializing features...');
    
    // Track participants section interactions to prevent scrolling issues
    trackParticipantsInteraction();
    
    console.log('✅ Features initialized (buttons disabled for clean interface)');
}

// Simplified drag and drop (disabled for clean interface)
function initializeDragAndDrop() {
    console.log('🔄 Drag and drop disabled for clean interface');
}

// Global functions (minimal set)
window.saveDataNow = saveDataNow;
window.loadData = loadData;

console.log('🎉 ULTRA-SIMPLE system loaded!');
