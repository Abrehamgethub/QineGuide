import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { ReactNode, MouseEvent } from 'react';

interface ExternalLinkProps {
  url: string | undefined | null;
  children?: ReactNode;
  className?: string;
  showIcon?: boolean;
}

/**
 * Sanitizes and fixes malformed URLs before rendering
 * - Removes leading slash before https:// (main cause of redirect error)
 * - Handles double slashes and malformed protocols
 * - Adds https:// if protocol is missing
 * - Returns empty string for invalid URLs
 */
export function fixURL(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';
  
  let cleaned = url.trim();
  
  // Skip if empty after trim
  if (!cleaned) return '';
  
  // Remove leading slash(es) before https:// (e.g., /https://example.com or ///https://)
  cleaned = cleaned.replace(/^\/+(https?:)/i, '$1');
  
  // Remove any leading slashes that shouldn't be there
  cleaned = cleaned.replace(/^\/+/, '');
  
  // Handle protocol-relative URLs (//example.com)
  if (cleaned.startsWith('//')) {
    cleaned = 'https:' + cleaned;
  }
  
  // Fix malformed protocols (htps://, htp://, etc.)
  cleaned = cleaned.replace(/^h?t?t?p?s?:\/?\/?/i, (match) => {
    if (match.toLowerCase().includes('https')) return 'https://';
    if (match.toLowerCase().includes('http')) return 'http://';
    return match;
  });
  
  // If it's missing protocol entirely, add https://
  if (!/^https?:\/\//i.test(cleaned)) {
    // Only add protocol if it looks like a URL (has a dot and no spaces)
    if (cleaned.includes('.') && !cleaned.includes(' ')) {
      cleaned = 'https://' + cleaned;
    }
  }
  
  // Validate URL structure
  try {
    if (/^https?:\/\//i.test(cleaned)) {
      new URL(cleaned);
    }
  } catch {
    // If URL is invalid, return empty
    return '';
  }
  
  return cleaned;
}

/**
 * Extract a display name from URL (domain) or truncate text
 */
export function getDisplayName(url: string, fallback: string = 'Visit Resource'): string {
  const fixed = fixURL(url);
  if (!fixed) return fallback;
  
  try {
    const urlObj = new URL(fixed);
    // Return clean domain name
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return fallback;
  }
}

/**
 * Force open external URL - bypasses any router interception
 */
export function openExternalURL(url: string, e?: MouseEvent): void {
  const fixed = fixURL(url);
  if (!fixed) return;
  
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Use window.open to bypass any router interception
  window.open(fixed, '_blank', 'noopener,noreferrer');
}

/**
 * ExternalLink component that properly handles external URLs
 * - Prevents React Router from intercepting the navigation
 * - Sanitizes malformed URLs
 * - Opens in new tab with security attributes
 * - Uses window.open as fallback for maximum compatibility
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
  
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Force open in new tab using window.open
    window.open(fixedUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <a
      href={fixedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children || 'Open Resource'}
      {showIcon && <ExternalLinkIcon className="inline-block ml-1 h-3 w-3" />}
    </a>
  );
};

export default ExternalLink;
