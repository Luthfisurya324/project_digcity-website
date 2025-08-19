/**
 * Performance Monitor Component
 * Displays real-time performance metrics in development mode
 */

import React, { useState, useEffect } from 'react';
import { usePerformance } from '../hooks/usePerformance';
import { getWebVitalsData, type PerformanceMetric } from '../utils/webVitals';

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  minimized?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = import.meta.env.DEV,
  position = 'bottom-right',
  minimized: initialMinimized = false
}) => {
  const { performanceScore, recommendations, isLoading } = usePerformance();
  const [isMinimized, setIsMinimized] = useState(initialMinimized);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState(getWebVitalsData());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetrics(getWebVitalsData());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!enabled) return null;

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 9999,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: isMinimized ? '8px' : '12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: isMinimized ? '60px' : '300px',
      transition: 'all 0.3s ease'
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyles, top: '10px', left: '10px' };
      case 'top-right':
        return { ...baseStyles, top: '10px', right: '10px' };
      case 'bottom-left':
        return { ...baseStyles, bottom: '10px', left: '10px' };
      case 'bottom-right':
      default:
        return { ...baseStyles, bottom: '10px', right: '10px' };
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return '#4ade80';
      case 'needs-improvement': return '#fbbf24';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatValue = (metric: PerformanceMetric) => {
    if (metric.name === 'CLS') {
      return metric.value.toFixed(3);
    }
    return `${Math.round(metric.value)}ms`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4ade80';
    if (score >= 50) return '#fbbf24';
    return '#ef4444';
  };

  if (isMinimized) {
    return (
      <div 
        style={getPositionStyles()}
        onClick={() => setIsMinimized(false)}
        title="Click to expand performance monitor"
      >
        <div style={{ cursor: 'pointer', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>PERF</div>
          <div style={{ 
            color: getScoreColor(performanceScore),
            fontWeight: 'bold'
          }}>
            {performanceScore}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={getPositionStyles()}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <div style={{ fontWeight: 'bold' }}>Performance Monitor</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            style={{
              background: 'none',
              border: '1px solid #374151',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
            title="Toggle recommendations"
          >
            💡
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              background: 'none',
              border: '1px solid #374151',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
            title="Minimize"
          >
            −
          </button>
        </div>
      </div>

      {/* Performance Score */}
      <div style={{ 
        marginBottom: '8px',
        padding: '6px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px'
      }}>
        <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '2px' }}>Overall Score</div>
        <div style={{ 
          fontSize: '18px',
          fontWeight: 'bold',
          color: getScoreColor(performanceScore)
        }}>
          {performanceScore}/100
        </div>
      </div>

      {/* Core Web Vitals */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>Core Web Vitals</div>
        
        {Object.entries(currentMetrics).map(([key, metric]) => {
          if (!metric) return null;
          
          return (
            <div key={key} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '2px',
              padding: '2px 4px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '2px'
            }}>
              <span style={{ fontSize: '10px' }}>{metric.name}:</span>
              <span style={{ 
                color: getRatingColor(metric.rating),
                fontWeight: 'bold',
                fontSize: '10px'
              }}>
                {formatValue(metric)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{ 
          fontSize: '10px', 
          opacity: 0.7,
          textAlign: 'center',
          padding: '4px'
        }}>
          Measuring performance...
        </div>
      )}

      {/* Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <div style={{ 
          marginTop: '8px',
          padding: '6px',
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          borderRadius: '4px',
          borderLeft: '3px solid #fbbf24'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>Recommendations:</div>
          {recommendations.slice(0, 3).map((rec, index) => (
            <div key={index} style={{ 
              fontSize: '9px', 
              marginBottom: '2px',
              opacity: 0.9,
              lineHeight: '1.2'
            }}>
              • {rec}
            </div>
          ))}
          {recommendations.length > 3 && (
            <div style={{ fontSize: '9px', opacity: 0.7, marginTop: '2px' }}>
              +{recommendations.length - 3} more...
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{ 
        marginTop: '8px',
        fontSize: '9px',
        opacity: 0.6,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '4px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span><span style={{ color: '#4ade80' }}>●</span> Good</span>
          <span><span style={{ color: '#fbbf24' }}>●</span> Needs Improvement</span>
          <span><span style={{ color: '#ef4444' }}>●</span> Poor</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;

// Hook for programmatic access to performance data
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState(getWebVitalsData());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getWebVitalsData());
    }, 1000);

    // Keyboard shortcut to toggle monitor (Ctrl/Cmd + Shift + P)
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return {
    metrics,
    isVisible,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false),
    toggle: () => setIsVisible(prev => !prev)
  };
};

// Performance Alert Component
export const PerformanceAlert: React.FC<{ threshold?: number }> = ({ threshold = 50 }) => {
  const { performanceScore } = usePerformance();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || performanceScore >= threshold || !import.meta.env.DEV) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span>⚠️ Performance Score: {performanceScore}/100</span>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '0 4px'
        }}
      >
        ×
      </button>
    </div>
  );
};