export const TOPPING_GROUPS = [
  {
    key: 'salty',
    label: 'Salty Toppings',
    items: [
      { label: 'Butter', jp: 'バター', icon: '🧈' },
      { label: 'Ham', jp: 'ハム', icon: '🥓' },
      { label: 'Cheese', jp: 'チーズ', icon: '🧀' },
      { label: 'Egg', jp: '卵', icon: '🥚' },
      { label: 'Mushroom', jp: 'きのこ', icon: '🍄' },
      { label: 'Onions', jp: '玉ねぎ', icon: '🧅' },
      { label: 'Creamed Leek', jp: 'ネギのクリーム煮', icon: '🌿' }
    ]
  },
  {
    key: 'sweet',
    label: 'Sweet Toppings',
    items: [
      { label: 'Sugar', jp: '砂糖', icon: '🍬' },
      { label: 'Lemon Sugar', jp: 'レモンシュガー', icon: '🍋' },
      { label: 'Cinnamon Sugar', jp: 'シナモンシュガー', icon: '🧁' },
      { label: 'Butter Sugar', jp: 'バターシュガー', icon: '🧈' },
      { label: 'Nutella', jp: 'ヌテラ', icon: '🍫' },
      { label: 'Honey', jp: 'はちみつ', icon: '🍯' },
      { label: 'Homemade Apple Strawberry Jelly', jp: 'りんごといちごの\n手作りジャム', icon: '🍎🍓' }
    ]
  }
]

export const createToppingGroups = () =>
  TOPPING_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((topping) => ({
      ...topping,
      available: true
    }))
  }))