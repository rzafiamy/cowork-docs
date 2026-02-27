import os
import re

def update_sidebar_links():
    docs_dir = "/home/cook/Documents/Dev/Dev-365/cowork-docs/docs"
    # Sidebar link pattern for security.html
    # <a href="/docs/security.html" class="block px-3 py-2 rounded-lg text-zinc-400 hover:text-white transition-colors">Security</a>
    # Or variations with bg-white/5 etc.
    
    pattern = re.compile(r'(<a href="/docs/security\.html"[^>]*>)(Security)(</a>)')
    replacement = r'\1Security & Firewall\3'
    
    for filename in os.listdir(docs_dir):
        if filename.endswith(".html"):
            filepath = os.path.join(docs_dir, filename)
            with open(filepath, 'r') as f:
                content = f.read()
            
            new_content = pattern.sub(replacement, content)
            
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated sidebar in {filename}")

if __name__ == "__main__":
    update_sidebar_links()
