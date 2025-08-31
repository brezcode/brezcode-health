import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  Dna, 
  Activity, 
  FileText, 
  Heart, 
  Scale,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SectionAnalysis {
  sectionScores: {
    [key: string]: {
      score: number;
      factors: string[];
    };
  };
  sectionSummaries: {
    [key: string]: string;
  };
}

interface DetailedSectionAnalysisProps {
  sectionAnalysis: SectionAnalysis;
}

export default function DetailedSectionAnalysis({ sectionAnalysis }: DetailedSectionAnalysisProps) {
  const [expandedSections, setExpandedSections] = React.useState<{[key: string]: boolean}>({});

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const getSectionIcon = (sectionName: string) => {
    switch (sectionName) {
      case 'Demographics':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'Family History & Genetics':
        return <Dna className="h-5 w-5 text-purple-600" />;
      case 'Lifestyle':
        return <Activity className="h-5 w-5 text-green-600" />;
      case 'Medical History':
        return <FileText className="h-5 w-5 text-orange-600" />;
      case 'Hormonal Factors':
        return <Heart className="h-5 w-5 text-pink-600" />;
      case 'Physical Characteristics':
        return <Scale className="h-5 w-5 text-indigo-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLevelBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Moderate Risk</Badge>;
    return <Badge className="bg-red-100 text-red-800">Higher Risk</Badge>;
  };

  const sections = Object.keys(sectionAnalysis.sectionScores || {});

  if (sections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detailed Section Analysis</CardTitle>
          <CardDescription>No detailed analysis available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-6 w-6 mr-2 text-blue-600" />
          Comprehensive Section Analysis
        </CardTitle>
        <CardDescription>
          Detailed professional assessment of each health category based on your quiz responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((sectionName) => {
          const sectionData = sectionAnalysis.sectionScores[sectionName];
          const summary = sectionAnalysis.sectionSummaries[sectionName];
          const isExpanded = expandedSections[sectionName];

          return (
            <div key={sectionName} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Section Header */}
              <div 
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSection(sectionName)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getSectionIcon(sectionName)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{sectionName}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className={`text-sm font-medium px-2 py-1 rounded-full ${getScoreColor(sectionData.score)}`}>
                          Score: {sectionData.score}/100
                        </div>
                        {getRiskLevelBadge(sectionData.score)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {sectionData.factors && sectionData.factors.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {sectionData.factors.length} factor{sectionData.factors.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                </div>
                
                {/* Risk Factors Preview */}
                {sectionData.factors && sectionData.factors.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {sectionData.factors.slice(0, isExpanded ? undefined : 2).map((factor, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                      {!isExpanded && sectionData.factors.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{sectionData.factors.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-6 bg-white">
                  {/* Comprehensive Summary */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                      Professional Assessment
                    </h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {summary || 'No detailed analysis available for this section.'}
                      </p>
                    </div>
                  </div>

                  {/* Risk Factors Detail */}
                  {sectionData.factors && sectionData.factors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-red-600" />
                        Identified Risk Factors
                      </h4>
                      <div className="grid gap-2">
                        {sectionData.factors.map((factor, index) => (
                          <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                            <span className="text-sm text-red-800">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Score Interpretation */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Score Interpretation</h4>
                    <div className="text-sm text-blue-800">
                      {sectionData.score >= 80 && (
                        <p>
                          <strong>Excellent (80-100):</strong> This category shows minimal risk factors and optimal health patterns. 
                          Continue current practices and maintain regular monitoring.
                        </p>
                      )}
                      {sectionData.score >= 60 && sectionData.score < 80 && (
                        <p>
                          <strong>Moderate (60-79):</strong> This category shows some areas for improvement with manageable risk factors. 
                          Focus on addressing modifiable factors through lifestyle changes and medical guidance.
                        </p>
                      )}
                      {sectionData.score < 60 && (
                        <p>
                          <strong>Needs Attention (&lt;60):</strong> This category indicates significant risk factors requiring attention. 
                          Prioritize addressing these factors through comprehensive interventions and professional guidance.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Overall Summary */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Insights</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
              <ul className="space-y-1 text-gray-700">
                {sections
                  .filter(section => sectionAnalysis.sectionScores[section].score >= 80)
                  .map(section => (
                    <li key={section} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {section}: {sectionAnalysis.sectionScores[section].score}/100
                    </li>
                  ))
                }
                {sections.filter(section => sectionAnalysis.sectionScores[section].score >= 80).length === 0 && (
                  <li className="text-gray-500 italic">Focus on improvement opportunities below</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Areas for Focus</h4>
              <ul className="space-y-1 text-gray-700">
                {sections
                  .filter(section => sectionAnalysis.sectionScores[section].score < 80)
                  .sort((a, b) => sectionAnalysis.sectionScores[a].score - sectionAnalysis.sectionScores[b].score)
                  .slice(0, 3)
                  .map(section => (
                    <li key={section} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                      {section}: {sectionAnalysis.sectionScores[section].score}/100
                    </li>
                  ))
                }
                {sections.filter(section => sectionAnalysis.sectionScores[section].score < 80).length === 0 && (
                  <li className="text-gray-500 italic">All sections show strong performance</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}