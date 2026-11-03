# 🧮 Modern Simple Calculator

A modern, responsive, and accessible web-based calculator built with clean vanilla JavaScript, semantic HTML5, and modern CSS3. Designed with a modular architecture, floating-point precision handling, full keyboard navigation, dark/light theme switching, and calculation history.

![Calculator Preview](https://raw.githubusercontent.com/Calista2628/Calista2628/main/preview.png)

---

## ✨ Features

- **Core Arithmetic Operations**: Addition (`+`), subtraction (`−`), multiplication (`×`), and division (`÷`).
- **Precision & Formatting**: Floating-point precision rounding (avoids `0.1 + 0.2 = 0.30000000000000004` issues) and localized comma digit separation.
- **Advanced Helper Controls**:
  - `AC` (All Clear): Resets the entire calculator state.
  - `CE` (Clear Entry): Clears the current input while preserving previous operations.
  - `±` (Toggle Sign): Flips current operand between positive and negative.
  - `%` (Percentage): Calculates percentages instantly.
  - `Backspace`: Deletes the last entered digit.
- **Calculation History**: Collapsible history drawer storing recent calculations with click-to-recall support.
- **Dark / Light Mode**: Seamless theme switching with user preference saved in `localStorage`.
- **Full Keyboard Navigation**: Type numbers and operations directly using your keyboard or numpad.
- **Accessible & Responsive**: Follows ARIA standards for screen readers and adapts smoothly across desktop and mobile viewports.
- **Zero External Runtime Dependencies**: Pure vanilla JavaScript with ES modules.
- **Tested**: Comprehensive unit test suite using Node.js native test runner.

---

## 📁 Project Structure

```
├── index.html            # Main application HTML markup & ARIA accessibility
├── style.css             # Design tokens, CSS variables, dark/light themes, and layout
├── package.json          # Project metadata, scripts, and dev configuration
├── src/
│   ├── app.js            # UI controller, event delegation, and theme/history handling
│   └── calculator.js     # Core calculator logic engine (pure ES module, decoupled from DOM)
├── tests/
│   └── calculator.test.js# Unit tests covering arithmetic, chaining, precision, and edge cases
└── README.md             # Project documentation and usage guide
```

---

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- (Optional, for running tests or local server) [Node.js](https://nodejs.org/) v18+

### Quick Start (Running Locally)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Calista2628/Calista2628.git
   cd Calista2628
   ```

2. **Open directly in browser**:
   Simply open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html

   # On Linux
   xdg-open index.html

   # On Windows
   start index.html
   ```

3. **Or run with a local web server (Recommended for ES Modules)**:
   ```bash
   npm start
   ```
   or
   ```bash
   npx serve .
   ```
   Then navigate to `http://localhost:3000`.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `0` – `9` | Enter numbers |
| `.` | Decimal point |
| `+` | Add |
| `-` | Subtract |
| `*` or `x` | Multiply |
| `/` | Divide |
| `%` | Percentage |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last entered digit |
| `Escape` | All Clear (AC) |
| `H` or `h` | Toggle calculation history |
| `T` or `t` | Toggle Dark / Light theme |

---

## 🧪 Running Tests

The project includes unit tests for the core logic engine using the built-in Node.js test runner (`node:test` and `node:assert`).

Run the test suite:
```bash
npm test
```

### Test Coverage Highlights

- Initial state initialization and digit appending
- Decimal point prevention and leading decimals
- Sign toggling and negative zero checks
- All arithmetic operations (`+`, `-`, `*`, `/`)
- Safe handling of division by zero (returns informative message rather than crashing)
- Floating-point accuracy (e.g. `0.1 + 0.2 = 0.3`)
- Operation chaining (e.g. `10 + 5 * 2 = 30`)
- Display formatting with thousand separators

---

## 🛠️ Technology Stack

- **HTML5**: Semantic tags, ARIA roles, and accessibility attributes.
- **CSS3**: CSS Custom Properties (variables), CSS Grid, Flexbox, smooth transitions, and responsive media queries.
- **JavaScript (ES6+)**: ES Modules, object-oriented design, decoupled engine architecture.
- **Node.js**: Native test runner for zero-dependency unit testing.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
