const fs = require('fs-extra');
const archiver = require('archiver');
const path = require('path');

async function createCompleteSCORMPackage() {
    const packageName = 'ai-avatar-hotel-training-course.zip';
    const tempDir = './temp-complete-course';
    
    try {
        console.log('🏨 Creating Complete AI Avatar Hotel Training Course Package...');
        
        // Clean up any existing temp directory
        if (fs.existsSync(tempDir)) {
            await fs.remove(tempDir);
        }
        
        // Create temp directory
        await fs.ensureDir(tempDir);
        
        // Copy the entire SCROMProject structure
        console.log('📚 Copying course content...');
        await fs.copy('./SCROMProject', tempDir);
        
        // Update the manifest title to reflect the enhanced version
        const manifestPath = path.join(tempDir, 'imsmanifest.xml');
        let manifestContent = await fs.readFile(manifestPath, 'utf8');
        
        // Update the title in the manifest
        manifestContent = manifestContent.replace(
            '<title>Handling Guest Complaints Professionally at the Front Desk</title>',
            '<title>AI Avatar Hotel Training: Handling Guest Complaints Professionally</title>'
        );
        
        await fs.writeFile(manifestPath, manifestContent);
        
        console.log('🤖 Enhanced chatbot files already integrated in course...');
        
        // Create the zip package
        console.log('📦 Creating SCORM package...');
        const output = fs.createWriteStream(packageName);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        
        output.on('close', () => {
            const sizeInMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
            console.log(`✅ Package created: ${packageName}`);
            console.log(`📊 Total size: ${sizeInMB} MB`);
            console.log(`📁 Files included: ${archive.pointer()} bytes`);
            console.log('\n🎯 Package Contents:');
            console.log('   • Complete hotel front desk training course');
            console.log('   • AI Avatar chatbot with OpenAI integration');
            console.log('   • HeyGen avatar streaming capability');
            console.log('   • Role-play scenarios for complaint handling');
            console.log('   • SCORM 1.2 compliant for LMS deployment');
            console.log('\n🚀 Ready for LMS upload!');
        });
        
        archive.on('error', (err) => {
            throw err;
        });
        
        archive.pipe(output);
        
        // Add all files from temp directory
        archive.directory(tempDir, false);
        
        await archive.finalize();
        
        // Clean up temp directory
        await fs.remove(tempDir);
        
    } catch (error) {
        console.error('❌ Error creating package:', error);
        
        // Clean up on error
        if (fs.existsSync(tempDir)) {
            await fs.remove(tempDir);
        }
        
        process.exit(1);
    }
}

// Run the packaging
createCompleteSCORMPackage(); 