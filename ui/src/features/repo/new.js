import React, { useState } from 'react';

function ModernFolderSelector() {
  const [selectedFolderPath, setSelectedFolderPath] = useState('');

  const handleFolderSelection = async () => {
    try {
      // Request directory access
      const directoryHandle = await window.showDirectoryPicker();
      
      // Get the name of the selected directory
      setSelectedFolderPath(directoryHandle.name);
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  return (
    <div>
      <button onClick={handleFolderSelection}>
        Select Folder
      </button>
      {selectedFolderPath && (
        <p>Selected Folder: {selectedFolderPath}</p>
      )}
    </div>
  );
}

export default ModernFolderSelector;