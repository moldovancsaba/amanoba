import { existsSync, readFileSync } from 'node:fs';

type Manifest = {
  gdsVersion: string;
  supportedEntryPoints?: string[];
  localAdapters?: Array<{ contract: string; path: string }>;
  approvedExceptions?: Array<{ surface: string; reason?: string }>;
  migrationStatus?: string;
};

function readText(path: string) {
  return readFileSync(path, 'utf8');
}

function requireFile(path: string, findings: string[], label: string) {
  if (!existsSync(path)) {
    findings.push(`${label}: missing \`${path}\``);
  }
}

function requireIncludes(text: string, needle: string, findings: string[], label: string) {
  if (!text.includes(needle)) {
    findings.push(`${label}: expected to reference \`${needle}\``);
  }
}

function main() {
  const manifestPath = 'gds-adoption.json';
  if (!existsSync(manifestPath)) {
    console.error(`Missing GDS adoption manifest: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(readText(manifestPath)) as Manifest;
  const findings: string[] = [];

  const requiredDocs = [
    'docs/product/DESIGN_UPDATE.md',
    'docs/product/PATTERN_CONTRACT_INVENTORY.md',
    'docs/product/GDS_ADOPTION_MANIFEST.md',
    'docs/product/GDS_EXCEPTION_REGISTER.md',
    'docs/core/CODING_STANDARDS.md',
    'READMEDEV.md',
    'package.json',
  ];

  for (const path of requiredDocs) {
    requireFile(path, findings, 'Required doc');
  }

  for (const adapter of manifest.localAdapters ?? []) {
    requireFile(adapter.path, findings, `Local adapter ${adapter.contract}`);
  }

  const designUpdate = readText('docs/product/DESIGN_UPDATE.md');
  const patternInventory = readText('docs/product/PATTERN_CONTRACT_INVENTORY.md');
  const adoptionManifest = readText('docs/product/GDS_ADOPTION_MANIFEST.md');
  const exceptionRegister = readText('docs/product/GDS_EXCEPTION_REGISTER.md');
  const codingStandards = readText('docs/core/CODING_STANDARDS.md');
  const readmeDev = readText('READMEDEV.md');
  const packageJson = readText('package.json');

  requireIncludes(designUpdate, manifest.gdsVersion, findings, 'Design update');
  requireIncludes(patternInventory, manifest.gdsVersion, findings, 'Pattern inventory');
  requireIncludes(adoptionManifest, manifest.gdsVersion, findings, 'Adoption manifest');
  requireIncludes(adoptionManifest, 'gds-adoption.json', findings, 'Adoption manifest');
  requireIncludes(exceptionRegister, 'gds-adoption.json', findings, 'Exception register');
  requireIncludes(codingStandards, 'npm run ui:check:gds', findings, 'Coding standards');
  requireIncludes(readmeDev, 'npm run ui:check:gds', findings, 'READMEDEV');
  requireIncludes(packageJson, '"ui:check:gds-adoption"', findings, 'package.json');
  requireIncludes(packageJson, '"ui:check:gds"', findings, 'package.json');
  requireIncludes(packageJson, '"ui:gds:check"', findings, 'package.json');
  requireIncludes(packageJson, '@doneisbetter/gds-theme', findings, 'package.json');
  requireIncludes(packageJson, '@doneisbetter/gds-core', findings, 'package.json');
  requireIncludes(packageJson, 'releases/download/gds-v2.6.1', findings, 'package.json');
  if (packageJson.includes('@gds/')) {
    findings.push('package.json: remove legacy @gds/* dependencies; use @doneisbetter/* only');
  }
  if (packageJson.includes('file:../GENERAL_DESIGN_SYSTEM/packages/')) {
    findings.push('package.json: remove sibling file: GDS installs; use approved release asset tarballs until npm publication is live');
  }

  for (const adapter of manifest.localAdapters ?? []) {
    requireIncludes(patternInventory, adapter.path, findings, `Pattern inventory (${adapter.contract})`);
  }

  if (manifest.migrationStatus !== 'enforced') {
    findings.push(`Manifest migrationStatus should be \`enforced\`, got \`${manifest.migrationStatus ?? 'missing'}\``);
  }

  if (findings.length > 0) {
    console.error('GDS adoption check failed:');
    for (const finding of findings) {
      console.error(`- ${finding}`);
    }
    process.exit(1);
  }

  console.log('✅ GDS adoption check passed.');
}

main();
