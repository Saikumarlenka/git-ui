import React, { useState, useRef, useEffect, useDeferredValue } from "react";
import {
  Button,
  Modal,
  Typography,
  Space,
  Input,
  message,
  Skeleton,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  configureLim,
  sendPromptToApi,
  selectTransformedCode,
  commitCode,
  selectTransformedCodestatus,
  selectCommitStatus,
  selectCommitResponse,
  selectllmstatus,
  selectPromptError,
  resetResponse,
  selectresponseerror
} from "./promptSlice";
import CustomDiffViewerComponent from "./DiffViewerComponent";
import { notify } from "../../antd-components/Notify";
import ResponseDisplay from "./ResponseDisplay";
const dummyData = {
  plan_id: "123e4567-e89b-12d3-a456-426614174000",
  project_name: "my_project",
  changes: [
    {
      action_type: "modify",
      file_path: "authentication/views.py",
      start_line: 25,
      end_line: 40,
      old_code:
        "def login(request):................................................................\n    # Old login implementation def login(request):\n    # Old login implementation def login(request):\n    # Old login implementation",
      new_code:
        "def login(request):\n    # New login implementation with enhanced security",
    },
    {
      action_type: "rename_file",
      file_path: "authentication/old_utils.py",
      new_file_path: "authentication/security_utils.py",
    },
    {
      action_type: "add",
      file_path: "authentication/middleware.py",
      new_code:
        "class EnhancedSecurityMiddleware:\n    # New security middleware implementation",
    },
  ],
  summary: {
    modify: 1,
    rename_file: 1,
    add: 1,
    total_changes: 3,
  },
};

// LLM Providers <a href="https://imgbb.com/"><img src="https://i.ibb.co/hgjvC42/images.png" alt="images" border="0"></a>
const LLM_PROVIDERS = [
  // { id: 'anthropic', name: 'Anthropic', logo: 'https://i.ibb.co/yWfJFPx/icons8-claude-120.png'},
  { id: "openai", name: "OpenAI", logo: "https://openai.com/favicon.ico" },
  { id: "gemini", name: "Gemini", logo: "https://i.ibb.co/hgjvC42/images.png" },
];

// Models for each provider
const PROVIDER_MODELS = {
  openai: [
    { id: "GPT-4o", name: "GPT-4o" },
    { id: "GPT-4o mini", name: "GPT -4o mini" },
    { id: "GPT-4 Turbo", name: "GPT-4 Turbo" },
    { id: "GPT-4", name: "GPT-4" },
    { id: "GPT-3.5 Turbo", name: "GPT-3.5 Turbo" },
    { id: "DALL·E", name: "DALL·E" },
  ],
  gemini: [
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
    { id: "gemini-1.5-flash-8b", name: "Gemini 1.5 flash-8b" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
    { id: "gemini-1.0-pro", name: "Gemini 1.0 Pro" },
  ],
};

const { Text, Title } = Typography;

const Prompt = () => {


  const [response, Setresponse] = useState(false);
  const [iscode,Setiscode]=useState(false)
  const dispatch = useDispatch();
  const transformedCode = useSelector(selectTransformedCode);
  const codestatus = useSelector(selectTransformedCodestatus);
  console.log(codestatus);
  const commitstatus = useSelector(selectCommitStatus);
  const code= useSelector(selectTransformedCode)
  console.log(code);
  const commitresponse=useSelector(selectCommitResponse)
  console.log(commitresponse)
  const llmstatus = useSelector(selectllmstatus)
  const errorresponse = useSelector(selectresponseerror)
  console.log(errorresponse);
  useEffect(() => {
    // Cleanup function to reset response when leaving the page
    return () => {
      dispatch(resetResponse());
    };
  }, [dispatch]);
  
  // console.log(code.changes);
  
  

  const [value, setValue] = useState("");
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const textareaRef = useRef(null);

  const handleCommit = () => {
    // Check if 'code' is null or undefined
    if (!code || !code.plan_id) {
      message.warning("Please make changes in the code and ensure there is a plan ID to commit.");
      return;
    }
  
    try {
      dispatch(commitCode(code.plan_id));
      Setiscode(false)
      Setresponse(true)
      // message.success("Commit successfully triggered.");
    } catch (error) {
      console.error("Error during commit:", error); // For debugging/logging purposes
      message.error("An error occurred while committing the code. Please try again.");
    }
  };
  if (code && Array.isArray(code.changes) && code.changes.length === 0) {
    message.warning("No changes are applied");
  }
  
  
  const handlePrompt = () => {
    const url = window.location.pathname;

    const payload = {
      prompt: value,
      project_name: url.split("/").pop(),
    };

    dispatch(sendPromptToApi(payload));
    Setiscode(true)
    Setresponse(false)

    console.log("Button inside textarea clicked:", value);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
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
    setApiKey("");
  };

  const handleSettingsSubmit = () => {
    // Validate inputs
    if (!selectedProvider || !selectedModel || !apiKey) {
      message.error("Please complete all selections and enter an API key");
      return;
    }

    // Process the configuration
    const configData = {
      llm_provider: selectedProvider,
      api_model: selectedModel,
      api_key: apiKey,
    };
    dispatch(configureLim(configData));

    console.log("LLM Configuration:", configData);
    message.success("LLM Configuration Updated");

    // Close modal
    handleSettingsCancel();
  };

  return (
    <div className="w-10/12 h-screen mx-auto mt-10">
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
            minHeight: "150px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        />
        <Button
          loading={codestatus === "loading"}
          onClick={handlePrompt}
          className={`absolute bottom-4 right-4 px-2 py-2   rounded-lg shadow-md transition-all duration-300 ${
            !value.trim() ? "bg-gray-400 text-gray-200 cursor-not-allowed" : ""
          }`}
          disabled={!value.trim()}
        >
          Apply Changes
        </Button>
      </div>
      {errorresponse && (
  <div className="error-message">
    {errorresponse}
  </div>
)}

      {code &&

      <div className="w-full  border border-spacing-1 mt-10">
        <div className="flex flex-col w-full">
          <div className="flex flex-row-reverse">
            <Button
              className="bg-green-500 hover:bg-green-600 text-end m-4"
              onClick={handleCommit}
              loading={commitstatus === "loading"}
            >
              Commit
            </Button>
          </div>
          {codestatus === "loading" ? (
            <Skeleton
              active
              paragraph={{
                rows: 4,
              }}
            />
          ) : (
            <CustomDiffViewerComponent dummydata={code} className=" w-full" />
          )}
          {response && (
            <ResponseDisplay response={commitresponse} />
          )}
          
        </div>
      </div>}

      {/* LLM Settings Modal */}
      <Modal
        title={
          <Title level={4} style={{ textAlign: "center", marginBottom: 0 }}>
            Configure LLM
          </Title>
        }
        open={isSettingsModalVisible}
        onOk={handleSettingsSubmit}
        onCancel={handleSettingsCancel}
        okText="Submit"
        okButtonProps={{
          disabled: !(selectedProvider && selectedModel && apiKey),
          loading: llmstatus==='loading'
        }}
        width={500}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Provider Selection */}
          <div>
            <Text strong>Select Your LLM Provider</Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                marginTop: 8,
              }}
            >
              {LLM_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  style={{
                    border:
                      "1px solid " +
                      (selectedProvider === provider.id
                        ? "#1890ff"
                        : "#d9d9d9"),
                    borderRadius: 8,
                    padding: 12,
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor:
                      selectedProvider === provider.id ? "#e6f7ff" : "white",
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
                      maxWidth: "100%",
                      marginBottom: 8,
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 16,
                  marginTop: 8,
                }}
              >
                {PROVIDER_MODELS[selectedProvider].map((model) => (
                  <div
                    key={model.id}
                    style={{
                      border:
                        "1px solid " +
                        (selectedModel === model.id ? "#1890ff" : "#d9d9d9"),
                      borderRadius: 8,
                      padding: 12,
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor:
                        selectedModel === model.id ? "#e6f7ff" : "white",
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
