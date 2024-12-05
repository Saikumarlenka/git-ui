import React, { useEffect } from "react";
import { Table, Typography, Spin,Button,Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRepos, selectAllRepos, selectRepoStatus, selectRepoError, deleteRepo } from "./repoSlice";
import { useNavigate } from "react-router-dom";
import RepoModal from "./RepoModal";




const { Title } = Typography;

const Repolist = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const repos = useSelector(selectAllRepos);
  const status = useSelector(selectRepoStatus);
  const error = useSelector(selectRepoError);

  //temporary
   const columns = [
    {
      title: "Project Name",
      dataIndex: "project_name",
      key: "project_name",
      render: (text,record) => <span className="text-blue-500 font-semibold cursor-pointer" onClick={()=>handleIndex(record.project_name)}>{text}</span>,
    },
    {
      title: "Path",
      dataIndex: "path",
      key: "path",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Indexed At",
      dataIndex: "indexed_at",
      key: "indexed_at",
      render: (text) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Popconfirm
          placement="top"
          title="Are you sure to Delete this Repository"
          description="Delete this Repository"
          onConfirm={()=>handleDelete(record.project_name)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
          
        </div>
      ),
    },
  ];
  const handleIndex =(project_name)=>{
    navigate(`/repo/${project_name}`)
    


  }
  const handleDelete=(reponame)=>{
    dispatch(deleteRepo(reponame))
    
  }

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllRepos());
    }
  }, [dispatch, status]);



  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Title level={3} className="text-red-600">
          {error || "Failed to fetch repositories"}
        </Title>
       
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-md p-6">
        <div className="flex justify-between">
        <Title level={2} className="text-center mb-4">
          Repository List
        </Title>
        <RepoModal />
        </div>
        <Table
          columns={columns}
          dataSource={repos}
          
          pagination={{ pageSize: 10 }}
          className="ant-table-tw"
        />
      </div>
    </div>
  );
};

export default Repolist;
