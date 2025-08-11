# EMEA FTO Offsite - October 2025

A GitHub Pages website for the EMEA FTO team offsite in Barcelona, featuring AWS branding and interactive functionality.

## Features

- **AWS-branded design** with official colors and styling
- **Interactive agenda** in calendar format
- **Participant management** with editable travel details and dietary restrictions
- **Auto-save functionality** using localStorage
- **Export to CSV** for participant data
- **Responsive design** for mobile and desktop
- **Barcelona information** including weather, office location, and local recommendations

## Setup Instructions

### 1. Create GitHub Repository

1. Create a new repository on GitHub (make it public for GitHub Pages)
2. Upload all files from this directory to the repository
3. Go to repository Settings → Pages
4. Set Source to "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click Save

### 2. Access the Website

Your website will be available at: `https://[your-username].github.io/[repository-name]`

### 3. Customize the Content

#### Update the Agenda
Edit the `index.html` file to replace the sample agenda with your actual schedule:
- Modify the `.day-column` sections
- Update times, session titles, and descriptions
- Add or remove days as needed

#### Add Real Participants
- Use the website interface to add/edit participants
- Data is automatically saved to browser localStorage
- Export participant data to CSV when needed

#### Customize Styling
Edit `styles.css` to modify:
- Colors (AWS brand colors are pre-defined in CSS variables)
- Layout and spacing
- Typography

## File Structure

```
emea-fto-offsite/
├── index.html          # Main website file
├── styles.css          # AWS-branded styling
├── script.js           # Interactive functionality
├── README.md           # This file
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions deployment
```

## Interactive Features

### Participant Management
- **Add Participants**: Click the "+ Add Participant" button
- **Edit Information**: Click on any cell to edit inline
- **Delete Participants**: Use the Delete button in each row
- **Auto-save**: Changes are saved automatically every 30 seconds
- **Export Data**: Click "📊 Export to CSV" to download participant data

### Keyboard Shortcuts
- `Ctrl+S`: Manual save
- `Ctrl+E`: Export to CSV
- `Enter`: Confirm edits in table cells

## Customization Guide

### Adding New Agenda Items
```html
<div class="time-slot">
    <div class="time">HH:MM - HH:MM</div>
    <div class="session">
        <h4>Session Title</h4>
        <p>Session description</p>
    </div>
</div>
```

### Modifying Colors
Update CSS variables in `styles.css`:
```css
:root {
    --aws-orange: #FF9900;
    --aws-dark-blue: #232F3E;
    /* Add your custom colors */
}
```

### Adding New Information Sections
Follow the pattern in the Barcelona Information section:
```html
<div class="info-card">
    <h3>🏢 Title</h3>
    <p><strong>Label:</strong> Information</p>
</div>
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design included

## Data Privacy

- All participant data is stored locally in the browser
- No data is sent to external servers
- Export functionality creates local CSV files only

## Support

For technical issues or feature requests, contact the EMEA FTO team or create an issue in the GitHub repository.

## AWS Branding Compliance

This website uses official AWS brand colors and follows AWS design guidelines:
- Primary: AWS Orange (#FF9900)
- Secondary: AWS Dark Blue (#232F3E)
- Typography: Amazon Ember font family
- Logo: Simplified AWS logo in SVG format

---

**Note**: Remember to replace the sample agenda with your actual offsite schedule and update participant information as needed.
