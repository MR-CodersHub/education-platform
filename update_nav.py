import os
import re

dir_path = "c:/Users/dines/OneDrive/Desktop/education-platform-main"

html_files = []
for root, dirs, files in os.walk(dir_path):
    for f in files:
        if f.endswith(".html"):
            html_files.append(os.path.join(root, f).replace("\\", "/"))

def replacer(m, filepath):
    # Determine correct relative path for links
    prefix = "" if "/pages/" in filepath.lower() else "pages/"
    
    new_links = f"""
                        <a href="{prefix}login.html" class="block px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary-blue transition">Login/Signup</a>
                        <a href="{prefix}admin-dashboard.html" class="block px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary-blue transition">Admin Dashboard</a>
                        <a href="{prefix}user-dashboard.html" class="block px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary-blue transition">User Dashboard</a>
"""
    return m.group(1) + new_links + "                    " + m.group(3)

for filepath in html_files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = content
    
    # 1. Update dropdowns
    pattern = re.compile(r'(<div\s+id="user-dropdown"[^>]*>)(.*?)(</div>)', re.DOTALL)
    new_content = pattern.sub(lambda m: replacer(m, filepath), new_content)

    # 2. Update login.html inputs if it's the login.html file
    if filepath.endswith("login.html"):
        new_content = new_content.replace('placeholder="name@email.com"', 'placeholder="Email Address"')
        new_content = new_content.replace('placeholder="••••••••"', 'placeholder="Password"')

        # remove any default selected values if they exist (just in case they were added dynamically or directly)
        new_content = new_content.replace('value="admin@gmail.com"', 'value=""')
        import re
        new_content = re.sub(r'value=".*?"', lambda m: m.group(0) if m.group(0) not in ['value="admin"', 'value="user"'] else m.group(0), new_content) # don't break the <select> option values

    if content != new_content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Updated:", filepath)

print("All done!")
