import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedPoints } from "@/components/ui/point";
import { wavyitem, flatgift, beads, pendant } from "@/images";
import { useNavigate } from "react-router-dom";

const items = [
  { id: 1, name: "Mystery Item 1", img: "/item.png" },
  { id: 2, name: "Mystery Item 2", img: "/item.png" },
  { id: 3, name: "Mystery Item 3", img: "/item.png" },
  { id: 4, name: "Mystery Item 4", img: "/item.png" },
  { id: 5, name: "Mystery Item 5", img: "/item.png" },
  { id: 6, name: "Mystery Item 6", img: "/item.png" },
];

export default function Dashboard() {
  const [loyaltyPoints, _setLoyaltyPoints] = useState(200);
  const [animatePoints, _setAnimatePoints] = useState(false);
  const navigate = useNavigate();

  // navigation handlers
  const handleGiftAirtime = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Navigating to gift-airtime");
    navigate("/gift-airtime", { replace: true });
  };

  const handleGiftToken = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Navigating to gift-token");
    navigate("/gift-token", { replace: true });
  };

  const handleGiftStore = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Navigating to gift-store");
    navigate("/gift-store", { replace: true });
  };

  return (
    <div className="min-h-screen h-screen overflow-x-auto overflow-y-hidden relative bg-gradient-to-b from-[#fce8e6] via-[#fbd9db] to-[#f9f1ec]">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={wavyitem}
          alt="Wavy fabric"
          className="absolute top-0 right-0 w-64 opacity-30 blur-sm transform scale-110 rotate-6"
        />
        <img
          src={flatgift}
          alt="Gift box"
          className="absolute bottom-4 left-4 w-40 opacity-40 blur-[1px]"
        />
        <img
          src={pendant}
          alt="Pendant"
          className="absolute top-10 left-6 w-24 opacity-30 rotate-12 blur-sm"
        />
        <img
          src={beads}
          alt="Pearls"
          className="absolute bottom-6 right-6 w-28 opacity-30 blur-sm"
        />
      </div>

      {/* Main content */}
      <div className="min-h-screen pt-20 px-4 relative z-1">
        <div className="max-w-lg mx-auto h-[calc(100vh-6rem)] bg-white/30 backdrop-blur-xl rounded-3xl p-6 shadow-2xl overflow-y-auto">
          {/* Balance */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-[#832c2c]/90 font-medium">Your Balance</h2>
              <AnimatedPoints points={loyaltyPoints} animate={animatePoints} />
            </div>
            <div className="bg-gradient-to-r from-[#f6c1c1] to-[#fbe9e7] rounded-2xl p-6 text-center shadow">
              <span className="text-3xl font-bold text-[#832c2c]">$1,000</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              onClick={handleGiftAirtime}
              type="button"
              className="bg-[#e47a7a] hover:bg-[#d76666] text-white rounded-xl py-3 font-medium transition-all shadow-md"
            >
              Gift Airtime
            </Button>
            <Button
              onClick={handleGiftToken}
              className="bg-[#f4b6b6] hover:bg-[#f09090] text-white rounded-xl py-3 font-medium transition-all shadow-md"
            >
              Gift Token
            </Button>
            <Button
              onClick={handleGiftStore}
              className="col-span-2 bg-[#e47a7a] hover:bg-[#d76666] text-white rounded-xl py-3 font-medium transition-all shadow-md"
            >
              Gift Store
            </Button>
          </div>

          {/* Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="bg-white/20 hover:bg-white/30 transition-all cursor-pointer border-0 shadow-sm rounded-xl"
              >
                <CardContent className="p-3">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <p className="text-[#832c2c]/80 text-sm mt-2 text-center">
                    {item.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
