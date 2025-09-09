import React from 'react';
import { shouldRedirectToLinktree, shouldRedirectToAdmin } from '../../utils/domainDetection';

interface DebugInfoProps {
  enabled?: boolean;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ enabled = false }) => {
  if (!enabled || typeof window === 'undefined') return null;

  const debugData = {
    hostname: window.location.hostname,
    href: window.location.href,
    pathname: window.location.pathname,
    isLinktreeSubdomain: shouldRedirectToLinktree(),
    isAdminSubdomain: shouldRedirectToAdmin(),
    timestamp: new Date().toISOString()
  };

  return (
    <div className="fixed top-0 left-0 z-50 bg-black bg-opacity-80 text-white p-4 text-xs max-w-md">
      <h4 className="font-bold mb-2">Debug Info (DEV MODE)</h4>
      <div className="space-y-1">
        <div><strong>Hostname:</strong> {debugData.hostname}</div>
        <div><strong>Full URL:</strong> {debugData.href}</div>
        <div><strong>Pathname:</strong> {debugData.pathname}</div>
        <div><strong>Is Linktree:</strong> {debugData.isLinktreeSubdomain ? '✅' : '❌'}</div>
        <div><strong>Is Admin:</strong> {debugData.isAdminSubdomain ? '✅' : '❌'}</div>
        <div><strong>Timestamp:</strong> {debugData.timestamp}</div>
      </div>
    </div>
  );
};

export default DebugInfo;
