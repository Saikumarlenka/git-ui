import React, { useState, useRef, useEffect, useDeferredValue } from "react";
import { Button, Modal, Typography, Space, Input, message } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { configureLim, sendPromptToApi, selecttransformedcode} from "./promptSlice";


// LLM Providers
const LLM_PROVIDERS = [
  // { id: 'anthropic', name: 'Anthropic', logo: 'https://i.ibb.co/yWfJFPx/icons8-claude-120.png'},
  { id: 'openai', name: 'OpenAI', logo: 'https://openai.com/favicon.ico' },
  { id: 'google', name: 'Gemini', logo: 'https://www.google.com/favicon.ico' }
];

// Models for each provider
const PROVIDER_MODELS = {
 
  'openai': [
    { id: 'GPT-4o', name: 'GPT-4o' },
    {id:'GPT-4o mini', name: 'GPT -4o mini'},
    {id:'GPT-4 Turbo', name:'GPT-4 Turbo'},
    {id:'GPT-4', name:'GPT-4'},
    { id: ' GPT-3.5 Turbo', name: 'GPT-3.5 Turbo' },
    {id:'DALL·E',name:'DALL·E'}
  ],
  'google': [
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 flash-8b' },
    {id:'gemini-1.5-pro', name:'Gemini 1.5 Pro'},
    {id:'gemini-1.0-pro',name:'Gemini 1.0 Pro'}
  ]
};

const { Text, Title } = Typography;

const Prompt = () => {
  const dispatch = useDispatch()
  const transformedCode = useSelector(selecttransformedcode)
  const [value, setValue] = useState("");
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const textareaRef = useRef(null);

  const handleButtonClick = () => {
    const url = window.location.pathname;
    const payload = {prompt:value,
      dry_run:"True"
    }

    const projectName = url.split('/').pop();
    dispatch(sendPromptToApi({ projectName, payload }));
    console.log("Button inside textarea clicked:", value);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  // Settings Modal Handlers
  const showSettingsModal = () => {
    setIsSettingsModalVisible(true);
  };

  const handleSettingsCancel = () => {
    setIsSettingsModalVisible(false);
    // Reset selection states
    setSelectedProvider(null);
    setSelectedModel(null);
    setApiKey('');
  };

  const handleSettingsSubmit = () => {
    // Validate inputs
    if (!selectedProvider || !selectedModel || !apiKey) {
      message.error('Please complete all selections and enter an API key');
      return;
    }

    // Process the configuration
    const configData = {
      llm_provider: selectedProvider,
      api_model: selectedModel,
      api_key: apiKey
    };
    dispatch(configureLim(configData))
    
    console.log('LLM Configuration:', configData);
    message.success('LLM Configuration Updated');

    // Close modal
    handleSettingsCancel();
  };

  return (
    <div className="w-9/12 h-screen mx-auto mt-10">
      <div className="flex flex-row-reverse">
        <Button 
          icon={<SettingOutlined />} 
          onClick={showSettingsModal}
          className="m-5"
        >
          Settings
        </Button>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder="Enter your Prompt here..."
          className="w-full resize-none rounded-md border border-gray-300 p-4 pr-20 text-gray-800 focus:border-blue-500 focus:outline-none"
          style={{
            minHeight: '150px',
            overflowY: 'auto'
          }}
        />
        <button
          onClick={handleButtonClick}
          className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Apply Changes
        </button>
      </div>

      <div className="w-full h-4/6 border border-spacing-1 mt-10">
      {transformedCode && (
        <div>
          <h2>Transformed Code:</h2>
          <pre>{JSON.stringify(transformedCode, null, 2)}</pre>
        </div>
      )}
        <div className="flex flex-row-reverse">
          <Button className="bg-green-500 hover:bg-green-600 text-end m-4">
            Commit
          </Button>
        </div>
      </div>

      {/* LLM Settings Modal */}
      <Modal
        title={<Title level={4} style={{ textAlign: 'center', marginBottom: 0 }}>Configure LLM</Title>}
        open={isSettingsModalVisible}
        onOk={handleSettingsSubmit}
        onCancel={handleSettingsCancel}
        okText="Submit"
        okButtonProps={{
          disabled: !(selectedProvider && selectedModel && apiKey)
        }}
        width={500}
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
                  onClick={() => {
                    setSelectedProvider(provider.id);
                    setSelectedModel(null);
                  }}
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
                    onClick={() => setSelectedModel(model.id)}
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
        </Space>
      </Modal>
    </div>
  );
};

export default Prompt;