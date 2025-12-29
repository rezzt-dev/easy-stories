# Easy Stories

<div align="center">

![Easy Stories Banner](https://img.shields.io/badge/Easy%20Stories-Spotify%20to%20Instagram-1DB954?style=for-the-badge&logo=spotify&logoColor=white)

**Transform your favourite Spotify tracks into polished images ready for Instagram Stories**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

[Live Demo](#) • [Report a Bug](https://github.com/rezzt-devc/easy-stories/issues) • [Request a Feature](https://github.com/rezzt-devc/easy-stories/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Available Themes](#available-themes)
- [Project Structure](#project-structure)
- [Spotify API](#spotify-api)
- [Contributing](#contributing)
- [Licence](#licence)
- [Author](#author)
- [Support](#support)

---

## Overview

**Easy Stories** is a web application that enables users to generate customised images of their favourite Spotify tracks, optimised for sharing on Instagram Stories. The application connects directly to the Spotify API, allowing track search and the creation of professional visual compositions using more than 30 different themes.

### Use Cases

- **Content creators**: Share favourite music on Instagram Stories with a professional layout.
- **Musicians and artists**: Promote releases using visually appealing images.
- **Music enthusiasts**: Express musical taste in a visual format.
- **Community managers**: Produce music-related assets for social media quickly and consistently.

---

## Features

### Core Functionality

- **Spotify authentication**: Secure connection using the Client Credentials Flow.
- **Advanced search**: Search for tracks by title or artist.
- **30+ visual themes**: From minimalist designs to vibrant and cyberpunk-inspired styles.
- **Real-time preview**: Instantly visualise all changes applied to the design.
- **Custom text**: Add personalised messages to the generated images.
- **High-quality export**: Download images in PNG format.
- **Responsive design**: Fully functional on mobile, tablet, and desktop devices.
- **Performance optimisation**: Fast loading times and a smooth user experience.

### Technical Characteristics

- **No backend**: 100% frontend application.
- **Vanilla JavaScript**: No heavy framework dependencies.
- **Canvas API**: Image generation performed in the browser.
- **Modular design**: Structured and maintainable codebase.
- **Accessibility**: Keyboard navigation and ARIA labels.
- **Security**: XSS prevention and input validation mechanisms.

---

## Demo

### Screenshots

> Add application screenshots in this section.

Example flow:

`Start Screen → Track Search → Customisation → Final Output`

### Workflow

1. **Connect** to Spotify using developer credentials.
2. **Search** for the desired track.
3. **Customise** the design and optional text.
4. **Download** the generated image.

---

## Technologies

### Frontend

- **HTML5**: Semantic document structure.
- **CSS3**: Modern styling with CSS variables and animations.
- **JavaScript ES6+**: Modular application logic.

### APIs and Services

- **Spotify Web API**: Track search and metadata retrieval.
- **Canvas API**: Image generation.

### Typography

- **Google Fonts**: Poppins (300, 400, 500, 600, 700).

---

## Installation

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge).
- Spotify developer credentials ([obtain them here](https://developer.spotify.com/dashboard)).

### Local Setup

1. **Clone the repository**
```git
git clone https://github.com/rezzt-devc/easy-stories.git
cd easy-stories
```

2. **Open the application**
Open the `index.html` file directly in a browser or use a local server:
```git
With Python 3
python -m http.server 8000

With Node.js (http-server)
npx http-server

With PHP
php -S localhost:8000
```

3. **Access the application**
Navigate to `http://localhost:8000` in the browser.

---
## Configuration

### Obtaining Spotify Credentials

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Sign in using a Spotify account.
3. Create a new application.
4. Copy the **Client ID** and **Client Secret**.
5. Paste them into the Easy Stories configuration.

### Advanced Configuration

The `js/config.js` file defines canvas settings and visual styles. The following elements can be customised:

- **Canvas dimensions**: `CANVAS_CONFIG.width` and `CANVAS_CONFIG.height`.
- **Theme styles**: `STYLES` object containing all theme definitions.
- **Card configuration**: Position, size, and border configuration.

```css
// Example configuration
window.CANVAS_CONFIG = {
  width: 1080,
  height: 1920,
  card: {
    width: 980,
    height: 1720,
    // Additional configuration options
  }
};
```

---
## Usage
### Step-by-Step Guide

#### 1. Connect to Spotify
1. Enter the Client ID.
2. Enter the Client Secret.
3. Select "Connect with Spotify".

#### 2. Search for a Track
1. Enter the track title or artist name.
2. Press Enter or select the search button.
3. Choose a track from the results list.

#### 3. Customise the Image
1. Select a visual style from the dropdown menu.
2. (Optional) Add custom text.
3. Review the real-time preview.

#### 4. Download
1. Select "Download Image".
2. The image will be saved as a PNG file.

---
### Keyboard Shortcuts

- **Enter** in credential fields: Move to the next field or trigger connection.
- **Enter** in the search field: Execute search.
- **Tab**: Navigate between interactive elements.

---

## Available Themes

### Light Themes (10)

| Theme              | Description             | Palette                     |
|--------------------|-------------------------|-----------------------------|
| **Minimal White**  | Clean minimalist design | White, light grey           |
| **Pure Light**     | Pure white background   | White, black                |
| **macOS Light**    | macOS-inspired          | Light grey, blue            |
| **Paper White**    | Paper-like texture      | Beige, brown                |
| **Corporate Light**| Professional appearance | Grey, corporate blue        |
| **Calm Sky**       | Sky-inspired tones      | Light blue, white           |
| **Sage Light**     | Soft green              | Sage green, cream           |
| **Linen**          | Linen-style texture     | Beige, light brown          |
| **Polar Light**    | Arctic tones            | Ice blue, white             |
| **Cherry Blossom** | Soft pink               | Pink, white                 |

### Dark Themes (10)

| Theme               | Description                  | Palette                   |
|---------------------|------------------------------|---------------------------|
| **Minimal Black**   | Deep minimalist black        | Black, white              |
| **macOS Dark**      | Dark macOS-inspired          | Dark grey, blue           |
| **macOS Black**     | Pure macOS-style black       | Black, grey               |
| **Glass**           | Glassmorphism effect         | Transparency, blur        |
| **Charcoal**        | Charcoal-inspired dark tones | Charcoal grey, white      |
| **Catppuccin**      | Catppuccin colour palette    | Purple, pink, blue        |
| **Neon Night**      | Neon night aesthetic         | Black, neon accents       |
| **Midnight Purple** | Midnight purple theme        | Purple, black             |
| **Forest Green**    | Forest-inspired palette      | Dark green, black         |
| **Ocean Breeze**    | Ocean-inspired palette       | Dark blue, cyan           |

### Vibrant Themes (10)

| Theme              | Description             | Palette                        |
|--------------------|-------------------------|--------------------------------|
| **Rainbow**        | Multicolour rainbow     | Full colour spectrum           |
| **Sunset Blur**    | Blurred sunset          | Orange, pink, purple           |
| **Tropical Punch** | Tropical vibrant tones  | Pink, yellow, green           |
| **Festival**       | Festival-inspired       | Bright multicolour            |
| **Aurora Burst**   | Aurora borealis         | Green, blue, purple           |
| **Neon Coral**     | Neon coral              | Coral, neon pink              |
| **Electric Lime**  | Electric lime           | Lime, neon yellow             |
| **Hot Magenta**    | Intense magenta         | Magenta, pink                 |
| **Royal Crimson**  | Royal crimson           | Red, gold                     |
| **Cyberpunk**      | Cyberpunk aesthetic     | Cyan, magenta, black          |

---
## Project Structure
```text
easy-stories/
│
├── index.html # Main entry point
├── LICENSE # MIT licence
├── README.md # Project documentation
│
├── js/ # JavaScript modules
│ ├── main.js # Core application logic
│ ├── spotify-api.js # Spotify API integration
│ ├── canvas-generator.js # Canvas-based image generation
│ └── config.js # Canvas and style configuration
│
├── styles/ # Stylesheets
│ ├── main.css # Global styles
│ └── components.css # Component-specific styles
│
└── res/ # Assets
└── favicon.ico # Application icon
```

### Key Files

#### `js/main.js`

Contains the main application logic:

- State management.
- Spotify integration.
- Track search.
- Event handling.
- Notification system.

#### `js/spotify-api.js`

Helper module for interaction with the Spotify API:

- Token retrieval.
- Track search.
- Token validation.
- Formatting utilities.

#### `js/canvas-generator.js`

Handles image generation using the Canvas API:

- Background and pattern rendering.
- Album cover drawing.
- Application of visual styles.
- Image export.

#### `js/config.js`

Central configuration:

- Canvas dimensions.
- Definitions for more than 30 visual themes.
- Card and layout configuration.

---

## Spotify API

### Authentication

Easy Stories uses Spotify’s **Client Credentials** flow, which is suitable for applications that do not require access to private user data.

### Endpoints Used

- **Token**: `POST https://accounts.spotify.com/api/token`
- **Search**: `GET https://api.spotify.com/v1/search`

### Rate Limiting

Spotify enforces rate limits on its APIs. Easy Stories handles:

- Expired tokens (automatic renewal).
- 401 errors (redirecting to credentials).
- Response validation.

### Official Documentation

For further details, refer to the [Spotify Web API documentation](https://developer.spotify.com/documentation/web-api).

---

## Contributing

Contributions are welcome. To contribute to Easy Stories:

### Contribution Process

1. **Fork** the repository.
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`).
3. **Commit** changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** the branch (`git push origin feature/AmazingFeature`).
5. **Open** a Pull Request.

### Contribution Guidelines

- Keep the code clean and well documented.
- Follow the existing naming conventions.
- Add JSDoc comments to functions.
- Test changes across multiple browsers.
- Update documentation where necessary.

### Reporting Bugs

To report a bug, open an [issue](https://github.com/rezzt-devc/easy-stories/issues) including:

- Detailed description of the problem.
- Steps to reproduce.
- Expected versus actual behaviour.
- Screenshots where relevant.
- Browser and version information.

### Feature Requests

For feature proposals, open an [issue](https://github.com/rezzt-devc/easy-stories/issues) including:

- Clear feature description.
- Use cases.
- Expected benefits.
- Mockups or examples (optional).

---

## Licence

This project is licensed under the **MIT Licence**. Refer to the [LICENSE](LICENSE) file for full terms.

---

## Author

**rezzt.dev**

- Website: [rezzt.dev](https://rezzt.dev)
- GitHub: [@rezzt-devc](https://github.com/rezzt-devc)

---

## Support

For support or enquiries:

- Use [GitHub Issues](https://github.com/rezzt-devc/easy-stories/issues).
- Visit [rezzt.dev](https://rezzt.dev).

---

<div align="center">

If you find this project useful, consider starring it on GitHub.

Developed by [rezzt.dev](https://rezzt.dev)

</div>

