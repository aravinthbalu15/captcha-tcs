
// Local storage based API service (no backend required)
interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
  };
}

interface CaptchaResponse {
  success: boolean;
  problem: string;
  answer: number;
}

export const apiService = {
  // Authentication
  async login(email: string, password: string, captchaAnswer: string, captchaExpected: number): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validate CAPTCHA
    if (parseInt(captchaAnswer) !== captchaExpected) {
      return {
        success: false,
        message: 'Please solve the CAPTCHA correctly'
      };
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        message: 'No account found with this email address. Please sign up first.'
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    // Generate mock token
    const token = `mock_token_${Date.now()}`;

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: true
      }
    };
  },

  async signup(name: string, email: string, password: string, captchaAnswer: string, captchaExpected: number): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validate required fields
    if (!name || !email || !password) {
      return {
        success: false,
        message: 'Name, email, and password are required'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please provide a valid email address'
      };
    }

    // Validate CAPTCHA
    if (parseInt(captchaAnswer) !== captchaExpected) {
      return {
        success: false,
        message: 'Please solve the CAPTCHA correctly'
      };
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === email.toLowerCase());

    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists'
      };
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      isEmailVerified: true
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Generate mock token
    const token = `mock_token_${Date.now()}`;

    return {
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isEmailVerified: newUser.isEmailVerified
      }
    };
  },

  async getCurrentUser() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      return { success: false, message: 'No token found' };
    }

    // For demo purposes, extract user info from token or use mock data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users[0]; // Get first user for demo

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    };
  },

  async getCaptcha(): Promise<CaptchaResponse> {
    // Generate client-side CAPTCHA
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

    return {
      success: true,
      problem: `${num1} ${operator} ${num2}`,
      answer: answer
    };
  }
};
