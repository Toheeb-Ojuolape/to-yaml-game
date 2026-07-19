import type { Sample } from "../types";

export const samples: Sample[] = [
  // ── Novice: flat objects, 2-4 keys, primitives only ──
  {
    id: 1,
    title: "User handle",
    tier: "novice",
    json: { business: "acme", is_registered: true },
  },
  {
    id: 2,
    title: "RGB color",
    tier: "novice",
    json: { name: "Sunset Orange", hex: "#ff7043" },
  },
  {
    id: 3,
    title: "Point in space",
    tier: "novice",
    json: { x: 12, y: -4, z: 0 },
  },
  {
    id: 4,
    title: "Light switch",
    tier: "novice",
    json: { room: "kitchen", on: false, brightness: 80 },
  },
  {
    id: 5,
    title: "Book stub",
    tier: "novice",
    json: { title: "Dune", author: "Frank Herbert", year: 1965 },
  },

  // ── Apprentice: one nesting level, one array of primitives, nulls ──
  {
    id: 6,
    title: "Product listing",
    tier: "apprentice",
    json: {
      sku: "TSHIRT-BLK-M",
      price: 24.99,
      inStock: true,
      tags: ["apparel", "cotton", "unisex"],
    },
  },
  {
    id: 7,
    title: "Blog post",
    tier: "apprentice",
    json: {
      slug: "hello-world",
      published: true,
      views: 1042,
      editor: null,
    },
  },
  {
    id: 8,
    title: "Feature flags",
    tier: "apprentice",
    json: {
      service: "checkout",
      flags: {
        darkMode: true,
        betaCheckout: false,
      },
    },
  },
  {
    id: 9,
    title: "Playlist",
    tier: "apprentice",
    json: {
      name: "Focus",
      tracks: ["Clair de Lune", "Weightless", "River Flows in You"],
      shuffle: false,
    },
  },
  {
    id: 10,
    title: "Weather reading",
    tier: "apprentice",
    json: {
      city: "Lagos",
      tempC: 29.5,
      condition: "Humid",
      alerts: null,
    },
  },

  // ── Expert: nested objects, arrays of objects, mixed types, empty edge cases ──
  {
    id: 11,
    title: "Order summary",
    tier: "expert",
    json: {
      orderId: "A-2291",
      customer: { name: "Wale Adisa", vip: true },
      items: [
        { sku: "MUG-01", qty: 2 },
        { sku: "PEN-07", qty: 1 },
      ],
    },
  },
  {
    id: 12,
    title: "Address book entry",
    tier: "expert",
    json: {
      contact: "Nkechi Obi",
      phones: ["+234-801-555-0142"],
      address: {
        city: "Abuja",
        zip: "900001",
      },
      notes: [],
    },
  },
  {
    id: 13,
    title: "Server health",
    tier: "expert",
    json: {
      host: "api-03",
      status: "degraded",
      metrics: { cpu: 0.82, memory: 0.61 },
      lastIncident: null,
      tags: [],
    },
  },
  {
    id: 14,
    title: "Recipe",
    tier: "expert",
    json: {
      name: "Jollof Rice",
      servings: 4,
      ingredients: [
        { item: "rice", amount: "3 cups" },
        { item: "tomato", amount: "6" },
      ],
      vegetarian: true,
    },
  },
  {
    id: 15,
    title: "Team roster",
    tier: "expert",
    json: {
      team: "Platform",
      lead: { name: "Ifeoma Chukwu", email: "ifeoma@example.com" },
      members: ["Tobi", "Sade", "Chidi"],
      openRoles: 0,
    },
  },

  // ── Master: deep nesting, arrays of arrays/mixed objects, special characters ──
  {
    id: 16,
    title: "API response",
    tier: "master",
    json: {
      status: 200,
      data: {
        user: {
          id: 88,
          bio: "Backend engineer: loves Go & coffee",
          social: { twitter: "@arclight", github: null },
        },
        permissions: ["read", "write"],
      },
      meta: { requestId: "f3d9-01", cached: false },
    },
  },
  {
    id: 17,
    title: "CI pipeline",
    tier: "master",
    json: {
      pipeline: "deploy-prod",
      triggers: ["push", "tag"],
      jobs: [
        { name: "build", steps: ["install", "compile"] },
        { name: "test", steps: ["unit", "integration"] },
      ],
      env: { NODE_ENV: "production", DEBUG: false },
    },
  },
  {
    id: 18,
    title: "File tree",
    tier: "master",
    json: {
      name: "src",
      type: "directory",
      children: [
        { name: "index.ts", type: "file", size: 512 },
        {
          name: "lib",
          type: "directory",
          children: [{ name: "yaml.ts", type: "file", size: 1203 }],
        },
      ],
    },
  },
  {
    id: 19,
    title: "Matrix grid",
    tier: "master",
    json: {
      label: "identity-3x3",
      rows: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      determinant: 1,
    },
  },
  {
    id: 20,
    title: "Invoice",
    tier: "master",
    json: {
      invoiceNo: "INV-3321",
      billTo: {
        name: "Chidinma & Co.",
        note: 'Ref: "Q3 contract"',
      },
      lineItems: [
        { desc: "Consulting", hours: 12.5, rate: 85 },
        { desc: "Support", hours: -2, rate: 85 },
      ],
      totalDue: 867.5,
      paid: false,
    },
  },
];

export function sampleForLevel(id: number): Sample | undefined {
  return samples.find((s) => s.id === id);
}
