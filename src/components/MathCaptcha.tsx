
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";

interface MathCaptchaProps {
  onValidation: (isValid: boolean) => void;
  className?: string;
}

const MathCaptcha: React.FC<MathCaptchaProps> = ({ onValidation, className = "" }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState('+');
  const [userAnswer, setUserAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);

  const generateProblem = () => {
    const operators = ['+', '-', '*'];
    const selectedOperator = operators[Math.floor(Math.random() * operators.length)];
    let n1, n2;
    
    switch (selectedOperator) {
      case '+':
        n1 = Math.floor(Math.random() * 20) + 1;
        n2 = Math.floor(Math.random() * 20) + 1;
        break;
      case '-':
        n1 = Math.floor(Math.random() * 20) + 10;
        n2 = Math.floor(Math.random() * n1) + 1;
        break;
      case '*':
        n1 = Math.floor(Math.random() * 10) + 1;
        n2 = Math.floor(Math.random() * 10) + 1;
        break;
      default:
        n1 = 5;
        n2 = 3;
    }
    
    setNum1(n1);
    setNum2(n2);
    setOperator(selectedOperator);
    setUserAnswer('');
    setIsValid(false);
    onValidation(false);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  useEffect(() => {
    if (userAnswer.trim() === '') {
      setIsValid(false);
      onValidation(false);
      return;
    }

    let correctAnswer;
    switch (operator) {
      case '+':
        correctAnswer = num1 + num2;
        break;
      case '-':
        correctAnswer = num1 - num2;
        break;
      case '*':
        correctAnswer = num1 * num2;
        break;
      default:
        correctAnswer = 0;
    }

    const isCorrect = parseInt(userAnswer) === correctAnswer;
    setIsValid(isCorrect);
    onValidation(isCorrect);
  }, [userAnswer, num1, num2, operator, onValidation]);

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Verify you're human (solve this math problem):
      </label>
      <div className="flex items-center space-x-3">
        <div className="bg-gray-100 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-lg font-mono">
          {num1} {operator} {num2} = ?
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateProblem}
          className="flex-shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer"
          className={`w-32 ${isValid ? 'border-green-500' : userAnswer ? 'border-red-500' : ''}`}
        />
        {userAnswer && (
          <span className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? '✓ Correct' : '✗ Incorrect'}
          </span>
        )}
      </div>
    </div>
  );
};

export default MathCaptcha;
