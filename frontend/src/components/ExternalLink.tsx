import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ExternalLinkProps {
  url: string | undefined | null;
  children?: ReactNode;
  className?: string;
  showIcon?: boolean;
}

/**
 * Sanitizes and fixes malformed URLs before rendering
 * - Removes leading slash before https:// (main cause of redirect error)
 * - Adds https:// if protocol is missing
 * - Returns null for empty/invalid URLs
 */
export function fixURL(url: string | undefined | null): string {
  if (!url) return '';
  
  let cleaned = url.trim();
  
  // Remove leading slash(es) before https:// (e.g., /https://example.com)
  cleaned = cleaned.replace(/^\/+(https?:\/\/)/i, '$1');
  
  // Handle protocol-relative URLs (//example.com)
  if (cleaned.startsWith('//')) {
    cleaned = 'https:' + cleaned;
  }
  
  // If it's missing protocol entirely, add https://
  if (!/^https?:\/\//i.test(cleaned)) {
    // Only add protocol if it looks like a URL (has a dot)
    if (cleaned.includes('.')) {
      cleaned = 'https://' + cleaned;
    }
  }
  
  return cleaned;
}

/**
 * ExternalLink component that properly handles external URLs
 * - Prevents React Router from intercepting the navigation
 * - Sanitizes malformed URLs
 * - Opens in new tab with security attributes
 */
const ExternalLink = ({ 
  url, 
  children, 
  className = 'text-primary-600 hover:text-primary-700 hover:underline',
  showIcon = true 
}: ExternalLinkProps) => {
  const fixedUrl = fixURL(url);
  
  // Don't render if URL is empty or invalid
  if (!fixedUrl) return null;
  
  return (
    <a
      href={fixedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        // Ensure click propagates correctly for external links
        e.stopPropagation();
      }}
    >
      {children || 'Open Resource'}
      {showIcon && <ExternalLinkIcon className="inline-block ml-1 h-3 w-3" />}
    </a>
  );
};

export default ExternalLink;
