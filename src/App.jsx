import "./App.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home";
import CreateNFT from "./pages/CreateNFT";
import NFTDetails from "./pages/NFTDetails";
import ListedItems from "./pages/ListedItems";
import PurchasedItems from "./pages/PurchasedItems";
import PageNotFound from "./pages/PageNotFound";
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
            <Route path="/purchased" element={<PurchasedItems />} />
            <Route path="/listed" element={<ListedItems />} />
            <Route path="/create" element={<CreateNFT />} />
            <Route path="/nft/:itemId" element={<NFTDetails />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
    </>
  );
}

export default App;
