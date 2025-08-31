import React, { useState } from 'react';
import { AlertTriangle, Heart, Users, Calendar, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface UrgencyRiskMessageProps {
  evidenceBasedRisk: {
    riskFactors: {
      unmodifiable: { [key: string]: any };
      modifiable: { [key: string]: any };
    };
    lifetimeRisk: {
      currentRisk: string;
      baseline: string;
      message: string;
    };
    modifiableReduction: number;
    unmodifiableRisk: number;
  };
  userProfile: {
    hasChildren?: boolean;
    age: number;
    name?: string;
  };
}

export default function UrgencyRiskMessage({ evidenceBasedRisk, userProfile }: UrgencyRiskMessageProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const unmodifiableFactors = Object.values(evidenceBasedRisk.riskFactors.unmodifiable);
  const lifetimeRisk = parseFloat(evidenceBasedRisk.lifetimeRisk.currentRisk.replace('%', ''));
  const isHighRisk = lifetimeRisk > 20;
  const hasChildren = userProfile.hasChildren || userProfile.age > 25; // Assume likely to have children if over 25

  const getUrgencyMessage = () => {
    if (lifetimeRisk >= 50) {
      return "Your risk is significantly above average and requires immediate attention.";
    } else if (lifetimeRisk >= 25) {
      return "Your risk is substantially higher than the average woman.";
    } else if (lifetimeRisk >= 16) {
      return "Your risk is notably above the national average.";
    } else {
      return "While your risk is closer to average, there are still important factors to address.";
    }
  };

  const getEmotionalMessage = () => {
    if (hasChildren && isHighRisk) {
      return {
        icon: <Heart className="h-5 w-5 text-red-500" />,
        message: "Your children need you healthy and strong. Taking action now protects not just you, but your entire family's future.",
        emphasis: "For your family's sake, these risks cannot be ignored."
      };
    } else if (isHighRisk) {
      return {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        message: "Your loved ones depend on you being healthy. The risks you face are serious and demand immediate attention.",
        emphasis: "Delaying action means accepting unnecessary risk."
      };
    } else {
      return {
        icon: <Shield className="h-5 w-5 text-orange-500" />,
        message: "Prevention is always better than treatment. Your risks are manageable but require proactive steps.",
        emphasis: "Early action leads to the best outcomes."
      };
    }
  };

  const emotionalMessage = getEmotionalMessage();

  return (
    <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-orange-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-red-900">
                Critical Health Assessment
              </CardTitle>
              <CardDescription className="text-red-700">
                Understanding your unmodifiable risk factors
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-600">
              {evidenceBasedRisk.lifetimeRisk.currentRisk}
            </div>
            <div className="text-sm text-red-700">lifetime risk</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Baseline Statistics */}
        <div className="bg-white rounded-lg p-4 border border-red-200">
          <div className="flex items-center mb-3">
            <Users className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="font-semibold text-gray-900">National Statistics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">1 in 8</div>
              <div className="text-sm text-gray-600">women will develop breast cancer</div>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {Math.round(lifetimeRisk / 12.5)} in 8
              </div>
              <div className="text-sm text-red-700">is your estimated risk</div>
            </div>
          </div>
        </div>

        {/* Urgency Message */}
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            {emotionalMessage.icon}
            <div>
              <h4 className="font-semibold text-red-900 mb-2">
                {getUrgencyMessage()}
              </h4>
              <p className="text-red-800 mb-2">
                {emotionalMessage.message}
              </p>
              <div className="text-sm font-medium text-red-900 bg-red-200 px-3 py-2 rounded">
                {emotionalMessage.emphasis}
              </div>
            </div>
          </div>
        </div>

        {/* Unmodifiable Risk Factors */}
        {unmodifiableFactors.length > 0 && (
          <div className="space-y-3">
            <div 
              className="flex items-center justify-between cursor-pointer p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
              onClick={() => setShowDetails(!showDetails)}
            >
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                Your Fixed Risk Factors ({unmodifiableFactors.length})
              </h3>
              {showDetails ? 
                <ChevronUp className="h-5 w-5 text-gray-600" /> : 
                <ChevronDown className="h-5 w-5 text-gray-600" />
              }
            </div>

            {showDetails && (
              <div className="space-y-2">
                {unmodifiableFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{factor.factor}</div>
                      <div className="text-sm text-gray-600">{factor.description}</div>
                    </div>
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      {factor.riskIncrease}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-300 rounded-lg p-4">
          <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            What This Means for You
          </h4>
          <p className="text-orange-800 mb-3">
            While these risk factors cannot be changed, understanding them is the first step toward taking control of your health. 
            The good news is that you have significant power to reduce your overall risk through lifestyle modifications.
          </p>
          <div className="bg-orange-200 text-orange-900 px-4 py-3 rounded-lg text-center font-semibold">
            {evidenceBasedRisk.modifiableReduction > 0 && (
              <>You can potentially reduce your risk by up to {evidenceBasedRisk.modifiableReduction}% through proven lifestyle changes.</>
            )}
          </div>
        </div>

        {/* Hope Transition Teaser */}
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">Ready to Take Control?</h4>
          <p className="text-green-800 text-sm mb-3">
            Scroll down to discover evidence-based actions that can significantly reduce your risk and improve your overall health.
          </p>
          <div className="text-green-600 font-semibold">
            ↓ Your personalized action plan awaits below ↓
          </div>
        </div>
      </CardContent>
    </Card>
  );
}