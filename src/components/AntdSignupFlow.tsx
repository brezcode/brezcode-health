import { useState } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Progress, 
  Typography, 
  Alert, 
  Space, 
  Divider, 
  ConfigProvider 
} from "antd";
import { 
  EyeInvisibleOutlined, 
  EyeTwoTone, 
  UserOutlined, 
  MailOutlined, 
  LockOutlined,
  SafetyOutlined 
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

interface AntdSignupFlowProps {
  quizAnswers: Record<string, any>;
  onComplete: () => void;
}

export default function AntdSignupFlow({ quizAnswers, onComplete }: AntdSignupFlowProps) {
  const [step, setStep] = useState(1);
  const [form] = Form.useForm();
  const [verificationForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Custom theme to match existing brand colors
  const theme = {
    token: {
      colorPrimary: '#2563eb', // Blue-600
      colorSuccess: '#10b981', // Green-500
      colorWarning: '#f59e0b', // Yellow-500
      borderRadius: 12,
      fontSize: 16,
    },
    components: {
      Button: {
        borderRadius: 12,
        controlHeight: 48,
        fontSize: 16,
      },
      Input: {
        borderRadius: 12,
        controlHeight: 48,
        fontSize: 16,
      },
      Card: {
        borderRadius: 20,
      }
    }
  };

  // Real signup API call
  const handleSignup = async (values: any) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/auth/signup', {
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
      
      setUserEmail(values.email);
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
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          code: values.verificationCode
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Invalid verification code');
      }
      
      // Store verified user data
      const pendingUser = JSON.parse(localStorage.getItem('brezcode_pending_user') || '{}');
      const verifiedUser = {
        ...pendingUser,
        ...result.user,
        emailVerified: true,
        verifiedAt: new Date().toISOString()
      };
      localStorage.setItem('brezcode_user', JSON.stringify(verifiedUser));
      localStorage.removeItem('brezcode_pending_user');
      
      console.log('Email verified successfully');
      onComplete();
    } catch (error: any) {
      setError(error.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setIsResending(true);
    setError("");
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend verification code');
      }
      
      console.log('Verification code resent to:', userEmail);
    } catch (error: any) {
      setError(error.message || "Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  const renderStep1 = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <ConfigProvider theme={theme}>
        <Card 
          className="w-full max-w-md shadow-2xl border-0"
          style={{ backgroundColor: 'white' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Progress Bar */}
            <div className="text-center">
              <Progress 
                percent={50} 
                strokeColor={{
                  '0%': '#3b82f6',
                  '100%': '#1d4ed8',
                }}
                trailColor="#e5e7eb"
                strokeWidth={8}
                showInfo={false}
                style={{ marginBottom: 16 }}
              />
              <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                Create Your Account
              </Title>
              <Paragraph style={{ color: '#6b7280', fontSize: '16px', marginBottom: 0 }}>
                Enter your details to get started
              </Paragraph>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Signup Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSignup}
              size="large"
              requiredMark={false}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* Name Fields */}
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'First name is required' }]}
                    style={{ width: '50%', marginRight: 8 }}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="First Name"
                    />
                  </Form.Item>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Last name is required' }]}
                    style={{ width: '50%' }}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Last Name"
                    />
                  </Form.Item>
                </Space.Compact>

                {/* Email */}
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Email is required' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="your.email@example.com"
                  />
                </Form.Item>

                {/* Password */}
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Password is required' },
                    { min: 8, message: 'Password must be at least 8 characters' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                {/* Confirm Password */}
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
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                {/* Error Alert */}
                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}

                {/* Submit Button */}
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    block
                    size="large"
                    style={{ 
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 600
                    }}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          </Space>
        </Card>
      </ConfigProvider>
    </div>
  );

  const renderStep2 = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <ConfigProvider theme={theme}>
        <Card 
          className="w-full max-w-md shadow-2xl border-0"
          style={{ backgroundColor: 'white' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Progress Bar */}
            <div className="text-center">
              <Progress 
                percent={100} 
                strokeColor={{
                  '0%': '#10b981',
                  '100%': '#059669',
                }}
                trailColor="#e5e7eb"
                strokeWidth={8}
                showInfo={false}
                style={{ marginBottom: 16 }}
              />
              <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                <SafetyOutlined style={{ color: '#10b981', marginRight: 8 }} />
                Verify Your Email
              </Title>
              <Paragraph style={{ color: '#6b7280', fontSize: '16px', marginBottom: 0 }}>
                We've sent a verification code to <Text strong>{userEmail}</Text>
              </Paragraph>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Verification Form */}
            <Form
              form={verificationForm}
              layout="vertical"
              onFinish={handleVerification}
              size="large"
              requiredMark={false}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Form.Item
                  name="verificationCode"
                  label="Verification Code"
                  rules={[
                    { required: true, message: 'Verification code is required' },
                    { len: 6, message: 'Code must be 6 digits' }
                  ]}
                >
                  <Input
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    style={{ 
                      textAlign: 'center', 
                      fontSize: '24px', 
                      letterSpacing: '8px',
                      fontWeight: 'bold'
                    }}
                  />
                </Form.Item>

                <Paragraph style={{ 
                  color: '#6b7280', 
                  fontSize: '14px', 
                  textAlign: 'center',
                  marginBottom: 16 
                }}>
                  Enter the 6-digit code sent to your email
                </Paragraph>

                {/* Error Alert */}
                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}

                {/* Verify Button */}
                <Form.Item style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    block
                    size="large"
                    style={{ 
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 600
                    }}
                  >
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </Button>
                </Form.Item>

                {/* Resend Code Button */}
                <Form.Item style={{ marginBottom: 16 }}>
                  <Button
                    type="default"
                    loading={isResending}
                    block
                    size="large"
                    onClick={handleResendCode}
                    style={{ 
                      height: '48px',
                      fontSize: '16px'
                    }}
                  >
                    {isResending ? "Resending..." : "Resend Code"}
                  </Button>
                </Form.Item>

                {/* Back Button */}
                <Button
                  type="link"
                  block
                  onClick={() => setStep(1)}
                  style={{ 
                    fontSize: '16px',
                    color: '#3b82f6'
                  }}
                >
                  ← Back to Sign Up
                </Button>
              </Space>
            </Form>
          </Space>
        </Card>
      </ConfigProvider>
    </div>
  );

  return step === 1 ? renderStep1() : renderStep2();
}