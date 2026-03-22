import { MenuData } from './menu-types';

export const MENU_DEFAULT_SAMPLE_DATA: MenuData = {
  project_id: 0,
  name: 'Napoli Pizza Co.',
  description:
    'Wood-fired Neapolitan pizza, handmade pasta, and late-night favorites served from our open kitchen in the heart of the city.',
  logo_url:
    'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=400&q=80',
  cover_image_url:
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80',
  gallery_images: [
    'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1520201163981-8cc95007dd2e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80',
  ],
  phone: '+63 997 221 7704',
  email: 'hello@napolipizza.co',
  address: '123 Main Street, Makati City',
  website_url: 'https://kislap.app',
  google_maps_url: 'https://maps.google.com',
  whatsapp: '+639972217704',
  currency: 'PHP',
  search_enabled: true,
  hours_enabled: true,
  business_hours: [
    { day: 'Monday', open: '11:00', close: '21:00', closed: false },
    { day: 'Tuesday', open: '11:00', close: '21:00', closed: false },
    { day: 'Wednesday', open: '11:00', close: '21:00', closed: false },
    { day: 'Thursday', open: '11:00', close: '22:00', closed: false },
    { day: 'Friday', open: '11:00', close: '22:00', closed: false },
    { day: 'Saturday', open: '10:00', close: '22:00', closed: false },
    { day: 'Sunday', open: '10:00', close: '20:00', closed: false },
  ],
  social_links: [
    { platform: 'instagram', url: 'https://instagram.com' },
    { platform: 'facebook', url: 'https://facebook.com' },
    { platform: 'tripadvisor', url: 'https://tripadvisor.com' },
    { platform: 'google-reviews', url: 'https://google.com/maps' },
  ],
  categories: [
    {
      id: 1,
      name: 'Pizza Classiche',
      description: 'Stone-baked signatures with bright tomato, soft mozzarella, and a blistered crust.',
      image_url:
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      is_visible: true,
    },
    {
      id: 2,
      name: 'Pizza Speciali',
      description: 'Bolder combinations for guests who want a richer, more layered bite.',
      image_url:
        'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=1200&q=80',
      is_visible: true,
    },
    {
      id: 3,
      name: 'Pasta & Sides',
      description: 'Comfort picks, fried starters, and creamy plates that round out the table.',
      image_url:
        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
      is_visible: true,
    },
  ],
  items: [
    {
      id: 101,
      menu_category_id: 1,
      name: 'Margherita',
      description: 'San Marzano tomato, fior di latte mozzarella, basil, and extra virgin olive oil.',
      image_url:
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
      badge: 'Classic',
      price: 'PHP 480',
      is_available: true,
      is_featured: true,
    },
    {
      id: 102,
      menu_category_id: 1,
      name: 'Pepperoni',
      description: 'House tomato sauce, mozzarella, and crisp-edged pepperoni with a touch of hot honey.',
      image_url:
        'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80',
      badge: 'Bestseller',
      price: 'PHP 560',
      is_available: true,
      is_featured: true,
    },
    {
      id: 103,
      menu_category_id: 2,
      name: 'Quattro Formaggi',
      description: 'Mozzarella, gorgonzola, parmesan, provolone, and roasted garlic oil finished with black pepper.',
      image_url:
        'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=80',
      badge: 'Rich',
      price: 'PHP 640',
      is_available: true,
      is_featured: false,
    },
    {
      id: 104,
      menu_category_id: 2,
      name: 'Prosciutto Rucola',
      description: 'Fresh mozzarella, prosciutto, arugula, and shaved parmesan on a tomato base.',
      image_url:
        'https://images.unsplash.com/photo-1520201163981-8cc95007dd2e?auto=format&fit=crop&w=900&q=80',
      badge: 'Chef Pick',
      price: 'PHP 690',
      is_available: true,
      is_featured: true,
    },
    {
      id: 105,
      menu_category_id: 3,
      name: 'Truffle Cream Pasta',
      description: 'Creamy pasta finished with mushrooms, parmesan, cracked pepper, and truffle oil.',
      image_url:
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80',
      badge: 'New',
      price: 'PHP 420',
      is_available: true,
      is_featured: false,
    },
    {
      id: 106,
      menu_category_id: 3,
      name: 'Garlic Parmesan Fries',
      description: 'Crisp fries tossed in garlic butter, parsley, parmesan dust, and served with aioli.',
      image_url:
        'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80',
      badge: 'Shareable',
      price: 'PHP 220',
      is_available: true,
      is_featured: false,
    },
  ],
};
