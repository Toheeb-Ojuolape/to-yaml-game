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
  // ── Config Reader: real-world GitHub Actions & Docker Compose YAML, shown as YAML → JSON ──
  {
    id: 21,
    title: "CI trigger",
    tier: "reader",
    direction: "yamlToJson",
    json: {
      name: "CI",
      on: { push: { branches: ["main"] } },
      jobs: {
        build: {
          "runs-on": "ubuntu-latest",
          steps: [{ uses: "actions/checkout@v4" }, { run: "npm test" }],
        },
      },
    },
    yaml: `name: CI
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test`,
  },
  {
    id: 22,
    title: "Compose service",
    tier: "reader",
    direction: "yamlToJson",
    json: {
      version: "3.8",
      services: {
        web: {
          image: "nginx:latest",
          ports: ["80:80"],
          environment: { NODE_ENV: "production" },
        },
      },
    },
    yaml: `version: "3.8"
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    environment:
      NODE_ENV: production`,
  },
  {
    id: 23,
    title: "Matrix build",
    tier: "reader",
    direction: "yamlToJson",
    json: {
      jobs: {
        test: {
          "runs-on": "ubuntu-latest",
          strategy: { matrix: { "node-version": [18, 20, 22] } },
          steps: [{ uses: "actions/setup-node@v4", with: { "node-version": "${{ matrix.node-version }}" } }],
        },
      },
    },
    yaml: `jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}`,
  },
  {
    id: 24,
    title: "Compose network",
    tier: "reader",
    direction: "yamlToJson",
    json: {
      services: {
        api: {
          image: "myapp/api:1.0",
          depends_on: ["db"],
          volumes: ["db_data:/var/lib/data"],
        },
        db: { image: "postgres:16" },
      },
      volumes: { db_data: null },
    },
    yaml: `services:
  api:
    image: myapp/api:1.0
    depends_on:
      - db
    volumes:
      - db_data:/var/lib/data
  db:
    image: postgres:16
volumes:
  db_data:`,
  },
  {
    id: 25,
    title: "Conditional step",
    tier: "reader",
    direction: "yamlToJson",
    json: {
      steps: [
        {
          name: "Notify on failure",
          if: "failure()",
          env: { SLACK_WEBHOOK: "${{ secrets.SLACK_WEBHOOK }}" },
          run: "curl -X POST $SLACK_WEBHOOK",
        },
      ],
    },
    yaml: `steps:
  - name: Notify on failure
    if: failure()
    env:
      SLACK_WEBHOOK: \${{ secrets.SLACK_WEBHOOK }}
    run: curl -X POST $SLACK_WEBHOOK`,
  },

  // ── Wizard: anchors/aliases, merge keys, matrices+conditionals, intrinsic functions, loops ──
  {
    id: 26,
    title: "Shared timeout",
    tier: "wizard",
    direction: "yamlToJson",
    json: {
      base: { timeout: 30, retries: 3 },
      service_a: { config: { timeout: 30, retries: 3 } },
      service_b: { config: { timeout: 30, retries: 3 } },
    },
    yaml: `base: &base
  timeout: 30
  retries: 3
service_a:
  config: *base
service_b:
  config: *base`,
  },
  {
    id: 27,
    title: "Merged environments",
    tier: "wizard",
    direction: "yamlToJson",
    json: {
      defaults: { adapter: "postgres", host: "localhost" },
      development: { adapter: "postgres", host: "localhost", database: "dev_db" },
      test: { adapter: "postgres", host: "test-host", database: "test_db" },
    },
    yaml: `defaults: &defaults
  adapter: postgres
  host: localhost
development:
  <<: *defaults
  database: dev_db
test:
  <<: *defaults
  database: test_db
  host: test-host`,
  },
  {
    id: 28,
    title: "Matrix with condition",
    tier: "wizard",
    direction: "yamlToJson",
    json: {
      env: { CI: true },
      jobs: {
        test: {
          strategy: { matrix: { os: ["ubuntu-latest", "macos-latest"] } },
          if: "github.event_name == 'pull_request'",
          env: { CI: true },
        },
      },
    },
    yaml: `env: &common_env
  CI: true
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
    if: github.event_name == 'pull_request'
    env: *common_env`,
  },
  {
    id: 29,
    title: "CloudFormation logic",
    tier: "wizard",
    direction: "yamlToJson",
    json: {
      Conditions: {
        IsProduction: { "Fn::Equals": [{ Ref: "Environment" }, "production"] },
      },
      Resources: {
        Bucket: {
          Type: "AWS::S3::Bucket",
          Properties: {
            BucketName: { "Fn::If": ["IsProduction", "prod-bucket", "dev-bucket"] },
          },
        },
      },
    },
    yaml: `Conditions:
  IsProduction:
    Fn::Equals:
      - Ref: Environment
      - production
Resources:
  Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName:
        Fn::If:
          - IsProduction
          - prod-bucket
          - dev-bucket`,
  },
  {
    id: 30,
    title: "Ansible loop & when",
    tier: "wizard",
    direction: "yamlToJson",
    json: {
      tasks: [
        {
          name: "Install packages",
          apt: { name: "{{ item }}", state: "present" },
          loop: ["nginx", "curl", "git"],
          when: 'ansible_os_family == "Debian"',
        },
      ],
    },
    yaml: `tasks:
  - name: Install packages
    apt:
      name: "{{ item }}"
      state: present
    loop:
      - nginx
      - curl
      - git
    when: ansible_os_family == "Debian"`,
  },
];

export function sampleForLevel(id: number): Sample | undefined {
  return samples.find((s) => s.id === id);
}
