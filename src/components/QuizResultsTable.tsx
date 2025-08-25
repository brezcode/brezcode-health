import { useEffect, useState } from 'react';
import { Table, Card, Typography, Spin, Alert } from 'antd';

const { Title, Text } = Typography;

interface QuizResultsTableProps {
  sessionId?: string;
}

interface QuizAnswer {
  question: string;
  answer: string;
}

export default function QuizResultsTable({ sessionId }: QuizResultsTableProps) {
  const [quizData, setQuizData] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        // Get session ID from localStorage if not provided
        const quizSessionId = sessionId || localStorage.getItem('brezcode_quiz_session_id');
        
        if (!quizSessionId) {
          console.log('No quiz session ID found, using empty data');
          setQuizData([]);
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching simplified quiz results for session:', quizSessionId);
        const response = await fetch(`/api/quiz/report/${quizSessionId}`);
        const result = await response.json();
        
        if (result.success && result.simplified_quiz) {
          console.log('✅ Quiz results loaded for table display');
          setQuizData(result.simplified_quiz);
        } else {
          console.log('⚠️ No simplified quiz data available');
          setQuizData([]);
        }
        
      } catch (error) {
        console.error('❌ Error fetching quiz results:', error);
        setError('Unable to load quiz results');
        setQuizData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [sessionId]);

  // Table columns configuration
  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      width: '40%',
      render: (text: string) => (
        <Text strong style={{ color: '#1f2937' }}>{text}</Text>
      ),
    },
    {
      title: 'Your Answer',
      dataIndex: 'answer',
      key: 'answer',
      width: '60%',
      render: (text: string) => (
        <Text style={{ color: '#4b5563' }}>{text}</Text>
      ),
    },
  ];

  // Add row keys for the table
  const tableData = quizData.map((item, index) => ({
    ...item,
    key: index,
  }));

  if (loading) {
    return (
      <Card className="quiz-results-table">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Loading your quiz responses...</Text>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="quiz-results-table">
        <Alert
          message="Unable to Load Quiz Results"
          description={error}
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  if (quizData.length === 0) {
    return (
      <Card className="quiz-results-table">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">No quiz responses found to display.</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card className="quiz-results-table">
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
          📋 Your Quiz Responses Summary
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Quick overview of your health assessment answers
        </Text>
      </div>
      
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        size="middle"
        bordered={false}
        style={{
          background: '#ffffff',
        }}
        rowClassName="quiz-table-row"
      />
      
      <style jsx>{`
        .quiz-results-table .ant-table-tbody > tr:hover > td {
          background-color: #f8fafc !important;
        }
        
        .quiz-table-row {
          transition: background-color 0.2s ease;
        }
        
        .quiz-results-table .ant-table-thead > tr > th {
          background-color: #f8fafc;
          border-bottom: 2px solid #e5e7eb;
          font-weight: 600;
          color: #374151;
        }
        
        .quiz-results-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f3f4f6;
          padding: 12px 16px;
        }
        
        .quiz-results-table .ant-table {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Card>
  );
}