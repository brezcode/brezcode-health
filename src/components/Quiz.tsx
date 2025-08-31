import { useState, useEffect } from "react";
import { postJSON } from '../api/client';
import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Slider,
  LinearProgress,
  IconButton,
  Box,
  Paper,
  Alert,
  AlertTitle
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface QuizQuestion {
  id: string;
  question: string;
  reason?: string;
  type: "number_range" | "multiple_choice" | "text" | "slider" | "yes_no";
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
  condition?: {
    questionId: string;
    answer: string;
    exclude?: boolean;
  };
}

const quizSections = [
  {
    title: "Section 1: Demographic Factors",
    description: "Basic demographic information that influences baseline risk",
    questions: [
      {
        id: "age",
        question: "What is your current age?",
        reason: "According to a 2024 study by American Cancer Society, breast cancer risk increases with age.",
        type: "number_range" as const,
        min: 20,
        max: 80,
        required: true
      },
      {
        id: "country",
        question: "Which country are you residing now?",
        reason: "According to a 2024 study by American Cancer Society, 1 in 8 women in US will develop cancer in their lifetime",
        type: "multiple_choice" as const,
        options: ["United States", "Canada", "United Kingdom", "Australia", "Other"],
        required: true
      },
      {
        id: "ethnicity",
        question: "What is your racial/ethnic background?",
        reason: "Breast cancer risk varies by ethnicity.",
        type: "multiple_choice" as const,
        options: ["White (non-Hispanic)", "Black", "Asian", "Hispanic/Latino", "American Indian"],
        required: true
      }
    ]
  },
  {
    title: "Section 2: Family History and Genetics Factors",
    description: "Hereditary and genetic risk factors",
    questions: [
      {
        id: "family_history",
        question: "Do you have a first-degree relative (mother, sister, daughter) or second-degree relative with breast cancer (BC)?",
        reason: "Family history increases risk.",
        type: "multiple_choice" as const,
        options: [
          "Yes, I have first-degree relative with BC",
          "Yes, I have second-degree relative with BC",
          "Yes, I have both first-degree relative and second-degree relative with BC",
          "No, I do not have any relative with BC"
        ],
        required: true
      },
      {
        id: "brca_test",
        question: "Have you ever been told you have one of the following genetic or family cancer syndromes after having genetic testing?",
        reason: "Certain genetic mutations significantly increase risk.",
        type: "multiple_choice" as const,
        options: ["BRCA1/2", "No condition", "Not tested"],
        required: true
      }
    ]
  },
  {
    title: "Section 3: Reproductive and Hormonal Factors",
    description: "Hormonal exposure and reproductive history",
    questions: [
      {
        id: "menstrual_age",
        question: "At what age did you have your first menstrual period?",
        reason: "Early menarche modestly increases risk.",
        type: "multiple_choice" as const,
        options: ["Before 12 years old", "12 years old or later"],
        required: true
      },
      {
        id: "pregnancy_age",
        question: "Have you ever been pregnant? If yes, at what age did you have your first full-term pregnancy?",
        reason: "Pregnancy timing affects lifetime risk.",
        type: "multiple_choice" as const,
        options: ["Never had a full-term pregnancy", "Age 30 or older", "Age 25-29", "Before age 25"],
        required: true
      },
      {
        id: "oral_contraceptives",
        question: "Have you ever used hormonal birth control (e.g., pills, patches, injections)?",
        reason: "Oral contraceptives slightly increase risk during current use.",
        type: "multiple_choice" as const,
        options: ["Yes, currently using", "Yes, used in the past", "No, never used"],
        required: true
      },
      {
        id: "menopause",
        question: "Have you gone without a menstrual period for 12 or more consecutive months (excluding pregnancy or medical conditions)?",
        reason: "Post-menopausal status changes hormone profile.",
        type: "multiple_choice" as const,
        options: ["Yes, at age 55 or older", "Yes, before age 55", "Not yet"],
        required: true
      },
      {
        id: "weight",
        question: "What is your weight in kg?",
        reason: "Used to calculate BMI; obesity increases risk post-menopause.",
        type: "number_range" as const,
        min: 40,
        max: 150,
        required: true
      },
      {
        id: "height",
        question: "What is your height in meters?",
        reason: "Used to calculate BMI.",
        type: "number_range" as const,
        min: 1.4,
        max: 2.1,
        required: true
      },
      {
        id: "hrt",
        question: "Have you ever used Combined Hormone Replacement Therapy (HRT) for more than 5 years?",
        reason: "Combined HRT >5 years increases risk.",
        type: "multiple_choice" as const,
        options: ["Yes", "No"],
        required: true
      }
    ]
  },
  {
    title: "Section 4: Symptom Risk Factors",
    description: "Current breast symptoms and related factors",
    questions: [
      {
        id: "breast_symptoms",
        question: "Do you have any breast symptoms such as lumps, pain, or nipple discharge?",
        reason: "Symptoms inform immediate risk.",
        type: "multiple_choice" as const,
        options: [
          "I have breast pain",
          "I have a lump in my breast",
          "I have swollen breast or changed in size or shape",
          "Yes, I have other symptoms",
          "No, I don't have any symptoms"
        ],
        required: true
      },
      {
        id: "pain_severity",
        question: "How painful is it?",
        reason: "Character of pain can guide next steps.",
        type: "multiple_choice" as const,
        options: [
          "Severe Cyclical Pain in Breast or Armpit",
          "Severe and Continuous Non-Cyclical Breast Pain in one part of the breast or armpit",
          "Mild Pain"
        ],
        required: false,
        condition: { questionId: "breast_symptoms", answer: "I have breast pain" }
      },
      {
        id: "lump_characteristics",
        question: "Is it larger than 2 cm or growing rapidly?",
        reason: "Rapid growth/size matters.",
        type: "multiple_choice" as const,
        options: [
          "Growing Lump with size over 5cm",
          "Growing Lump size over 2cm",
          "Stable Lump size over 2cm",
          "Stable Lump size below 2cm"
        ],
        required: false,
        condition: { questionId: "breast_symptoms", answer: "I have a lump in my breast" }
      },
      {
        id: "breast_changes",
        question: "Are you currently experiencing swollen breast or persistent changes in breast size or shape",
        reason: "Persistent changes may increase risk.",
        type: "multiple_choice" as const,
        options: [
          "Yes, I have swollen breast or armpit",
          "Yes, I have persistent changes in breast size or shape"
        ],
        required: false,
        condition: { questionId: "breast_symptoms", answer: "I have swollen breast or changed in size or shape" }
      }
    ]
  },
  {
    title: "Section 5: Screening and Precancerous Risk Factors",
    description: "Screening history and precancerous conditions",
    questions: [
      {
        id: "mammogram_frequency",
        question: "How often do you undergo mammogram or other screening for breast cancer?",
        reason: "Screening frequency impacts detection.",
        type: "multiple_choice" as const,
        options: ["Annually (once a year)", "Biennially (every 2 years)", "Irregularly", "Never"],
        required: true
      },
      {
        id: "dense_breast",
        question: "Have you been told that you have dense breast tissue based on a mammogram?",
        reason: "Dense breasts double risk.",
        type: "multiple_choice" as const,
        options: ["Yes, I have dense breast tissue", "No, I don't have dense breast tissue", "I don't know"],
        required: true,
        condition: { questionId: "mammogram_frequency", answer: "Never", exclude: true }
      },
      {
        id: "benign_condition",
        question: "Have you been diagnosed with a benign breast condition, such as atypical hyperplasia, LCIS, or complex/complicated cysts?",
        reason: "Some benign conditions increase risk.",
        type: "multiple_choice" as const,
        options: [
          "Yes, Atypical Hyperplasia (ADH/ALH)",
          "Yes, LCIS",
          "Yes, complex/complicated cysts",
          "Yes, other benign condition (e.g., simple cysts, fibrocystic changes)",
          "No benign breast conditions"
        ],
        required: true,
        condition: { questionId: "mammogram_frequency", answer: "Never", exclude: true }
      },
      {
        id: "cancer_history",
        question: "Have you been diagnosed with a cancerous breast condition, such as IBC, ILC, or DCIS?",
        reason: "History of cancer affects recurrence risk.",
        type: "multiple_choice" as const,
        options: [
          "Yes, I am a Breast Cancer Patient currently undergoing treatment",
          "Yes, I am a Breast Cancer Survivor taking medication to lower the risk of recurrence",
          "No diagnosed breast conditions"
        ],
        required: true,
        condition: { questionId: "mammogram_frequency", answer: "Never", exclude: true }
      },
      {
        id: "cancer_stage",
        question: "What Stage is/was your breast cancer",
        reason: "Stage guides follow-up.",
        type: "multiple_choice" as const,
        options: ["Stage 0", "Stage 1", "Stage 2", "Stage 3", "Stage 4"],
        required: false,
        condition: { questionId: "cancer_history", answer: "Yes, I am a Breast Cancer Patient currently undergoing treatment" }
      }
    ]
  },
  {
    title: "Section 6: Lifestyle and Environmental Factors",
    description: "Modifiable lifestyle and environmental risk factors",
    questions: [
      {
        id: "western_diet",
        question: "Do you regularly follow a Western diet?",
        reason: "Western diet pattern increases risk.",
        type: "multiple_choice" as const,
        options: ["Yes, Western diet", "Yes, mixed diet with some Western elements", "No, mostly non-Western diet"],
        required: true
      },
      {
        id: "smoke",
        question: "Do you currently smoke tobacco products?",
        reason: "Current smoking modestly increases risk.",
        type: "multiple_choice" as const,
        options: ["Yes", "No"],
        required: true
      },
      {
        id: "alcohol",
        question: "How many alcoholic drinks do you consume per day, on average?",
        reason: "Alcohol intake increases risk in a dose-dependent way.",
        type: "multiple_choice" as const,
        options: ["2 or more drinks", "1 drink", "None"],
        required: true
      },
      {
        id: "night_shift",
        question: "Do you regularly work night shifts?",
        reason: "Night shift work slightly increases risk.",
        type: "multiple_choice" as const,
        options: ["Yes", "No"],
        required: true
      },
      {
        id: "stressful_events",
        question: "Have you experienced striking stressful life events?",
        reason: "Stressful life events may contribute to risk.",
        type: "multiple_choice" as const,
        options: ["Yes, striking life events", "Yes, stressful life events", "No, no significant stressful events"],
        required: true
      },
      {
        id: "chronic_stress",
        question: "Do you experience chronic stress?",
        reason: "Chronic stress modestly increases risk.",
        type: "multiple_choice" as const,
        options: ["Yes, chronic high stress", "Yes, occasional moderate stress", "No, low or no chronic stress"],
        required: true
      },
      {
        id: "sugar_diet",
        question: "Do you regularly consume a high sugar diet?",
        reason: "High added sugars may increase risk.",
        type: "multiple_choice" as const,
        options: ["Yes, high sugar diet", "Yes, moderate sugar diet", "No, low or no added sugar diet"],
        required: true
      },
      {
        id: "exercise",
        question: "Do you engage in regular moderate to vigorous exercise?",
        reason: "Regular activity lowers risk.",
        type: "multiple_choice" as const,
        options: ["Yes, regular moderate to vigorous exercise", "Yes, occasional light exercise", "No, little or no regular exercise"],
        required: true
      }
    ]
  }
];

// Flatten all questions for easier processing  
const quizQuestions: QuizQuestion[] = quizSections.flatMap(section => 
  section.questions.map(q => ({ ...q, section: section.title }))
);

interface QuizProps {
  onComplete: (answers: Record<string, any>) => void;
  onClose: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export default function Quiz({ onComplete, onClose, isSubmitting = false, submitError = null }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentAnswer, setCurrentAnswer] = useState<any>("");
  const [userCountry, setUserCountry] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  // Get user's country from IP address
  useEffect(() => {
    const getUserCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCountry(data.country_name || 'Unknown');
      } catch (error) {
        console.error('Failed to get user location:', error);
        setUserCountry('Unknown');
      }
    };

    getUserCountry();
  }, []);

  // Filter questions based on conditions
  const getVisibleQuestions = () => {
    return quizQuestions.filter(question => {
      if (!question.condition) return true;

      const conditionAnswer = answers[question.condition.questionId];
      
      // Handle exclude condition (hide question when condition matches)
      if (question.condition.exclude) {
        return conditionAnswer !== question.condition.answer;
      }
      
      // Handle include condition (show question when condition matches)
      return conditionAnswer === question.condition.answer;
    });
  };

  const visibleQuestions = getVisibleQuestions();

  // Format reason text to be more friendly and readable
  const formatReasonText = (reason: string) => {
    // Clean up the text to be more user-friendly
    let formatted = reason
      .replace(/According to a \d+ study by.*?, /, "Research shows that ")
      .replace(/According to.*? study.*?, /, "Research shows that ")
      .replace(/According to.*?, /, "Research shows that ")
      .replace(/Studies show.*?, /, "Research shows that ")
      .replace(/relative risk.*?\)/g, "")
      .replace(/\(RR.*?\)/g, "")
      .replace(/approximately /g, "about ")
      .replace(/\(relative risk, RR ≈.*?\)/g, "")
      .replace(/\s+\(\s*$/, "")  // Remove trailing opening parentheses
      .replace(/\s+\(\s*\./g, ".")  // Remove stray "(" before periods
      .replace(/Compare to.*?, /g, "")
      .replace(/Women who /g, "Women who ")
      .replace(/women who /g, "women who ");

    return formatted;
  };

  // Ensure we have a valid current question
  const currentQuestion = visibleQuestions[currentQuestionIndex] || visibleQuestions[visibleQuestions.length - 1];
  const progress = Math.min(((currentQuestionIndex + 1) / Math.max(visibleQuestions.length, 1)) * 100, 100);
  const isLastQuestion = currentQuestionIndex >= visibleQuestions.length - 1;

  const handleNext = () => {
    // Save current answer
    const updatedAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
    setAnswers(updatedAnswers);

    // Find next question index
    let nextQuestionIndex = currentQuestionIndex + 1;

    // If we're at the last question, complete the quiz
    if (nextQuestionIndex >= visibleQuestions.length) {
      const finalAnswers: Record<string, any> = { 
        ...updatedAnswers,
        country: userCountry
      };

      // Compute BMI and flag obesity if weight/height are available
      if (finalAnswers.weight && finalAnswers.height) {
        const bmi = Number(finalAnswers.weight) / (Number(finalAnswers.height) ** 2);
        finalAnswers.bmi = Math.round(bmi * 10) / 10;
        finalAnswers.obesity = bmi >= 30 ? 'Yes' : 'No';
      }

      onComplete(finalAnswers);
      return;
    }

    setCurrentQuestionIndex(nextQuestionIndex);
    setCurrentAnswer("");
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setValidationError("");
      setCurrentQuestionIndex(prev => prev - 1);
      const previousQuestion = visibleQuestions[currentQuestionIndex - 1];
      setCurrentAnswer(answers[previousQuestion.id] || "");
    }
  };

  const isAnswerValid = () => {
    if (!currentQuestion.required) return true;

    switch (currentQuestion.type) {
      case "number_range":
        const num = Number(currentAnswer);
        return !isNaN(num) && 
               num >= (currentQuestion.min || 0) && 
               num <= (currentQuestion.max || 100) &&
               currentAnswer !== "";
      case "multiple_choice":
      case "yes_no":
        return currentAnswer !== "";
      case "text":
        return currentAnswer.trim() !== "";
      case "slider":
        return currentAnswer !== null && currentAnswer !== undefined;
      default:
        return true;
    }
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case "number_range":
        return (
          <Box sx={{ my: 1 }}>
            <FormControl fullWidth>
              <FormLabel>
                <Typography variant="caption">Choose a value: {currentAnswer || currentQuestion.min || 0}</Typography>
              </FormLabel>
              <TextField
                type="number"
                inputProps={{
                  min: currentQuestion.min,
                  max: currentQuestion.max,
                  step: currentQuestion.id === "height" ? 0.1 : 1
                }}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={`Enter a number between ${currentQuestion.min} and ${currentQuestion.max}`}
                fullWidth
                size="small"
                sx={{ mt: 1 }}
              />
            </FormControl>
          </Box>
        );

      case "multiple_choice":
        return (
          <FormControl component="fieldset" sx={{ width: '100%', mt: 1 }}>
            <RadioGroup
              value={currentAnswer}
              onChange={(e) => {
                setCurrentAnswer(e.target.value);
                setValidationError("");
              }}
            >
              {currentQuestion.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio size="small" />}
                  label={<Typography variant="body2">{option}</Typography>}
                  sx={{
                    p: 0.75,
                    borderRadius: 1,
                    width: '100%',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                />
              ))}
            </RadioGroup>

            {validationError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {validationError}
              </Alert>
            )}
          </FormControl>
        );

      case "yes_no":
        return (
          <FormControl component="fieldset" sx={{ width: '100%', mt: 1 }}>
            <RadioGroup value={currentAnswer} onChange={(e) => setCurrentAnswer(e.target.value)}>
              <FormControlLabel value="yes" control={<Radio size="small" />} label={<Typography variant="body2">Yes</Typography>} />
              <FormControlLabel value="no" control={<Radio size="small" />} label={<Typography variant="body2">No</Typography>} />
            </RadioGroup>
          </FormControl>
        );

      case "slider":
        return (
          <Box sx={{ my: 1 }}>
            <FormLabel>
              <Typography variant="caption">Select a value: {currentAnswer || currentQuestion.min || 0}</Typography>
            </FormLabel>
            <Slider
              value={currentAnswer || currentQuestion.min || 0}
              onChange={(_, value) => setCurrentAnswer(value)}
              min={currentQuestion.min || 0}
              max={currentQuestion.max || 100}
              step={1}
              sx={{ mt: 0.5 }}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{
      position: 'fixed',
      inset: 0,
      bgcolor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 0.5
    }}>
      <Card sx={{ width: '100%', maxWidth: 800, maxHeight: '94vh', overflow: 'auto' }}>
        <CardHeader sx={{ p: 1.5, pb: 0.5 }}
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.05rem' } }}>Breast Health Assessment</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    // Skip quiz with default answers for testing
                    const defaultAnswers = {
                      age: "35",
                      ethnicity: "White (non-Hispanic)",
                      family_history: "No, I do not have any relative with BC",
                      brca_test: "Not tested",
                      dense_breast: "No",
                      menstrual_age: "12 years old or later",
                      pregnancy_age: "Before age 25",
                      oral_contraceptives: "No, never used",
                      menopause: "Not yet",
                      weight: "65",
                      height: "1.65",
                      hrt: "No",
                      western_diet: "No, mostly non-Western diet (e.g., Mediterranean or plant-based)",
                      smoke: "No",
                      alcohol: "None",
                      night_shift: "No",
                      stressful_events: "No, no significant stressful events",
                      benign_condition: "No benign breast conditions",
                      cancer_history: "No diagnosed breast conditions",
                      mammogram_frequency: "Biennially (every 2 years)",
                      breast_symptoms: "No, I don't have any symptoms",
                      country: userCountry,
                      bmi: 23.9,
                      obesity: "No"
                    };
                    onComplete(defaultAnswers);
                  }}
                  sx={{ color: 'primary.main' }}
                >
                  Skip Quiz (Test)
                </Button>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          }
          subheader={
            <Box sx={{ mt: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                <Typography variant="body2" color="text.secondary">
                  Question {currentQuestionIndex + 1} of {visibleQuestions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(progress)}% complete
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 1 }} />
            </Box>
          }
        />

        <CardContent sx={{ py: 1 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: '0.95rem', sm: '1rem' }, lineHeight: 1.25 }}>
              {currentQuestion.question}
            </Typography>

            {/* Show BMI calculation and warning for height question */}
            {currentQuestion.id === "height" && answers.weight && currentAnswer && (
              <Paper sx={{ p: 1.5, bgcolor: 'info.light', color: 'info.contrastText', mt: 1 }}>
                {(() => {
                  const weight = answers.weight;
                  const height = currentAnswer;
                  if (weight && height) {
                    const bmi = Number(weight) / (Number(height) ** 2);
                    const roundedBmi = Math.round(bmi * 10) / 10;
                    const isPostmenopausal = answers.menopause === "Yes, at age 55 or older" || answers.menopause === "Yes, before age 55";

                    return (
                      <Box>
                        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                          <strong>Your calculated BMI: {roundedBmi}</strong>
                        </Typography>
                        {roundedBmi >= 30 && isPostmenopausal && (
                          <Alert severity="warning" sx={{ mt: 1 }}>
                            <AlertTitle>Important Health Notice</AlertTitle>
                            Your BMI is {roundedBmi}, which is in the obese range (≥30). 
                            As a postmenopausal woman, this is associated with increased breast cancer risk. 
                            Consider speaking with your healthcare provider about strategies to lower your BMI through diet and exercise.
                          </Alert>
                        )}
                      </Box>
                    );
                  }
                  return null;
                })()}
              </Paper>
            )}

            {renderQuestionInput()}

            {/* Show educational reason below the answer box */}
            {currentQuestion.reason && (
              <Paper 
                sx={{ 
                  mt: 2, 
                  p: 1.5,
                  bgcolor: 'info.light',
                  color: 'info.contrastText',
                  borderLeft: 4,
                  borderColor: 'info.main'
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Why we ask this question:
                </Typography>
                <Typography variant="body2">
                  {formatReasonText(currentQuestion.reason)}
                </Typography>
              </Paper>
            )}
            
            {/* Show submit error */}
            {submitError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Submission Error</AlertTitle>
                {submitError}. Please try again.
              </Alert>
            )}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            pt: 2,
            borderTop: 1,
            borderColor: 'divider'
          }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              sx={{ px: 4, py: 1.5 }}
            >
              Previous
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isAnswerValid() || isSubmitting}
              sx={{ px: 4, py: 1.5 }}
            >
              {isSubmitting ? "Saving..." : (isLastQuestion ? "Complete Assessment" : "Next")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}