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
  Col
} from "antd";
import { 
  EyeInvisibleOutlined, 
  EyeTwoTone, 
  UserOutlined, 
  MailOutlined, 
  LockOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface SignupFlowProps {
  quizAnswers: Record<string, any>;
  onComplete: () => void;
}

export default function SignupFlow({ quizAnswers, onComplete }: SignupFlowProps) {
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

  const handleSignup = async (values: any) => {
    setError("");
    
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Store user data and quiz answers locally for demo
      localStorage.setItem('brezcode_user', JSON.stringify({
        ...values,
        password: undefined, // Don't store password
        quizAnswers,
        registeredAt: new Date().toISOString()
      }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep(2);
    } catch (error: any) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (values: any) => {
    setError("");
    setIsLoading(true);
    
    try {
      // Simulate email verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, accept any 6-digit code
      if (verificationCode.length === 6) {
        // Mark as verified
        const userData = JSON.parse(localStorage.getItem('brezcode_user') || '{}');
        userData.emailVerified = true;
        userData.verifiedAt = new Date().toISOString();
        localStorage.setItem('brezcode_user', JSON.stringify(userData));
        
        onComplete();
      } else {
        setError("Please enter a valid 6-digit verification code");
      }
    } catch (error: any) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
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
                {isLoading ? "Creating Account..." : "Create Account"}
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

          <Paragraph type="secondary" style={{ textAlign: 'center', fontSize: 12 }}>
            For demo: enter any 6-digit number (e.g., 123456)
          </Paragraph>

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