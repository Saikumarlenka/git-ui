import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Input, Button, message, Row, Col } from "antd";
import { FolderOpenOutlined } from "@ant-design/icons";
import { fetchAllRepos, indexRepo, selectAllRepos, selectLoading, selectRepoError } from "./repoSlice"; 
import { PlusOutlined } from '@ant-design/icons';
const RepoModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [repoPath, setRepoPath] = useState("");
  const [projectName, setProjectName] = useState("");

  const dispatch = useDispatch();
  // const { repos, loading, } = useSelector((state) => state.repos);
  const repos = useSelector(selectAllRepos)

  
  const errormessage = useSelector(selectRepoError)

  if(errormessage){
    message.error(errormessage)
    setIsModalVisible(false);
  }



  
  const handlePathChange = (e) => {
    setRepoPath(e.target.value);
  };

  
  const handleSubmit = (values) => {
    

  
      indexRepoAction(values);
    
  };

  const indexRepoAction = (values) => {
    const existingRepo = repos.find(repo => repo.project_name === values.projectName);
    
    if (repoPath && values.projectName  ) {
      const payload = {
        repo_path: repoPath,
        project_name: values.projectName,
      };

      // Dispatch the Redux action
      dispatch(indexRepo(payload))
        .unwrap()
        .then(() => {
          // message.success("Repository indexed successfully!");
          dispatch(fetchAllRepos()); 
          setIsModalVisible(false);
          setRepoPath("");
          setProjectName("");
        })
        .catch((err) => {
          message.error(err.message || "Failed to index repository.");
          setIsModalVisible(false);
        });
    } else {
      message.error("Please select a folder or enter the path before submitting.");
    }
  };

  return (
    <div>
      
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
      <PlusOutlined /> New Index
      </Button>

      <Modal
        title="Enter Project Details"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setRepoPath("");
          setProjectName("");
        }}
        footer={null}
        width={600}
      >
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="projectName"
            label="Project Name"
            rules={[{ required: true, message: "Please input the project name!" }]}
          >
            <Input
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Project Path" required>
            <Row gutter={8} align="middle">
              <Col flex="auto">
                <Input
                  placeholder="Project absolute path"
                  value={repoPath}
                  onChange={handlePathChange}
                />
              </Col>
              
            </Row>
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => {
                setIsModalVisible(false);
                setRepoPath("");
                setProjectName("");
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" >
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RepoModal;
