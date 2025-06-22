
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Shield, Envelope, Lock, ArrowLeft } from 'react-bootstrap-icons';
import { useAuth } from '@/contexts/AuthContext';
import MathCaptcha from '@/components/MathCaptcha';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaData, setCaptchaData] = useState({
    isValid: false,
    answer: '',
    expected: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors) setErrors('');
  };

  const handleCaptchaValidation = (isValid: boolean, answer: string, expected: number) => {
    setCaptchaData({ isValid, answer, expected });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setErrors('Please fill in all fields');
      return;
    }

    if (!captchaData.isValid) {
      setErrors('Please solve the CAPTCHA correctly');
      return;
    }

    setIsLoading(true);
    setErrors('');

    try {
      const result = await login(
        formData.email, 
        formData.password, 
        formData.rememberMe,
        captchaData.answer,
        captchaData.expected
      );
      
      if (result.success) {
        toast.success('Welcome back! Successfully logged in.');
        navigate('/dashboard');
      } else {
        setErrors(result.message);
      }
    } catch (error) {
      setErrors('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-gradient" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            {/* Back to Home */}
            <Button
              variant="link"
              onClick={() => navigate('/')}
              className="text-muted text-decoration-none mb-4 p-0"
            >
              <ArrowLeft className="me-2" />
              Back to Home
            </Button>

            <Card className="shadow-lg border-0">
              <Card.Header className="text-center bg-white py-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <Shield size={40} className="text-primary" />
                </div>
                <Card.Title as="h2" className="fw-bold text-dark mb-2">Welcome Back</Card.Title>
                <Card.Subtitle className="text-muted">
                  Sign in to your account to continue
                </Card.Subtitle>
              </Card.Header>

              <Card.Body className="p-4">
                {errors && (
                  <Alert variant="danger" className="mb-4">
                    {errors}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium text-muted d-flex align-items-center">
                      <Envelope className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      size="lg"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium text-muted d-flex align-items-center">
                      <Lock className="me-2" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      size="lg"
                      required
                    />
                  </Form.Group>

                  <MathCaptcha 
                    onValidation={handleCaptchaValidation}
                    className="mb-3"
                  />

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      label="Remember me for 30 days"
                      className="text-muted"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 fw-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Form>
              </Card.Body>

              <Card.Footer className="text-center bg-light">
                <p className="text-muted mb-0">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary text-decoration-none fw-medium">
                    Sign up here
                  </Link>
                </p>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
