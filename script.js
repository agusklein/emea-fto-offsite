// MOST BASIC SAVE SYSTEM - WILL WORK
console.log('🚀 Starting BASIC save system...');

// Wait for page to load
window.addEventListener('load', function() {
    console.log('✅ Page loaded completely');
    
    // Load any saved data first
    loadEverything();
    
    // Set up saving
    setupSaving();
    
    // Initialize drag and drop
    initializeDragAndDrop();
    
    // Add move buttons to existing activities
    setTimeout(function() {
        addMoveButtons();
    }, 500);
    
    // Test immediately
    setTimeout(testNow, 1000);
});

function setupSaving() {
    console.log('🔧 Setting up ENHANCED saving system...');
    
    // Save on ANY input change (immediate)
    document.body.addEventListener('input', function(e) {
        if (e.target.contentEditable === 'true') {
            console.log('📝 INPUT DETECTED:', e.target.textContent.substring(0, 50));
            // Save immediately, no delay
            saveNow();
        }
    });
    
    // Save when element loses focus (immediate)
    document.body.addEventListener('focusout', function(e) {
        if (e.target.contentEditable === 'true') {
            console.log('👆 FOCUS OUT:', e.target.textContent.substring(0, 50));
            saveNow();
        }
    });
    
    // Save on Enter key (immediate)
    document.body.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.contentEditable === 'true') {
            console.log('⏎ Enter pressed');
            e.preventDefault();
            e.target.blur();
            saveNow();
        }
    });
    
    // Save before leaving page (critical)
    window.addEventListener('beforeunload', function() {
        console.log('🚪 Page unloading, CRITICAL SAVE...');
        saveNow();
        // Force synchronous save
        const data = localStorage.getItem('website-data');
        if (data) {
            localStorage.setItem('website-data-emergency', data);
        }
    });
    
    // Save on page visibility change (when tab becomes hidden/visible)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('👁️ Page hidden, saving...');
            saveNow();
        } else {
            console.log('👁️ Page visible, loading latest...');
            // Small delay to ensure any other tabs have saved
            setTimeout(loadEverything, 500);
        }
    });
    
    // Frequent auto-save (every 1 second instead of 2)
    setInterval(function() {
        console.log('⏰ Frequent auto-save...');
        saveNow();
    }, 1000);
    
    // Additional backup save every 5 seconds
    setInterval(function() {
        console.log('💾 Backup save...');
        const mainData = localStorage.getItem('website-data');
        if (mainData) {
            localStorage.setItem('website-data-backup', mainData);
            localStorage.setItem(`website-data-${Date.now()}`, mainData);
        }
    }, 5000);
    
    console.log('✅ ENHANCED saving system initialized');
}

function saveNow() {
    console.log('💾 SAVING NOW...');
    
    try {
        // Create a comprehensive save object
        const saveData = {
            timestamp: new Date().toISOString(),
            version: '3.0', // Increment version for better tracking
            completeHTML: document.documentElement.outerHTML, // Save entire page HTML
            agendaHTML: null,
            editableContent: {},
            activityStyles: {},
            participantData: {}
        };
        
        // Save complete agenda section HTML
        const agendaSection = document.querySelector('.agenda');
        if (agendaSection) {
            saveData.agendaHTML = agendaSection.outerHTML;
            console.log('💾 Saved complete agenda HTML structure');
        }
        
        // Save all editable content with detailed tracking
        const editables = document.querySelectorAll('[contenteditable="true"]');
        console.log(`💾 Found ${editables.length} editable elements`);
        
        editables.forEach(function(element, index) {
            const uniqueId = generateUniqueId(element, index);
            saveData.editableContent[uniqueId] = {
                text: element.textContent || element.innerText || '',
                html: element.innerHTML || '',
                tag: element.tagName,
                className: element.className,
                parentClass: element.parentElement ? element.parentElement.className : '',
                index: index
            };
        });
        
        // Save all activity styles with enhanced tracking
        document.querySelectorAll('.time-slot').forEach(function(slot, index) {
            const uniqueId = `activity_${index}_${slot.dataset.activity || 'unknown'}`;
            const style = slot.style;
            
            if (style.cssText || style.borderLeftColor || style.backgroundColor) {
                saveData.activityStyles[uniqueId] = {
                    cssText: style.cssText,
                    borderLeftColor: style.borderLeftColor || '',
                    borderLeftWidth: style.borderLeftWidth || '',
                    borderLeftStyle: style.borderLeftStyle || '',
                    backgroundColor: style.backgroundColor || '',
                    dataActivity: slot.dataset.activity || '',
                    innerHTML: slot.innerHTML
                };
                console.log(`💾 Saved styles for ${uniqueId}`);
            }
        });
        
        // Save participant table data
        const participantRows = document.querySelectorAll('#participantsBody tr');
        participantRows.forEach(function(row, index) {
            const cells = row.querySelectorAll('td[contenteditable="true"]');
            const rowData = [];
            cells.forEach(cell => {
                rowData.push(cell.textContent || '');
            });
            saveData.participantData[`row_${index}`] = rowData;
        });
        
        // Save to localStorage with multiple backup keys
        const jsonData = JSON.stringify(saveData);
        localStorage.setItem('website-data', jsonData);
        localStorage.setItem('website-data-backup', jsonData);
        localStorage.setItem(`website-data-${Date.now()}`, jsonData); // Timestamped backup
        
        // Clean old timestamped backups (keep only last 5)
        cleanOldBackups();
        
        console.log(`✅ COMPREHENSIVE SAVE COMPLETE`);
        console.log(`📊 Saved: ${Object.keys(saveData.editableContent).length} editable elements`);
        console.log(`📊 Saved: ${Object.keys(saveData.activityStyles).length} activity styles`);
        console.log(`📊 Saved: ${Object.keys(saveData.participantData).length} participant rows`);
        console.log(`📊 Data size: ${jsonData.length} characters`);
        
        showMessage(`💾 Saved ${Object.keys(saveData.editableContent).length} elements + styles + activities`);
        
        return true;
        
    } catch (error) {
        console.error('❌ SAVE FAILED:', error);
        showMessage('❌ Save failed: ' + error.message);
        return false;
    }
}

function generateUniqueId(element, index) {
    // Create a more unique identifier for elements
    let id = `${element.tagName.toLowerCase()}_${index}`;
    
    if (element.id) {
        id += `_${element.id}`;
    }
    
    if (element.className) {
        id += `_${element.className.replace(/\s+/g, '_')}`;
    }
    
    // Add parent context for uniqueness
    if (element.parentElement) {
        const parent = element.parentElement;
        if (parent.className) {
            id += `_parent_${parent.className.replace(/\s+/g, '_')}`;
        }
        if (parent.tagName) {
            id += `_${parent.tagName.toLowerCase()}`;
        }
    }
    
    return id;
}

function cleanOldBackups() {
    const keys = Object.keys(localStorage);
    const timestampedKeys = keys.filter(key => key.startsWith('website-data-') && key !== 'website-data-backup');
    
    if (timestampedKeys.length > 5) {
        // Sort by timestamp and remove oldest
        timestampedKeys.sort();
        const toRemove = timestampedKeys.slice(0, timestampedKeys.length - 5);
        toRemove.forEach(key => {
            localStorage.removeItem(key);
            console.log('🧹 Cleaned old backup:', key);
        });
    }
}

function loadEverything() {
    console.log('📂 LOADING COMPREHENSIVE DATA...');
    
    let savedData = localStorage.getItem('website-data');
    
    // Try backup if main data is corrupted or missing
    if (!savedData) {
        console.log('📂 Main data not found, trying backup...');
        savedData = localStorage.getItem('website-data-backup');
    }
    
    if (!savedData) {
        console.log('ℹ️ No saved data found');
        return;
    }
    
    try {
        const data = JSON.parse(savedData);
        console.log('📂 Found saved data from:', data.timestamp);
        console.log('📂 Data version:', data.version || 'legacy');
        
        // Restore agenda HTML structure first (includes new activities)
        if (data.agendaHTML) {
            const agendaSection = document.querySelector('.agenda');
            if (agendaSection) {
                // Store current event listeners before replacing HTML
                console.log('📂 Restoring complete agenda structure...');
                agendaSection.outerHTML = data.agendaHTML;
                
                // Re-initialize everything after HTML restoration
                setTimeout(function() {
                    console.log('🔄 Re-initializing after HTML restoration...');
                    setupSaving();
                    initializeDragAndDrop();
                    addMoveButtons();
                }, 200);
            }
        }
        
        // Restore editable content with enhanced matching
        if (data.editableContent) {
            console.log('📂 Restoring editable content...');
            let restoredCount = 0;
            
            Object.keys(data.editableContent).forEach(function(uniqueId) {
                const contentData = data.editableContent[uniqueId];
                
                // Try multiple methods to find the element
                let element = findElementByUniqueId(uniqueId, contentData);
                
                if (element && element.contentEditable === 'true') {
                    element.textContent = contentData.text;
                    if (contentData.html && contentData.html !== contentData.text) {
                        element.innerHTML = contentData.html;
                    }
                    restoredCount++;
                    console.log(`📂 Restored: ${uniqueId} = "${contentData.text.substring(0, 50)}..."`);
                }
            });
            
            console.log(`✅ Restored ${restoredCount} editable elements`);
        }
        
        // Restore activity styles with enhanced matching
        if (data.activityStyles) {
            console.log('📂 Restoring activity styles...');
            let stylesRestored = 0;
            
            Object.keys(data.activityStyles).forEach(function(uniqueId) {
                const styleData = data.activityStyles[uniqueId];
                
                // Find activity by data-activity attribute or position
                let activity = null;
                if (styleData.dataActivity) {
                    activity = document.querySelector(`[data-activity="${styleData.dataActivity}"]`);
                }
                
                // Fallback to position-based matching
                if (!activity) {
                    const activities = document.querySelectorAll('.time-slot');
                    const index = parseInt(uniqueId.split('_')[1]);
                    if (activities[index]) {
                        activity = activities[index];
                    }
                }
                
                if (activity) {
                    if (styleData.cssText) {
                        activity.style.cssText = styleData.cssText;
                    } else {
                        if (styleData.borderLeftColor) activity.style.borderLeftColor = styleData.borderLeftColor;
                        if (styleData.borderLeftWidth) activity.style.borderLeftWidth = styleData.borderLeftWidth;
                        if (styleData.borderLeftStyle) activity.style.borderLeftStyle = styleData.borderLeftStyle;
                        if (styleData.backgroundColor) activity.style.backgroundColor = styleData.backgroundColor;
                    }
                    stylesRestored++;
                    console.log(`📂 Restored styles for: ${uniqueId}`);
                }
            });
            
            console.log(`✅ Restored ${stylesRestored} activity styles`);
        }
        
        // Restore participant data
        if (data.participantData) {
            console.log('📂 Restoring participant data...');
            const participantRows = document.querySelectorAll('#participantsBody tr');
            let participantsRestored = 0;
            
            Object.keys(data.participantData).forEach(function(rowKey) {
                const rowIndex = parseInt(rowKey.split('_')[1]);
                const rowData = data.participantData[rowKey];
                
                if (participantRows[rowIndex]) {
                    const cells = participantRows[rowIndex].querySelectorAll('td[contenteditable="true"]');
                    rowData.forEach(function(cellText, cellIndex) {
                        if (cells[cellIndex]) {
                            cells[cellIndex].textContent = cellText;
                        }
                    });
                    participantsRestored++;
                }
            });
            
            console.log(`✅ Restored ${participantsRestored} participant rows`);
        }
        
        const loadTime = new Date(data.timestamp).toLocaleString();
        showMessage(`📂 Loaded complete data from ${loadTime}`, 'success');
        console.log('✅ COMPREHENSIVE LOAD COMPLETE');
        
    } catch (error) {
        console.error('❌ LOAD FAILED:', error);
        showMessage('❌ Load failed: ' + error.message);
        
        // Try to recover from backup
        tryRecoverFromBackup();
    }
}

function findElementByUniqueId(uniqueId, contentData) {
    // Try multiple strategies to find the element
    
    // Strategy 1: Direct class and tag matching
    if (contentData.className && contentData.tag) {
        const elements = document.querySelectorAll(`${contentData.tag.toLowerCase()}.${contentData.className.split(' ').join('.')}`);
        if (elements[contentData.index]) {
            return elements[contentData.index];
        }
    }
    
    // Strategy 2: Parent class context
    if (contentData.parentClass) {
        const parentElements = document.querySelectorAll(`.${contentData.parentClass.split(' ').join('.')}`);
        for (let parent of parentElements) {
            const childElements = parent.querySelectorAll(`${contentData.tag.toLowerCase()}[contenteditable="true"]`);
            if (childElements[0]) {
                return childElements[0];
            }
        }
    }
    
    // Strategy 3: All elements of same tag
    const allElements = document.querySelectorAll(`${contentData.tag.toLowerCase()}[contenteditable="true"]`);
    if (allElements[contentData.index]) {
        return allElements[contentData.index];
    }
    
    return null;
}

function tryRecoverFromBackup() {
    console.log('🔄 Attempting recovery from backup...');
    
    // Try timestamped backups
    const keys = Object.keys(localStorage);
    const timestampedKeys = keys.filter(key => key.startsWith('website-data-') && key !== 'website-data-backup');
    
    if (timestampedKeys.length > 0) {
        // Try the most recent backup
        timestampedKeys.sort().reverse();
        const latestBackup = localStorage.getItem(timestampedKeys[0]);
        
        if (latestBackup) {
            try {
                const backupData = JSON.parse(latestBackup);
                console.log('🔄 Found backup data from:', backupData.timestamp);
                
                // Restore from backup
                localStorage.setItem('website-data', latestBackup);
                loadEverything();
                
                showMessage('🔄 Recovered from backup!', 'success');
                return;
            } catch (e) {
                console.error('❌ Backup recovery failed:', e);
            }
        }
    }
    
    showMessage('❌ Could not recover data', 'error');
}

function showMessage(text) {
    // Remove old messages
    const oldMessages = document.querySelectorAll('.status-message');
    oldMessages.forEach(function(msg) {
        msg.remove();
    });
    
    // Create new message
    const message = document.createElement('div');
    message.className = 'status-message';
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(message);
    
    // Remove after 3 seconds
    setTimeout(function() {
        message.remove();
    }, 3000);
}

function testNow() {
    console.log('🧪 TESTING SAVE SYSTEM...');
    
    const editables = document.querySelectorAll('[contenteditable="true"]');
    console.log(`🧪 Found ${editables.length} editable elements on page`);
    
    // Test save
    const saveResult = saveNow();
    
    if (saveResult) {
        // Check if data was actually saved
        const saved = localStorage.getItem('website-data');
        if (saved) {
            const data = JSON.parse(saved);
            console.log(`✅ TEST PASSED - ${data.elements.length} elements saved to localStorage`);
            showMessage('✅ Save system working!');
        } else {
            console.log('❌ TEST FAILED - No data in localStorage');
            showMessage('❌ Save system failed!');
        }
    } else {
        console.log('❌ TEST FAILED - Save function returned false');
        showMessage('❌ Save system failed!');
    }
}

// Simple button handlers
document.addEventListener('click', function(e) {
    // Manual save button
    if (e.target.id === 'save-data-btn') {
        saveNow();
        showMessage('💾 Manual save complete!');
    }
    
    // Add participant button
    if (e.target.id === 'add-participant-btn') {
        addParticipant();
    }
    
    // Color mode button
    if (e.target.id === 'color-mode-btn') {
        toggleColorMode();
    }
    
    // Color picker buttons on activities
    if (e.target.classList.contains('color-picker-btn-inline')) {
        e.stopPropagation();
        openColorPicker(e.target.closest('.time-slot'));
    }
    
    // Color options in modal
    if (e.target.classList.contains('color-option')) {
        applyColor(e.target.style.backgroundColor);
    }
    
    // Close color modal
    if (e.target.classList.contains('color-modal') || e.target.textContent === 'Cancel') {
        closeColorModal();
    }
});

// Color mode functionality
let colorMode = false;

function toggleColorMode() {
    colorMode = !colorMode;
    const btn = document.getElementById('color-mode-btn');
    
    if (colorMode) {
        btn.textContent = '🎨 Exit Color';
        btn.style.background = '#8C4FFF';
        showColorButtons();
        showMessage('🎨 Color mode enabled', 'success');
    } else {
        btn.textContent = '🎨 Color Mode';
        btn.style.background = '#FF9900';
        hideColorButtons();
        showMessage('🎨 Color mode disabled', 'success');
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
                right: 8px;
                background: var(--aws-orange);
                color: white;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
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
        showMessage('🎨 Color applied!', 'success');
        saveNow(); // Save the color change
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

function addParticipant() {
    const tbody = document.getElementById('participantsBody');
    if (!tbody) {
        console.log('❌ Could not find participants table');
        return;
    }

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
    saveNow();
    showMessage('👤 Participant added!');
}

function deleteParticipant(button) {
    if (confirm('Delete this participant?')) {
        button.closest('tr').remove();
        console.log('👤 Deleted participant');
        saveNow();
        showMessage('👤 Participant deleted!');
    }
}

function showAddActivityModal(dayName) {
    console.log('🎯 Opening add activity modal for:', dayName);
    
    // Remove any existing modal first
    const existingModal = document.querySelector('.add-activity-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
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
        <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            <h3 style="margin-top: 0; color: #333;">Add New Activity to ${dayName}</h3>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #555;">Time:</label>
                <input type="text" id="newActivityTime" placeholder="e.g., 2:00 PM - 3:00 PM" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" required>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #555;">Activity Title:</label>
                <input type="text" id="newActivityTitle" placeholder="e.g., Team Discussion" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" required>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #555;">Description:</label>
                <textarea id="newActivityDescription" placeholder="e.g., Owner: John | Timekeeper: Jane" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px; height: 80px; font-size: 1rem; resize: vertical;"></textarea>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #555;">Activity Type:</label>
                <select id="newActivityType" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;">
                    <option value="meeting">🏢 Meeting</option>
                    <option value="workshop">🛠️ Workshop</option>
                    <option value="demo">💻 Demo</option>
                    <option value="social">🍽️ Social</option>
                    <option value="break">☕ Break</option>
                    <option value="free">🆓 Free Time</option>
                    <option value="arrival">✈️ Arrival</option>
                </select>
            </div>
            <div style="text-align: right; border-top: 1px solid #eee; padding-top: 1rem;">
                <button type="button" id="cancelActivityBtn" style="background: #6c757d; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; margin-right: 1rem; font-size: 1rem;">Cancel</button>
                <button type="button" id="addActivityBtn" style="background: #28a745; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-size: 1rem;">Add Activity</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('✅ Modal created and added to page');
    
    // Add event listeners
    document.getElementById('cancelActivityBtn').addEventListener('click', function() {
        console.log('❌ Cancel clicked');
        closeAddActivityModal();
    });
    
    document.getElementById('addActivityBtn').addEventListener('click', function() {
        console.log('✅ Add Activity clicked');
        
        const time = document.getElementById('newActivityTime').value.trim();
        const title = document.getElementById('newActivityTitle').value.trim();
        const description = document.getElementById('newActivityDescription').value.trim();
        const type = document.getElementById('newActivityType').value;
        
        if (!time || !title) {
            alert('Please fill in both Time and Activity Title');
            return;
        }
        
        console.log('📝 Creating activity:', { time, title, description, type, dayName });
        addActivityToDay(dayName, time, title, description, type);
        closeAddActivityModal();
    });
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            console.log('🖱️ Background clicked');
            closeAddActivityModal();
        }
    });
    
    // Focus on first input
    setTimeout(function() {
        document.getElementById('newActivityTime').focus();
    }, 100);
}

function addActivityToDay(dayName, time, title, description, type) {
    console.log('🎯 Adding activity to day:', dayName);
    console.log('📝 Activity details:', { time, title, description, type });
    
    // Find the correct day column
    const dayColumns = document.querySelectorAll('.day-column');
    let targetColumn = null;
    
    console.log(`🔍 Found ${dayColumns.length} day columns`);
    
    dayColumns.forEach(function(column, index) {
        const dayTitle = column.querySelector('h3');
        if (dayTitle) {
            const dayText = dayTitle.textContent.trim();
            console.log(`📅 Day ${index}: "${dayText}"`);
            if (dayText === dayName) {
                targetColumn = column;
                console.log(`✅ Found target column for ${dayName}`);
            }
        }
    });
    
    if (!targetColumn) {
        console.error('❌ Could not find day column for:', dayName);
        alert('Error: Could not find the day column. Please try again.');
        return;
    }
    
    // Create new activity element with delete and move buttons
    const newActivity = document.createElement('div');
    newActivity.className = `time-slot ${type}`;
    newActivity.setAttribute('data-category', type);
    newActivity.setAttribute('data-activity', `custom-${Date.now()}`);
    newActivity.draggable = true;
    
    newActivity.innerHTML = `
        <button class="delete-activity-btn" onclick="deleteActivity(this)" title="Delete Activity">🗑️</button>
        <div class="move-buttons">
            <button class="move-btn" onclick="moveActivity(this, 'up')" title="Move Up">↑</button>
            <button class="move-btn" onclick="moveActivity(this, 'down')" title="Move Down">↓</button>
        </div>
        <div class="time" contenteditable="true">${time}</div>
        <div class="session">
            <h4 contenteditable="true">${title}</h4>
            ${description ? `<p contenteditable="true">${description}</p>` : '<p contenteditable="true">Click to add description</p>'}
        </div>
    `;
    
    // Add the new activity to the day column (before the add button)
    const addButton = targetColumn.querySelector('.add-activity-btn');
    if (addButton && addButton.parentElement) {
        // Insert before the day header (which contains the add button)
        targetColumn.insertBefore(newActivity, addButton.parentElement.nextSibling);
    } else {
        // Fallback: just append to the column
        targetColumn.appendChild(newActivity);
    }
    
    console.log(`✅ Added new activity "${title}" to ${dayName}`);
    
    // Setup drag and drop for the new activity
    setupDragAndDrop();
    
    // Save the changes immediately
    setTimeout(function() {
        saveNow();
    }, 100);
    
    showMessage(`✅ Activity "${title}" added to ${dayName}!`, 'success');
}

function closeAddActivityModal() {
    const modal = document.querySelector('.add-activity-modal');
    if (modal) {
        modal.remove();
    }
}

// Delete Activity Function
function deleteActivity(button) {
    const activity = button.closest('.time-slot');
    const activityTitle = activity.querySelector('h4')?.textContent || 'this activity';
    
    if (confirm(`Are you sure you want to delete "${activityTitle}"?`)) {
        console.log('🗑️ Deleting activity:', activityTitle);
        activity.remove();
        
        // Save changes immediately
        setTimeout(function() {
            saveNow();
        }, 100);
        
        showMessage(`🗑️ Activity "${activityTitle}" deleted!`, 'success');
    }
}

// Initialize Drag and Drop for Activities
function initializeDragAndDrop() {
    console.log('🔄 Initializing drag and drop for activities...');
    
    // Make all time-slots draggable
    document.addEventListener('DOMContentLoaded', function() {
        setupDragAndDrop();
    });
    
    // Re-setup drag and drop after loading saved data
    setTimeout(setupDragAndDrop, 500);
}

function setupDragAndDrop() {
    const timeSlots = document.querySelectorAll('.time-slot');
    const dayColumns = document.querySelectorAll('.day-column');
    
    console.log(`🔄 Setting up drag and drop for ${timeSlots.length} activities`);
    
    // Make activities draggable
    timeSlots.forEach(function(slot) {
        slot.draggable = true;
        
        slot.addEventListener('dragstart', function(e) {
            console.log('🎯 Drag started:', slot.querySelector('h4')?.textContent);
            slot.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', slot.outerHTML);
            e.dataTransfer.setData('text/plain', slot.dataset.activity || '');
        });
        
        slot.addEventListener('dragend', function(e) {
            console.log('🎯 Drag ended');
            slot.classList.remove('dragging');
            
            // Remove drag-over class from all columns
            dayColumns.forEach(col => col.classList.remove('drag-over'));
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
            // Only remove if we're actually leaving the column
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
                
                // Add to new location (before the add button)
                const addButton = column.querySelector('.add-activity-btn');
                if (addButton && addButton.parentElement) {
                    column.insertBefore(draggedElement, addButton.parentElement.nextSibling);
                } else {
                    column.appendChild(draggedElement);
                }
                
                // Re-setup drag and drop for the moved element
                setupDragAndDrop();
                
                // Save changes
                setTimeout(function() {
                    saveNow();
                }, 100);
                
                showMessage('📍 Activity moved to new day!', 'success');
            }
        });
    });
}

// Add move up/down buttons to activities
function addMoveButtons() {
    const timeSlots = document.querySelectorAll('.time-slot');
    
    timeSlots.forEach(function(slot) {
        // Don't add if already has move buttons
        if (slot.querySelector('.move-buttons')) return;
        
        const moveButtons = document.createElement('div');
        moveButtons.className = 'move-buttons';
        moveButtons.innerHTML = `
            <button class="move-btn" onclick="moveActivity(this, 'up')" title="Move Up">↑</button>
            <button class="move-btn" onclick="moveActivity(this, 'down')" title="Move Down">↓</button>
        `;
        
        slot.appendChild(moveButtons);
    });
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
    
    // Save changes
    setTimeout(function() {
        saveNow();
    }, 100);
    
    showMessage(`📍 Activity moved ${direction}!`, 'success');
}

// Make functions available globally
window.saveNow = saveNow;
window.loadEverything = loadEverything;
window.testNow = testNow;
window.deleteParticipant = deleteParticipant;
window.showAddActivityModal = showAddActivityModal;
window.closeAddActivityModal = closeAddActivityModal;
window.deleteActivity = deleteActivity;
window.moveActivity = moveActivity;

console.log('🎉 BASIC save system ready!');
