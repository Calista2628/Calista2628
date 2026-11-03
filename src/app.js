/**
 * UI Controller for Modern Calculator
 * Manages user interactions, keyboard events, theme switching, and history rendering.
 */

import { Calculator } from './calculator.js';

document.addEventListener('DOMContentLoaded', () => {
  const calculator = new Calculator();

  // DOM Elements
  const currentOperandText = document.getElementById('current-operand');
  const previousOperandText = document.getElementById('previous-operand');
  const numberButtons = document.querySelectorAll('[data-number]');
  const operationButtons = document.querySelectorAll('[data-operation]');
  const equalsButton = document.querySelector('[data-action="equals"]');
  const allClearButton = document.querySelector('[data-action="all-clear"]');
  const clearEntryButton = document.querySelector('[data-action="clear-entry"]');
  const toggleSignButton = document.querySelector('[data-action="toggle-sign"]');
  const percentButton = document.querySelector('[data-action="percent"]');

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const historyToggleBtn = document.getElementById('history-toggle-btn');
  const historyPanel = document.getElementById('history-panel');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  // State
  let history = [];

  // Theme Persistence
  const savedTheme = localStorage.getItem('calc-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('calc-theme', newTheme);
    });
  }

  // Update Display
  function updateDisplay() {
    const state = calculator.getState();
    currentOperandText.textContent = state.displayCurrent;
    previousOperandText.textContent = state.displayPrevious;

    // Highlight active operator button
    operationButtons.forEach(button => {
      if (calculator.operation && button.getAttribute('data-operation') === calculator.operation) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  // Add Calculation to History
  function addHistory(entry) {
    if (!entry || entry.error) return;
    history.unshift(entry);
    if (history.length > 20) {
      history.pop();
    }
    renderHistory();
  }

  function renderHistory() {
    if (!historyList) return;
    if (history.length === 0) {
      historyList.innerHTML = '<li class="history-empty">No calculations yet</li>';
      return;
    }

    historyList.innerHTML = '';
    history.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.setAttribute('tabindex', '0');
      li.setAttribute('role', 'button');
      li.setAttribute('aria-label', `${item.prev} ${item.operation} ${item.current} equals ${item.result}`);

      li.innerHTML = `
        <span class="history-calc">${item.prev} ${item.operation} ${item.current} =</span>
        <span class="history-res">${item.result}</span>
      `;

      // Clicking an item restores its result
      li.addEventListener('click', () => {
        calculator.clear();
        calculator.appendNumber(item.result);
        updateDisplay();
      });

      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          calculator.clear();
          calculator.appendNumber(item.result);
          updateDisplay();
        }
      });

      historyList.appendChild(li);
    });
  }

  // History Panel Toggle
  if (historyToggleBtn && historyPanel) {
    historyToggleBtn.addEventListener('click', () => {
      const isHidden = historyPanel.classList.toggle('hidden');
      historyPanel.setAttribute('aria-hidden', isHidden.toString());
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      history = [];
      renderHistory();
    });
  }

  // Keypad Event Listeners
  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendNumber(button.getAttribute('data-number'));
      updateDisplay();
    });
  });

  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      const op = button.getAttribute('data-operation');
      const hist = calculator.chooseOperation(op);
      if (hist) addHistory(hist);
      updateDisplay();
    });
  });

  if (equalsButton) {
    equalsButton.addEventListener('click', () => {
      const hist = calculator.compute();
      if (hist) addHistory(hist);
      updateDisplay();
    });
  }

  if (allClearButton) {
    allClearButton.addEventListener('click', () => {
      calculator.clear();
      updateDisplay();
    });
  }

  if (clearEntryButton) {
    clearEntryButton.addEventListener('click', () => {
      calculator.clearEntry();
      updateDisplay();
    });
  }

  if (toggleSignButton) {
    toggleSignButton.addEventListener('click', () => {
      calculator.toggleSign();
      updateDisplay();
    });
  }

  if (percentButton) {
    percentButton.addEventListener('click', () => {
      calculator.percentage();
      updateDisplay();
    });
  }

  // Keyboard Shortcuts Support
  window.addEventListener('keydown', (e) => {
    // If user is focused on history button or inside another input (if any)
    if (['H', 'h'].includes(e.key) && historyToggleBtn) {
      historyToggleBtn.click();
      return;
    }
    if (['T', 't'].includes(e.key) && themeToggleBtn) {
      themeToggleBtn.click();
      return;
    }

    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      e.preventDefault();
      calculator.appendNumber(e.key);
      updateDisplay();
      return;
    }

    if (e.key === '+') {
      e.preventDefault();
      const hist = calculator.chooseOperation('+');
      if (hist) addHistory(hist);
      updateDisplay();
      return;
    }

    if (e.key === '-') {
      e.preventDefault();
      const hist = calculator.chooseOperation('−');
      if (hist) addHistory(hist);
      updateDisplay();
      return;
    }

    if (e.key === '*' || e.key === 'x' || e.key === 'X') {
      e.preventDefault();
      const hist = calculator.chooseOperation('×');
      if (hist) addHistory(hist);
      updateDisplay();
      return;
    }

    if (e.key === '/') {
      e.preventDefault();
      const hist = calculator.chooseOperation('÷');
      if (hist) addHistory(hist);
      updateDisplay();
      return;
    }

    if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      const hist = calculator.compute();
      if (hist) addHistory(hist);
      updateDisplay();
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      calculator.delete();
      updateDisplay();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      calculator.clear();
      updateDisplay();
      return;
    }

    if (e.key === '%') {
      e.preventDefault();
      calculator.percentage();
      updateDisplay();
      return;
    }
  });

  // Initial render
  updateDisplay();
});
