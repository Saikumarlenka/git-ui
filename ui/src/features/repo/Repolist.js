import React, { useEffect } from "react";
import { Table, Typography, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRepos, selectAllRepos, selectRepoStatus, selectRepoError } from "./repoSlice";
import { columns } from "./repoConfig";


const { Title } = Typography;

const Repolist = () => {
  const dispatch = useDispatch();
  const repos = useSelector(selectAllRepos);
  const status = useSelector(selectRepoStatus);
  const error = useSelector(selectRepoError);

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
        <Title level={2} className="text-center mb-4">
          Repository List
        </Title>
        <Table
          columns={columns}
          dataSource={repos}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 10 }}
          className="ant-table-tw"
        />
      </div>
    </div>
  );
};

export default Repolist;
