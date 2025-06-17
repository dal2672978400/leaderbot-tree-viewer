import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
// 全局设置：树刷新时间间隔（毫秒）
const TREE_REFRESH_INTERVAL = 2000; // ✅ 可随时调整为 1000 / 5000 等

// ✅ 将你的 JSON 结构转换成 react-d3-tree 的格式
const convertTree = (node) => ({
  name: node.text,
  attributes: {
    author: node.author,
    time: node.time,
  },
  children: (node.children || []).map(convertTree),
});

function App() {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await fetch("/mock_tree.json");
        const json = await res.json();
        setTreeData([convertTree(json)]);
      } catch (error) {
        console.error("❌ 获取树数据失败", error);
      }
    };

    fetchTree();
    const interval = setInterval(fetchTree, TREE_REFRESH_INTERVAL); // 每3秒刷新一次
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🧠 群体讨论树</h2>
      {treeData.length > 0 ? (
        <Tree
          data={treeData}
          translate={{ x: 400, y: 100 }}
          orientation="vertical"
          nodeSize={{ x: 300, y: 150 }}  // ✅ 设置每个节点的逻辑空间大小
          separation={{ siblings: 1.0, nonSiblings: 1.0 }} // ✅ 加大兄弟节点间距
          renderCustomNodeElement={(rd3tProps) => <CustomLabel {...rd3tProps} />}
        />
      ) : (
        <p style={{ textAlign: "center" }}>正在加载讨论树...</p>
      )}
    </div>
  );
}

// ✅ 自定义标签内容，自动换行并限宽
const CustomLabel = ({ nodeDatum }) => {
  return (
    <foreignObject width={300} height={200} x={-150} y={-100}>
      <div style={{
          maxWidth: "180px",
          padding: "10px",
          fontSize: "15px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "#fff",
          whiteSpace: "normal",
          wordWrap: "break-word",
          boxShadow: "2px 2px 5px rgba(0,0,0,0.1)"
        }}
      >
        <strong>{nodeDatum.name}</strong>
        <div>👤 {nodeDatum.attributes?.author}</div>
        <div style={{ color: "gray", fontSize: "10px" }}>
          🕒 {nodeDatum.attributes?.time?.split("T")[0]}
        </div>
      </div>
    </foreignObject>
  );
};

export default App;