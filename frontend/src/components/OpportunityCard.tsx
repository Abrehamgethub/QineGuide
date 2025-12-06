import { ExternalLink, Bookmark, BookmarkCheck, Briefcase } from 'lucide-react';
import { fixURL } from './ExternalLink';

interface OpportunityCardProps {
  title: string;
  provider: string;
  url: string;
  category: string;
  skillLevel: string;
  description?: string;
  isSaved?: boolean;
  onSave?: () => void;
  onUnsave?: () => void;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  scholarship: { bg: 'bg-purple-100', text: 'text-purple-700' },
  internship: { bg: 'bg-blue-100', text: 'text-blue-700' },
  course: { bg: 'bg-green-100', text: 'text-green-700' },
  bootcamp: { bg: 'bg-orange-100', text: 'text-orange-700' },
  fellowship: { bg: 'bg-pink-100', text: 'text-pink-700' },
  default: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const OpportunityCard = ({
  title,
  provider,
  url,
  category,
  skillLevel,
  description,
  isSaved = false,
  onSave,
  onUnsave,
}: OpportunityCardProps) => {
  const colors = categoryColors[category.toLowerCase()] || categoryColors.default;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2">{title}</h3>
            <p className="text-sm text-gray-500">{provider}</p>
          </div>
        </div>

        {/* Save Button */}
        {(onSave || onUnsave) && (
          <button
            onClick={isSaved ? onUnsave : onSave}
            className={`rounded-lg p-2 transition-colors ${
              isSaved
                ? 'bg-primary-100 text-primary-600'
                : 'bg-gray-100 text-gray-400 hover:text-primary-600'
            }`}
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{description}</p>
      )}

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}>
          {category}
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {skillLevel}
        </span>
      </div>

      {/* Link */}
      <a
        href={fixURL(url)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition-all"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Force open in new tab - bypasses React Router completely
          window.open(fixURL(url), '_blank', 'noopener,noreferrer');
        }}
      >
        <span>View Opportunity</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
};

export default OpportunityCard;
