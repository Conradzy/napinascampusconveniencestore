export type Category = "Snacks" | "Drinks" | "School Supplies";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
};

export type CartItem = Product & { quantity: number };
export type OrderType = "Dine In" | "Take Out";

export type Receipt = {
  reference: string;
  orderType: OrderType;
  items: CartItem[];
  totalCents: number;
  paidCents: number;
  changeCents: number;
};

export const products: Product[] = [
  { id: "noodles", name: "Instant Noodles", price: 18, category: "Snacks", image: "/products/noodles.svg" },
  { id: "chips", name: "Potato Chips", price: 25, category: "Snacks", image: "/products/chips.svg" },
  { id: "soda", name: "Soft Drink (Can)", price: 25, category: "Drinks", image: "/products/soda.svg" },
  { id: "water", name: "Bottled Water", price: 20, category: "Drinks", image: "/products/water.svg" },
  { id: "ballpen", name: "Ballpen (piece)", price: 12, category: "School Supplies", image: "/products/ballpen.svg" },
  { id: "notebook", name: "Notebook (piece)", price: 35, category: "School Supplies", image: "/products/notebook.svg" },
];

export const categories = ["All", "Snacks", "Drinks", "School Supplies"] as const;
