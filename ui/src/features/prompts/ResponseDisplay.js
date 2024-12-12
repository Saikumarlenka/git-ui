import React from 'react';
import { 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  FileExclamationOutlined,
  InfoCircleOutlined,
  WarningOutlined 
} from '@ant-design/icons';
import { Card, Alert, Typography } from 'antd';

const { Text, Title } = Typography;

const ResponseDisplay = ({ response }) => {
  // Early return for no response
  if (!response) {
    return (
      <div className="bg-gray-100 flex items-center justify-center p-4 min-h-[300px]">
        <Card 
          className="w-full max-w-md"
          title={
            <div className="flex items-center space-x-2">
              <InfoCircleOutlined className="text-blue-500" />
              <Title level={4} className="mb-0">No Response Available</Title>
            </div>
          }
        >
          <Alert 
            message="No Response Data" 
            description="No operational response has been received or processed."
            type="info"
            showIcon
            className="mb-4"
          />
        </Card>
      </div>
    );
  }

  // Early return if summary is missing
  if (!response.summary) {
    return (
      <div className="bg-gray-100 flex items-center justify-center p-4 min-h-[300px]">
        <Card 
          className="w-full max-w-md"
          title={
            <div className="flex items-center space-x-2">
              <ExclamationCircleOutlined className="text-red-500" />
              <Title level={4} className="mb-0">Invalid Response Format</Title>
            </div>
          }
        >
          <Alert 
            message="Invalid Response" 
            description="The response is missing critical summary information."
            type="error"
            showIcon
            className="mb-4"
          />
        </Card>
      </div>
    );
  }

  // Determine if there are errors or changes
  const hasErrors = response.errors && response.errors.length > 0;
  const hasChanges = response.applied_changes && response.applied_changes.length > 0;

  // Determine the overall status
  const getStatusDetails = () => {
    if (hasErrors) {
      return {
        type: 'error',
        icon: <ExclamationCircleOutlined />,
        title: 'Operation Completed with Errors',
        description: 'Some operations failed during execution.'
      };
    }
    if (hasChanges) {
      return {
        type: 'success',
        icon: <CheckCircleOutlined />,
        title: 'Operation Successful',
        description: 'All changes were applied successfully.'
      };
    }
    return {
      type: 'info',
      icon: <InfoCircleOutlined />,
      title: 'No Changes Detected',
      description: 'No operations were performed.'
    };
  };

  const { type, icon, title, description } = getStatusDetails();

  return (
    <div className="bg-gray-100 flex  justify-center p-4 min-h-[300px]">
      <Card 
        className="w-full max-w-md"
        title={
          <div className="flex items-center space-x-2">
            {icon}
            <Title level={4} className="mb-0">{title}</Title>
          </div>
        }
      >
        {/* Summary Alert */}
        <Alert 
          message="Operation Summary" 
          description={
            <div className="space-y-1">
              <Text>Total Changes: {response.summary.total_changes}</Text>
              <br />
              <Text>Applied Changes: {response.summary.applied_changes}</Text>
              <br />
              <Text>Failed Changes: {response.summary.failed_changes}</Text>
            </div>
          }
          type={type}
          showIcon
          icon={<WarningOutlined />}
          className="mb-4"
        />

        {/* Applied Changes Section */}
        {hasChanges && (
          <Alert 
            message="Applied Changes" 
            description={
              <ul className="list-disc pl-4">
                {response.applied_changes && response.applied_changes.length > 0 ? (
                  response.applied_changes.map((change, index) => (
                    <li key={index}>
                      <strong>File Path:</strong> {change.file_path} <br />
                      <strong>Action:</strong> {change.action_type} <br />
                      <strong>Start Line:</strong> {change.start_line} <br />
                      {/* <pre className="bg-gray-100 p-2 overflow-auto">
                        {change.new_code}
                      </pre> */}
                    </li>
                  ))
                ) : (
                  <li>No applied changes found.</li>
                )}
              </ul>
            }
            
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            className="mb-4"
          />
        )}

        {/* Errors Section */}
        {hasErrors && (
          <Alert 
            message="Errors Occurred" 
            description={
              <div className="space-y-2">
                {response.errors.map((error, index) => (
                  <div key={index} className="bg-red-50 p-2 rounded">
                    <Text strong>Action Type:</Text> {error.action_type}
                    <br />
                    <Text strong>File Path:</Text> {error.file_path}
                    <br />
                    <Text strong>Error Message:</Text> {error.error}
                  </div>
                ))}
              </div>
            }
            type="error"
            showIcon
            icon={<FileExclamationOutlined />}
          />
        )}
      </Card>
    </div>
  );
};

export default ResponseDisplay;