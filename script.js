// Interactive functionality for the EMEA FTO Offsite website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeEditableCells();
    loadSavedData();
    
    // Auto-save functionality
    setInterval(saveData, 30000); // Save every 30 seconds
});

// Initialize editable cells with better UX
function initializeEditableCells() {
    const editableCells = document.querySelectorAll('.editable');
    
    editableCells.forEach(cell => {
        // Add placeholder text styling
        if (cell.textContent.trim() === 'Click to edit') {
            cell.classList.add('placeholder');
        }
        
        // Focus event
        cell.addEventListener('focus', function() {
            if (this.classList.contains('placeholder')) {
                this.textContent = '';
                this.classList.remove('placeholder');
            }
        });
        
        // Blur event
        cell.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = 'Click to edit';
                this.classList.add('placeholder');
            }
            saveData();
        });
        
        // Enter key handling
        cell.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });
    });
}

// Add new participant row
function addParticipant() {
    const table = document.getElementById('participantsTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td contenteditable="true" class="editable placeholder">Enter name</td>
        <td contenteditable="true" class="editable placeholder">Enter dietary restrictions</td>
        <td contenteditable="true" class="editable placeholder">Click to edit</td>
        <td contenteditable="true" class="editable placeholder">Click to edit</td>
        <td contenteditable="true" class="editable placeholder">Click to edit</td>
        <td><button onclick="deleteRow(this)" class="delete-btn">Delete</button></td>
    `;
    
    // Initialize the new editable cells
    const newEditableCells = newRow.querySelectorAll('.editable');
    newEditableCells.forEach(cell => {
        cell.addEventListener('focus', function() {
            if (this.classList.contains('placeholder')) {
                this.textContent = '';
                this.classList.remove('placeholder');
            }
        });
        
        cell.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = this.textContent.includes('name') ? 'Enter name' : 
                                 this.textContent.includes('dietary') ? 'Enter dietary restrictions' : 'Click to edit';
                this.classList.add('placeholder');
            }
            saveData();
        });
        
        cell.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });
    });
    
    // Focus on the first cell of the new row
    newEditableCells[0].focus();
    
    saveData();
}

// Delete participant row
function deleteRow(button) {
    if (confirm('Are you sure you want to delete this participant?')) {
        const row = button.closest('tr');
        row.remove();
        saveData();
    }
}

// Save data to localStorage
function saveData() {
    const tableData = [];
    const rows = document.querySelectorAll('#participantsTable tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            tableData.push({
                name: cells[0].textContent,
                dietary: cells[1].textContent,
                arrival: cells[2].textContent,
                departure: cells[3].textContent,
                hotel: cells[4].textContent
            });
        }
    });
    
    localStorage.setItem('emea-fto-participants', JSON.stringify(tableData));
    
    // Show save indicator
    showSaveIndicator();
}

// Load saved data from localStorage
function loadSavedData() {
    const savedData = localStorage.getItem('emea-fto-participants');
    if (savedData) {
        try {
            const tableData = JSON.parse(savedData);
            const tbody = document.querySelector('#participantsTable tbody');
            
            // Clear existing rows except the first two sample rows
            const existingRows = tbody.querySelectorAll('tr');
            existingRows.forEach((row, index) => {
                if (index >= 2) {
                    row.remove();
                }
            });
            
            // Add saved rows (skip first two if they match sample data)
            tableData.forEach((participant, index) => {
                if (index < 2) {
                    // Update existing sample rows
                    const row = existingRows[index];
                    if (row) {
                        const cells = row.querySelectorAll('td');
                        if (cells.length >= 5) {
                            cells[0].textContent = participant.name;
                            cells[1].textContent = participant.dietary;
                            cells[2].textContent = participant.arrival;
                            cells[3].textContent = participant.departure;
                            cells[4].textContent = participant.hotel;
                            
                            // Remove placeholder class if content is not placeholder
                            cells.forEach(cell => {
                                if (cell.classList.contains('editable') && 
                                    !cell.textContent.includes('Click to edit') && 
                                    !cell.textContent.includes('Enter')) {
                                    cell.classList.remove('placeholder');
                                }
                            });
                        }
                    }
                } else {
                    // Add new rows for additional participants
                    addParticipantFromData(participant);
                }
            });
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

// Add participant from saved data
function addParticipantFromData(participant) {
    const table = document.getElementById('participantsTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td contenteditable="true" class="editable">${participant.name}</td>
        <td contenteditable="true" class="editable">${participant.dietary}</td>
        <td contenteditable="true" class="editable">${participant.arrival}</td>
        <td contenteditable="true" class="editable">${participant.departure}</td>
        <td contenteditable="true" class="editable">${participant.hotel}</td>
        <td><button onclick="deleteRow(this)" class="delete-btn">Delete</button></td>
    `;
    
    // Initialize the new editable cells
    const newEditableCells = newRow.querySelectorAll('.editable');
    newEditableCells.forEach(cell => {
        // Remove placeholder class if content is meaningful
        if (!cell.textContent.includes('Click to edit') && 
            !cell.textContent.includes('Enter')) {
            cell.classList.remove('placeholder');
        }
        
        cell.addEventListener('focus', function() {
            if (this.classList.contains('placeholder')) {
                this.textContent = '';
                this.classList.remove('placeholder');
            }
        });
        
        cell.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = 'Click to edit';
                this.classList.add('placeholder');
            }
            saveData();
        });
        
        cell.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });
    });
}

// Show save indicator
function showSaveIndicator() {
    // Remove existing indicator
    const existingIndicator = document.querySelector('.save-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create and show new indicator
    const indicator = document.createElement('div');
    indicator.className = 'save-indicator';
    indicator.textContent = '✓ Saved';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1B660F;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    
    document.body.appendChild(indicator);
    
    // Animate in
    setTimeout(() => {
        indicator.style.opacity = '1';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 300);
    }, 2000);
}

// Export data functionality
function exportData() {
    const tableData = [];
    const rows = document.querySelectorAll('#participantsTable tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            tableData.push({
                Name: cells[0].textContent,
                'Dietary Restrictions': cells[1].textContent,
                'Arrival Date/Time': cells[2].textContent,
                'Departure Date/Time': cells[3].textContent,
                Hotel: cells[4].textContent
            });
        }
    });
    
    // Convert to CSV
    const csv = convertToCSV(tableData);
    downloadCSV(csv, 'emea-fto-participants.csv');
}

// Convert data to CSV format
function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    return csvContent;
}

// Download CSV file
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Add export button to the page
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.add-btn');
    if (addButton) {
        const exportButton = document.createElement('button');
        exportButton.textContent = '📊 Export to CSV';
        exportButton.className = 'add-btn';
        exportButton.style.marginLeft = '10px';
        exportButton.onclick = exportData;
        addButton.parentNode.insertBefore(exportButton, addButton.nextSibling);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveData();
    }
    
    // Ctrl+E to export
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});

// Add CSS for placeholder styling
const style = document.createElement('style');
style.textContent = `
    .placeholder {
        color: #999 !important;
        font-style: italic;
    }
    
    .save-indicator {
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(style);
