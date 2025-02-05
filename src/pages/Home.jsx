import Navbar from "../components/Navbar";
import Card from "../components/Card";

const Home = () => {
  return (
    <div className="w-full h-screen flex items-center justify-between flex-col pb-16">
      <Navbar />
      <div className="w-full p-8 h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-y-2.5 gap-x-2.5">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Home;
