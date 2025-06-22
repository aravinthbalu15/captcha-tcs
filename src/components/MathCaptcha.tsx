
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ArrowClockwise } from 'react-bootstrap-icons';
import { apiService } from '@/services/api';

interface MathCaptchaProps {
  onValidation: (isValid: boolean, answer: string, expected: number) => void;
  className?: string;
}

const MathCaptcha: React.FC<MathCaptchaProps> = ({ onValidation, className = "" }) => {
  const [problem, setProblem] = useState('');
  const [expectedAnswer, setExpectedAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateProblem = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getCaptcha();
      if (response.success) {
        setProblem(response.problem);
        setExpectedAnswer(response.answer);
        setUserAnswer('');
        setIsValid(false);
        onValidation(false, '', response.answer);
      }
    } catch (error) {
      console.error('Error generating CAPTCHA:', error);
      // Fallback to client-side generation if backend is unavailable
      fallbackGeneration();
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackGeneration = useCallback(() => {
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, answer;

    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
        break;
      default:
        answer = 0;
    }

    setProblem(`${num1} ${operator} ${num2}`);
    setExpectedAnswer(answer);
    setUserAnswer('');
    setIsValid(false);
    onValidation(false, '', answer);
  }, [onValidation]);

  useEffect(() => {
    generateProblem();
  }, []); // Remove onValidation from dependency array

  useEffect(() => {
    if (userAnswer.trim() === '') {
      setIsValid(false);
      onValidation(false, userAnswer, expectedAnswer);
      return;
    }

    const isCorrect = parseInt(userAnswer) === expectedAnswer;
    setIsValid(isCorrect);
    onValidation(isCorrect, userAnswer, expectedAnswer);
  }, [userAnswer, expectedAnswer]); // Remove onValidation from dependency array

  return (
    <div className={`mb-3 ${className}`}>
      <Form.Label className="fw-medium text-muted">
        Verify you're human (solve this math problem):
      </Form.Label>
      <div className="d-flex align-items-center gap-3 mb-2">
        <div className="bg-light px-3 py-2 rounded border-2 border-dashed text-monospace fs-5">
          {isLoading ? 'Loading...' : problem} = ?
        </div>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={generateProblem}
          disabled={isLoading}
        >
          <ArrowClockwise />
        </Button>
      </div>
      <div className="d-flex align-items-center gap-2">
        <Form.Control
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer"
          style={{ width: '120px' }}
          className={isValid ? 'border-success' : userAnswer ? 'border-danger' : ''}
        />
        {userAnswer && (
          <span className={`small ${isValid ? 'text-success' : 'text-danger'}`}>
            {isValid ? '✓ Correct' : '✗ Incorrect'}
          </span>
        )}
      </div>
    </div>
  );
};

export default MathCaptcha;
