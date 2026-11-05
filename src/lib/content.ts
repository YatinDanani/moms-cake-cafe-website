export const business = {
  name: "Mom's Cake Café",
  shortName: "Mom's Cake",
  tagline: "Cake that feels like home",
  addressLine1: "2060 Oak Bay Ave",
  addressLine2: "Victoria, BC V8R 1E4",
  phone: "250-590-5543",
  phoneHref: "tel:+12505905543",
  email: "momscake2023@yahoo.com",
  hours: [
    { days: "Monday – Saturday", time: "8:00 AM – 6:00 PM" },
    { days: "Sunday & holidays", time: "8:00 AM – 5:00 PM" },
  ],
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=2060+Oak+Bay+Ave%2C+Victoria%2C+BC+V8R+1E4",
  social: {
    // Instagram and TikTok are still placeholder handles until confirmed.
    instagram: "https://instagram.com/momscakecafe",
    facebook: "https://www.facebook.com/profile.php?id=100091969637518",
    tiktok: "https://www.tiktok.com/@momscakecafe",
  },
} as const;

export const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/custom-cakes", label: "Custom Cakes" },
  { href: "/catering", label: "Catering" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Visit & Contact" },
] as const;

export const offerings = [
  {
    key: "cakes",
    name: "Signature Cakes",
    blurb: "Layered classics and celebration showstoppers, built to order.",
    color: "coffee",
  },
  {
    key: "cupcakes",
    name: "Cupcakes",
    blurb: "One-hand treats in flavors that rotate with the season.",
    color: "caramel",
  },
  {
    key: "sansrival",
    name: "Sansrival",
    blurb: "Crisp meringue layers folded with buttercream, the old way.",
    color: "mocha",
  },
  {
    key: "coffee",
    name: "Coffee & Drinks",
    blurb: "Espresso pulled to order, made for lingering at a table.",
    color: "latte",
  },
  {
    key: "meals",
    name: "Homemade Meals",
    blurb: "A short daily menu of real food, cooked the way home is.",
    color: "coffee",
  },
] as const;

export const story = [
  {
    label: "Home kitchen",
    title: "Where it began",
    text: "Cakes for family celebrations, made in a home kitchen with recipes already decades old.",
  },
  {
    label: "Word of mouth",
    title: "A growing following",
    text: "Requests from neighbors and friends turned a home kitchen into something bigger.",
  },
  {
    label: "Today",
    title: "Mom's Cake Café",
    text: "A storefront on Oak Bay Ave where the cakes, the coffee, and the people who ask for both get to stay a while.",
  },
] as const;

export const values = [
  { name: "Quality", text: "Nothing leaves the kitchen we wouldn't serve family." },
  { name: "Hospitality", text: "Every table gets the same welcome, regular or first-timer." },
  { name: "Creativity", text: "Custom orders are a conversation, not a catalog." },
  { name: "Consistency", text: "The cake you loved last year tastes the same this year." },
] as const;

// Real reviews from Mom's Cake Café's Google Business profile.
export const testimonials = [
  {
    quote:
      "I absolutely loved the custom cake. It looked exactly as requested, with beautiful details. The cake was soft, moist and full of flavor. I would definitely order from them again! Thank you Mom's Cake Cafe!",
    name: "Therese Chavez",
  },
  {
    quote:
      "I ordered gender reveal cake it was so delicious, the design is great, Sir Victor is so generous and polite, next time I will try the other flavor of their cakes, highly recommended for all occasions!!! Legit 100% thank you for the complimentary Sansrival, my favorite pistachio is the best but all are yummy!!!!",
    name: "Mecel Villanueva",
  },
  {
    quote:
      "WOW! I found the best Sans Rival I have ever had. Sans Rival is a traditional Filipino layered cake made with crispy cashew meringue, rich French buttercream, and chopped toasted cashews. I tried the Pistachio Sans Rival, and I was immediately blown away by the flavours and textures. The size of their sans rivals are significantly larger than all the sans rivals I've ever tried. The service was warm, friendly, and enthusiastic.",
    name: "Rhox",
  },
] as const;

export const cakeMenu = [
  {
    category: "Signature Cakes",
    note: "Larger sizes and custom designs quoted on request.",
    items: [
      {
        name: "Carrot Cake",
        description: "Spiced carrot cake with cream cheese frosting, walnuts, and a hint of cinnamon",
        sizes: [
          { label: "6×4", price: "$42" },
          { label: "8\"", price: "$64" },
        ],
      },
      {
        name: "Classic Ube Cake",
        description: "Filipino purple yam cake with ube halaya",
        sizes: [
          { label: "6×4", price: "$44" },
          { label: "8\"", price: "$70" },
        ],
      },
      {
        name: "Ube Cake with Leche Flan",
        description: "Classic ube cake crowned with silky leche flan topping",
        sizes: [
          { label: "6×4", price: "$70" },
          { label: "8\"", price: "$80" },
        ],
      },
      {
        name: "Cookies & Cream Oreo Cake",
        description: "Chocolate sponge layered with Oreo cream filling and crushed cookies",
        sizes: [
          { label: "6×4", price: "$44" },
          { label: "8\"", price: "$64" },
        ],
      },
      {
        name: "Floral Cake",
        description: "Elegant floral buttercream design with rich chocolate cake inside",
        sizes: [
          { label: "6×4", price: "$53" },
          { label: "8\"", price: "$65" },
        ],
      },
      {
        name: "Mango Bravo",
        description: "Layers of chiffon sponge, cream, and fresh mangoes topped with meringue",
        sizes: [
          { label: "6×4", price: "$53" },
          { label: "6×5", price: "$70" },
          { label: "8×4", price: "$85" },
          { label: "8×6", price: "$93" },
          { label: "10×4", price: "$125" },
        ],
      },
      {
        name: "Mocha Cake",
        description: "Coffee-infused sponge with mocha buttercream and caramel swirl",
        sizes: [
          { label: "6×4", price: "$42" },
          { label: "8\"", price: "$64" },
        ],
      },
      {
        name: "Moist Chocolate Cake",
        description: "Rich triple-layer chocolate cake with dark ganache and cocoa dusting",
        sizes: [
          { label: "6×4", price: "$44" },
          { label: "8\"", price: "$58" },
        ],
      },
      {
        name: "Red Velvet Cake",
        description: "Red velvet layers with cream cheese frosting and delicate crumb",
        sizes: [
          { label: "6×4", price: "$43" },
          { label: "8\"", price: "$60" },
        ],
      },
      {
        name: "Vanilla Cake",
        description: "Light, fluffy vanilla sponge with smooth buttercream frosting",
        sizes: [
          { label: "6×4", price: "$42" },
          { label: "8\"", price: "$62" },
        ],
      },
      {
        name: "Pistachio Sansrival",
        description: "Crispy meringue layers with buttercream, coated in crushed pistachios",
        sizes: [
          { label: "6×4", price: "$57" },
          { label: "8\"", price: "$70" },
        ],
      },
      {
        name: "Almond Sansrival",
        description: "Crispy meringue layers with buttercream, coated in sliced almonds",
        sizes: [
          { label: "6×4", price: "$52" },
          { label: "8\"", price: "$65" },
        ],
      },
      {
        name: "Cashew Sansrival",
        description: "Crispy meringue layers with buttercream, coated in roasted cashews",
        sizes: [
          { label: "6×4", price: "$52" },
          { label: "8\"", price: "$65" },
        ],
      },
    ],
  },
  {
    category: "Cupcakes",
    note: "Sold individually or by the half-dozen.",
    items: [
      { name: "Red Velvet", sizes: [{ label: "", price: "$4.25" }] },
      { name: "Mango Cream", sizes: [{ label: "", price: "$4.25" }] },
      { name: "Biscoff Crunch", sizes: [{ label: "", price: "$4.75" }] },
      { name: "Classic Chocolate", sizes: [{ label: "", price: "$4.00" }] },
    ],
  },
  {
    category: "Coffee",
    note: "",
    items: [
      {
        name: "Café Latte",
        description: "Smooth espresso with steamed milk and silky microfoam",
        sizes: [
          { label: "Small", price: "$4.65" },
          { label: "Medium", price: "$5.25" },
          { label: "Large", price: "$5.45" },
        ],
      },
      {
        name: "Cappuccino",
        description: "Classic espresso with equal parts steamed milk and dense foam",
        sizes: [
          { label: "Small", price: "$4.65" },
          { label: "Medium", price: "$5.25" },
          { label: "Large", price: "$5.45" },
        ],
      },
      {
        name: "Flat White",
        description: "Velvety double-shot espresso with microfoam",
        sizes: [
          { label: "Small", price: "$4.85" },
          { label: "Medium", price: "$5.45" },
          { label: "Large", price: "$5.65" },
        ],
      },
      {
        name: "Americano",
        description: "Bold espresso lengthened with hot water",
        sizes: [
          { label: "Small", price: "$3.55" },
          { label: "Medium", price: "$3.95" },
          { label: "Large", price: "$4.35" },
        ],
      },
      {
        name: "Mocha",
        description: "Espresso, chocolate, steamed milk, and whipped cream",
        sizes: [
          { label: "Small", price: "$5" },
          { label: "Medium", price: "$5.65" },
          { label: "Large", price: "$6.15" },
        ],
      },
    ],
  },
  {
    category: "Non-Coffee Hot Beverages",
    note: "",
    items: [
      {
        name: "Hot Matcha Latte",
        description: "Ceremonial-grade matcha with creamy steamed milk",
        sizes: [
          { label: "Small", price: "$5.25" },
          { label: "Medium", price: "$5.65" },
          { label: "Large", price: "$6.05" },
        ],
      },
      {
        name: "Hot Chocolate",
        description: "Rich Belgian chocolate with steamed milk and marshmallows",
        sizes: [
          { label: "Small", price: "$4.25" },
          { label: "Medium", price: "$4.85" },
          { label: "Large", price: "$5.05" },
        ],
      },
      {
        name: "Hot Teas",
        description: "House-brewed selection of premium loose-leaf teas",
        sizes: [{ label: "", price: "$3.65" }],
      },
      {
        name: "London Fog",
        description: "Earl Grey tea with steamed milk and vanilla",
        sizes: [
          { label: "Small", price: "$4.75" },
          { label: "Medium", price: "$5.15" },
          { label: "Large", price: "$5.55" },
        ],
      },
    ],
  },
  {
    category: "Shaved Ice Desserts",
    note: "",
    items: [
      {
        name: "Halo-Halo",
        description: "Classic Filipino shaved-ice dessert with sweet beans, fruits, ube, and leche flan",
        sizes: [{ label: "", price: "$14" }],
      },
      {
        name: "Mais Con-Yelo",
        description: "Sweet corn and shaved ice with milk and a scoop of ice cream",
        sizes: [{ label: "", price: "$12" }],
      },
    ],
  },
  {
    category: "Smoothies",
    note: "",
    items: [
      {
        name: "Mango Smoothie",
        description: "Fresh ripe mangoes blended with creamy milk and ice",
        sizes: [
          { label: "Regular", price: "$6.95" },
          { label: "Large", price: "$7.45" },
        ],
      },
      {
        name: "Strawberry Smoothie",
        description: "Sweet strawberries blended with yogurt and ice",
        sizes: [
          { label: "Regular", price: "$6.95" },
          { label: "Large", price: "$7.45" },
        ],
      },
      {
        name: "Lime Smoothie",
        description: "Refreshing lime blended with ice and a hint of mint",
        sizes: [
          { label: "Regular", price: "$6.95" },
          { label: "Large", price: "$7.45" },
        ],
      },
    ],
  },
  {
    category: "Mojitos",
    note: "",
    items: [
      {
        name: "Strawberry Mojito",
        description: "Fresh muddled strawberries with mint, lime, and soda over crushed ice",
        sizes: [
          { label: "Regular", price: "$5.25" },
          { label: "Large", price: "$5.99" },
        ],
      },
      {
        name: "Mango Mojito",
        description: "Sweet ripe mango with mint, lime, and soda over crushed ice",
        sizes: [
          { label: "Regular", price: "$5.25" },
          { label: "Large", price: "$5.99" },
        ],
      },
      {
        name: "Lime Mojito",
        description: "Classic lime and mint mojito with sparkling soda over crushed ice",
        sizes: [
          { label: "Regular", price: "$5.25" },
          { label: "Large", price: "$5.99" },
        ],
      },
    ],
  },
  {
    category: "Chillers",
    note: "",
    items: [
      {
        name: "Coffee Chiller",
        description: "Chilled blended coffee with ice and a creamy finish",
        sizes: [
          { label: "Regular", price: "$5.35" },
          { label: "Large", price: "$5.75" },
        ],
      },
      {
        name: "Mocha Chiller",
        description: "Blended iced mocha with chocolate and whipped cream",
        sizes: [
          { label: "Regular", price: "$6.95" },
          { label: "Large", price: "$7.35" },
        ],
      },
      {
        name: "Espresso Chiller",
        description: "Bold double-shot espresso blended over ice",
        sizes: [
          { label: "Regular", price: "$6.35" },
          { label: "Large", price: "$6.75" },
        ],
      },
      {
        name: "Vanilla Chiller",
        description: "Creamy vanilla blended ice drink with a smooth finish",
        sizes: [
          { label: "Regular", price: "$5.35" },
          { label: "Large", price: "$5.75" },
        ],
      },
      {
        name: "Matcha Chiller",
        description: "Iced blended matcha with milk and crushed ice",
        sizes: [
          { label: "Regular", price: "$6.35" },
          { label: "Large", price: "$6.75" },
        ],
      },
    ],
  },
  {
    category: "Cold Coffee",
    note: "",
    items: [
      {
        name: "Iced Coffee",
        description: "Chilled house-brewed coffee served over ice",
        sizes: [{ label: "", price: "$4.35" }],
      },
      {
        name: "Iced Americano",
        description: "Bold espresso shots poured over cold water and ice",
        sizes: [{ label: "", price: "$4.55" }],
      },
      {
        name: "Iced Latte",
        description: "Espresso and cold milk over ice with silky foam",
        sizes: [{ label: "", price: "$5.50" }],
      },
      {
        name: "Iced Mocha",
        description: "Espresso, chocolate, and cold milk over ice",
        sizes: [{ label: "", price: "$5.75" }],
      },
      {
        name: "Iced Chai Latte",
        description: "Spiced chai and cold milk served over ice",
        sizes: [{ label: "", price: "$5.75" }],
      },
      {
        name: "Iced Chocolate",
        description: "Rich Belgian chocolate blended with cold milk and ice",
        sizes: [{ label: "", price: "$5.75" }],
      },
      {
        name: "Iced Matcha",
        description: "Ceremonial matcha whisked with cold milk over ice",
        sizes: [{ label: "", price: "$5.75" }],
      },
      {
        name: "Iced Vanilla Latte",
        description: "Vanilla espresso with cold milk over ice",
        sizes: [{ label: "", price: "$5.75" }],
      },
      {
        name: "Iced Caramel Macchiato",
        description: "Espresso, vanilla, caramel, and cold milk over ice",
        sizes: [{ label: "", price: "$5.75" }],
      },
    ],
  },
  {
    category: "Homemade Meals",
    note: "A short rotating menu. Ask what's on today.",
    items: [
      { name: "Soup & Half Sandwich", sizes: [{ label: "", price: "$11" }] },
      { name: "Chicken Adobo Plate", sizes: [{ label: "", price: "$14" }] },
      { name: "Seasonal Quiche & Salad", sizes: [{ label: "", price: "$13" }] },
    ],
  },
] as const;

// Named spots on the site an admin can replace with a real photo via /admin.
// Add more entries here as new photo placements get built — the admin page
// and photo-serving route both just iterate this list, no other wiring needed.
export const photoSlots = [
  { key: "hero", label: "Home page hero background" },
] as const;

export const cateringPackages = [
  {
    name: "Custom Cake Packages",
    text: "Tiered cakes, cupcake towers, and dessert tables.",
  },
  {
    name: "Full Meal Catering",
    text: "Pasta, rice meals, sandwiches, and more.",
  },
  {
    name: "Coffee & Beverage Bar",
    text: "Barista service with premium coffee selections.",
  },
  {
    name: "Dessert Buffets",
    text: "Pastries, cheesecakes, and sweet treats.",
  },
] as const;

// Categories an admin can file gallery photos under, also the section
// order on the public gallery page.
export const galleryCategories = [
  "Birthday Cakes",
  "Wedding Cakes",
  "Custom Cakes",
  "Cupcakes & Treats",
  "Events & Catering",
] as const;

export const eventTypes = [
  "Birthday",
  "Wedding",
  "Corporate",
  "Meeting",
  "Anniversary",
  "Graduation",
  "Other",
] as const;
