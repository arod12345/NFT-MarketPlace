import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import { useContext, useState, useEffect } from "react";
import AppContext from "../context/Context";
import pinata from "../utils/pinata";

const Home = () => {
  const { marketplace, nft, loading, setLoading } = useContext(AppContext);
  const [items, setItems] = useState([]);

  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount();
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        console.log("metadata", metadata);
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }
    }

    console.log("items", items);
    setItems(items);

    setLoading(false);
  };

  const buyMarketItem = async (item) => {
    await (
      await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
    ).wait();
    loadMarketplaceItems();
  };

  useEffect(() => {
    // if (marketplace?.itemCount) {
    // Ensure marketplace is initialized
    loadMarketplaceItems();
    // }
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-between flex-col">
      <Navbar />
      <div className="w-full p-8 h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-y-2.5 gap-x-2.5">
        {items.map((item, idx) => {
          // loading ? (
          //   <Spinner />
          // ) : (
          return <Card key={idx} item={item} buyMarketItem={buyMarketItem} />;
          // );
        })}
      </div>
      <div className="w-full h-full flex items-center justify-center">
        {items.length === 0 && (
          <h1 className="text-3xl font-extrabold">NO ITEMS ARE AVALIABLE!</h1>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
