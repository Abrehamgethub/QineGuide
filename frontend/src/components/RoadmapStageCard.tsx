import { ChevronDown, ChevronUp, BookOpen, Clock, Zap } from 'lucide-react';
import { useState } from 'react';

interface RoadmapStageProps {
  stageNumber: number;
  title: string;
  description: string;
  resources: string[];
  duration?: string;
  skills?: string[];
  isCompleted?: boolean;
  onToggleComplete?: () => void;
}

const RoadmapStageCard = ({
  stageNumber,
  title,
  description,
  resources,
  duration,
  skills,
  isCompleted = false,
  onToggleComplete,
}: RoadmapStageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border transition-all ${
        isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
      }`}
    >
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          {/* Stage Number */}
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
              isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-primary-100 text-primary-700'
            }`}
          >
            {stageNumber}
          </div>

          {/* Title & Description Preview */}
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {!isExpanded && (
              <p className="text-sm text-gray-500 line-clamp-1">{description}</p>
            )}
          </div>
        </div>

        {/* Expand Button */}
        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 pb-4">
          {/* Description */}
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">{description}</p>

          {/* Duration & Skills */}
          <div className="mt-4 flex flex-wrap gap-3">
            {duration && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            )}
            {skills && skills.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Zap className="h-4 w-4" />
                <span>{skills.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Resources */}
          {resources.length > 0 && (
            <div className="mt-4">
              <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <BookOpen className="h-4 w-4" />
                Resources
              </h4>
              <ul className="mt-2 space-y-2">
                {resources.map((resource, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Complete Button */}
          {onToggleComplete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete();
              }}
              className={`mt-4 w-full rounded-lg py-2 text-sm font-medium transition-colors ${
                isCompleted
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              {isCompleted ? 'Completed!' : 'Mark as Complete'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RoadmapStageCard;
