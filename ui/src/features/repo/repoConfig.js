export const columns = [
    {
      title: "Project Name",
      dataIndex: "project_name",
      key: "project_name",
      render: (text) => <span className="text-blue-500 font-semibold">{text}</span>,
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
          <button className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600">Indexed</button>
          
        </div>
      ),
    },
  ];