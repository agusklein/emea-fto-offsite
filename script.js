// MOST BASIC SAVE SYSTEM - WILL WORK
console.log('🚀 Starting BASIC save system...');

// Wait for page to load
window.addEventListener('load', function() {
    console.log('✅ Page loaded completely');
    
    // Load any saved data first
    loadEverything();
    
    // Set up saving
    setupSaving();
    
    // Test immediately
    setTimeout(testNow, 1000);
});

function setupSaving() {
    console.log('🔧 Setting up saving...');
    
    // Save on ANY input change
    document.body.addEventListener('input', function(e) {
        if (e.target.contentEditable === 'true') {
            console.log('📝 INPUT DETECTED:', e.target.textContent.substring(0, 50));
            saveNow();
        }
    });
    
    // Save when element loses focus
    document.body.addEventListener('focusout', function(e) {
        if (e.target.contentEditable === 'true') {
            console.log('👆 FOCUS OUT:', e.target.textContent.substring(0, 50));
            saveNow();
        }
    });
    
    // Save every 2 seconds automatically
    setInterval(function() {
        console.log('⏰ Auto-save...');
        saveNow();
    }, 2000);
    
    console.log('✅ Saving setup complete');
}

function saveNow() {
    console.log('💾 SAVING NOW...');
    
    try {
        const allData = [];
        const colorData = {}; // Add color data storage
        
        // Get ALL editable elements
        const editables = document.querySelectorAll('[contenteditable="true"]');
        console.log(`Found ${editables.length} editable elements`);
        
        editables.forEach(function(element, index) {
            allData.push({
                index: index,
                text: element.textContent || element.innerText || '',
                tag: element.tagName
            });
        });
        
        // Save activity colors
        document.querySelectorAll('.time-slot').forEach(function(slot, index) {
            const style = slot.style;
            if (style.borderLeftColor || style.borderLeftWidth || style.borderLeftStyle) {
                colorData[`activity_${index}`] = {
                    borderLeftColor: style.borderLeftColor,
                    borderLeftWidth: style.borderLeftWidth,
                    borderLeftStyle: style.borderLeftStyle
                };
                console.log(`💾 Saved color for activity ${index}:`, style.borderLeftColor);
            }
        });
        
        // Save to localStorage
        const saveObject = {
            saved: new Date().toISOString(),
            elements: allData,
            colors: colorData
        };
        
        localStorage.setItem('website-data', JSON.stringify(saveObject));
        
        console.log(`✅ SAVED ${allData.length} elements and ${Object.keys(colorData).length} colors successfully`);
        showMessage(`💾 Saved ${allData.length} items + colors`);
        
        return true;
        
    } catch (error) {
        console.error('❌ SAVE FAILED:', error);
        showMessage('❌ Save failed');
        return false;
    }
}

function loadEverything() {
    console.log('📂 LOADING...');
    
    const saved = localStorage.getItem('website-data');
    if (!saved) {
        console.log('ℹ️ No saved data found');
        return;
    }
    
    try {
        const data = JSON.parse(saved);
        console.log('📂 Found saved data from:', data.saved);
        
        const editables = document.querySelectorAll('[contenteditable="true"]');
        let restored = 0;
        
        editables.forEach(function(element, index) {
            if (data.elements[index]) {
                element.textContent = data.elements[index].text;
                restored++;
            }
        });
        
        // Restore activity colors
        if (data.colors) {
            Object.keys(data.colors).forEach(function(key) {
                const index = key.replace('activity_', '');
                const slots = document.querySelectorAll('.time-slot');
                if (slots[index]) {
                    const colorInfo = data.colors[key];
                    slots[index].style.borderLeftColor = colorInfo.borderLeftColor;
                    slots[index].style.borderLeftWidth = colorInfo.borderLeftWidth;
                    slots[index].style.borderLeftStyle = colorInfo.borderLeftStyle;
                    console.log(`📂 Restored color for activity ${index}:`, colorInfo.borderLeftColor);
                }
            });
            console.log(`✅ RESTORED ${Object.keys(data.colors).length} activity colors`);
        }
        
        console.log(`✅ RESTORED ${restored} elements`);
        showMessage(`📂 Loaded ${restored} items + colors`);
        
    } catch (error) {
        console.error('❌ LOAD FAILED:', error);
        showMessage('❌ Load failed');
    }
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
    const modal = document.createElement('div');
    modal.className = 'add-activity-modal';
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
        <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; width: 90%;">
            <h3>Add New Activity to ${dayName}</h3>
            <form id="addActivityForm">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Time:</label>
                    <input type="text" id="activityTime" placeholder="e.g., 2:00 PM - 3:00 PM" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;" required>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Activity Title:</label>
                    <input type="text" id="activityTitle" placeholder="e.g., Team Discussion" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;" required>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Description:</label>
                    <textarea id="activityDescription" placeholder="e.g., Owner: John | Timekeeper: Jane" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; height: 80px;"></textarea>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Activity Type:</label>
                    <select id="activityType" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
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
                    <button type="button" onclick="closeAddActivityModal()" style="background: #6c757d; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; margin-right: 1rem;">Cancel</button>
                    <button type="submit" style="background: #28a745; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">Add Activity</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('addActivityForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const time = document.getElementById('activityTime').value;
        const title = document.getElementById('activityTitle').value;
        const description = document.getElementById('activityDescription').value;
        const type = document.getElementById('activityType').value;
        
        addActivityToDay(dayName, time, title, description, type);
        closeAddActivityModal();
    });
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAddActivityModal();
        }
    });
}

function addActivityToDay(dayName, time, title, description, type) {
    // Find the correct day column
    const dayColumns = document.querySelectorAll('.day-column');
    let targetColumn = null;
    
    dayColumns.forEach(function(column) {
        const dayTitle = column.querySelector('h3').textContent;
        if (dayTitle === dayName) {
            targetColumn = column;
        }
    });
    
    if (!targetColumn) {
        console.error('Could not find day column for:', dayName);
        return;
    }
    
    // Create new activity element
    const newActivity = document.createElement('div');
    newActivity.className = `time-slot ${type}`;
    newActivity.setAttribute('data-category', type);
    newActivity.setAttribute('data-activity', `custom-${Date.now()}`);
    
    newActivity.innerHTML = `
        <div class="time" contenteditable="true">${time}</div>
        <div class="session">
            <h4 contenteditable="true">${title}</h4>
            <p contenteditable="true">${description}</p>
        </div>
    `;
    
    // Add the new activity to the day column
    targetColumn.appendChild(newActivity);
    
    console.log(`✅ Added new activity "${title}" to ${dayName}`);
    saveNow(); // Save the changes
    showMessage(`✅ Activity "${title}" added to ${dayName}!`, 'success');
}

function closeAddActivityModal() {
    const modal = document.querySelector('.add-activity-modal');
    if (modal) {
        modal.remove();
    }
}

// Make functions available globally
window.saveNow = saveNow;
window.loadEverything = loadEverything;
window.testNow = testNow;
window.deleteParticipant = deleteParticipant;
window.showAddActivityModal = showAddActivityModal;
window.closeAddActivityModal = closeAddActivityModal;

console.log('🎉 BASIC save system ready!');
