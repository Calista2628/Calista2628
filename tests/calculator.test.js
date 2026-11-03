import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Calculator } from '../src/calculator.js';

describe('Calculator Core Engine', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe('Basic input and state', () => {
    test('initializes with 0', () => {
      const state = calc.getState();
      assert.equal(state.currentOperand, '0');
      assert.equal(state.displayCurrent, '0');
      assert.equal(state.previousOperand, '');
    });

    test('appends digits correctly', () => {
      calc.appendNumber(1);
      calc.appendNumber(2);
      calc.appendNumber(3);
      assert.equal(calc.getState().currentOperand, '123');
    });

    test('prevents multiple leading zeros', () => {
      calc.appendNumber(0);
      calc.appendNumber(0);
      assert.equal(calc.getState().currentOperand, '0');
    });

    test('handles decimal point correctly', () => {
      calc.appendNumber(5);
      calc.appendNumber('.');
      calc.appendNumber(2);
      assert.equal(calc.getState().currentOperand, '5.2');

      // Second decimal point should be ignored
      calc.appendNumber('.');
      assert.equal(calc.getState().currentOperand, '5.2');
    });

    test('handles leading decimal point correctly', () => {
      calc.clear();
      calc.currentOperand = '';
      calc.appendNumber('.');
      assert.equal(calc.getState().currentOperand, '0.');
    });

    test('toggles sign', () => {
      calc.appendNumber(4);
      calc.appendNumber(2);
      calc.toggleSign();
      assert.equal(calc.getState().currentOperand, '-42');
      calc.toggleSign();
      assert.equal(calc.getState().currentOperand, '42');
    });

    test('toggle sign does nothing when 0', () => {
      calc.toggleSign();
      assert.equal(calc.getState().currentOperand, '0');
    });

    test('deletes digits one by one', () => {
      calc.appendNumber(1);
      calc.appendNumber(2);
      calc.appendNumber(3);
      calc.delete();
      assert.equal(calc.getState().currentOperand, '12');
      calc.delete();
      assert.equal(calc.getState().currentOperand, '1');
      calc.delete();
      assert.equal(calc.getState().currentOperand, '0');
    });

    test('clears entry with CE', () => {
      calc.appendNumber(9);
      calc.clearEntry();
      assert.equal(calc.getState().currentOperand, '0');
    });

    test('clears all with clear', () => {
      calc.appendNumber(9);
      calc.chooseOperation('+');
      calc.appendNumber(5);
      calc.clear();
      const state = calc.getState();
      assert.equal(state.currentOperand, '0');
      assert.equal(state.previousOperand, '');
      assert.equal(state.operation, undefined);
    });
  });

  describe('Arithmetic Operations', () => {
    test('addition: 15 + 27 = 42', () => {
      calc.appendNumber(1);
      calc.appendNumber(5);
      calc.chooseOperation('+');
      calc.appendNumber(2);
      calc.appendNumber(7);
      const res = calc.compute();
      assert.equal(calc.getState().currentOperand, '42');
      assert.equal(res.result, '42');
    });

    test('subtraction: 50 - 18 = 32', () => {
      calc.appendNumber(5);
      calc.appendNumber(0);
      calc.chooseOperation('-');
      calc.appendNumber(1);
      calc.appendNumber(8);
      calc.compute();
      assert.equal(calc.getState().currentOperand, '32');
    });

    test('multiplication: 6 * 7 = 42', () => {
      calc.appendNumber(6);
      calc.chooseOperation('×');
      calc.appendNumber(7);
      calc.compute();
      assert.equal(calc.getState().currentOperand, '42');
    });

    test('division: 84 / 2 = 42', () => {
      calc.appendNumber(8);
      calc.appendNumber(4);
      calc.chooseOperation('÷');
      calc.appendNumber(2);
      calc.compute();
      assert.equal(calc.getState().currentOperand, '42');
    });

    test('division by zero produces error message', () => {
      calc.appendNumber(5);
      calc.chooseOperation('÷');
      calc.appendNumber(0);
      calc.compute();
      assert.equal(calc.getState().currentOperand, 'Cannot divide by 0');
    });

    test('percentage operation: 50% = 0.5', () => {
      calc.appendNumber(5);
      calc.appendNumber(0);
      calc.percentage();
      assert.equal(calc.getState().currentOperand, '0.5');
    });
  });

  describe('Chaining and Precision', () => {
    test('chained operations: 10 + 5 * 2 = (10+5) * 2 = 30', () => {
      calc.appendNumber(1);
      calc.appendNumber(0);
      calc.chooseOperation('+');
      calc.appendNumber(5);
      calc.chooseOperation('×'); // Computes 10+5 = 15 first
      assert.equal(calc.getState().previousOperand, '15');
      calc.appendNumber(2);
      calc.compute();
      assert.equal(calc.getState().currentOperand, '30');
    });

    test('floating point precision: 0.1 + 0.2 = 0.3', () => {
      calc.appendNumber(0);
      calc.appendNumber('.');
      calc.appendNumber(1);
      calc.chooseOperation('+');
      calc.appendNumber(0);
      calc.appendNumber('.');
      calc.appendNumber(2);
      calc.compute();
      assert.equal(calc.getState().currentOperand, '0.3');
    });

    test('formatted display numbers with thousand separators', () => {
      calc.appendNumber(1);
      calc.appendNumber(2);
      calc.appendNumber(3);
      calc.appendNumber(4);
      calc.appendNumber(5);
      calc.appendNumber(6);
      calc.appendNumber(7);
      calc.appendNumber('.');
      calc.appendNumber(8);
      calc.appendNumber(9);
      assert.equal(calc.getState().displayCurrent, '1,234,567.89');
    });
  });
});
