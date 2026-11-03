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
  // Placeholder handles until the client supplies live profile links.
  social: {
    instagram: "https://instagram.com/momscakecafe",
    facebook: "https://facebook.com/momscakecafe",
    tiktok: "https://www.tiktok.com/@momscakecafe",
  },
} as const;

export const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/custom-cakes", label: "Custom Cakes" },
  { href: "/catering", label: "Catering" },
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
    year: "2016",
    title: "A home kitchen",
    text: "It started with one oven, birthday orders for neighbors, and a notebook of recipes passed down and tinkered with.",
  },
  {
    year: "2019",
    title: "A stall, a following",
    text: "Weekend markets around Victoria turned word-of-mouth into a waitlist, and the notebook turned into a real menu.",
  },
  {
    year: "Today",
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

export const testimonials = [
  {
    quote:
      "Our wedding cake looked like something from a magazine and tasted even better. They walked us through every flavor before we committed.",
    name: "Priya M.",
  },
  {
    quote:
      "I ordered a last-minute birthday cake on a Tuesday and it was ready Thursday morning, exactly as pictured. Victoria needed this place.",
    name: "Daniel R.",
  },
  {
    quote:
      "The sansrival is the reason I keep coming back, but the coffee and the window seat are why I stay for an hour.",
    name: "Grace L.",
  },
] as const;

export const cakeMenu = [
  {
    category: "Signature Cakes",
    note: "Priced per 8-inch round, serves 10–12. Larger tiers and custom designs quoted on request.",
    items: [
      { name: "Classic Vanilla Buttercream", price: "$52" },
      { name: "Dark Chocolate Ganache", price: "$56" },
      { name: "Ube & Coconut", price: "$58" },
      { name: "Lemon Elderflower", price: "$56" },
      { name: "Salted Caramel Mocha", price: "$60" },
    ],
  },
  {
    category: "Cupcakes",
    note: "Sold individually or by the half-dozen.",
    items: [
      { name: "Red Velvet", price: "$4.25" },
      { name: "Mango Cream", price: "$4.25" },
      { name: "Biscoff Crunch", price: "$4.75" },
      { name: "Classic Chocolate", price: "$4.00" },
    ],
  },
  {
    category: "Sansrival",
    note: "Whole and half sizes available; pre-order recommended.",
    items: [
      { name: "Sansrival Slice", price: "$6.50" },
      { name: "Whole Sansrival (8-inch)", price: "$48" },
    ],
  },
  {
    category: "Coffee & Drinks",
    note: "",
    items: [
      { name: "Espresso", price: "$3.25" },
      { name: "Latte", price: "$4.75" },
      { name: "Vanilla Oat Latte", price: "$5.25" },
      { name: "Iced Americano", price: "$4.00" },
      { name: "Hot Chocolate", price: "$4.25" },
    ],
  },
  {
    category: "Homemade Meals",
    note: "A short rotating menu — ask what's on today.",
    items: [
      { name: "Soup & Half Sandwich", price: "$11" },
      { name: "Chicken Adobo Plate", price: "$14" },
      { name: "Seasonal Quiche & Salad", price: "$13" },
    ],
  },
] as const;

export const cateringPackages = [
  {
    name: "Dessert Table",
    serves: "Serves 20–30",
    text: "A mixed spread of mini cupcakes, sansrival bites, and a small centerpiece cake, styled for the table.",
  },
  {
    name: "Event Cake",
    serves: "Serves 30–80",
    text: "One tiered cake sized to your guest count, in any flavor from our menu or a custom combination.",
  },
  {
    name: "Coffee Service",
    serves: "Up to 4 hours",
    text: "An espresso station with a barista on site, for showers, launches, or office afternoons.",
  },
] as const;
