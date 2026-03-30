import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import config from '../src/config/index.js';
import User from '../src/modules/user/model.js';
import Product from '../src/modules/product/model.js';

const products = [
  {
    name: 'Chicken Shawarma Plate',
    description:
      'Tender marinated chicken shawarma served with garlic sauce, pickles, fresh salad, and warm pita bread. A classic Middle Eastern favorite.',
    price: 12.99,
    category: 'Main Course',
    stock: 50,
    images: [
      {
        url: 'https://placehold.co/600x600/f97316/white?text=Shawarma',
        publicId: 'seed-shawarma',
      },
    ],
    ratings: { average: 4.7, count: 128 },
  },
  {
    name: 'Lamb Kofta Kebab',
    description:
      'Juicy grilled lamb kofta seasoned with aromatic spices, served on a bed of saffron rice with grilled vegetables and tahini sauce.',
    price: 15.49,
    category: 'Main Course',
    stock: 35,
    images: [
      {
        url: 'https://placehold.co/600x600/ef4444/white?text=Kofta',
        publicId: 'seed-kofta',
      },
    ],
    ratings: { average: 4.5, count: 95 },
  },
  {
    name: 'Falafel Wrap',
    description:
      'Crispy homemade falafel wrapped in warm flatbread with hummus, pickled turnips, fresh tomatoes, and tangy tahini dressing.',
    price: 8.99,
    category: 'Wraps',
    stock: 80,
    images: [
      {
        url: 'https://placehold.co/600x600/22c55e/white?text=Falafel',
        publicId: 'seed-falafel',
      },
    ],
    ratings: { average: 4.3, count: 210 },
  },
  {
    name: 'Hummus with Pita',
    description:
      'Creamy house-made hummus drizzled with olive oil and paprika, served with warm freshly baked pita bread. Perfect as a starter or snack.',
    price: 6.49,
    category: 'Appetizers',
    stock: 100,
    images: [
      {
        url: 'https://placehold.co/600x600/eab308/white?text=Hummus',
        publicId: 'seed-hummus',
      },
    ],
    ratings: { average: 4.6, count: 175 },
  },
  {
    name: 'Grilled Chicken Platter',
    description:
      'Half chicken marinated in a blend of herbs and spices, grilled to perfection. Served with rice, coleslaw, and garlic aioli.',
    price: 14.99,
    category: 'Main Course',
    stock: 40,
    images: [
      {
        url: 'https://placehold.co/600x600/3b82f6/white?text=Chicken',
        publicId: 'seed-chicken',
      },
    ],
    ratings: { average: 4.8, count: 312 },
  },
  {
    name: 'Beef Burger Deluxe',
    description:
      'Premium angus beef patty topped with cheddar cheese, caramelized onions, lettuce, tomato, and our signature sauce on a brioche bun.',
    price: 11.99,
    category: 'Burgers',
    stock: 60,
    images: [
      {
        url: 'https://placehold.co/600x600/a855f7/white?text=Burger',
        publicId: 'seed-burger',
      },
    ],
    ratings: { average: 4.4, count: 156 },
  },
  {
    name: 'Mixed Grill Feast',
    description:
      'A generous platter of grilled chicken, lamb chops, kofta, and shish tawook. Served with hummus, tabbouleh, and grilled pita.',
    price: 24.99,
    category: 'Main Course',
    stock: 20,
    images: [
      {
        url: 'https://placehold.co/600x600/ec4899/white?text=Mixed+Grill',
        publicId: 'seed-mixedgrill',
      },
    ],
    ratings: { average: 4.9, count: 88 },
  },
  {
    name: 'Caesar Salad',
    description:
      'Crisp romaine lettuce with parmesan shavings, crunchy croutons, and classic creamy Caesar dressing. Add grilled chicken for an extra charge.',
    price: 7.99,
    category: 'Salads',
    stock: 70,
    images: [
      {
        url: 'https://placehold.co/600x600/14b8a6/white?text=Salad',
        publicId: 'seed-salad',
      },
    ],
    ratings: { average: 4.1, count: 67 },
  },
  {
    name: 'Mango Lassi',
    description:
      'Refreshing yogurt-based drink blended with ripe Alphonso mangoes, a hint of cardamom, and a touch of honey. Served chilled.',
    price: 4.99,
    category: 'Beverages',
    stock: 120,
    images: [
      {
        url: 'https://placehold.co/600x600/f59e0b/white?text=Lassi',
        publicId: 'seed-lassi',
      },
    ],
    ratings: { average: 4.5, count: 143 },
  },
  {
    name: 'Baklava Box (6 pcs)',
    description:
      'Layers of flaky phyllo dough filled with crushed pistachios and walnuts, sweetened with fragrant rose-water syrup. Box of 6 pieces.',
    price: 9.99,
    category: 'Desserts',
    stock: 45,
    images: [
      {
        url: 'https://placehold.co/600x600/d946ef/white?text=Baklava',
        publicId: 'seed-baklava',
      },
    ],
    ratings: { average: 4.7, count: 201 },
  },
  {
    name: 'Crispy Loaded Fries',
    description:
      'Golden crispy fries loaded with melted cheese, jalapeños, sour cream, and your choice of shawarma chicken or ground beef topping.',
    price: 7.49,
    category: 'Sides',
    stock: 90,
    images: [
      {
        url: 'https://placehold.co/600x600/f43f5e/white?text=Fries',
        publicId: 'seed-fries',
      },
    ],
    ratings: { average: 4.2, count: 98 },
  },
  {
    name: 'Turkish Tea Set',
    description:
      'Traditional double-brewed Turkish black tea served in authentic tulip glasses with sugar cubes. Set includes a pot for two.',
    price: 3.99,
    category: 'Beverages',
    stock: 150,
    images: [
      {
        url: 'https://placehold.co/600x600/0ea5e9/white?text=Tea',
        publicId: 'seed-tea',
      },
    ],
    ratings: { average: 4.0, count: 54 },
  },
];

const seed = async () => {
  try {
    await mongoose.connect(config.mongo.uri);
    console.log('Connected to MongoDB');

    // Find or create a seed admin user
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@wajbakit_proto.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Created admin user: admin@wajbakit_proto.com / admin123');
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert with createdBy reference
    const docs = products.map((p) => ({ ...p, createdBy: admin._id }));
    await Product.insertMany(docs);
    console.log(`Seeded ${docs.length} products`);

    await mongoose.disconnect();
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
