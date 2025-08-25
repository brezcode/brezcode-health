import { useState } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Progress, 
  Typography, 
  Space, 
  Divider,
  Alert,
  Row,
  Col,
  Switch
} from "antd";
import { 
  EyeInvisibleOutlined, 
  EyeTwoTone, 
  UserOutlined, 
  MailOutlined, 
  LockOutlined,
  ArrowLeftOutlined,
  ReloadOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface CleanSignupFlowProps {
  quizAnswers: Record<string, any>;
  onComplete: () => void;
}

export default function CleanSignupFlow({ quizAnswers, onComplete }: CleanSignupFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [testMode, setTestMode] = useState(false);

  // Real signup API call with test mode support
  const handleSignup = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Update formData with the submitted values
    setFormData({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword || ""
    });
    
    // TEST MODE: Skip email verification and create user directly
    if (testMode) {
      try {
        const testUser = {
          id: Date.now(),
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          quizAnswers,
          isTestUser: true,
          isEmailVerified: true, // Skip verification
          verifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        
        // Store verified test user
        localStorage.setItem('brezcode_user', JSON.stringify(testUser));
        
        console.log(`✅ TEST MODE: Created user ${values.email} without verification`);
        
        // Complete registration immediately
        onComplete();
        return;
      } catch (error: any) {
        setError("Failed to create test user");
        setIsLoading(false);
        return;
      }
    }
    
    try {
      const response = await fetch('http://localhost:3002/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          quizAnswers
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create account');
      }
      
      // Store minimal user data locally (no password)
      localStorage.setItem('brezcode_pending_user', JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        quizAnswers,
        registeredAt: new Date().toISOString()
      }));
      
      console.log('Account created, email verification sent to:', values.email);
      setStep(2);
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  // Real email verification
  const handleVerification = async (values: any) => {
    setIsLoading(true);
    setError("");
    
    try {
      const requestData = {
        email: formData.email,
        code: verificationCode
      };
      
      console.log('Debug - Sending verification request:', requestData);
      console.log('Debug - formData.email:', formData.email);
      console.log('Debug - verificationCode:', verificationCode);
      
      // If formData.email is empty, the request won't work
      if (!formData.email || !verificationCode) {
        throw new Error(`Missing data - email: ${formData.email}, code: ${verificationCode}`);
      }
      
      const response = await fetch('http://localhost:3002/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Invalid verification code');
      }
      
      // Store verified user data
      const pendingUser = JSON.parse(localStorage.getItem('brezcode_pending_user') || '{}');
      const verifiedUser = {
        ...pendingUser,
        emailVerified: true,
        verifiedAt: new Date().toISOString()
      };
      
      localStorage.setItem('brezcode_user', JSON.stringify(verifiedUser));
      localStorage.removeItem('brezcode_pending_user');
      
      console.log('Email verified successfully');
      onComplete();
    } catch (error: any) {
      setError(error.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setIsResending(true);
    setError("");
    
    try {
      const requestData = { email: formData.email };
      
      console.log('Debug - Resending code for email:', requestData);
      console.log('Debug - formData.email:', formData.email);
      
      const response = await fetch('http://localhost:3002/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to resend verification code');
      }
      
      console.log('Verification code resent to:', formData.email);
    } catch (error: any) {
      setError(error.message || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  if (step === 1) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '16px'
      }}>
        <Card 
          style={{ 
            width: '100%', 
            maxWidth: 480,
            borderRadius: 16,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Progress 
              percent={50} 
              size="small" 
              strokeColor="#667eea"
              style={{ marginBottom: 16 }}
            />
            <Title level={2} style={{ marginBottom: 8, color: '#1a1a1a' }}>
              Create Your Account
            </Title>
            <Text type="secondary">
              Enter your details to get started
            </Text>
          </div>
          
          <Form
            layout="vertical"
            onFinish={handleSignup}
            requiredMark={false}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true, message: 'Please enter your first name' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="First Name"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true, message: 'Please enter your last name' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Last Name"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="your@email.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 8, message: 'Password must be at least 8 characters' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Create a password"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Confirm your password"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {/* Test Mode Toggle */}
            <Form.Item style={{ marginBottom: 16 }}>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                border: '1px dashed #d0d7de'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}>
                  <div>
                    <Text strong style={{ fontSize: '14px', color: '#24292f' }}>
                      🧪 Test Mode
                    </Text>
                    <br />
                    <Text style={{ fontSize: '12px', color: '#656d76' }}>
                      Skip email verification for testing (user1, user2, etc.)
                    </Text>
                  </div>
                  <Switch 
                    checked={testMode}
                    onChange={setTestMode}
                    size="default"
                  />
                </div>
                {testMode && (
                  <Alert 
                    message="Test mode: Email verification will be bypassed" 
                    type="info" 
                    showIcon 
                    style={{ marginTop: 8, fontSize: '12px' }}
                  />
                )}
              </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
                size="large"
                style={{ 
                  width: '100%', 
                  height: 48,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                {isLoading 
                  ? (testMode ? "Creating Test User..." : "Creating Account...") 
                  : (testMode ? "🧪 Create Test User" : "Create Account")
                }
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '16px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 480,
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Progress 
            percent={100} 
            size="small" 
            strokeColor="#52c41a"
            style={{ marginBottom: 16 }}
          />
          <Title level={2} style={{ marginBottom: 8, color: '#1a1a1a' }}>
            Verify Your Email
          </Title>
          <Paragraph type="secondary">
            We sent a verification code to <Text strong>{formData.email}</Text>
          </Paragraph>
        </div>
        
        <Form
          layout="vertical"
          onFinish={handleVerification}
          requiredMark={false}
        >
          <Form.Item
            name="verificationCode"
            label="Verification Code"
            rules={[
              { required: true, message: 'Please enter the verification code' },
              { len: 6, message: 'Please enter a 6-digit code' }
            ]}
          >
            <Input 
              placeholder="Enter 6-digit code"
              maxLength={6}
              size="large"
              style={{ 
                textAlign: 'center', 
                fontSize: 18, 
                letterSpacing: 4,
                fontFamily: 'monospace'
              }}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </Form.Item>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item style={{ marginBottom: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              size="large"
              style={{ 
                width: '100%', 
                height: 48,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Button
              type="link"
              icon={<ReloadOutlined />}
              loading={isResending}
              onClick={handleResendCode}
              style={{ color: '#667eea' }}
            >
              {isResending ? "Resending..." : "Resend Code"}
            </Button>
          </div>

          <Divider>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => setStep(1)}
              style={{ color: '#667eea' }}
            >
              Back to Account Details
            </Button>
          </Divider>
        </Form>
      </Card>
    </div>
  );
}