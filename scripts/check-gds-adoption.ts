import { existsSync, readFileSync } from 'node:fs';

type Manifest = {
  sharedSsotPath: string;
  sharedSsotRepoUrl: string;
  alignedGdsVersion: string;
  alignedGdsDate: string;
  localDocs: Record<string, string>;
  themeAndProviders: string[];
  serverTokenSources: string[];
  legacyCssSupportFiles: string[];
  patternContracts: Array<{ id: string; paths: string[] }>;
  mantineOnlyFiles: string[];
  forbiddenImports: string[];
  documentedExceptions: Array<{ id: string; filePaths: string[] }>;
};

function readText(path: string) {
  return readFileSync(path, 'utf8');
}

function requireFile(path: string, findings: string[], context: string) {
  if (!existsSync(path)) {
    findings.push(`${context}: missing required path \`${path}\``);
  }
}

function requireIncludes(text: string, needle: string, findings: string[], context: string) {
  if (!text.includes(needle)) {
    findings.push(`${context}: expected to reference \`${needle}\``);
  }
}

function main() {
  const manifestPath = 'config/gds-adoption.json';
  if (!existsSync(manifestPath)) {
    console.error(`Missing GDS adoption manifest: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(readText(manifestPath)) as Manifest;
  const findings: string[] = [];

  const localDocPaths = Object.values(manifest.localDocs);
  for (const path of localDocPaths) {
    requireFile(path, findings, 'Local docs');
  }

  for (const path of manifest.themeAndProviders) {
    requireFile(path, findings, 'Theme/provider');
  }

  for (const path of manifest.serverTokenSources) {
    requireFile(path, findings, 'Server token source');
  }

  for (const path of manifest.legacyCssSupportFiles) {
    requireFile(path, findings, 'Legacy CSS support file');
  }

  for (const contract of manifest.patternContracts) {
    for (const path of contract.paths) {
      requireFile(path, findings, `Pattern contract ${contract.id}`);
    }
  }

  for (const path of manifest.mantineOnlyFiles) {
    requireFile(path, findings, 'Mantine-only protected file');
  }

  for (const exception of manifest.documentedExceptions) {
    for (const path of exception.filePaths) {
      requireFile(path, findings, `Documented exception ${exception.id}`);
    }
  }

  const designUpdatePath = manifest.localDocs.designUpdate;
  const patternInventoryPath = manifest.localDocs.patternInventory;
  const adoptionManifestDocPath = manifest.localDocs.adoptionManifest;
  const exceptionRegisterPath = manifest.localDocs.exceptionRegister;

  const designUpdate = existsSync(designUpdatePath) ? readText(designUpdatePath) : '';
  const patternInventory = existsSync(patternInventoryPath) ? readText(patternInventoryPath) : '';
  const adoptionManifestDoc = existsSync(adoptionManifestDocPath) ? readText(adoptionManifestDocPath) : '';
  const exceptionRegister = existsSync(exceptionRegisterPath) ? readText(exceptionRegisterPath) : '';
  const codingStandards = existsSync('docs/core/CODING_STANDARDS.md') ? readText('docs/core/CODING_STANDARDS.md') : '';
  const readmeDev = existsSync('READMEDEV.md') ? readText('READMEDEV.md') : '';
  const packageJson = existsSync('package.json') ? readText('package.json') : '';

  requireIncludes(designUpdate, manifest.alignedGdsVersion, findings, 'Design update');
  requireIncludes(designUpdate, manifest.alignedGdsDate, findings, 'Design update');
  requireIncludes(designUpdate, manifest.localDocs.exceptionRegister, findings, 'Design update');
  requireIncludes(designUpdate, manifest.localDocs.adoptionManifest, findings, 'Design update');

  requireIncludes(adoptionManifestDoc, manifest.alignedGdsVersion, findings, 'Adoption manifest doc');
  requireIncludes(adoptionManifestDoc, manifest.alignedGdsDate, findings, 'Adoption manifest doc');
  requireIncludes(adoptionManifestDoc, manifest.sharedSsotPath, findings, 'Adoption manifest doc');
  requireIncludes(adoptionManifestDoc, manifest.sharedSsotRepoUrl, findings, 'Adoption manifest doc');
  requireIncludes(adoptionManifestDoc, manifest.localDocs.exceptionRegister, findings, 'Adoption manifest doc');

  requireIncludes(codingStandards, 'npm run ui:check:gds', findings, 'Coding standards');
  requireIncludes(readmeDev, 'npm run ui:check:gds', findings, 'READMEDEV');
  requireIncludes(packageJson, '"ui:check:gds"', findings, 'package.json');
  requireIncludes(packageJson, '"ui:check:gds-adoption"', findings, 'package.json');
  requireIncludes(designUpdate, manifest.sharedSsotRepoUrl, findings, 'Design update');

  for (const contract of manifest.patternContracts) {
    for (const path of contract.paths) {
      requireIncludes(patternInventory, path, findings, `Pattern inventory (${contract.id})`);
      requireIncludes(adoptionManifestDoc, path, findings, `Adoption manifest doc (${contract.id})`);
    }
  }

  for (const path of manifest.themeAndProviders) {
    requireIncludes(designUpdate, path, findings, 'Design update');
    requireIncludes(adoptionManifestDoc, path, findings, 'Adoption manifest doc');
  }

  for (const path of manifest.serverTokenSources) {
    requireIncludes(designUpdate, path, findings, 'Design update');
  }

  for (const path of manifest.legacyCssSupportFiles) {
    requireIncludes(designUpdate, path, findings, 'Design update');
  }

  for (const path of manifest.mantineOnlyFiles) {
    requireIncludes(adoptionManifestDoc, path, findings, 'Adoption manifest doc');
  }

  for (const specifier of manifest.forbiddenImports) {
    requireIncludes(adoptionManifestDoc, specifier, findings, 'Adoption manifest doc');
  }

  for (const exception of manifest.documentedExceptions) {
    requireIncludes(exceptionRegister, exception.id, findings, 'Exception register');
    requireIncludes(adoptionManifestDoc, exception.id, findings, 'Adoption manifest doc');
    for (const path of exception.filePaths) {
      requireIncludes(exceptionRegister, path, findings, `Exception register (${exception.id})`);
    }
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
