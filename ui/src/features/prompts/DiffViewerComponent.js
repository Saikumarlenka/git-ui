import React from 'react';

// Sample data (as provided in the original code)


// Custom Diff Component to highlight differences with scrollbars
const CustomDiffViewer = ({ oldValue, newValue }) => {
  // Simple diff algorithm to compare lines
  const oldLines = oldValue.split('\n');
  const newLines = newValue.split('\n');
  
  // Create a comparison result
  const diffLines = Math.max(oldLines.length, newLines.length);
  const processedLines = Array.from({ length: diffLines }, (_, index) => ({
    oldLine: oldLines[index] || '',
    newLine: newLines[index] || '',
    isDifferent: oldLines[index] !== newLines[index]
  }));

  return (
    <div className="grid grid-cols-2 gap-4 font-mono text-sm">
      <div className="bg-red-50 p-2 max-h-64 overflow-y-auto">
        <h5 className="font-bold mb-2 text-red-600 sticky top-0 bg-red-50 z-10">Old Code</h5>
        {processedLines.map((diff, index) => (
          <div 
            key={index} 
            className={`${diff.isDifferent ? 'bg-red-100' : ''} px-2 whitespace-pre-wrap`}
          >
            {diff.oldLine}
          </div>
        ))}
      </div>
      <div className="bg-green-50 p-2 max-h-64 overflow-y-auto">
        <h5 className="font-bold mb-2 text-green-600 sticky top-0 bg-green-50 z-10">New Code</h5>
        {processedLines.map((diff, index) => (
          <div 
            key={index} 
            className={`${diff.isDifferent ? 'bg-green-100' : ''} px-2 whitespace-pre-wrap`}
          >
            {diff.newLine}
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomDiffViewerComponent = ({dummydata}) => {
  return (
    <div className="text-start p-4">
      <div className="space-y-6">
        {dummydata && dummydata.changes.map((change, index) => {
          if (change.action_type === "modify") {
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md ">
                <h4 className="text-lg text-center font-semibold text-blue-500 px-48">
                  {`Modified: ${change.file_path}`}
                </h4>
                {
                  dummydata
                }
                <CustomDiffViewer className='text-start'
                  oldValue={change.old_code} 
                  newValue={change.new_code} 
                />
              </div>
            );
          }
          
          if (change.action_type === "rename_file") {
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-yellow-500">
                  {`Renamed: ${change.file_path}`}
                </h4>
                <p className="text-md text-gray-700">
                  {`New name: ${change.new_file_path}`}
                </p>
              </div>
            );
          }
          
          if (change.action_type === "add") {
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-green-500">
                  {`Added: ${change.file_path}`}
                </h4>
                <pre className="bg-gray-100 p-4 rounded-md text-sm font-mono text-gray-700 max-h-64 overflow-y-auto">
                  {change.new_code}
                </pre>
              </div>
            );
          }
          
          return null;
        })}
      </div>
    </div>
  );
};

export default CustomDiffViewerComponent;