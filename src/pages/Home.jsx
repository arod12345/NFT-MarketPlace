import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import Error from "../components/Error";
import { useContext, useState, useEffect } from "react";
import AppContext from "../context/Context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { marketplace, nft, account } = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.read.itemCount();
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.read.items([i]);
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.read.tokenURI([item.tokenId]);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.read.getTotalPrice([item.itemId]);
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          isOwner: item.seller.toLowerCase() === account.toLowerCase(),
        });
      }
    }
    setItems(items);
    setLoading(false);
  };

  const buyMarketItem = async (item) => {
    const buyToast = toast.loading(`Purcahsing ${item.name} NFT  ..`);

    try {
      const tx = await marketplace.write.purchaseItem([item.itemId], {
        value: item.totalPrice,
      });
      await tx.wait();
      toast.update(buyToast, {
        render: `Purchased  ${item.name} NFT Successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      loadMarketplaceItems();
      navigate("/purchased");
    } catch (error) {
      console.error("Error buying item:", error);
      toast.update(buyToast, {
        render: ` Erorr Purchasing ${item.name} NFT`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    if (marketplace) {
      loadMarketplaceItems();
    }
  }, [marketplace, account]);

  if (!account) {
    return (
      <Error message="Please connect your wallet to view marketplace items" />
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-grow p-4 sm:p-8">
        {/* Grid Container */}
        <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-[50vh]">
              <Spinner />
            </div>
          ) : items.length > 0 ? (
            items.map((item, idx) => (
              <Card
                key={idx}
                item={item}
                buyMarketItem={buyMarketItem}
                isOwner={item.isOwner}
                home={true}
              />
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-[50vh]">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center">
                NO ITEMS AVAILABLE!
              </h1>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
