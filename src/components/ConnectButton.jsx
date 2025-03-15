import { useState, useContext } from "react";
import AppContext from "../context/Context";

const ConnectButton = () => {
  const { address, connectors, connect, disconnect } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {address ? (
        <button
          onClick={() => disconnect()}
          className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
        >
          {address.slice(0, 5) + "..." + address.slice(-4)}
        </button>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
        >
          Connect
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 flex items-center justify-center bg-[#13131310] bg-opacity-50 z-50"
        >
          <div className="bg-[#131313] border-[0.5px] border-[#ffffff40] text-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Select Wallet</h2>
            <div className="flex flex-col space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    setShowModal(false);
                  }}
                  className="border-[0.1px] flex items-center border-[#ffffff20] cursor-pointer hover:bg-[#ffffff20] font-bold py-2 px-4 rounded w-full"
                >
                  <img src={connector.icon} className="w-6 h-6 mr-4 " />
                  {connector.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-red-500 hover:underline cursor-pointer w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectButton;
