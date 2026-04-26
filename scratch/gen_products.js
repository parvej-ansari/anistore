const fs = require('fs');
const path = require('path');

const categories = ["Figures", "Clothing", "Posters", "Collectibles", "Watches", "Shoes"];
const platforms = ["Amazon", "Flipkart", "Meesho"];

const animeList = ["Naruto", "One Piece", "Dragon Ball Z", "Attack on Titan", "Demon Slayer", "Jujutsu Kaisen", "Bleach", "Death Note"];

const products = [];

for (let i = 1; i <= 120; i++) {
  const anime = animeList[Math.floor(Math.random() * animeList.length)];
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const plat = platforms[Math.floor(Math.random() * platforms.length)];
  
  let link = "";
  if (plat === "Amazon") link = `https://www.amazon.in/s?k=${anime}+${cat}+anime`;
  else if (plat === "Flipkart") link = `https://www.flipkart.com/search?q=${anime}+${cat}+anime`;
  else link = `https://www.meesho.com/search?q=${anime}+${cat}+anime`;

  products.push({
    id: `prod_${i}`,
    name: `${anime} Elite ${cat}`,
    description: `Professional high-quality ${anime} themed ${cat.toLowerCase()} for the ultimate fan. Sourced from ${plat} for the best deals.`,
    price: Math.floor(Math.random() * 2000) + 499,
    image: `https://images.unsplash.com/photo-${1578632738908 + i}?auto=format&fit=crop&q=80&w=800`,
    affiliateLink: link,
    platform: plat,
    category: cat
  });
}

fs.writeFileSync(path.join(__dirname, '../src/data/products.json'), JSON.stringify(products, null, 2));
console.log("Generated 120 Professional Products!");
