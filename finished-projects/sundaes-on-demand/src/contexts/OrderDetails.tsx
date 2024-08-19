import React,{ createContext, useContext, useState, ReactNode } from "react";
import { pricePerItem } from "../constants";

// Define interfaces for the state and context
interface OptionCounts {
  scoops: { [key: string]: number };
  toppings: { [key: string]: number };
}

interface OrderDetailsContextProps {
  optionCounts: OptionCounts;
  totals: {
    scoops: number;
    toppings: number;
  };
  updateItemCount: (itemName: string, newItemCount: number, optionType: keyof OptionCounts) => void;
  resetOrder: () => void;
}

interface OrderDetailsProviderProps {
  children: ReactNode;
}

// Initialize context with an undefined value
const OrderDetails = createContext<OrderDetailsContextProps | undefined>(undefined);

// Custom hook to ensure the context is used within a provider
export function useOrderDetails() {
  const contextValue = useContext(OrderDetails);
  if (!contextValue) {
    throw new Error("useOrderDetails must be called from within an OrderDetailsProvider");
  }
  return contextValue;
}

export function OrderDetailsProvider({ children }: OrderDetailsProviderProps) {
  const [optionCounts, setOptionCounts] = useState<OptionCounts>({
    scoops: {}, // example: { Chocolate: 1, Vanilla: 2 }
    toppings: {}, // example: { "Gummi Bears": 1 }
  });

  function updateItemCount(itemName: string, newItemCount: number, optionType: keyof OptionCounts) {
    setOptionCounts((prevOptionCounts) => ({
      ...prevOptionCounts,
      [optionType]: {
        ...prevOptionCounts[optionType],
        [itemName]: newItemCount,
      },
    }));
  }

  function resetOrder() {
    setOptionCounts({ scoops: {}, toppings: {} });
  }

  function calculateTotal(optionType: keyof OptionCounts) {
    const countsArray = Object.values(optionCounts[optionType]);
    const totalCount = countsArray.reduce((total, value) => total + value, 0);
    return totalCount * pricePerItem[optionType];
  }

  const totals = {
    scoops: calculateTotal("scoops"),
    toppings: calculateTotal("toppings"),
  };

  const value: OrderDetailsContextProps = { optionCounts, totals, updateItemCount, resetOrder };

  return <OrderDetails.Provider value={value}>{children}</OrderDetails.Provider>;
}
