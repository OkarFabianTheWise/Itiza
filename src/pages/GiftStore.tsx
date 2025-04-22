import React, { useState, useEffect, ChangeEvent } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { CustomWalletMultiButton } from "../components/walletConnect";
import { invokeGiftToken } from "@/utils/helpers";

function GiftStore(): JSX.Element {
  const [giftAddress, setGiftAddress] = useState<string>("");
  const [giftAmount, setGiftAmount] = useState<number>(0);
  const { connection } = useConnection();
  const wallet = useWallet();
  // Add at the top of the file after imports
  type GiftType = "Crypto" | "NFT";
  type TokenSymbol = "SOL" | "USDC" | "USDT";

  // Update your state declarations
  const [giftType, setGiftType] = useState<GiftType>("Crypto");
  const [selectedToken, setSelectedToken] = useState<TokenSymbol>("SOL");
  const [message, setMessage] = useState<string>(""); // State for success or failure message
  const [userBalance, setUserBalance] = useState<number>(0); // Wallet balance
  const feeRate = 0.05; // 5% fee

  // Fetch wallet balance when the wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet.publicKey) {
        try {
          console.log(
            "Fetching balance for wallet:",
            wallet.publicKey.toBase58()
          );
          const balance = await connection.getBalance(wallet.publicKey);
          console.log("Wallet balance in lamports:", balance);
          setUserBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
        }
      }
    };

    fetchBalance();
  }, [wallet.publicKey, connection]);

  const handleGift = async (): Promise<void> => {
    if (giftType === "Crypto") {
      await handleCryptoGift();
    } else if (giftType === "NFT") {
      await handleNFTGift();
    }
  };

  const handleCryptoGift = async (): Promise<void> => {
    if (isNaN(giftAmount) || giftAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    // if (giftAmount > userBalance) {
    //   alert("Insufficient balance");
    //   return;
    // }

    try {
      // Simulate token transfer logic
      const transferSuccessful = await invokeGiftToken(
        connection,
        wallet,
        giftAmount,
        giftAddress,
        selectedToken
      );

      if (transferSuccessful) {
        setUserBalance((prevBalance) => prevBalance - giftAmount); // Deduct total from user balance
        setMessage("Transfer completed. Crypto sent successfully!");
        setGiftAmount(0); // Clear the gift amount after successful transfer
      } else {
        setMessage("Failed to send crypto.");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setMessage("Failed to send crypto.");
    }
  };

  const handleNFTGift = async (): Promise<void> => {
    if (!giftAddress) {
      alert("Enter a valid recipient address");
      return;
    }

    console.log(`Minting visual-themed NFT for ${giftAddress}`);

    try {
      // Simulate NFT minting process with visual theme
      const nftMetadata = await mintVisualNFTForRecipient(giftAddress);
      setMessage(
        `Transfer completed. NFT sent successfully! View NFT: ${nftMetadata.image}`
      );
    } catch (error) {
      console.error("NFT minting error:", error);
      setMessage("Failed to send NFT.");
    }
  };

  const mintVisualNFTForRecipient = async (
    address: string
  ): Promise<{ image: string }> => {
    // Simulate NFT minting process with visual metadata
    console.log(`Minting visual-themed NFT for ${address}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const nftMetadata = {
          name: "Giftcoin NFT",
          description:
            "A special visual-themed NFT gifted via Giftcoin Wallet.",
          image: "https://via.placeholder.com/300.png?text=Giftcoin+NFT", // Replace with actual image URL
        };
        console.log(`NFT minted successfully for ${address}`);
        console.log(`NFT Metadata:`, nftMetadata);
        resolve(nftMetadata);
      }, 2000);
    });
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      setter(e.target.value);
    };

  const handleGiftAmountChange =
    (setter: React.Dispatch<React.SetStateAction<number>>) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      setter(e.target.valueAsNumber);
    };

  const handleTokenChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedToken(e.target.value as TokenSymbol);
  };

  const handleGiftTypeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setGiftType(e.target.value as GiftType);
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Giftcoin Wallet</h1>
        <CustomWalletMultiButton />

        {/* User Balance */}
        <div className="mb-4 text-gray-700">
          <strong>Balance:</strong> {userBalance.toFixed(4)} {selectedToken}
        </div>

        {/* Gift Tokens */}
        <div className="bg-gray-100 p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Gift Tokens</h2>

          {/* Gift Type Selection */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="gift-type-select"
            >
              Select Gift Type
            </label>
            <select
              id="gift-type-select"
              className="input w-full"
              value={giftType}
              onChange={handleGiftTypeChange}
            >
              <option value="Crypto">Crypto</option>
              <option value="NFT">NFT</option>
            </select>
          </div>

          {/* Token Selection (only for Crypto) */}
          {giftType === "Crypto" && (
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="token-select"
              >
                Select Token
              </label>
              <select
                id="token-select"
                className="input w-full"
                value={selectedToken}
                onChange={handleTokenChange}
              >
                <option value="SOL">Solana (SOL)</option>
                <option value="USDC">USDC</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          )}

          {/* Recipient Address Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="recipient-address"
            >
              Recipient Wallet Address
            </label>
            <input
              id="recipient-address"
              type="text"
              placeholder="Enter recipient address"
              className="input w-full"
              onChange={handleInputChange(setGiftAddress)}
            />
          </div>

          {/* Amount Input (only for Crypto) */}
          {giftType === "Crypto" && (
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="gift-amount"
              >
                Amount
              </label>
              <input
                id="gift-amount"
                type="number"
                placeholder="Enter amount"
                className="input w-full"
                value={giftAmount}
                onChange={handleGiftAmountChange(setGiftAmount)}
              />
            </div>
          )}

          {/* Fee and Recipient Amount Display (only for Crypto) */}
          {giftType === "Crypto" && giftAmount && !isNaN(giftAmount) && (
            <div className="text-sm mb-3 text-gray-700">
              Fee: {(giftAmount * feeRate).toFixed(4)} {selectedToken} |
              Recipient gets: {(giftAmount * (1 - feeRate)).toFixed(4)}{" "}
              {selectedToken}
            </div>
          )}

          {/* Send Gift Button */}
          <button
            className="btn bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
            onClick={handleGift}
          >
            Send Gift
          </button>

          {/* Success or Failure Message */}
          {message && (
            <div
              className={`mt-4 font-semibold ${
                message.includes("completed")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GiftStore;
