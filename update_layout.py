import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Remove Possibilities Section
possibilities_pattern = re.compile(r'(  <!-- ==========================================\n       SECTION D: EVENT POSSIBILITIES & ADD-ONS\n       ========================================== -->\n  <section class="section[^"]*" id="possibilities">.*?  </section>\n)', re.DOTALL)
possibilities_match = possibilities_pattern.search(content)
if possibilities_match:
    content = content.replace(possibilities_match.group(1), '')
else:
    print("Possibilities section not found")

# 2. Replace Contact Form with Google Map
# Find the contact-form-panel
form_pattern = re.compile(r'(      <!-- Final Lead Capture Form Panel -->\n      <div class="contact-form-panel">)(.*?)(      </div>\n    </div>\n  </section>)', re.DOTALL)
form_match = form_pattern.search(content)

map_html = '''
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104595.64259838048!2d-88.78923330623315!3d34.27514755106571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88874ca7151e51b3%3A0xc3ba677c7f71c4c1!2sTupelo%2C%20MS!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" width="100%" height="100%" style="border:0; min-height: 500px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
'''

if form_match:
    content = content[:form_match.start(2)] + map_html + content[form_match.start(3):]
    # Remove padding and background from the panel to make the map flush
    content = content.replace('<div class="contact-form-panel">', '<div class="contact-form-panel" style="padding: 0; background: transparent; box-shadow: none;">')
else:
    print("Contact form not found")

# 3. Update Alternating Classes
def set_class(html, section_id, is_alt):
    cls = "section section-alt" if is_alt else "section"
    pattern = re.compile(r'<section class="[^"]*" id="' + section_id + r'">')
    return pattern.sub(f'<section class="{cls}" id="{section_id}">', html)

content = set_class(content, 'about', False)
content = set_class(content, 'venue', True)
content = set_class(content, 'amenities', False)
content = set_class(content, 'catering', True)
# possibilities is gone
content = set_class(content, 'gallery', False)
content = set_class(content, 'faq', True)
content = set_class(content, 'contact', False)

with open('index.html', 'w') as f:
    f.write(content)

print("Done")
