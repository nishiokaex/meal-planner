// サンプル献立データ
export const sampleMeals = [
  {
    id: 1,
    name: "ハンバーグ定食",
    mainDish: "ハンバーグ",
    sideDishes: ["サラダ", "味噌汁", "ご飯"],
    ingredients: ["牛ひき肉", "玉ねぎ", "卵", "パン粉", "レタス", "トマト", "味噌", "豆腐"],
    cookingTime: 30,
    difficulty: "普通",
    lastMade: null
  },
  {
    id: 2,
    name: "カレーライス",
    mainDish: "カレー",
    sideDishes: ["ご飯", "福神漬け"],
    ingredients: ["カレールー", "じゃがいも", "にんじん", "玉ねぎ", "牛肉", "ご飯"],
    cookingTime: 45,
    difficulty: "簡単",
    lastMade: new Date('2024-06-20')
  },
  {
    id: 3,
    name: "鶏の唐揚げ定食",  
    mainDish: "鶏の唐揚げ",
    sideDishes: ["キャベツの千切り", "味噌汁", "ご飯"],
    ingredients: ["鶏もも肉", "醤油", "酒", "にんにく", "生姜", "片栗粉", "キャベツ"],
    cookingTime: 25,
    difficulty: "普通",
    lastMade: new Date('2024-06-25')
  },
  {
    id: 4,
    name: "パスタセット",
    mainDish: "ミートソースパスタ",
    sideDishes: ["サラダ", "ガーリックブレッド"],
    ingredients: ["パスタ", "牛ひき肉", "トマト缶", "玉ねぎ", "にんにく", "レタス", "食パン"],
    cookingTime: 20,
    difficulty: "簡単",
    lastMade: new Date('2024-06-28')
  },
  {
    id: 5,
    name: "魚の煮付け定食",
    mainDish: "さばの煮付け",
    sideDishes: ["小松菜のお浸し", "味噌汁", "ご飯"],
    ingredients: ["さば", "醤油", "みりん", "砂糖", "生姜", "小松菜", "ご飯"],
    cookingTime: 35,
    difficulty: "普通",
    lastMade: new Date('2024-06-22')
  }
];

// 献立履歴データ
export const mealHistory = [
  {
    id: 1,
    mealId: 2,
    date: new Date('2024-06-20'),
    rating: 4,
    notes: "子供たちに好評だった"
  },
  {
    id: 2,
    mealId: 5,
    date: new Date('2024-06-22'),
    rating: 3,
    notes: "少し味が濃かった"
  },
  {
    id: 3,
    mealId: 3,
    date: new Date('2024-06-25'),
    rating: 5,
    notes: "完璧な仕上がり"
  },
  {
    id: 4,
    mealId: 4,
    date: new Date('2024-06-28'),
    rating: 4,
    notes: "簡単で美味しい"
  }
];