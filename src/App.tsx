import './App.css'
import { useRef, useState, useEffect } from 'react'
import Quiz from './components/Quiz'
import QuizPage from './pages/QuizPage'
import UserDashboard from './components/UserDashboard'
import ReportPage from './pages/ReportPage'
import { 
  Button, 
  Layout, 
  Menu, 
  Typography, 
  Space, 
  Avatar, 
  Drawer,
  Grid,
  Divider,
  ConfigProvider
} from 'antd';
import { 
  MenuOutlined, 
  CloseOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Title, Text } = Typography;

function Navigation({ onTakeQuiz }: { onTakeQuiz: () => void }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0,
      right: 0,
      width: '100%', 
      background: 'transparent', 
      zIndex: 40,
      height: '80px'
    }}>
      <div style={{ 
        maxWidth: '1440px', 
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px'
      }}>
        {/* Logo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          cursor: 'pointer'
        }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            backgroundColor: '#facc15', 
            color: '#000', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            BC
          </div>
          <div style={{ 
            color: '#facc15', 
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            BrezCode
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div style={{ 
          display: 'none',
          alignItems: 'center', 
          gap: '24px'
        }} className="lg:flex">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '32px'
          }}>
            <a href="#how-it-works" style={{ 
              color: '#facc15', 
              fontWeight: 500, 
              textDecoration: 'none'
            }}>
              How it works
            </a>
            <a href="#features" style={{ 
              color: '#facc15', 
              fontWeight: 500, 
              textDecoration: 'none'
            }}>
              Features
            </a>
            <a href="#pricing" style={{ 
              color: '#facc15', 
              fontWeight: 500, 
              textDecoration: 'none'
            }}>
              Pricing
            </a>
          </div>
          
          <Button 
            type="text" 
            style={{ 
              color: '#facc15',
              border: 'none',
              background: 'transparent',
              padding: '8px 16px',
              fontSize: '16px'
            }}
          >
            Sign In
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div style={{ display: 'block' }} className="lg:hidden">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setShowMobileMenu(true)}
            style={{ 
              color: '#facc15',
              border: 'none',
              background: 'transparent',
              padding: '8px'
            }}
          />
        </div>
      </div>
      
      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar size={24} style={{ backgroundColor: '#facc15', color: '#000', fontSize: '12px' }}>
              BC
            </Avatar>
            <span style={{ color: '#facc15', fontSize: '16px' }}>BrezCode</span>
          </div>
        }
        placement="right"
        onClose={() => setShowMobileMenu(false)}
        open={showMobileMenu}
        width={280}
        bodyStyle={{ padding: '24px' }}
        headerStyle={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button 
            type="text" 
            block 
            href="#how-it-works"
            onClick={() => setShowMobileMenu(false)}
            style={{ 
              textAlign: 'left', 
              height: '48px', 
              justifyContent: 'flex-start',
              fontSize: '16px'
            }}
          >
            How it works
          </Button>
          <Button 
            type="text" 
            block 
            href="#features"
            onClick={() => setShowMobileMenu(false)}
            style={{ 
              textAlign: 'left', 
              height: '48px', 
              justifyContent: 'flex-start',
              fontSize: '16px'
            }}
          >
            Features
          </Button>
          <Button 
            type="text" 
            block 
            href="#pricing"
            onClick={() => setShowMobileMenu(false)}
            style={{ 
              textAlign: 'left', 
              height: '48px', 
              justifyContent: 'flex-start',
              fontSize: '16px'
            }}
          >
            Pricing
          </Button>
          
          <Divider style={{ margin: '16px 0' }} />
          
          <Button 
            type="text"
            block
            style={{ 
              textAlign: 'left', 
              height: '48px',
              justifyContent: 'flex-start',
              fontSize: '16px'
            }}
          >
            Sign In
          </Button>
        </Space>
      </Drawer>
    </div>
  );
}

function Hero({ onTakeQuiz }: { onTakeQuiz: () => void }) {
  return (
    <section style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px', paddingTop: '80px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            backdropFilter: 'blur(4px)',
            borderRadius: '24px', 
            padding: '12px 24px', 
            marginBottom: '32px'
          }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#4ade80', 
              borderRadius: '50%', 
              marginRight: '12px',
              animation: 'pulse 2s infinite'
            }}></div>
            <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>
              Evidence-based AI coaching available 24/7
            </Text>
          </div>

          <Text style={{ 
            fontSize: '20px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '24px', 
            maxWidth: '1024px', 
            margin: '0 auto 24px',
            lineHeight: 1.6,
            display: 'block'
          }}>
            "1 in 8 women in US will develop breast cancer in their lifetime"... According to WHO
          </Text>

          <Title level={1} style={{ 
            fontSize: '48px', 
            color: '#fff', 
            marginBottom: '32px', 
            lineHeight: 1.2, 
            maxWidth: '1024px', 
            margin: '0 auto 24px' 
          }}>
            Good news! You can now <span style={{ 
              background: 'linear-gradient(45deg, #facc15, #f59e0b)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>REVERSE</span> the development<br />
            and lower the risk by <span style={{ color: '#facc15' }}>100% in 15 days.</span>
          </Title>

          <Text style={{ 
            fontSize: '20px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '8px', 
            maxWidth: '1024px', 
            margin: '0 auto 8px',
            lineHeight: 1.6,
            display: 'block',
            fontStyle: 'italic'
          }}>
            The #1 evidence-based AI breast health coaching platform to help you
          </Text>
          <Text style={{ 
            fontSize: '20px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '32px', 
            maxWidth: '1024px', 
            margin: '0 auto 32px',
            lineHeight: 1.6,
            display: 'block',
            fontStyle: 'italic'
          }}>
            regain control of your wellness.
          </Text>

          <Text style={{ 
            fontSize: '18px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '48px', 
            maxWidth: '768px', 
            margin: '0 auto 48px',
            lineHeight: 1.6,
            display: 'block'
          }}>
            Don't wait until it is too late, your family depends on you.
          </Text>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: '32px'
          }}>
            <Button 
              type="primary"
              size="large"
              onClick={onTakeQuiz}
              style={{ 
                backgroundColor: '#facc15', 
                color: '#000', 
                padding: '20px 48px', 
                fontSize: '20px', 
                fontWeight: 700, 
                height: 'auto',
                borderRadius: '24px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              Take the quiz to start
            </Button>
            <Button 
              variant="outline"
              size="large"
              style={{ 
                border: '2px solid #fff',
                color: '#fff',
                backgroundColor: 'transparent',
                padding: '16px 32px', 
                fontSize: '16px', 
                fontWeight: 700, 
                height: 'auto',
                borderRadius: '24px'
              }}
            >
              Already have an account? Sign In
            </Button>
          </div>

          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '18px', 
            marginBottom: '64px',
            display: 'block'
          }}>
            Start for free. Cancel any time.
          </Text>
        </div>

        {/* Hero Image Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '64px', 
          alignItems: 'start', 
          paddingBottom: '0' 
        }}>
          <div style={{ 
            position: 'relative', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-end', 
            height: '500px' 
          }}>
            {/* Yellow Circle Background */}
            <div style={{ 
              width: '320px', 
              height: '320px', 
              backgroundColor: '#facc15', 
              borderRadius: '50%', 
              position: 'absolute',
              bottom: '120px'
            }}></div>
            {/* Woman Image */}
            <img 
              src="/happy-woman.png"
              alt="Happy woman using phone"
              style={{
                position: 'relative',
                zIndex: 10,
                objectFit: 'contain',
                objectPosition: 'bottom',
                width: '24rem',
                height: '30rem',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
              }}
            />

            {/* Chat Bubbles */}
            <div style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              backgroundColor: '#fff', 
              borderRadius: '16px', 
              padding: '12px', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
              maxWidth: '192px', 
              zIndex: 20 
            }}>
              <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>Hey Sue, how'd it go yesterday?</p>
            </div>

            <div style={{ 
              position: 'absolute', 
              top: '80px', 
              right: '32px', 
              backgroundColor: '#8b5cf6', 
              borderRadius: '16px', 
              padding: '12px', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
              maxWidth: '192px', 
              zIndex: 20 
            }}>
              <p style={{ fontSize: '14px', color: '#fff', margin: 0 }}>I am following the plan, and feeling great today!</p>
            </div>

            <div style={{ 
              position: 'absolute', 
              bottom: '80px', 
              left: '16px', 
              backgroundColor: '#10b981', 
              borderRadius: '16px', 
              padding: '12px', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
              maxWidth: '160px', 
              zIndex: 20 
            }}>
              <p style={{ fontSize: '14px', color: '#fff', margin: 0 }}>Great work sticking to your plan!</p>
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '96px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>96%</div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#fff', 
              marginBottom: '16px' 
            }}>
              of members report<br />
              reduced anxiety after 90 days
            </div>
            <p style={{ 
              color: 'rgba(219, 234, 254, 1)', 
              marginBottom: '32px',
              fontSize: '16px',
              lineHeight: 1.6
            }}>
              In addition, BrezCode members feel accomplished by an average of 80% after 90 days, as verified in a third-party study.
            </p>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px'
            }}>
              <Button 
                type="primary"
                size="large"
                onClick={onTakeQuiz}
                style={{ 
                  backgroundColor: '#facc15', 
                  color: '#000', 
                  padding: '16px 32px', 
                  fontSize: '18px', 
                  fontWeight: 700, 
                  height: 'auto',
                  borderRadius: '24px',
                  border: 'none'
                }}
              >
                Take the quiz to start
              </Button>
              <div style={{ height: '56px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">BC</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              How <span className="text-blue-600">BrezCode Works</span>
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            After a quick quiz, we'll personalize your first weekly plan, introduce you to daily health rituals, and invite you to our private community. Our supportive coaches will be with you at every step of the way.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow w-full max-w-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Weekly planning</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Every Sunday you'll get a personalized plan for the week ahead. Pre-commit to your week ahead to crush your goals.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow w-full max-w-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Community</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Give and get support in the vibrant BrezCode community, a place to cultivate a positive mindset every day.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Resources</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Exercises, videos, and resources are available on-demand to help you stay motivated when you need it.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">24/7 Coaching</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  If you want any support or query, our AI coach trained by medical experts is always just a text message away, 24x7.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow w-full max-w-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Progress Tracking</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Whether it's sleep, exercise, stress, or drinks cut, BrezCode shows you your progress in the terms that matter most to you.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow w-full max-w-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Smart Alerts</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tracking your drinks and diets will become the foundation of your habit change. BrezCode makes it simple and fun!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RiskReductionChart() {
  const outerFrameRef = useRef<HTMLDivElement>(null)
  const innerScreenRef = useRef<HTMLDivElement>(null)

  const data = [
    { name: 'Exercise', reduction: 40, icon: '💪' },
    { name: 'Nutrition', reduction: 25, icon: '🥗' },
    { name: 'Mindfulness', reduction: 20, icon: '🧘‍♀️' },
    { name: 'Monitoring', reduction: 35, icon: '📊' },
    { name: 'Breathing', reduction: 15, icon: '🫁' },
    { name: 'Massage', reduction: 20, icon: '💆‍♀️' },
    { name: 'Self Exam', reduction: 20, icon: '🔍' }
  ];

  const total = data.reduce((sum, item) => sum + item.reduction, 0);

  const getBarWidth = (value) => {
    return (value / 50) * 100; // 50% is the max value (matches old layout)
  };

  return (
    <div className="text-center mb-16">
      {/* iPhone mockup frame (div-based) */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div ref={outerFrameRef} className="shadow-2xl" style={{ height: '600px', width: '20rem', background: 'linear-gradient(180deg, #1f2937, #0b0f19)', borderRadius: '3rem', padding: '8px' }}>
            <div ref={innerScreenRef} className="w-full h-full overflow-hidden relative" style={{ background: '#ffffff', borderRadius: '2.5rem' }}>
              <div
                className="absolute bg-black rounded-b-2xl z-10"
                style={{ top: 0, left: '50%', transform: 'translateX(-50%)', width: '8rem', height: '1.5rem' }}
              ></div>

              <div className="pt-8 px-6 flex justify-between items-center text-sm font-medium text-gray-900">
                <span>9:41</span>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-2 border border-gray-900 rounded-lg">
                    <div className="w-full h-full bg-green-500 rounded-lg"></div>
                  </div>
                </div>
              </div>

              <div className="px-6 pt-4 h-full overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Risk Reduction Progress</h3>
                </div>

                <div className="space-y-4">
                  {data.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4" style={item.name === 'Self Exam' ? { marginBottom: '1rem' } : undefined}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-base font-semibold text-gray-900">{item.name}</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">-{item.reduction}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${getBarWidth(item.reduction)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                
              </div>
              {/* PNG bezel overlay (optional). Place a transparent PNG at public/iphone-frame.png */}
              <img
                src="/iphone-frame.png"
                alt="iPhone frame"
                className="absolute"
                style={{ top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                onError={(e: any) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Total Risk Reduction Display */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-6 rounded-2xl shadow-lg max-w-lg mx-auto mb-12">
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">Achieve {total}% Risk Reduction</div>
          <div className="text-lg opacity-90">Through evidence-based lifestyle changes</div>
        </div>
      </div>
    </div>
  );
}

function Features({ onTakeQuiz }: { onTakeQuiz: () => void }) {

  const activities = [
    {
      title: 'Daily 5mins breathing exercise',
      description: 'Lower Chronic stress',
      reduction: '-15%',
      icon: "🫁",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: 'Daily 10mins mindfulness exercise',
      description: 'Increase positivity',
      reduction: '-5%',
      icon: "🧘‍♀️",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: '3x/weekly Self Breast Massage',
      description: 'Lower Chronic inflammation',
      reduction: '-20%',
      icon: "💆‍♀️",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      title: 'Personalized dietary management',
      description: 'Lower Carcinogen',
      reduction: '-20%',
      icon: "🥗",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: 'Daily Physical exercise tracking',
      description: 'Lower oxidative stress',
      reduction: '-40%',
      icon: "🏃‍♀️",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      title: 'Monthly Self Breast Exam',
      description: 'Early Symptom Detection',
      reduction: '-20%',
      icon: "🔍",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    {
      title: 'Daily educational content and tips',
      description: 'Increase awareness',
      reduction: '-5%',
      icon: "📚",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      title: 'AI-Risk Monitoring system',
      description: 'Early detection',
      reduction: '-50%',
      icon: "🤖",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Evidence-based activities to reverse breast cancer development
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            All activities are scientifically proven to reduce breast cancer risk
          </p>
        </div>

        <RiskReductionChart />

        <div className="grid grid-cols-2 gap-4 justify-items-center">
          {activities.map((activity, index) => (
            <div key={index} className="bg-white border-2 border-blue-100 p-4 rounded-2xl hover:shadow-xl transition-shadow hover:border-blue-200 w-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900 flex-1 pr-2">{activity.title}</h3>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                  {activity.reduction}
                </div>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">{activity.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Summary */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-12" style={{ marginTop: '80px' }}>
          <div className="grid md:grid-cols-2 gap-12 items-center justify-items-center">
            {/* Left side - Content */}
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold mb-8 text-blue-600">BrezCode can help you</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-900">Reduce breast cancer risk</h4>
                    <p className="text-gray-600">No matter where you are on your journey, BrezCode can help you reduce risk, with no pressure to be perfect.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-900">Gain control over your wellness</h4>
                    <p className="text-gray-600">We'll teach you the science-backed habits and techniques to gain control over your breast health.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-900">Reduce anxiety and stress</h4>
                    <p className="text-gray-600">The days of anxiety ruining your day or week are over. Learn to enjoy peace of mind with fewer negative effects.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-900">Improve your well-being</h4>
                    <p className="text-gray-600">Taking care of your health can have a big positive impact on your sleep, mental health, relationships, and more.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={onTakeQuiz}
                  className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition-all border-none cursor-pointer"
                >
                  Take the quiz to start
                </button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative flex justify-center">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="w-full h-96 rounded-2xl overflow-hidden flex items-center justify-center">
                  <img 
                    src="/yoga-lady.png" 
                    alt="Woman meditating in peaceful pose"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing({ onTakeQuiz }: { onTakeQuiz: () => void }) {

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Free 15-day trial, then <span className="text-blue-500">simple pricing</span>
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold inline-block">
              ⭐ BEST VALUE
            </span>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl shadow-xl p-12 border-2 border-blue-500">

            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">BrezCode Premium</h3>
              <div className="text-6xl font-bold mb-2 text-blue-500">
                Free
              </div>
              <p className="text-xl text-gray-600 mb-2">15 days, then $4.99/month</p>
              <p className="text-gray-500 mb-8">Cancel anytime • No hidden fees</p>

              <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Easy Risk scoring and tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Weekly Planning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Analytics & dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Personalized recommendations</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>AI chatbot messaging interface</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Supportive community</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Focus on moderation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Affordable cost</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onTakeQuiz}
                className="w-full py-4 rounded-full font-bold text-xl bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-lg transition-all hover:scale-105 border-none cursor-pointer"
              >
                Take the quiz to start
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Start immediately • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            <span className="font-semibold">30-day money-back guarantee</span> • Cancel anytime • No hidden fees
          </p>
        </div>
      </div>
    </section>
  );
}

function ReviewsAndTestimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Real BrezCode customers
          </h2>
        </div>

        {/* Combined Customer Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                M
              </div>
              <div>
                <h3 className="font-bold text-lg">Mia</h3>
                <p className="text-gray-600">Age 26, College Student</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              "As a young woman, I ignored breast health. This app's fun, quick lessons taught me to listen to my body and act early!"
            </p>
            <div className="flex items-center justify-between">
              <div className="flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>
              <span className="text-sm text-gray-500">Real BrezCode Customer</span>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                E
              </div>
              <div>
                <h3 className="font-bold text-lg">Emily</h3>
                <p className="text-gray-600">Age 31, Working Mother</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              "I found a lump and panicked. The app guided me through self-exams and screening info, helping me stay calm and get answers fast."
            </p>
            <div className="flex items-center justify-between">
              <div className="flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>
              <span className="text-sm text-gray-500">Real BrezCode Customer</span>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                A
              </div>
              <div>
                <h3 className="font-bold text-lg">Aisha</h3>
                <p className="text-gray-600">Age 35, High-Risk Patient</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              "My sister had breast cancer, so I'm high-risk. The app's risk scoring and check-in reminders help me feel in control of my health!"
            </p>
            <div className="flex items-center justify-between">
              <div className="flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>
              <span className="text-sm text-gray-500">Real BrezCode Customer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="py-20 bg-gray-50">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="text-blue-500">Questions</span>
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Is my health information secure?</h3>
            <p className="text-gray-600">Yes, we use bank-level encryption and are HIPAA compliant. Your health data is never shared with third parties.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-3">How accurate are the risk assessments?</h3>
            <p className="text-gray-600">Our assessments are based on evidence-based medical research and validated risk models used by healthcare professionals.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Can I cancel my subscription anytime?</h3>
            <p className="text-gray-600">Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Is this a replacement for medical care?</h3>
            <p className="text-gray-600">No, BrezCode is designed to complement your healthcare, not replace it. Always consult with healthcare professionals for medical decisions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Promise() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Our Promise to You
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-white leading-relaxed font-medium mb-12">
              We know this is a deeply personal journey for you, as it was for us. We follow a strict code of conduct and promise to always put your health and wellness above all else.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">No shame or guilt ever</h3>
                <p className="text-white/90">
                  Mindful lifestyle is about celebrating our wins, not making you feel bad.
                </p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Always private and secure</h3>
                <p className="text-white/90">
                  This is a personal, private journey for you. We make privacy a top priority.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Money back guarantee</h3>
                <p className="text-white/90">
                  If you give it a fair shot and aren't happy after 30 days, just let us know!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function Results() {
  return (
    <section className="py-20 bg-white">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            With measurable impact
          </h2>
          <p className="text-lg text-gray-500 italic">
            Results reported from a recent customer survey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">96% feel less anxiety</span>
            </div>
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">90% improve diet quality</span>
            </div>
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">87% have better sleep</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">80% feel accomplished</span>
            </div>
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">75% improve mental health</span>
            </div>
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">100% improve breast health</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignUp({ onTakeQuiz }: { onTakeQuiz: () => void }) {

  return (
    <section className="py-20 bg-gradient-to-br from-blue-400 to-blue-600">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of women taking control of their breast health with personalized AI guidance and support.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="space-y-4">
              <button 
                onClick={onTakeQuiz}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 px-6 rounded-lg border-none cursor-pointer transition-all"
              >
                Start Your Health Assessment
              </button>
              <p className="text-center text-sm text-gray-500 mb-4">
                Complete our 23-question assessment to get personalized insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-16">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">BC</span>
              </div>
              <span className="text-xl font-semibold">BrezCode</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering women with AI-driven breast health insights and personalized coaching for proactive wellness management.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 BrezCode. All rights reserved. This service is for informational purposes only and does not replace professional medical advice.</p>
          <p className="text-xs text-gray-500 mt-2">Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </footer>
  );
}

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#2563eb',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    borderRadius: 8,
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  },
};

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToQuiz = () => {
    window.history.pushState({}, '', '/quiz');
    setCurrentPath('/quiz');
  };

  // Route to quiz page
  if (currentPath === '/quiz') {
    return <QuizPage />;
  }

  // Route to dashboard page
  if (currentPath === '/dashboard') {
    return <UserDashboard />;
  }

  // Route to report page
  if (currentPath === '/report') {
    return <ReportPage />;
  }

  // Main landing page
  return (
    <ConfigProvider theme={theme}>
      <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <Navigation onTakeQuiz={navigateToQuiz} />
        <Hero onTakeQuiz={navigateToQuiz} />
        <Features onTakeQuiz={navigateToQuiz} />
        <HowItWorks />
        <ReviewsAndTestimonials />
        <FAQ />
        <Promise />
        <Results />
        <SignUp onTakeQuiz={navigateToQuiz} />
        <Pricing onTakeQuiz={navigateToQuiz} />
        <Footer />
      </div>
    </ConfigProvider>
  )
}

export default App
