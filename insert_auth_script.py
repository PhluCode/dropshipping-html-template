from pathlib import Path
import re
root = Path('c:/Users/patta/OneDrive/Desktop/dropshipping-html-template')
pattern = re.compile(r'(\<script src="assets/js/main\.js"\></script>)', re.IGNORECASE)
files = sorted(root.glob('*.html'))
for path in files:
    text = path.read_text(encoding='utf-8')
    if 'assets/js/auth.js' in text:
        continue
    if 'assets/js/main.js' not in text:
        continue
    new_text = pattern.sub(r"\1\n    <script src=\"assets/js/auth.js\"></script>", text)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        print(f'Updated {path.name}')
