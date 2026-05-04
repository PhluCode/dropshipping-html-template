from pathlib import Path
import re

root = Path(__file__).resolve().parent
pattern = re.compile(r'<!--header top start-->.*?<!--header middel start-->', re.DOTALL)
updated = []
for path in sorted(root.glob('*.html')):
    text = path.read_text(encoding='utf-8')
    if pattern.search(text):
        path.write_text(pattern.sub('<!--header middel start-->', text), encoding='utf-8')
        updated.append(path.name)
print(f'Updated {len(updated)} files:')
for name in updated:
    print(' -', name)
