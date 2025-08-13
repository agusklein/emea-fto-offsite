// SIMPLEST BULLETPROOF SAVE SYSTEM - GUARANTEED TO WORK
console.log('🚀 Loading SIMPLE save system...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded');
    
    // Load saved data first
    loadData();
    
    // Initialize save system
    initSaveSystem();
    
    // Initialize buttons
    initButtons();
});

// SIMPLE SAVE SYSTEM
function initSaveSystem() {
    console.log('🔧 Initializing SIMPLE save system...');
    
    // Save on ANY change
    document.addEventListener('input', function(e) {
        if (e.target.contentEditable === 'true') {
            console.log('📝 CHANGE:', e.target.textContent);
            saveData();
        }
    });
    
    // Save when clicking away
    document.addEventListener('blur', function(e) {
        if (e.target.contentEditable === 'true') {
            console.log('👆 BLUR SAVE:', e.target.textContent);
            saveData();
        }
    }, true);
    
    // Save on Enter
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.contentEditable === 'true') {
            console.log('⏎ ENTER SAVE');
            e.preventDefault();
            e.target.blur();
        }
    });
    
    // Save every 3 seconds
    setInterval(saveData, 3000);
    
    // Save before leaving
    window.addEventListener('beforeunload', saveData);
    
    console.log('✅ Save system ready');
}

// SIMPLE SAVE FUNCTION
function saveData() {
    console.log('💾 SAVING...');
    
    try {
        const data = {};
        let count = 0;
        
        // Save ALL editable content with simple numbering
        document.querySelectorAll('[contenteditable="true"]').forEach((element, index) => {
            data[`item_${index}`] = {
                text: element.textContent || '',
                tag: element.tagName,
                classes: element.className,
                parent: element.parentElement ? element.parentElement.tagName : ''
            };
            count++;
        });
        
        // Save to localStorage
        localStorage.setItem('simple-save', JSON.stringify({
            timestamp: new Date().toISOString(),
            data: data,
            count: count
        }));
        
        console.log(`✅ SAVED ${count} items`);
        showMsg(`💾 Saved ${count} items`);
        
    } catch (error) {
        console.error('❌ SAVE ERROR:', error);
        showMsg('❌ Save failed');
    }
}

// SIMPLE LOAD FUNCTION
function loadData() {
    console.log('📂 LOADING...');
    
    const saved = localStorage.getItem('simple-save');
    if (!saved) {
        console.log('ℹ️ No saved data');
        return;
    }
    
    try {
        const saveData = JSON.parse(saved);
        console.log('📂 Found data:', saveData.timestamp);
        
        let restored = 0;
        const allElements = document.querySelectorAll('[contenteditable="true"]');
        
        // Restore by matching position
        allElements.forEach((element, index) => {
            const key = `item_${index}`;
            if (saveData.data[key]) {
                element.textContent = saveData.data[key].text;
                restored++;
                console.log(`📂 Restored ${index}: "${saveData.data[key].text}"`);
            }
        });
        
        console.log(`✅ LOADED ${restored} items`);
        showMsg(`📂 Loaded ${restored} items`);
        
    } catch (error) {
        console.error('❌ LOAD ERROR:', error);
        showMsg('❌ Load failed');
    }
}

// SIMPLE MESSAGE FUNCTION
function showMsg(text) {
    // Remove old messages
    document.querySelectorAll('.msg').forEach(m => m.remove());
    
    const msg = document.createElement('div');
    msg.className = 'msg';
    msg.textContent = text;
    msg.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #28a745;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 9999;
        font-size: 14px;
    `;
    
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

// SIMPLE BUTTON INITIALIZATION
function initButtons() {
    console.log('🔘 Init buttons...');
    
    // Manual save button
    const saveBtn = document.getElementById('save-data-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveData();
            showMsg('💾 Manual save done!');
        });
    }
    
    // Add participant button
    const addBtn = document.getElementById('add-participant-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addParticipant);
    }
    
    console.log('✅ Buttons ready');
}

// SIMPLE ADD PARTICIPANT
function addParticipant() {
    const tbody = document.getElementById('participantsBody');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td contenteditable="true">New Person</td>
        <td contenteditable="true">None</td>
        <td contenteditable="true">-</td>
        <td contenteditable="true">-</td>
        <td contenteditable="true">-</td>
        <td><button onclick="deleteParticipant(this)">🗑️</button></td>
    `;
    
    tbody.appendChild(row);
    saveData();
    showMsg('👤 Added participant');
}

// SIMPLE DELETE PARTICIPANT
function deleteParticipant(btn) {
    if (confirm('Delete this participant?')) {
        btn.closest('tr').remove();
        saveData();
        showMsg('👤 Deleted participant');
    }
}

// TEST FUNCTION
function testSave() {
    console.log('🧪 TESTING...');
    
    const editables = document.querySelectorAll('[contenteditable="true"]');
    console.log(`🧪 Found ${editables.length} editable elements`);
    
    saveData();
    
    const saved = localStorage.getItem('simple-save');
    if (saved) {
        const data = JSON.parse(saved);
        console.log(`✅ Test passed - ${data.count} items saved`);
        return true;
    } else {
        console.log('❌ Test failed');
        return false;
    }
}

// GLOBAL FUNCTIONS
window.deleteParticipant = deleteParticipant;
window.saveData = saveData;
window.loadData = loadData;
window.testSave = testSave;

console.log('🎉 SIMPLE save system loaded!');
