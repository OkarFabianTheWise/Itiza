// MerchantDashboard.tsx
import React, { useState, useMemo } from "react";
import { Layout } from "../components/Layout";
import MerchantSignup from "../components/merchant/MerchantSignup";
import ProductUpload from "../components/merchant/ProductUpload";
import ProductManagement from "../components/merchant/ProductManagement";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useWallet } from "@solana/wallet-adapter-react";

const MerchantDashboard: React.FC = () => {
  const wallet = useWallet();
  const [isRegistered, setIsRegistered] = useState(false);

  // Memoize the wallet address
  const walletAddress = useMemo(
    () => wallet.publicKey?.toBase58(),
    [wallet.publicKey]
  );

  // Always call useQuery, even if wallet is not connected
  const merchant = useQuery(api.queries.getByWallet, {
    walletAddress: walletAddress ?? "",
  });

  console.log("Merchant:", merchant);

  // Render states
  const renderContent = () => {
    if (!wallet.connected || !walletAddress) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Wallet Not Connected</h2>
          <p>Please connect your wallet to access the merchant dashboard.</p>
        </div>
      );
    }

    if (merchant === undefined) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
        </div>
      );
    }

    if (merchant === null && !isRegistered) {
      return (
        <div className="container mx-auto px-4 py-8">
          <MerchantSignup onSignupSuccess={() => setIsRegistered(true)} />
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <ProductUpload merchantId={merchant._id} />
        <ProductManagement merchantId={merchant._id} />
      </div>
    );
  };

  return <Layout>{renderContent()}</Layout>;
};

export default MerchantDashboard;
