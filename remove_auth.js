const fs = require('fs');
const path = require('path');

const dirPath = "c:/Users/dines/OneDrive/Desktop/education-platform-main/pages";

const files = fs.readdirSync(dirPath);

for (const file of files) {
    if (!file.endsWith('.html')) continue;

    const fullPath = path.join(dirPath, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;

    if (file.startsWith('admin-')) {
        // Remove admin access control script
        const regexAdmin = /<script>\s*\/\/\s*Admin Dashboard Access Control.*?<\/script>/is;
        content = content.replace(regexAdmin, '');
    } else if (file === 'user-dashboard.html') {
        // Remove user access control script
        const regexUser = /<script>\s*\/\/\s*User Dashboard Access Control.*?<\/script>/is;
        content = content.replace(regexUser, '');
    }

    // Sometimes there are empty <script>\s*</script> tags left, remove them if any
    content = content.replace(/<script>\s*<\/script>/ig, '');

    if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated auth check in: ${file}`);
    }
}

console.log("Done checking auth removals.");
