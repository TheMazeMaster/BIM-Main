import overlayContent from './overlayContent.js';

const expectedLength = 132;
const expectedFields = 25;

if (!Array.isArray(overlayContent)) {
  console.error('overlayContent is not an array');
  process.exit(1);
}

if (overlayContent.length !== expectedLength) {
  console.error(`overlayContent should have ${expectedLength} entries but has ${overlayContent.length}`);
  process.exit(1);
}

for (let i = 0; i < overlayContent.length; i++) {
  const entry = overlayContent[i];
  if (!Array.isArray(entry) || entry.length !== expectedFields) {
    console.error(`Entry at index ${i} should have ${expectedFields} fields but has ${Array.isArray(entry) ? entry.length : 'not an array'}`);
    process.exit(1);
  }
}

console.log('overlayContent validation passed');
