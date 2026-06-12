"use client";

import React, { useEffect, useState } from "react";

interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  description: string;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: "detective",
    name: "Detective Hat",
    emoji: "🕵️",
    price: 100,
    description: "Equip Nuggy to solve Wikipedia mysteries.",
  },
  {
    id: "space",
    name: "Space Helmet",
    emoji: "🚀",
    price: 150,
    description: "Equip Nuggy to explore astronomical facts.",
  },
];

interface GistShopProps {
  cookiesBalance: number;
  onPurchaseOrEquip: () => void;
}

export default function GistShop({ cookiesBalance, onPurchaseOrEquip }: GistShopProps) {
  const [purchased, setPurchased] = useState<string[]>([]);
  const [equipped, setEquipped] = useState<string>("");

  useEffect(() => {
    const savedPurchased = localStorage.getItem("purchased_outfits");
    const savedEquipped = localStorage.getItem("active_outfit");
    if (savedPurchased) setPurchased(JSON.parse(savedPurchased));
    if (savedEquipped) setEquipped(savedEquipped);
  }, []);

  const handleAction = (item: ShopItem) => {
    const isPurchased = purchased.includes(item.id);

    if (isPurchased) {
      // Toggle equip/unequip
      const nextEquip = equipped === item.id ? "" : item.id;
      setEquipped(nextEquip);
      localStorage.setItem("active_outfit", nextEquip);
      onPurchaseOrEquip();
    } else {
      // Buy
      if (cookiesBalance < item.price) return;
      const nextPurchased = [...purchased, item.id];
      setPurchased(nextPurchased);
      localStorage.setItem("purchased_outfits", JSON.stringify(nextPurchased));
      
      // Auto-equip on purchase
      setEquipped(item.id);
      localStorage.setItem("active_outfit", item.id);

      // Deduct balance
      const newBalance = cookiesBalance - item.price;
      localStorage.setItem("cookies_balance", newBalance.toString());

      onPurchaseOrEquip();
    }
  };

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-4 pb-16">
      <div className="bg-card border-[3px] border-[#2C1D11] dark:border-zinc-800 rounded-3xl p-6 text-center shadow-[0_6px_0_0_#2C1D11] dark:shadow-[0_6px_0_0_rgba(0,0,0,0.4)]">
        <h3 className="font-serif text-xl font-extrabold text-foreground mb-1 select-none">
          Nuggy's Costume Shop 🏪
        </h3>
        <p className="font-sans text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-3 select-none">
          Dress up your cookie mascot
        </p>
        <div className="h-[2px] w-full bg-[#2C1D11] dark:bg-zinc-800 mb-3" />
        <div className="flex justify-center items-center gap-1.5 font-sans text-sm font-black text-coral select-none">
          <span>Your Balance:</span>
          <span>🍪 {cookiesBalance}</span>
        </div>
      </div>

      {SHOP_ITEMS.map((item) => {
        const isPurchased = purchased.includes(item.id);
        const isEquipped = equipped === item.id;
        const canAfford = cookiesBalance >= item.price;

        return (
          <div
            key={item.id}
            className="bg-card border-[3px] border-[#2C1D11] dark:border-zinc-800 rounded-2xl p-4 flex gap-4 items-center shadow-[0_4px_0_0_#2C1D11] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.4)]"
          >
            <div className="w-16 h-16 rounded-xl bg-[#fdf1ed] dark:bg-zinc-800 border-2 border-[#2C1D11] dark:border-zinc-700 flex items-center justify-center text-3xl flex-shrink-0 select-none">
              {item.emoji}
            </div>

            <div className="flex-1 flex flex-col gap-1 overflow-hidden select-none">
              <h4 className="font-serif text-base font-extrabold text-foreground truncate">
                {item.name}
              </h4>
              <p className="font-sans text-xs font-semibold text-foreground/70 leading-normal">
                {item.description}
              </p>
              {!isPurchased && (
                <span className="font-sans text-xs font-black text-coral">
                  Cost: 🍪 {item.price}
                </span>
              )}
            </div>

            <button
              onClick={() => handleAction(item)}
              disabled={!isPurchased && !canAfford}
              className={`px-4 py-2 font-sans font-extrabold text-xs rounded-xl border-2 border-[#2C1D11] dark:border-zinc-700 shadow-[0_3px_0_0_#2C1D11] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none transition-all duration-75 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus:outline-none ${
                isEquipped
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_3px_0_0_#0d5a52] border-emerald-600"
                  : isPurchased
                  ? "bg-[#2C1D11] dark:bg-zinc-800 text-white"
                  : "bg-coral hover:bg-[#ee7e63] text-white"
              }`}
            >
              {isEquipped ? "Equipped" : isPurchased ? "Equip" : `Buy 🍪`}
            </button>
          </div>
        );
      })}
    </div>
  );
}
