import type { LevelSlot, Sample } from "../types";
import type { Rng } from "../lib/rng";
import { pick, pickN, randBool, randFloat, randInt, titleCase } from "../lib/rng";
import {
  ADJECTIVES,
  CITIES,
  COLOR_NOUNS,
  DB_ADAPTERS,
  DISH_NOUNS,
  FIRST_NAMES,
  HOBBIES,
  IMAGE_NAMES,
  INGREDIENTS,
  LAST_NAMES,
  MOOD_NOUNS,
  NODE_VERSIONS,
  NOUNS,
  PACKAGE_NAMES,
  PRODUCT_SKUS,
  ROOMS,
  TAG_WORDS,
  TEAM_NAMES,
  TRACK_NAMES,
  WEATHER_CONDITIONS,
} from "./pools";

function twoWord(rng: Rng, a: readonly string[], b: readonly string[]) {
  return `${titleCase(pick(rng, a))} ${titleCase(pick(rng, b))}`;
}

function personName(rng: Rng) {
  return `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`;
}

function hexColor(rng: Rng) {
  return `#${randInt(rng, 0, 0xffffff).toString(16).padStart(6, "0")}`;
}

function determinant3x3(m: number[][]): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

export const levelSlots: LevelSlot[] = [
  // ── Novice: flat objects, 2-4 keys, primitives only ──
  {
    id: 1,
    title: "User handle",
    tier: "novice",
    generate: (rng) => ({
      json: { business: twoWord(rng, ADJECTIVES, NOUNS), is_registered: randBool(rng) },
    }),
  },
  {
    id: 2,
    title: "RGB color",
    tier: "novice",
    generate: (rng) => ({
      json: { name: twoWord(rng, ADJECTIVES, COLOR_NOUNS), hex: hexColor(rng) },
    }),
  },
  {
    id: 3,
    title: "Point in space",
    tier: "novice",
    generate: (rng) => ({
      json: { x: randInt(rng, -50, 50), y: randInt(rng, -50, 50), z: randInt(rng, -50, 50) },
    }),
  },
  {
    id: 4,
    title: "Light switch",
    tier: "novice",
    generate: (rng) => ({
      json: { room: pick(rng, ROOMS), on: randBool(rng), brightness: randInt(rng, 0, 100) },
    }),
  },
  {
    id: 5,
    title: "Book stub",
    tier: "novice",
    generate: (rng) => ({
      json: {
        title: twoWord(rng, ADJECTIVES, NOUNS),
        author: personName(rng),
        year: randInt(rng, 1900, 2024),
      },
    }),
  },

  // ── Apprentice: one nesting level, one array of primitives, nulls ──
  {
    id: 6,
    title: "Product listing",
    tier: "apprentice",
    generate: (rng) => ({
      json: {
        sku: `${pick(rng, ["TSHIRT", "MUG", "HAT", "BAG", "PEN", "BOOK"])}-${pick(rng, ["BLK", "WHT", "RED", "BLU"])}-${pick(rng, ["S", "M", "L", "XL"])}`,
        price: randFloat(rng, 4.99, 199.99),
        inStock: randBool(rng),
        tags: pickN(rng, TAG_WORDS, 3),
      },
    }),
  },
  {
    id: 7,
    title: "Blog post",
    tier: "apprentice",
    generate: (rng) => ({
      json: {
        slug: `${pick(rng, ADJECTIVES)}-${pick(rng, NOUNS)}`,
        published: randBool(rng),
        views: randInt(rng, 0, 50000),
        editor: null,
      },
    }),
  },
  {
    id: 8,
    title: "Feature flags",
    tier: "apprentice",
    generate: (rng) => ({
      json: {
        service: pick(rng, TEAM_NAMES).toLowerCase(),
        flags: { darkMode: randBool(rng), betaCheckout: randBool(rng) },
        rolloutPercent: randInt(rng, 0, 100),
      },
    }),
  },
  {
    id: 9,
    title: "Playlist",
    tier: "apprentice",
    generate: (rng) => ({
      json: {
        name: twoWord(rng, ADJECTIVES, MOOD_NOUNS),
        tracks: pickN(rng, TRACK_NAMES, 3),
        shuffle: randBool(rng),
      },
    }),
  },
  {
    id: 10,
    title: "Weather reading",
    tier: "apprentice",
    generate: (rng) => ({
      json: {
        city: pick(rng, CITIES),
        tempC: randFloat(rng, -5, 42, 1),
        condition: pick(rng, WEATHER_CONDITIONS),
        alerts: null,
      },
    }),
  },

  // ── Expert: nested objects, arrays of objects, mixed types, empty edge cases ──
  {
    id: 11,
    title: "Order summary",
    tier: "expert",
    generate: (rng) => ({
      json: {
        orderId: `${pick(rng, ["A", "B", "C", "D"])}-${randInt(rng, 1000, 9999)}`,
        customer: { name: personName(rng), vip: randBool(rng) },
        items: pickN(rng, PRODUCT_SKUS, 2).map((sku) => ({ sku, qty: randInt(rng, 1, 5) })),
      },
    }),
  },
  {
    id: 12,
    title: "Address book entry",
    tier: "expert",
    generate: (rng) => ({
      json: {
        contact: personName(rng),
        phones: [`+234-${randInt(rng, 700, 909)}-555-${randInt(rng, 1000, 9999)}`],
        address: { city: pick(rng, CITIES), zip: String(randInt(rng, 100000, 999999)) },
        notes: [],
      },
    }),
  },
  {
    id: 13,
    title: "Server health",
    tier: "expert",
    generate: (rng) => ({
      json: {
        host: `${pick(rng, ["api", "web", "db", "cache", "worker"])}-${randInt(rng, 1, 20)}`,
        status: pick(rng, ["healthy", "degraded", "down"]),
        metrics: { cpu: randFloat(rng, 0, 1, 2), memory: randFloat(rng, 0, 1, 2) },
        lastIncident: null,
        tags: [],
      },
    }),
  },
  {
    id: 14,
    title: "Recipe",
    tier: "expert",
    generate: (rng) => ({
      json: {
        name: `${titleCase(pick(rng, ADJECTIVES))} ${pick(rng, DISH_NOUNS)}`,
        servings: randInt(rng, 1, 12),
        ingredients: pickN(rng, INGREDIENTS, 2),
        vegetarian: randBool(rng),
      },
    }),
  },
  {
    id: 15,
    title: "Team roster",
    tier: "expert",
    generate: (rng) => {
      const lead = personName(rng);
      return {
        json: {
          team: pick(rng, TEAM_NAMES),
          lead: { name: lead, email: `${lead.split(" ")[0].toLowerCase()}@example.com` },
          members: pickN(rng, FIRST_NAMES, 3),
          openRoles: randInt(rng, 0, 5),
        },
      };
    },
  },

  // ── Master: deep nesting, arrays of arrays/mixed objects, special characters ──
  {
    id: 16,
    title: "API response",
    tier: "master",
    generate: (rng) => {
      const [hobbyA, hobbyB] = pickN(rng, HOBBIES, 2);
      const role = pick(rng, [
        "Backend engineer",
        "Frontend engineer",
        "Platform engineer",
        "Data engineer",
        "DevOps engineer",
      ]);
      const handle = `${pick(rng, ADJECTIVES)}${pick(rng, NOUNS)}`;
      return {
        json: {
          status: pick(rng, [200, 201, 404, 500, 403]),
          data: {
            user: {
              id: randInt(rng, 1, 999),
              bio: `${role}: loves ${hobbyA} & ${hobbyB}`,
              social: { twitter: `@${handle}`, github: randBool(rng) ? handle : null },
            },
            permissions: pickN(rng, ["read", "write", "admin", "delete"], 2),
          },
          meta: {
            requestId: `${pick(rng, ["a1", "b2", "c3", "d4", "e5"])}-${randInt(rng, 10, 99)}`,
            cached: randBool(rng),
          },
        },
      };
    },
  },
  {
    id: 17,
    title: "CI pipeline",
    tier: "master",
    generate: (rng) => ({
      json: {
        pipeline: `${pick(rng, ["deploy", "build", "release", "publish"])}-${pick(rng, ["prod", "staging", "dev"])}`,
        triggers: pickN(rng, ["push", "tag", "pull_request", "schedule"], 2),
        jobs: [
          { name: "build", steps: pickN(rng, ["install", "compile", "lint", "bundle"], 2) },
          { name: "test", steps: pickN(rng, ["unit", "integration", "e2e", "smoke"], 2) },
        ],
        env: { NODE_ENV: pick(rng, ["production", "staging"]), DEBUG: randBool(rng) },
      },
    }),
  },
  {
    id: 18,
    title: "File tree",
    tier: "master",
    generate: (rng) => {
      const ext = pick(rng, ["ts", "js", "py", "go", "rs"]);
      const rootName = pick(rng, ["src", "lib", "app", "core"]);
      const subDir = pick(rng, ["lib", "utils", "helpers", "shared"]);
      const [fileA, fileB] = pickN(rng, NOUNS, 2).map((n) => `${n}.${ext}`);
      return {
        json: {
          name: rootName,
          type: "directory",
          children: [
            { name: fileA, type: "file", size: randInt(rng, 128, 4096) },
            {
              name: subDir,
              type: "directory",
              children: [{ name: fileB, type: "file", size: randInt(rng, 128, 4096) }],
            },
          ],
        },
      };
    },
  },
  {
    id: 19,
    title: "Matrix grid",
    tier: "master",
    generate: (rng) => {
      const rows = [
        [randInt(rng, -3, 3), randInt(rng, -3, 3), randInt(rng, -3, 3)],
        [randInt(rng, -3, 3), randInt(rng, -3, 3), randInt(rng, -3, 3)],
        [randInt(rng, -3, 3), randInt(rng, -3, 3), randInt(rng, -3, 3)],
      ];
      return {
        json: {
          label: `${pick(rng, ["sample", "test", "custom", "random"])}-3x3`,
          rows,
          determinant: determinant3x3(rows),
        },
      };
    },
  },
  {
    id: 20,
    title: "Invoice",
    tier: "master",
    generate: (rng) => {
      const company = twoWord(rng, ADJECTIVES, NOUNS);
      const [desc1, desc2] = pickN(rng, ["Consulting", "Support", "Design", "Development", "Training"], 2);
      const hours1 = randFloat(rng, 1, 40, 1);
      const hours2 = randFloat(rng, -5, 40, 1);
      const rate = randInt(rng, 50, 150);
      const totalDue = Math.round((hours1 + hours2) * rate * 100) / 100;
      return {
        json: {
          invoiceNo: `INV-${randInt(rng, 1000, 9999)}`,
          billTo: { name: `${company} & Co.`, note: `Ref: "Q${randInt(rng, 1, 4)} contract"` },
          lineItems: [
            { desc: desc1, hours: hours1, rate },
            { desc: desc2, hours: hours2, rate },
          ],
          totalDue,
          paid: randBool(rng),
        },
      };
    },
  },

  // ── Config Reader: real-world GitHub Actions & Docker Compose YAML, shown as YAML → JSON ──
  {
    id: 21,
    title: "CI trigger",
    tier: "reader",
    direction: "yamlToJson",
    generate: (rng) => {
      const workflowName = pick(rng, ["CI", "Build", "Test Suite", "Pipeline", "Checks"]);
      const branch = pick(rng, ["main", "master", "develop", "release", "trunk"]);
      const testCmd = pick(rng, [
        "npm test",
        "npm run test",
        "pytest",
        "make test",
        "yarn test",
        "go test ./...",
      ]);
      const jobName = pick(rng, ["build", "ci", "test", "verify"]);
      const runsOn = pick(rng, ["ubuntu-latest", "ubuntu-22.04", "macos-latest"]);
      const checkoutVersion = pick(rng, ["v3", "v4"]);
      const json = {
        name: workflowName,
        on: { push: { branches: [branch] } },
        jobs: {
          [jobName]: {
            "runs-on": runsOn,
            steps: [{ uses: `actions/checkout@${checkoutVersion}` }, { run: testCmd }],
          },
        },
      };
      const yaml = `name: ${workflowName}
on:
  push:
    branches:
      - ${branch}
jobs:
  ${jobName}:
    runs-on: ${runsOn}
    steps:
      - uses: actions/checkout@${checkoutVersion}
      - run: ${testCmd}`;
      return { json, yaml };
    },
  },
  {
    id: 22,
    title: "Compose service",
    tier: "reader",
    direction: "yamlToJson",
    generate: (rng) => {
      const image = pick(rng, IMAGE_NAMES);
      const tag = pick(rng, ["latest", "alpine", "1.0", "2.4", "stable"]);
      const port = pick(rng, [80, 8080, 3000, 5000, 9000]);
      const env = pick(rng, ["production", "development", "staging", "test"]);
      const composeVersion = pick(rng, ["3.8", "3.9", "3.7"]);
      const json = {
        version: composeVersion,
        services: {
          web: { image: `${image}:${tag}`, ports: [`${port}:${port}`], environment: { NODE_ENV: env } },
        },
      };
      const yaml = `version: "${composeVersion}"
services:
  web:
    image: ${image}:${tag}
    ports:
      - "${port}:${port}"
    environment:
      NODE_ENV: ${env}`;
      return { json, yaml };
    },
  },
  {
    id: 23,
    title: "Matrix build",
    tier: "reader",
    direction: "yamlToJson",
    generate: (rng) => {
      const versions = pickN(rng, NODE_VERSIONS, 3);
      const runsOn = pick(rng, ["ubuntu-latest", "ubuntu-22.04"]);
      const jobName = pick(rng, ["test", "build", "ci"]);
      const json = {
        jobs: {
          [jobName]: {
            "runs-on": runsOn,
            strategy: { matrix: { "node-version": versions } },
            steps: [
              { uses: "actions/setup-node@v4", with: { "node-version": "${{ matrix.node-version }}" } },
            ],
          },
        },
      };
      const yaml = `jobs:
  ${jobName}:
    runs-on: ${runsOn}
    strategy:
      matrix:
        node-version: [${versions.join(", ")}]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}`;
      return { json, yaml };
    },
  },
  {
    id: 24,
    title: "Compose network",
    tier: "reader",
    direction: "yamlToJson",
    generate: (rng) => {
      const apiImage = pick(rng, ["myapp/api", "acme/api", "backend/service", "core/api", "platform/api"]);
      const apiTag = pick(rng, ["1.0", "2.1", "latest", "stable"]);
      const dbImage = pick(rng, ["postgres:16", "mysql:8", "mongo:7", "postgres:15", "mariadb:11"]);
      const volumeName = pick(rng, ["db_data", "app_data", "cache_data", "pg_data"]);
      const mountPath = pick(rng, ["/var/lib/data", "/data", "/var/lib/postgresql/data", "/mnt/data"]);
      const json = {
        services: {
          api: {
            image: `${apiImage}:${apiTag}`,
            depends_on: ["db"],
            volumes: [`${volumeName}:${mountPath}`],
          },
          db: { image: dbImage },
        },
        volumes: { [volumeName]: null },
      };
      const yaml = `services:
  api:
    image: ${apiImage}:${apiTag}
    depends_on:
      - db
    volumes:
      - ${volumeName}:${mountPath}
  db:
    image: ${dbImage}
volumes:
  ${volumeName}:`;
      return { json, yaml };
    },
  },
  {
    id: 25,
    title: "Conditional step",
    tier: "reader",
    direction: "yamlToJson",
    generate: (rng) => {
      const stepName = pick(rng, [
        "Notify on failure",
        "Alert team",
        "Send status",
        "Post to Slack",
        "Report failure",
        "Ping oncall",
        "Log failure",
        "Escalate issue",
      ]);
      const condition = pick(rng, ["failure()", "success()", "always()", "cancelled()"]);
      const envVarName = pick(rng, ["SLACK_WEBHOOK", "DISCORD_WEBHOOK", "TEAMS_WEBHOOK", "NOTIFY_URL"]);
      const timeoutMinutes = randInt(rng, 1, 10);
      const json = {
        steps: [
          {
            name: stepName,
            if: condition,
            "timeout-minutes": timeoutMinutes,
            env: { [envVarName]: `\${{ secrets.${envVarName} }}` },
            run: `curl -X POST $${envVarName}`,
          },
        ],
      };
      const yaml = `steps:
  - name: ${stepName}
    if: ${condition}
    timeout-minutes: ${timeoutMinutes}
    env:
      ${envVarName}: \${{ secrets.${envVarName} }}
    run: curl -X POST $${envVarName}`;
      return { json, yaml };
    },
  },

  // ── Wizard: anchors/aliases, merge keys, matrices+conditionals, intrinsic functions, loops ──
  {
    id: 26,
    title: "Shared timeout",
    tier: "wizard",
    direction: "yamlToJson",
    generate: (rng) => {
      const timeout = randInt(rng, 5, 300);
      const retries = randInt(rng, 1, 15);
      const json = {
        base: { timeout, retries },
        service_a: { config: { timeout, retries } },
        service_b: { config: { timeout, retries } },
      };
      const yaml = `base: &base
  timeout: ${timeout}
  retries: ${retries}
service_a:
  config: *base
service_b:
  config: *base`;
      return { json, yaml };
    },
  },
  {
    id: 27,
    title: "Merged environments",
    tier: "wizard",
    direction: "yamlToJson",
    generate: (rng) => {
      const suffixes = ["db", "database", "store", "data"] as const;
      const adapter = pick(rng, DB_ADAPTERS);
      const host = pick(rng, ["localhost", "127.0.0.1", "db.internal", "db-primary", "db.local", "db-host"]);
      const testHost = pick(rng, ["test-host", "test-db", "ci-db", "staging-db", "qa-db", "sandbox-db"]);
      const devDb = `dev_${pick(rng, suffixes)}`;
      const testDb = `test_${pick(rng, suffixes)}`;
      const defaults = { adapter, host };
      const json = {
        defaults,
        development: { ...defaults, database: devDb },
        test: { ...defaults, database: testDb, host: testHost },
      };
      const yaml = `defaults: &defaults
  adapter: ${adapter}
  host: ${host}
development:
  <<: *defaults
  database: ${devDb}
test:
  <<: *defaults
  database: ${testDb}
  host: ${testHost}`;
      return { json, yaml };
    },
  },
  {
    id: 28,
    title: "Matrix with condition",
    tier: "wizard",
    direction: "yamlToJson",
    generate: (rng) => {
      const osList = pickN(
        rng,
        ["ubuntu-latest", "macos-latest", "windows-latest", "ubuntu-22.04", "macos-13", "self-hosted"],
        3
      );
      const eventName = pick(rng, ["pull_request", "push", "workflow_dispatch", "schedule"]);
      const ciValue = randBool(rng);
      const jobName = pick(rng, ["test", "build", "verify", "checks"]);
      const json = {
        env: { CI: ciValue },
        jobs: {
          [jobName]: {
            strategy: { matrix: { os: osList } },
            if: `github.event_name == '${eventName}'`,
            env: { CI: ciValue },
          },
        },
      };
      const yaml = `env: &common_env
  CI: ${ciValue}
jobs:
  ${jobName}:
    strategy:
      matrix:
        os: [${osList.join(", ")}]
    if: github.event_name == '${eventName}'
    env: *common_env`;
      return { json, yaml };
    },
  },
  {
    id: 29,
    title: "CloudFormation logic",
    tier: "wizard",
    direction: "yamlToJson",
    generate: (rng) => {
      const conditionName = pick(rng, ["IsProduction", "IsProd", "IsLive", "IsReleaseEnv"]);
      const paramName = pick(rng, ["Environment", "Stage", "DeployEnv", "EnvName"]);
      const trueValue = pick(rng, ["production", "prod", "live"]);
      const resourceName = pick(rng, ["Bucket", "DataBucket", "AssetBucket", "StorageBucket"]);
      const trueBucketName = pick(rng, ["prod-bucket", "prod-assets", "live-storage"]);
      const falseBucketName = pick(rng, ["dev-bucket", "dev-assets", "staging-storage"]);
      const json = {
        Conditions: { [conditionName]: { "Fn::Equals": [{ Ref: paramName }, trueValue] } },
        Resources: {
          [resourceName]: {
            Type: "AWS::S3::Bucket",
            Properties: { BucketName: { "Fn::If": [conditionName, trueBucketName, falseBucketName] } },
          },
        },
      };
      const yaml = `Conditions:
  ${conditionName}:
    Fn::Equals:
      - Ref: ${paramName}
      - ${trueValue}
Resources:
  ${resourceName}:
    Type: AWS::S3::Bucket
    Properties:
      BucketName:
        Fn::If:
          - ${conditionName}
          - ${trueBucketName}
          - ${falseBucketName}`;
      return { json, yaml };
    },
  },
  {
    id: 30,
    title: "Ansible loop & when",
    tier: "wizard",
    direction: "yamlToJson",
    generate: (rng) => {
      const packages = pickN(rng, PACKAGE_NAMES, 3);
      const osFamily = pick(rng, ["Debian", "RedHat", "Suse", "Alpine"]);
      const taskName = pick(rng, [
        "Install packages",
        "Ensure packages present",
        "Set up dependencies",
        "Install tools",
      ]);
      const module = pick(rng, ["apt", "yum", "package"]);
      const json = {
        tasks: [
          {
            name: taskName,
            [module]: { name: "{{ item }}", state: "present" },
            loop: packages,
            when: `ansible_os_family == "${osFamily}"`,
          },
        ],
      };
      const yaml = `tasks:
  - name: ${taskName}
    ${module}:
      name: "{{ item }}"
      state: present
    loop:
      - ${packages.join("\n      - ")}
    when: ansible_os_family == "${osFamily}"`;
      return { json, yaml };
    },
  },
];

export function resolveLevel(id: number, rng: Rng = Math.random): Sample | undefined {
  const slot = levelSlots.find((s) => s.id === id);
  if (!slot) return undefined;
  const { json, yaml } = slot.generate(rng);
  return { id: slot.id, title: slot.title, tier: slot.tier, direction: slot.direction, json, yaml };
}

export function slotForLevel(id: number): LevelSlot | undefined {
  return levelSlots.find((s) => s.id === id);
}
