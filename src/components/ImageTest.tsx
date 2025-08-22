import React, { useState } from 'react';
import { OptimizedImage } from './OptimizedImage';

const ImageTest: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Image Optimization Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Test 1: Basic OptimizedImage */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test 1: Basic OptimizedImage</h2>
          <div className="border rounded-lg p-4">
            <OptimizedImage 
              src="/logo_digcity.png"
              alt="DIGCITY Logo Test"
              width={200}
              height={200}
              className="w-full h-auto rounded-lg"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
            />
            <div className="mt-2 text-sm text-gray-600">
              <p>Status: {isLoaded ? '✅ Loaded' : hasError ? '❌ Error' : '⏳ Loading'}</p>
              <p>Image path: /logo_digcity.png</p>
            </div>
          </div>
        </div>

        {/* Test 2: With Loading States */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test 2: Loading States</h2>
          <div className="border rounded-lg p-4">
            <OptimizedImage 
              src="/logo_digcity.png"
              alt="DIGCITY Logo with Loading"
              width={200}
              height={200}
              className="w-full h-auto rounded-lg"
              showLoadingSkeleton={true}
              loading="lazy"
            />
            <div className="mt-2 text-sm text-gray-600">
              <p>With loading skeleton and lazy loading</p>
            </div>
          </div>
        </div>

        {/* Test 3: Error Handling */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test 3: Error Handling</h2>
          <div className="border rounded-lg p-4">
            <OptimizedImage 
              src="/non-existent-image.png"
              alt="Non-existent image test"
              width={200}
              height={200}
              className="w-full h-auto rounded-lg"
              fallbackSrc="/logo_digcity.png"
            />
            <div className="mt-2 text-sm text-gray-600">
              <p>Tests fallback to logo if image fails</p>
            </div>
          </div>
        </div>

        {/* Test 4: Performance Monitoring */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test 4: Performance</h2>
          <div className="border rounded-lg p-4">
            <OptimizedImage 
              src="/logo_digcity.png"
              alt="Performance test"
              width={200}
              height={200}
              className="w-full h-auto rounded-lg"
              priority={true}
              onLoad={(e) => {
                const img = e.currentTarget;
                const loadTime = performance.now();
                console.log(`Image loaded in ${loadTime}ms`);
              }}
            />
            <div className="mt-2 text-sm text-gray-600">
              <p>Priority loading with performance monitoring</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Image loading: {isLoaded ? '✅ Success' : hasError ? '❌ Failed' : '⏳ Pending'}</li>
          <li>Error handling: {hasError ? '✅ Working' : '⏳ Not tested'}</li>
          <li>Performance: Check console for load times</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageTest;
