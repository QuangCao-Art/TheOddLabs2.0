import re
import os

filepath = 'd:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern explanation:
# Match "id: 'labTank{Color}-{T|B}_{suffix}', x: {num}, y: {num}, type: 'prop', name: '{Anything}'"
# And optionally any hiddenLogId or other props after it on the same line.
# We will use re.sub with a function to preserve the rest of the line.

def replacer(match):
    color = match.group(1) # Green, Blue, Red
    before_name = match.group(2)
    after_name = match.group(3)
    
    new_name = f"{color} Specimen Tank"
    return f"{before_name}name: '{new_name}'{after_name}"

# We want to match: (id: 'labTank(Green|Blue|Red)-.*?type: 'prop', )(name: '[^']+')(.*)
pattern = re.compile(r"(id: 'labTank(Green|Blue|Red)-.*?type: 'prop', )name: '[^']+'(.*)")

new_content = pattern.sub(replacer, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replacement complete. Check overworld.js")
