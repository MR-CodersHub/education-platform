const fs = require('fs');
const path = require('path');

const dirPath = "c:/Users/dines/OneDrive/Desktop/education-platform-main";

function getAllHtmlFiles(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // exclude .vscode, css, img, js directories
            if (['.vscode', 'css', 'img', 'js'].includes(file)) continue;
            getAllHtmlFiles(fullPath, files);
        } else if (file.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    return files;
}

const htmlFiles = getAllHtmlFiles(dirPath);

for (const filepath of htmlFiles) {
    let content = fs.readFileSync(filepath, 'utf8');
    let originalContent = content;
    
    // Determine relative path
    const isPagesDir = filepath.toLowerCase().includes(path.sep + 'pages' + path.sep) || filepath.replace(/\\/g, '/').includes('/pages/');
    const prefix = isPagesDir ? "" : "pages/";
    
    // Dropdown replacement
    const newLinks = `
                        <a href="${prefix}login.html" class="block px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary-blue transition">Login/Signup</a>
                        <a href="${prefix}admin-dashboard.html" class="block px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary-blue transition">Admin Dashboard</a>
                        <a href="${prefix}user-dashboard.html" class="block px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary-blue transition">User Dashboard</a>
`;
    
    // Replace dropdown contents
    const regex = /(<div\s+id="user-dropdown"[^>]*>)([\s\S]*?)(<\/div>)/i;
    content = content.replace(regex, (match, p1, p2, p3) => p1 + newLinks + '                    ' + p3);
    
    // specific changes for login.html
    if (filepath.endsWith('login.html')) {
        content = content.replace(/placeholder="name@email.com"/g, 'placeholder="Email Address"');
        content = content.replace(/placeholder="••••••••"/g, 'placeholder="Password"');
        
        // ensure no values are left from previously hardcoded credentials (if any exist)
        content = content.replace(/value="admin@gmail.com"/g, 'value=""');
        content = content.replace(/value="admin123"/g, 'value=""');
        content = content.replace(/value="user@gmail.com"/g, 'value=""');
        content = content.replace(/value="user123"/g, 'value=""');
    }
    
    if (content !== originalContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated: ${filepath}`);
    }
}

console.log("All done!");
