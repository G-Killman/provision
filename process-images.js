const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const workspaceRoot = __dirname;
const rawImagesRoot = path.join(workspaceRoot, 'raw-images');
const stagingRoot = path.join(workspaceRoot, 'staging');
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp', '.avif']);

const makeSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isImageFile = (fileName) => allowedExtensions.has(path.extname(fileName).toLowerCase());

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      continue;
    }

    const nextToken = argv[index + 1];
    const [key, inlineValue] = token.split('=');
    const normalizedKey = key.replace(/^--/, '');
    args[normalizedKey] = inlineValue || (nextToken && !nextToken.startsWith('--') ? nextToken : true);

    if (!inlineValue && nextToken && !nextToken.startsWith('--')) {
      index += 1;
    }
  }

  return args;
}

function usage() {
  console.log('Usage: npm run process:images -- --source <folder> [--name <output-name>]');
  console.log('Example: npm run process:images -- --source raw-images/gallery-01 --name kitchen-remodel');
}

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function getImageFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && isImageFile(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
}

async function processFolder(sourceFolder, targetFolderName) {
  const targetFolder = path.join(stagingRoot, targetFolderName);
  const imageFiles = await getImageFiles(sourceFolder);
  const sourceFolderName = path.basename(sourceFolder);
  const safeFolderName = makeSlug(targetFolderName || sourceFolderName) || 'gallery';

  await ensureDirectory(targetFolder);

  for (let index = 0; index < imageFiles.length; index += 1) {
    const fileName = imageFiles[index];
    const sourcePath = path.join(sourceFolder, fileName);
    const sequentialNumber = String(index + 1).padStart(3, '0');
    const outputFileName = `${safeFolderName}-${sequentialNumber}.webp`;
    const outputPath = path.join(targetFolder, outputFileName);

    await sharp(sourcePath)
      .resize(800, 800, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82 })
      .toFile(outputPath);
  }

  return {
    folderName: path.basename(sourceFolder),
    targetFolderName,
    imageCount: imageFiles.length,
  };
}

async function main() {
  await ensureDirectory(rawImagesRoot);
  await ensureDirectory(stagingRoot);

  const args = parseArgs(process.argv.slice(2));
  const sourceInput = args.source;
  const customName = args.name;

  if (!sourceInput) {
    usage();
    return;
  }

  const sourceFolder = path.isAbsolute(sourceInput) ? sourceInput : path.join(workspaceRoot, sourceInput);

  try {
    await fs.access(sourceFolder);
  } catch {
    console.log(`Source folder not found: ${sourceInput}`);
    return;
  }

  const folderName = path.basename(sourceFolder);
  const targetFolderName = makeSlug(customName || folderName) || 'gallery';
  const result = await processFolder(sourceFolder, targetFolderName);

  if (result.imageCount === 0) {
    console.log(`No image files found in ${sourceInput}.`);
    return;
  }

  console.log(`Processed ${result.imageCount} images from ${result.folderName} -> staging/${result.targetFolderName}`);
  console.log('Staging is the handoff point. Build the gallery page from there.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
