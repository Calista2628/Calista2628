/**
 * Core Calculator Logic Engine
 * Handles mathematical operations, operand states, floating point precision, and history.
 */

export class Calculator {
  constructor() {
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.lastResult = null;
  }

  clearEntry() {
    this.currentOperand = '0';
  }

  delete() {
    if (this.shouldResetScreen) {
      return;
    }
    if (this.currentOperand === '0' || this.currentOperand === 'Error' || this.currentOperand === 'Cannot divide by 0') {
      this.currentOperand = '0';
      return;
    }
    if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  appendNumber(number) {
    const numStr = number.toString();

    if (this.shouldResetScreen || this.currentOperand === 'Error' || this.currentOperand === 'Cannot divide by 0') {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }

    if (numStr === '.' && this.currentOperand.includes('.')) {
      return;
    }

    if (this.currentOperand === '0' && numStr !== '.') {
      this.currentOperand = numStr;
    } else if (this.currentOperand === '' && numStr === '.') {
      this.currentOperand = '0.';
    } else {
      // Limit to 15 digits for display sanity
      if (this.currentOperand.replace(/[^0-9]/g, '').length >= 15) {
        return;
      }
      this.currentOperand += numStr;
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === 'Error' || this.currentOperand === 'Cannot divide by 0') {
      return;
    }

    if (this.previousOperand !== '' && !this.shouldResetScreen) {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
  }

  toggleSign() {
    if (this.currentOperand === '0' || this.currentOperand === 'Error' || this.currentOperand === 'Cannot divide by 0') {
      return;
    }
    if (this.currentOperand.startsWith('-')) {
      this.currentOperand = this.currentOperand.slice(1);
    } else {
      this.currentOperand = '-' + this.currentOperand;
    }
  }

  percentage() {
    if (this.currentOperand === 'Error' || this.currentOperand === 'Cannot divide by 0') {
      return;
    }
    const val = parseFloat(this.currentOperand);
    if (isNaN(val)) return;
    const result = this.roundResult(val / 100);
    this.currentOperand = result.toString();
  }

  roundResult(num) {
    if (isNaN(num) || !isFinite(num)) {
      return 'Error';
    }
    // Handle floating point precision inaccuracies, e.g. 0.1 + 0.2 = 0.30000000000000004 -> 0.3
    const precisionRounded = parseFloat(num.toPrecision(12));
    return precisionRounded;
  }

  compute() {
    if (!this.operation || this.previousOperand === '') {
      return null;
    }

    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) {
      return null;
    }

    let computation;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
      case '−':
        computation = prev - current;
        break;
      case '×':
      case '*':
        computation = prev * current;
        break;
      case '÷':
      case '/':
        if (current === 0) {
          this.currentOperand = 'Cannot divide by 0';
          this.previousOperand = '';
          this.operation = undefined;
          this.shouldResetScreen = true;
          return { error: 'Cannot divide by 0' };
        }
        computation = prev / current;
        break;
      default:
        return null;
    }

    const result = this.roundResult(computation);
    const historyEntry = {
      prev: this.previousOperand,
      operation: this.operation,
      current: this.currentOperand,
      result: result.toString()
    };

    this.lastResult = result.toString();
    this.currentOperand = result.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;

    return historyEntry;
  }

  getDisplayNumber(number) {
    if (number === 'Error' || number === 'Cannot divide by 0') {
      return number;
    }

    const stringNumber = number.toString();
    const isNegative = stringNumber.startsWith('-');
    const cleanNumber = isNegative ? stringNumber.slice(1) : stringNumber;

    const integerDigits = parseFloat(cleanNumber.split('.')[0]);
    const decimalDigits = cleanNumber.split('.')[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0
      });
    }

    const prefix = isNegative ? '-' : '';

    if (decimalDigits != null) {
      return `${prefix}${integerDisplay}.${decimalDigits}`;
    } else {
      return `${prefix}${integerDisplay}`;
    }
  }

  getState() {
    return {
      currentOperand: this.currentOperand,
      previousOperand: this.previousOperand,
      operation: this.operation,
      displayCurrent: this.getDisplayNumber(this.currentOperand),
      displayPrevious: this.previousOperand !== '' && this.operation ? `${this.getDisplayNumber(this.previousOperand)} ${this.operation}` : ''
    };
  }
}
