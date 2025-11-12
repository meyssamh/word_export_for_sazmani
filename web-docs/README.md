# Word Export Module Documentation

This directory contains the complete documentation website for the Word Export Module.

## Overview

The Word Export Module is a comprehensive TypeScript library for generating Word documents from JSON data with advanced multilingual support for Persian and English text.

## Documentation Structure

```
web-docs/
├── index.html          # Main homepage with overview and quick start
├── api.html           # Complete API reference
├── examples.html      # Working examples and use cases  
├── guide.html         # Comprehensive user guide
├── assets/
│   ├── css/
│   │   └── style.css  # Modern, responsive styles
│   ├── js/
│   │   └── main.js    # Interactive functionality
│   └── images/        # Documentation images (if any)
└── README.md          # This file
```

## Features

### 🎨 Modern Design
- Clean, professional layout
- Responsive design that works on all devices
- Syntax highlighting for code examples
- Smooth scrolling navigation

### 📚 Comprehensive Content
- **Homepage**: Overview, features, and quick installation
- **API Reference**: Complete method documentation with examples
- **Examples**: Working code examples for common use cases
- **User Guide**: In-depth guide covering templates, mapping, fonts, and troubleshooting

### 🔧 Interactive Features
- Copy-to-clipboard for all code blocks
- Smooth scrolling navigation
- Responsive mobile menu
- Search functionality (ready for implementation)

## Key Documentation Sections

### API Reference (`api.html`)
- WordExportModule class methods
- DocumentGenerator utilities
- DataTransformer functionality  
- Utility functions
- Complete type definitions

### Examples (`examples.html`)
- Basic usage patterns
- Single document export
- Batch export to ZIP files
- Multilingual document handling
- Custom font configuration
- Error handling best practices

### User Guide (`guide.html`)
- Getting started and installation
- Project structure explanation
- Creating and customizing DOCX templates
- Data mapping configuration
- Font management for Persian/English
- Best practices and troubleshooting

## Usage

### Local Development
```bash
# Serve the documentation locally
cd web-docs
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000` in your browser.

### Deployment
The documentation is static HTML/CSS/JS and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## Customization

### Styling
Edit `assets/css/style.css` to customize:
- Colors and theming
- Typography and fonts
- Layout and spacing
- Responsive breakpoints

### Content
- Update HTML files directly for content changes
- Modify navigation in each file's header
- Add new pages by creating additional HTML files

### JavaScript
Edit `assets/js/main.js` to add:
- Search functionality
- Interactive demos
- Dark mode toggle
- Analytics tracking

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Grid and Flexbox
- **Vanilla JavaScript**: No dependencies
- **Google Fonts**: Inter and JetBrains Mono
- **Responsive Design**: Mobile-first approach

## Contributing

To update the documentation:
1. Edit the relevant HTML files
2. Update styles in `assets/css/style.css`
3. Test locally before deployment
4. Ensure all links and examples work correctly

## License

This documentation is part of the Word Export Module project and shares the same MIT license.
