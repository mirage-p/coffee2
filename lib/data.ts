import type { MenuItem } from "./types"

const menuData = {
  drinks: [
    {
      id: 1,
      name: "Blueberry Matcha",
      ingredients: ["Blueberry syrup", "Oat milk", "Blueberry cold foam"],
    },
    {
      id: 2,
      name: "Lemon Poppyseed Matcha",
      ingredients: ["Lemon poppyseed syrup", "Oat milk", "Lemon poppyseed cold foam"],
    },
    {
      id: 3,
      name: "Mango Sago Matcha",
      ingredients: ["Mango purée (coconut milk, condensed milk)", "Sago", "Oat milk", "Honey"],
    },
  ],
  pastries: [
    {
      id: 4,
      name: "Croissant",
    },
    {
      id: 5,
      name: "Cherry Cheese Danish Bread",
    },
    {
      id: 6,
      name: "Cardamom Bun",
    },
    {
      id: 7,
      name: "Focaccia",
    },
  ],
}

// Convert to unified menu items without prices
export const menuItems: MenuItem[] = [
  ...menuData.drinks.map((drink) => ({
    ...drink,
    category: "drinks" as const,
  })),
  ...menuData.pastries.map((pastry) => ({
    ...pastry,
    ingredients: undefined,
    category: "pastries" as const,
  })),
]
