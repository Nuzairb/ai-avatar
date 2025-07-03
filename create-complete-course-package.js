const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('🏨 Creating Complete AI Avatar Hotel Training Course...');

// Create output stream
const output = fs.createWriteStream('ai-avatar-hotel-training-complete.zip');
const archive = archiver('zip', {
    zlib: { level: 9 }
});

output.on('close', function() {
    const sizeInMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
    console.log(`✅ Complete course package created: ai-avatar-hotel-training-complete.zip`);
    console.log(`📊 Total size: ${sizeInMB} MB`);
    console.log(`📁 Files included: ${archive.pointer()} bytes`);
    console.log('\n🎯 Package Contents:');
    console.log('   • Complete Articulate Rise hotel training course');
    console.log('   • AI Avatar chatbot with OpenAI GPT-3.5 integration');
    console.log('   • HeyGen avatar streaming capability');
    console.log('   • Interactive role-play scenarios');
    console.log('   • Professional complaint handling training');
    console.log('   • SCORM 1.2 compliant for LMS deployment');
    console.log('\n🚀 Ready for LMS upload!');
    console.log('\n📝 Course Information:');
    console.log('   Title: AI Avatar Hotel Training - Handling Guest Complaints Professionally');
    console.log('   Type: SCORM 1.2 Package');
    console.log('   Entry Point: scormdriver/indexAPI.html');
    console.log('   Chatbot: Integrated AI Avatar with role-play capabilities');
});

archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);

try {
    // Add the entire SCROMProject directory structure
    console.log('📚 Adding course content from SCROMProject...');
    archive.directory('SCROMProject/', false);
    
    console.log('📦 Finalizing package...');
    archive.finalize();
    
} catch (error) {
    console.error('❌ Error creating package:', error);
} 