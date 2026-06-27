# 🛡️ Dharmapala Shield

> *A Buddhist Cyberpunk Tower Defense Game*

Defend the digital realm with ancient wisdom and cutting-edge technology. Place mystical defense towers, battle corrupted entities, and protect the sacred servers from digital defilement.

## 🌸 Features

- **🧘 Buddhist-Cyberpunk Fusion**: Unique aesthetic combining ancient wisdom with futuristic technology
- **🏗️ Strategic Defense Placement**: Six unique defense types with distinct abilities and upgrade paths
- **👾 Diverse Enemy Types**: From script kiddies to quantum hackers, each with unique behaviors
- **👑 Epic Boss Battles**: Multi-phase boss encounters with dynamic abilities
- **🏆 Achievement System**: Track progress and unlock rewards across multiple categories
- **📱 Mobile-First Design**: Touch controls and responsive design for all devices
- **💾 Progressive Saves**: Automatic save system preserves your meditation journey

## 🚀 Quick Start

### Prerequisites

- Node.js 22 or newer
- Modern web browser with ES modules and Canvas API support
- Local storage enabled
- Touch events (for mobile play)

### Installation

1. **Install and start**

   ```bash
   npm install
   npm start
   ```

2. **Open the game**

   Navigate to [http://localhost:3000](http://localhost:3000). The actual game is
   served at `/`; there is no separate framework or backend application.

3. **Start Playing**
   - Click "New Game" to begin your meditation journey
   - Place defenses by clicking/tapping on the game field
   - Survive waves of digital corruption
   - Earn resources and upgrade your defenses

## 🎮 How to Play

### Resources

- **🧘 Dharma**: Primary currency for placing and upgrading defenses
- **📡 Bandwidth**: Required for advanced defenses and special abilities
- **🔒 Anonymity**: Rare resource needed for elite cyber-monk defenses

### Defense Types

1. **🛡️ Firewall Fortress** – Basic blocking defense with prayer flag flair
2. **🔐 Encryption Monastery** – Scrambles data packets with rotating ciphers
3. **🎯 Decoy Temple** – False targets that misdirect attackers
4. **🔁 Mirror Server** – Reflects hostile traffic back to its source
5. **🕶️ Anonymity Shroud** – Cloaks friendly network activity
6. **📡 Dharma Distributor** – Speeds up delivery and resource flow

### Enemy Types

- **Script Kiddie**: Fast, erratic movement patterns
- **Federal Agent**: Persistent, speeds up near defenses
- **Corporate Saboteur**: Stealth capabilities, periodically invisible
- **AI Surveillance**: Adaptive scanning, learns from defense patterns
- **Quantum Hacker**: Phase-shifting and teleportation abilities
- **Corrupted Monk**: Healing aura, corrupts nearby defenses

### Boss Encounters

- **Raid Team**: Spawns minions and uses EMP bursts
- **MegaCorp Titan**: Shield regeneration and market manipulation

### Controls

#### Desktop
- **Left Click**: Place defense / Select UI elements
- **Space**: Pause/Resume game
- **ESC**: Open main menu
- **1–6**: Select defense type
- **N**: Start next wave

#### Mobile
- **Tap**: Place defense / Select
- **Virtual Controls**: On-screen buttons for mobile devices

## 🏗️ Architecture

Dharmapala Shield is a client-only application. Game state, rendering, saves, audio,
and balance loading all run in the browser. The Node scripts only build and serve
static files; there is no database, WebSocket server, or application backend.

### Core Systems

```
js/
├── main.js                    # Game bootstrap and initialization
├── config.js                  # Game configuration and constants
├── utils.js                   # Shared utility functions
├── GameSystemManager.js       # System initialization and management
├── ScreenManager.js           # Screen navigation and UI flow
├── DefenseManager.js          # Defense placement and management
├── UIManager.js              # User interface updates and notifications
└── input.js                   # Input handling and mapping
```

### Gameplay Components

```
js/
├── defense.js                # Defense tower logic and behavior
├── enemy.js                  # Enemy AI and movement
├── Boss.js                   # Boss mechanics and phase transitions
├── Projectile.js             # Projectile physics and collision
├── level.js                  # Level progression and wave management
├── pathGenerator.js          # Dynamic path generation
└── particle.js               # Visual effects system
```

### Support Systems

```
js/
├── achievementManager.js     # Achievement tracking and rewards
├── audioManager.js           # Sound effects and music
├── saveSystem.js             # Save/load game state
├── mobile.js                 # Mobile-specific functionality
└── mobile.css                # Mobile-responsive design
```

## 🔧 Development

### Project Structure

```
dharmapala-shield/
├── index.html              # Main game entry point
├── README.md              # This documentation
├── js/                    # JavaScript game logic
├── css/                   # Stylesheets and theming
├── design/                # Runtime balance configuration
├── scripts/               # Static build and server scripts
├── tools/                 # Balance simulator and tuner
└── dist/                  # Generated production site (not committed)
```

### Commands

```bash
npm run build       # Create the production site in dist/
npm run dev         # Build and serve the game at http://localhost:3000
npm start           # Production-equivalent static build and server
npm run sim:normal  # Run the deterministic balance simulator
```

### Code Style

- **ES6+ JavaScript**: Modern syntax with classes and modules
- **Modular Design**: Single responsibility principle, loose coupling
- **Event-Driven**: Pub/sub pattern for system communication
- **Performance-First**: Object pooling, efficient rendering
- **Mobile-Friendly**: Touch controls, responsive design

## 🧪 Validation

`npm run build` verifies that the complete client application can be assembled into
`dist/`. The balance simulator can be run with the `sim:easy`, `sim:normal`, and
`sim:hard` scripts. Automated browser and unit tests are not yet included.

## 📱 Mobile Support

The game is designed mobile-first with:

- **Touch Controls**: Basic tap support with virtual controls
- **Responsive Design**: Adapts to all screen sizes and orientations
- **Performance Optimization**: Reduced effects on low-end devices
- **Accessibility**: Reduced motion support
- **Progressive Enhancement**: Graceful degradation for older devices

## 🌐 Browser Compatibility

- **Chrome/Chromium**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (iOS/macOS)
- **Edge**: Full support
- **Older Browsers**: Graceful degradation with feature detection

## 🔧 Configuration

Game settings can be customized in `js/config.js`:

```javascript
const CONFIG = {
    CANVAS_WIDTH: window.innerWidth > 768 ? 1200 : window.innerWidth,
    CANVAS_HEIGHT: window.innerWidth > 768 ? 800 : window.innerHeight * 0.6,
    GRID_SIZE: window.innerWidth > 768 ? 40 : 30,
    INITIAL_DHARMA: 100,
    INITIAL_BANDWIDTH: 50,
    INITIAL_ANONYMITY: 75,
    // ... other settings
};
```

## 🚀 Performance Optimization

The game includes several performance optimizations:

- **Object Pooling**: Reuse projectiles and particles
- **Efficient Rendering**: Canvas optimization and batching
- **Asset Optimization**: Image compression and sprite atlases
- **Memory Management**: Proper cleanup and garbage collection
- **Mobile Optimization**: Reduced effects and quality settings

## 🎯 Accessibility

The game includes accessibility features:

- **Keyboard Shortcuts**: Pause, menu access, and defense selection
- **Screen Reader Announcements**: Achievement notifications use ARIA live regions
- **Reduced Motion Support**: Certain effects respect `prefers-reduced-motion`
- **High Contrast Mode**: Enhanced visibility for users with visual impairments

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the Repository**
2. **Create a Feature Branch**
3. **Write Tests First** (TDD approach)
4. **Implement Changes**
5. **Ensure All Tests Pass**
6. **Submit Pull Request**

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Buddhist Philosophy**: Inspiration for game themes and mechanics
- **Cyberpunk Aesthetics**: Visual design and atmospheric elements
- **Open Source Community**: Libraries, tools, and inspiration

## 📞 Support

For support, questions, or feedback:

- **Issues**: Report bugs and request features
- **Discussions**: Community discussions and ideas

---

*May your defenses be strong and your meditation deep.* 🧘‍♂️✨

*Built with mindfulness, powered by code.* 💻🙏
