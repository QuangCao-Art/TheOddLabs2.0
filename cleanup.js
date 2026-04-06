const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'AntiGravityWorkSpace', 'TheOddLabs2.0', 'src', 'engine', 'overworld.js');
const backupPath = filePath + '.bak';

try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    const lines = originalContent.split('\n');

    // We want to keep lines 1 to 208 (indices 0 to 207)
    // And keep lines from 1737 onwards (index 1736 onwards)
    // Note: Line numbers shown in view_file are 1-based.
    
    console.log('Original lines count:', lines.length);
    console.log('Keeping lines 1-208 (indices 0-207)');
    console.log('Skipping lines 209-1736 (indices 208-1735)');
    console.log('Keeping from line 1737 onwards (index 1736 onwards)');

    const newLines = [
        ...lines.slice(0, 208),
        ...lines.slice(1736)
    ];

    console.log('New lines count:', newLines.length);

    fs.writeFileSync(backupPath, originalContent);
    fs.writeFileSync(filePath, newLines.join('\n'));

    console.log('Cleanup successful. Backup created at ' + backupPath);
} catch (err) {
    console.error('Error:', err);
}
