import { Navigate, Route, Routes } from "react-router-dom";
import NodePage from "./pages/NodePage";
import TreePage from "./pages/TreePage";
import UploadPage from "./pages/UploadPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/tree" element={<TreePage />} />
      <Route path="/tree/:nodePath" element={<NodePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
