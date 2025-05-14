// MerchantSignup.tsx
import React from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useForm } from "react-hook-form";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "../ui/use-toast";

interface MerchantFormData {
  businessName: string;
  businessAddress: string;
  email: string;
}

interface MerchantSignupProps {
  onSignupSuccess: () => void;
}

const MerchantSignup: React.FC<MerchantSignupProps> = ({ onSignupSuccess }) => {
  const wallet = useWallet();
  const { toast } = useToast();
  const createMerchant = useMutation(api.mutations.createMerchant); // Note: changed from merchant to merchants

  const { register, handleSubmit } = useForm<MerchantFormData>();

  const onSubmit = async (data: MerchantFormData) => {
    if (!wallet?.publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMerchant({
        ...data,
        walletAddress: wallet?.publicKey.toBase58(),
      });
      toast({
        title: "Success!",
        description: "Your merchant account has been created.",
      });
      onSignupSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create merchant account.",
        variant: "destructive",
      });
    }
  };

  // ...rest of the component remains the same...

  return (
    <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-serif text-gray-900 mb-6">
        Register as a Merchant
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            {...register("businessName", { required: true })}
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Address
          </label>
          <textarea
            {...register("businessAddress", { required: true })}
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-itiza-gold text-white rounded-lg py-3 hover:bg-opacity-90 transition-all"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default MerchantSignup;
