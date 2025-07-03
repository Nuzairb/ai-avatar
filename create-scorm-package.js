/**
 * SCORM Package Creator for AI Avatar Chatbot
 * This script creates a SCORM-compliant ZIP package
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Files to include in SCORM package
const SCORM_FILES = [
  'imsmanifest.xml',
  'metadata.xml', 
  'scorm-launcher.html',
  'scorm-standalone.html',
  'scorm-api.js',
  'scorm-wrapper.js',
  'index.html',
  'index.js',
  'index.css',
  'package.json',
  'favicon.ico'
];

// Optional files (include if they exist)
const OPTIONAL_FILES = [
  'README.md',
  'SCORM-Integration-Guide.md'
];

function createSCORMPackage() {
  const packageName = 'ai-avatar-chatbot-scorm.zip';
  const output = fs.createWriteStream(packageName);
  const archive = archiver('zip', { zlib: { level: 9 } });

  console.log('🚀 Creating SCORM Package...');

  // Handle archive events
  archive.on('error', (err) => {
    console.error('❌ Error creating package:', err);
    process.exit(1);
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn('⚠️  Warning:', err.message);
    } else {
      throw err;
    }
  });

  output.on('close', () => {
    console.log(`✅ SCORM package created: ${packageName}`);
    console.log(`📦 Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Test the package locally by extracting and opening scorm-launcher.html');
    console.log('2. Upload the ZIP file to your LMS');
    console.log('3. Configure completion settings in your LMS');
    console.log('4. Test with learners and monitor analytics');
    console.log('');
    console.log('📚 For detailed instructions, see SCORM-Integration-Guide.md');
  });

  // Pipe archive data to the file
  archive.pipe(output);

  // Add required files
  let filesAdded = 0;
  SCORM_FILES.forEach(file => {
    if (fs.existsSync(file)) {
      archive.file(file, { name: file });
      console.log(`✓ Added: ${file}`);
      filesAdded++;
    } else {
      console.error(`❌ Required file missing: ${file}`);
    }
  });

  // Add optional files
  OPTIONAL_FILES.forEach(file => {
    if (fs.existsSync(file)) {
      archive.file(file, { name: file });
      console.log(`✓ Added: ${file}`);
      filesAdded++;
    }
  });

  // Validate manifest file
  if (fs.existsSync('imsmanifest.xml')) {
    const manifestContent = fs.readFileSync('imsmanifest.xml', 'utf8');
    if (!manifestContent.includes('scorm-launcher.html')) {
      console.warn('⚠️  Warning: imsmanifest.xml may not reference scorm-launcher.html correctly');
    }
  }

  console.log(`\n📁 Total files added: ${filesAdded}`);

  // Finalize the archive
  archive.finalize();
}

// Pre-flight checks
function validateFiles() {
  console.log('🔍 Validating files...');
  
  const missingFiles = [];
  SCORM_FILES.forEach(file => {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  });

  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    console.log('\n💡 Make sure you have all SCORM integration files.');
    console.log('   Run the SCORM setup first if needed.');
    return false;
  }

  // Check for Node.js dependencies
  if (!fs.existsSync('node_modules/archiver')) {
    console.warn('⚠️  archiver package not found. Installing...');
    const { execSync } = require('child_process');
    try {
      execSync('npm install archiver', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to install archiver. Please run: npm install archiver');
      return false;
    }
  }

  return true;
}

// Main execution
if (require.main === module) {
  console.log('🎓 AI Avatar Chatbot - SCORM Package Creator');
  console.log('=========================================\n');

  if (validateFiles()) {
    createSCORMPackage();
  } else {
    process.exit(1);
  }
}

module.exports = { createSCORMPackage, validateFiles }; 