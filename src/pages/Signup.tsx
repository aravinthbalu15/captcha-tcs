
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Shield, Envelope, Lock, Person, ArrowLeft } from 'react-bootstrap-icons';
import { useAuth } from '@/contexts/AuthContext';
import MathCaptcha from '@/components/MathCaptcha';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaData, setCaptchaData] = useState({
    isValid: false,
    answer: '',
    expected: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors) setErrors('');
  };

  const handleCaptchaValidation = (isValid: boolean, answer: string, expected: number) => {
    setCaptchaData({ isValid, answer, expected });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrors('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setErrors('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setErrors('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors('Passwords do not match');
      return false;
    }
    if (!captchaData.isValid) {
      setErrors('Please solve the CAPTCHA correctly');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors('');

    try {
      const result = await signup(
        formData.name, 
        formData.email, 
        formData.password,
        captchaData.answer,
        captchaData.expected
      );
      
      if (result.success) {
        toast.success('Account created successfully! Welcome to SecureApp.');
        navigate('/dashboard');
      } else {
        setErrors(result.message);
      }
    } catch (error) {
      setErrors('An error occurred during signup');
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
                <Card.Title as="h2" className="fw-bold text-dark mb-2">Create Account</Card.Title>
                <Card.Subtitle className="text-muted">
                  Join us today with your real email address
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
                      <Person className="me-2" />
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      size="lg"
                      required
                    />
                  </Form.Group>

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
                      placeholder="Enter your real email address"
                      size="lg"
                      required
                    />
                    <Form.Text className="text-muted">
                      Please use a valid email address that you have access to.
                    </Form.Text>
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
                      placeholder="Create a password (min. 6 characters)"
                      size="lg"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium text-muted d-flex align-items-center">
                      <Lock className="me-2" />
                      Confirm Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      size="lg"
                      required
                    />
                  </Form.Group>

                  <MathCaptcha 
                    onValidation={handleCaptchaValidation}
                    className="mb-4"
                  />

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
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Form>
              </Card.Body>

              <Card.Footer className="text-center bg-light">
                <p className="text-muted mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary text-decoration-none fw-medium">
                    Sign in here
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

export default Signup;
