import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import Error from "../components/Error"
import { useContext, useState, useEffect } from "react";
import AppContext from "../context/Context";

const ListedItems = () => {
  const { marketplace, nft, account } = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadListedItems = async () => {
    if (!marketplace || !account) return;

    const itemCount = await marketplace.read.itemCount();
    let listedItems = [];

    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.read.items([i]);
      if (!item.sold && item.seller.toLowerCase() === account.toLowerCase()) {
        try {
          const uri = await nft.tokenURI(item.tokenId);
          const response = await fetch(uri);
          const metadata = await response.json();

          // get total price of item (item price + fee)
          const totalPrice = await marketplace.read.getTotalPrice([item.itemId]);

          listedItems.push({
            itemId: item.itemId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            seller: item.seller,
            totalPrice,
          });
        } catch (error) {
          console.error("Error loading item:", error);
        }
      }
    }

    setItems(listedItems);
    setLoading(false);
  };

  useEffect(() => {
    loadListedItems();
  }, [marketplace, account]);

  if (!account) {
    return <Error message="Please connect your wallet to view marketplace items" />  
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-grow p-4 sm:p-8">
        {/* Grid Container */}
        <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-[50vh]">
              <Spinner />
            </div>
          ) : items.length > 0 ? (
            items.map((item, idx) => (
                <Card key={idx} item={item} isListed={true} />
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

export default ListedItems;
