/**
 * Complete AI Avatar Hotel Training Course Package Creator
 * This script creates a SCORM-compliant ZIP package from SCROMProject
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function createCompleteCourse() {
  const packageName = 'ai-avatar-hotel-training-complete.zip';
  const output = fs.createWriteStream(packageName);
  const archive = archiver('zip', { zlib: { level: 9 } });

  console.log('🏨 Creating Complete AI Avatar Hotel Training Course...');

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
    console.log(`✅ Complete course package created: ${packageName}`);
    console.log(`📦 Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    console.log('');
    console.log('🎯 Package Contents:');
    console.log('   • Complete Articulate Rise hotel training course');
    console.log('   • AI Avatar chatbot with OpenAI GPT-3.5 integration');
    console.log('   • HeyGen avatar streaming capability');
    console.log('   • Interactive role-play scenarios');
    console.log('   • Professional complaint handling training');
    console.log('   • SCORM 1.2 compliant for LMS deployment');
    console.log('');
    console.log('📋 How to Use:');
    console.log('1. Upload this ZIP file to your LMS');
    console.log('2. Launch the course from your LMS');
    console.log('3. Complete the training modules');
    console.log('4. Use the AI Avatar chatbot for role-play practice');
    console.log('5. Progress is automatically tracked via SCORM');
    console.log('');
    console.log('📚 Entry point: scormdriver/indexAPI.html');
    console.log('🤖 AI Avatar chatbot integrated throughout the course');
  });

  // Pipe archive data to the file
  archive.pipe(output);

  // Check if SCROMProject exists
  if (!fs.existsSync('SCROMProject')) {
    console.error('❌ SCROMProject directory not found!');
    console.log('   Make sure you have the complete course content in SCROMProject folder.');
    process.exit(1);
  }

  // Add the entire SCROMProject directory
  console.log('📚 Adding complete course content from SCROMProject...');
  archive.directory('SCROMProject/', false);

  console.log('📦 Finalizing package...');
  
  // Finalize the archive
  archive.finalize();
}

// Pre-flight checks
function validateCourse() {
  console.log('🔍 Validating course structure...');
  
  if (!fs.existsSync('SCROMProject')) {
    console.error('❌ SCROMProject directory not found');
    return false;
  }

  if (!fs.existsSync('SCROMProject/imsmanifest.xml')) {
    console.error('❌ SCORM manifest not found in SCROMProject');
    return false;
  }

  if (!fs.existsSync('SCROMProject/scormcontent')) {
    console.error('❌ Course content directory not found');
    return false;
  }

  if (!fs.existsSync('SCROMProject/scormcontent/lib/chatbot/chatbot.js')) {
    console.error('❌ AI Avatar chatbot not found');
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

  console.log('✅ Course structure validated');
  return true;
}

// Main execution
if (require.main === module) {
  console.log('🎓 AI Avatar Hotel Training - Complete Course Package Creator');
  console.log('============================================================\n');

  if (validateCourse()) {
    createCompleteCourse();
  } else {
    console.log('\n💡 Make sure you have the complete SCROMProject folder with:');
    console.log('   - imsmanifest.xml (SCORM manifest)');
    console.log('   - scormcontent/ (Course content)');
    console.log('   - scormdriver/ (SCORM API drivers)');
    console.log('   - Enhanced AI Avatar chatbot files');
    process.exit(1);
  }
}

module.exports = { createCompleteCourse, validateCourse }; 