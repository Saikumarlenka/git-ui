import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Button, 
  Input, 
  message,
  Modal
} from 'antd';

// LLM Providers
const LLM_PROVIDERS = [
  { id: 'anthropic', name: 'Anthropic', logo: 'https://www.anthropic.com/favicon.png' },
  { id: 'openai', name: 'OpenAI', logo: 'https://openai.com/favicon.ico' },
  { id: 'google', name: 'Google', logo: 'https://www.google.com/favicon.ico' }
];

// Models for each provider (simplified)
const PROVIDER_MODELS = {
  'anthropic': [
    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku' }
  ],
  'openai': [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
  ],
  'google': [
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'gemini-ultra', name: 'Gemini Ultra' }
  ]
};

const { Title, Text } = Typography;

const LLMConfigComponent = () => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    // Reset model when provider changes
    setSelectedModel(null);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleSubmit = () => {
    // Validate inputs
    if (!selectedProvider || !selectedModel || !apiKey) {
      message.error('Please complete all selections and enter an API key');
      return;
    }

    // Simulated API call
    const submitData = {
      provider: selectedProvider,
      model: selectedModel,
      apiKey: apiKey
    };

    console.log('Submitting configuration:', submitData);
    
    // Show success modal
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  return (
    <Card 
      style={{ 
        width: 400, 
        margin: '0 auto', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
      }}
      title={
        <Title level={4} style={{ textAlign: 'center', marginBottom: 0 }}>
          Configure LLM
        </Title>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Provider Selection */}
        <div>
          <Text strong>Select Your LLM Provider</Text>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 16, 
            marginTop: 8 
          }}>
            {LLM_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                style={{
                  border: '1px solid ' + (selectedProvider === provider.id ? '#1890ff' : '#d9d9d9'),
                  borderRadius: 8,
                  padding: 12,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: selectedProvider === provider.id ? '#e6f7ff' : 'white'
                }}
                onClick={() => handleProviderSelect(provider.id)}
              >
                <img 
                  src={provider.logo} 
                  alt={provider.name} 
                  style={{ 
                    maxHeight: 40, 
                    maxWidth: '100%', 
                    marginBottom: 8 
                  }}
                />
                <Text>{provider.name}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* Model Selection */}
        {selectedProvider && (
          <div>
            <Text strong>Select Your Model</Text>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 16, 
              marginTop: 8 
            }}>
              {PROVIDER_MODELS[selectedProvider].map((model) => (
                <div
                  key={model.id}
                  style={{
                    border: '1px solid ' + (selectedModel === model.id ? '#1890ff' : '#d9d9d9'),
                    borderRadius: 8,
                    padding: 12,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: selectedModel === model.id ? '#e6f7ff' : 'white'
                  }}
                  onClick={() => handleModelSelect(model.id)}
                >
                  <Text>{model.name}</Text>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Key Input */}
        {selectedModel && (
          <div>
            <Text strong>Enter API Key</Text>
            <Input.Password
              placeholder="Enter your API key"
              style={{ marginTop: 8 }}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        )}

        {/* Submit Button */}
        {selectedModel && apiKey && (
          <Button 
            type="primary" 
            block 
            onClick={handleSubmit}
          >
            Submit Configuration
          </Button>
        )}

        {/* Submission Modal */}
        <Modal
          title="Configuration Submitted"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalOk}
        >
          <p>Your LLM configuration has been successfully submitted.</p>
        </Modal>
      </Space>
    </Card>
  );
};

export default LLMConfigComponent;