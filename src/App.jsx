import "./App.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/collection";
import CreateNFT from "./pages/CreateNFT";
import NFTDetails from "./pages/NFTDetails";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        newestOnTop
        hideProgressBar
        draggable
        theme="dark"
      />

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Mycollections" element={<Collection />} />
          <Route path="/create" element={<CreateNFT />} />
          <Route path="/nft/:id" element={<NFTDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
