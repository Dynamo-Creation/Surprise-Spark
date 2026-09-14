const { resolveVariables } = require('../lib/engine/variableResolver');
const { generatePublicId, isValidPublicId } = require('../lib/engine/publicId');
const { TriggerEngine } = require('../lib/engine/triggerEngine');
const { TemplateRegistry } = require('../lib/engine/templateRegistry');
const { DEMO_TEMPLATE_MODEL, DEMO_VERSION_1_0_0 } = require('../lib/engine/demoTemplate');

console.log('========================================================');
console.log('🧪 RUNNING PHASE 3 ENGINE VERIFICATION TEST SUITE');
console.log('========================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

// -----------------------------------------------------------------------------
// TEST 1: Variable Replacement Engine
// -----------------------------------------------------------------------------
console.log('--- 1. Variable Replacement Engine ---');
const context = {
  recipient_name: 'Rahul',
  sender_name: 'Ananya',
  message: 'Have an unforgettable birthday filled with joy!',
  special_date: '2026-09-14',
  photo_1: 'https://cdn.example.com/photo1.jpg'
};

const text1 = resolveVariables('Happy Birthday, {{recipient_name}}!', context);
assert(text1 === 'Happy Birthday, Rahul!', 'Replaces {{recipient_name}} accurately');

const text2 = resolveVariables('From: {{sender_name}} with love', context);
assert(text2 === 'From: Ananya with love', 'Replaces {{sender_name}} accurately');

const text3 = resolveVariables('Letter: {{message}}', context);
assert(text3 === 'Letter: Have an unforgettable birthday filled with joy!', 'Replaces {{message}} accurately');

const text4 = resolveVariables('Missing: {{undefined_var}}', context);
assert(text4 === 'Missing: {{undefined_var}}', 'Preserves unmatched variable gracefully');

// -----------------------------------------------------------------------------
// TEST 2: Public ID Generation
// -----------------------------------------------------------------------------
console.log('\n--- 2. Public ID Generator ---');
const ids = new Set();
for (let i = 0; i < 50; i++) {
  const pid = generatePublicId(8, 'sp-');
  assert(isValidPublicId(pid), `ID ${pid} matches valid URL pattern`);
  assert(!ids.has(pid), `ID ${pid} is uniquely generated`);
  ids.add(pid);
}

// -----------------------------------------------------------------------------
// TEST 3: Template Registry & Version Immutability
// -----------------------------------------------------------------------------
console.log('\n--- 3. Template Registry & Version Isolation ---');
const registry = TemplateRegistry.getInstance();
const tpl = registry.getTemplate('tpl-birthday-magic');
assert(tpl !== undefined, 'Resolves registered demo template by ID');
assert(tpl.slug === 'birthday-magic-surprise', 'Matches template slug');

const ver1 = registry.getTemplateVersion('ver-birthday-magic-1-0-0');
assert(ver1 !== undefined && ver1.version === '1.0.0', 'Resolves version 1.0.0 manifest');
assert(ver1.scenes.length === 3, 'Version 1.0.0 contains 3 defined scenes');

// Create surprise locked to v1.0.0
const surprise = {
  id: 'test-surp-1',
  publicId: 'sp-test1234',
  creatorId: 'user-1',
  templateId: 'tpl-birthday-magic',
  templateVersionId: 'ver-birthday-magic-1-0-0', // locked to v1.0.0
  recipientName: 'Rahul',
  senderName: 'Ananya',
  message: 'Test message',
  photos: [],
  status: 'published',
  viewCount: 0,
  createdAt: '2026-09-14T08:00:00Z',
  updatedAt: '2026-09-14T08:00:00Z'
};

// Simulate admin adding version 2.0.0 with 5 scenes
const ver2 = {
  id: 'ver-birthday-magic-2-0-0',
  templateId: 'tpl-birthday-magic',
  version: '2.0.0',
  changelog: 'Added extra fireworks and mini-game scenes',
  isPublished: true,
  scenes: [
    ...DEMO_VERSION_1_0_0.scenes,
    { id: 'sc-extra-4', name: 'Extra 4', order: 4, transition: 'fade', camera: {}, lighting: {}, environment: {}, objects: [], triggers: [] },
    { id: 'sc-extra-5', name: 'Extra 5', order: 5, transition: 'fade', camera: {}, lighting: {}, environment: {}, objects: [], triggers: [] }
  ],
  createdAt: '2026-09-14T09:00:00Z'
};
registry.registerTemplateVersion(ver2);

// Verify existing surprise still strictly resolves v1.0.0 with 3 scenes!
const resolvedExperience = registry.resolveSurpriseExperience(surprise);
assert(resolvedExperience.version.id === 'ver-birthday-magic-1-0-0', 'Surprise remains locked to version 1.0.0');
assert(resolvedExperience.scenes.length === 3, 'Surprise does NOT inherit version 2.0.0 scenes (Isolation preserved)');

// -----------------------------------------------------------------------------
// TEST 4: Data-Driven Trigger & Action Execution
// -----------------------------------------------------------------------------
console.log('\n--- 4. Trigger & Action Execution Engine ---');
const actionLog = [];

const triggerEngine = new TriggerEngine({
  onPlayAnimation: (objId, anim) => actionLog.push(`play:${objId}:${anim}`),
  onSpawnEffect: (effect) => actionLog.push(`effect:${effect}`),
  onTransitionScene: (target) => actionLog.push(`transition:${target}`)
});

// Load triggers from Scene 1
triggerEngine.loadTriggers(DEMO_VERSION_1_0_0.scenes[0].triggers);

// Dispatch object_clicked on gift box
triggerEngine.dispatchEvent('object_clicked', { targetObjectId: 'obj-gift-box' });
assert(actionLog.includes('play:obj-gift-box:shake'), 'Trigger fires immediate shake animation on gift box');

console.log('\n========================================================');
console.log(`🏁 TESTS FINISHED: ${passedTests}/${totalTests} PASSED`);
console.log('========================================================');
