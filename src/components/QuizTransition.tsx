import React from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Alert
} from 'antd';
import {
  CheckCircleOutlined,
  FileTextOutlined,
  HeartOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface QuizTransitionProps {
  onContinue: () => void;
}

export default function QuizTransition({ onContinue }: QuizTransitionProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '16px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '800px',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <CheckCircleOutlined 
              style={{ 
                fontSize: '64px', 
                color: '#52c41a',
                backgroundColor: '#f6ffed',
                padding: '16px',
                borderRadius: '50%'
              }} 
            />
          </div>
          <Title level={1} style={{ color: '#1f2937', marginBottom: '16px' }}>
            Congratulations! Quiz Complete
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#6b7280' }}>
            You've successfully completed your comprehensive breast health assessment
          </Paragraph>
        </div>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="What's Next?"
            description="Based on your responses, we're preparing a personalized assessment report with evidence-based recommendations tailored specifically for your breast health profile."
            type="info"
            showIcon
            style={{ 
              backgroundColor: '#f0f9ff', 
              border: '1px solid #bae6fd',
              borderRadius: '12px'
            }}
          />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card 
                size="small" 
                style={{ 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  height: '100%'
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <FileTextOutlined 
                    style={{ 
                      fontSize: '24px', 
                      color: '#8b5cf6',
                      backgroundColor: '#f3e8ff',
                      padding: '12px',
                      borderRadius: '8px'
                    }} 
                  />
                  <div>
                    <Title level={4} style={{ margin: '8px 0', color: '#1f2937' }}>
                      Comprehensive Report
                    </Title>
                    <Text style={{ color: '#6b7280' }}>
                      Detailed analysis of your risk factors and personalized recommendations
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card 
                size="small" 
                style={{ 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  height: '100%'
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <HeartOutlined 
                    style={{ 
                      fontSize: '24px', 
                      color: '#dc2626',
                      backgroundColor: '#fef2f2',
                      padding: '12px',
                      borderRadius: '8px'
                    }} 
                  />
                  <div>
                    <Title level={4} style={{ margin: '8px 0', color: '#1f2937' }}>
                      Personalized Health Schedule
                    </Title>
                    <Text style={{ color: '#6b7280' }}>
                      Daily activities tailored to your assessment results and health goals
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Alert
            message="Complete Your Registration"
            description={
              <div>
                <Paragraph style={{ marginBottom: '16px', color: '#92400e' }}>
                  To provide you with your personalized assessment report and begin your breast health coaching journey, we need to complete your account setup.
                </Paragraph>
                <ul style={{ 
                  color: '#92400e', 
                  margin: 0, 
                  paddingLeft: '20px',
                  fontSize: '14px'
                }}>
                  <li>Secure your account with email verification</li>
                  <li>Enable SMS notifications for important health reminders</li>
                  <li>Ensure we can deliver your personalized report safely</li>
                </ul>
              </div>
            }
            type="warning"
            icon={<SafetyOutlined />}
            style={{ 
              backgroundColor: '#fffbeb', 
              border: '1px solid #fde68a',
              borderRadius: '12px'
            }}
          />

          <div style={{ textAlign: 'center', paddingTop: '16px' }}>
            <Button 
              type="primary" 
              size="large"
              onClick={onContinue}
              style={{ 
                height: '48px',
                padding: '0 32px',
                fontSize: '18px',
                fontWeight: 600,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              Continue to Registration
            </Button>
            <Paragraph style={{ 
              marginTop: '12px', 
              color: '#9ca3af',
              fontSize: '14px'
            }}>
              This will only take 2-3 minutes to complete
            </Paragraph>
          </div>
        </Space>
      </Card>
    </div>
  );
}