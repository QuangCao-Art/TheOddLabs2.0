import os
import re
import json
import shutil
from datetime import datetime

# --- CONFIGURATION ---
MAPS_DIR = os.path.join("src", "data", "maps")
BACKUP_DIR = os.path.join("src", "data", "maps", "backups")

# Protocol V1.1: Multi-tile pairing rules
# Key = Top ID, Value = Bottom ID
STACKING_PAIRS = {
    'f11': 'f12', # Table C
    'f13': 'f14', # Lab Tank Green
    'f15': 'f16', # Lab Tank Blue
    'f18': 'f19', # Pot Plant A
    'f20': 'f21', # Pot Plant B
    'f22': 'f23', # Lab Tank Red
    'f24': 'f25', # Pot Plant C
    'f34': 'f35', # Skeleton A
    'f38': 'f40', # Incubator Left (Top -> Bottom)
    'f39': 'f41', # Incubator Right (Top -> Bottom)
    'f52': 'f54', # Cabinet Big Left (Top -> Bottom)
    'f53': 'f55', # Cabinet Big Right (Top -> Bottom)
    'f56': 'f57', # Table Leader B
    'f61': 'f62', # Box Pile
    'f67': 'f69', # Vending Machine Left
    'f68': 'f70', # Vending Machine Right
    'f71': 'f73', # Battle Machine Left
    'f72': 'f74', # Battle Machine Right
    'f76': 'f78', # Bookshelf Left
    'f77': 'f79', # Bookshelf Right
    'f80': 'f82', # CryoPod Big Left
    'f81': 'f83', # CryoPod Big Right
    'f84': 'f85', # Storage Pod
    'f86': 'f87', # Healthy Ancient Plant
    'f88': 'f89', # Dead Ancient Plant
}

class MapSync:
    def __init__(self):
        if not os.path.exists(BACKUP_DIR):
            os.makedirs(BACKUP_DIR)

    def validate_protocol(self):
        """Checks all map files for Protocol V1.1 violations (orphaned Tops/Bottoms)."""
        print("[SCAN] Auditing Map Data for Protocol V1.1 compliance...")
        violation_count = 0
        
        for filename in os.listdir(MAPS_DIR):
            if not filename.endswith(".js"):
                continue
                
            filepath = os.path.join(MAPS_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Extract objects array using regex
            objects_match = re.search(r"objects:\s*\[(.*?)\]", content, re.DOTALL)
            if not objects_match:
                continue
                
            objects_str = objects_match.group(1)
            # Find all objects using a naive but effective regex for { ... }
            objs = []
            for obj_match in re.finditer(r"\{[^{}]*?\}", objects_str):
                try:
                    # Clean up string for basic JSON parsing (though JS literals are loose)
                    raw = obj_match.group(0)
                    # Simple heuristic extraction
                    id_m = re.search(r"id:\s*['\"](.*?)['\"]", raw)
                    x_m = re.search(r"x:\s*(\d+)", raw)
                    y_m = re.search(r"y:\s*(\d+)", raw)
                    id_val = id_m.group(1) if id_m else "unknown"
                    x_val = int(x_m.group(1)) if x_m else 0
                    y_val = int(y_m.group(1)) if y_m else 0
                    
                    # Extract type from ID prefix (e.g., 'f13_at_tl' -> 'f13')
                    type_id = id_val.split("_")[0]
                    objs.append({"id": id_val, "type_id": type_id, "x": x_val, "y": y_val})
                except Exception:
                    continue

            # Create a coordinate map (supporting multiple objects per tile)
            coord_map = {}
            for o in objs:
                pos = (o['x'], o['y'])
                if pos not in coord_map:
                    coord_map[pos] = []
                coord_map[pos].append(o)
            
            # Check for violations
            for obj in objs:
                t_id = obj['type_id']
                if t_id in STACKING_PAIRS:
                    # Current is a TOP
                    expected_bottom_y = obj['y'] + 1
                    targets = coord_map.get((obj['x'], expected_bottom_y), [])
                    bottom_id = STACKING_PAIRS[t_id]
                    
                    # Check if ANY object at the target coordinate is the correct bottom
                    if not any(t['type_id'] == bottom_id for t in targets):
                        print(f"[ERROR] PROTOCOL ERROR in {filename}: Orphaned TOP '{obj['id']}' at ({obj['x']}, {obj['y']}). Missing Bottom '{bottom_id}' at y={expected_bottom_y}.")
                        violation_count += 1
                
                # Check for Bottoms with no Tops
                elif t_id in STACKING_PAIRS.values():
                    # Find the corresponding Top ID
                    top_id = next(k for k, v in STACKING_PAIRS.items() if v == t_id)
                    expected_top_y = obj['y'] - 1
                    targets = coord_map.get((obj['x'], expected_top_y), [])
                    
                    # Check if ANY object at the target coordinate is the correct top
                    if not any(t['type_id'] == top_id for t in targets):
                        print(f"[ERROR] PROTOCOL ERROR in {filename}: Orphaned BOTTOM '{obj['id']}' at ({obj['x']}, {obj['y']}). Missing Top '{top_id}' at y={expected_top_y}.")
                        violation_count += 1

        if violation_count == 0:
            print("[SUCCESS] All maps compliant with AI_DECORATION_PROTOCOL_V1.1.")
        else:
            print(f"[WARNING] Total violations found: {violation_count}")

    def backup(self, zone_name):
        src = os.path.join(MAPS_DIR, f"{zone_name}.js")
        if os.path.exists(src):
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            dest = os.path.join(BACKUP_DIR, f"{zone_name}_{timestamp}.js.bak")
            shutil.copy2(src, dest)
            return True
        return False

    def sync_furniture(self, zone_name, new_objects_list):
        """
        Overwrites the 'objects' array in a zone file with a new list,
        but PRESERVES existing NPCs and Wild Cells in the target file.
        Also IGNORES any NPCs in the incoming new_objects_list.
        """
        filepath = os.path.join(MAPS_DIR, f"{zone_name}.js")
        if not os.path.exists(filepath):
            print(f"Error: Zone '{zone_name}' not found.")
            return

        self.backup(zone_name)
        
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Step 1: Extract Existing NPCs from the current file
        # We look for objects that have type: "npc"
        objects_match = re.search(r"objects:\s*\[(.*?)\]", content, re.DOTALL)
        preserved_npcs = []
        if objects_match:
            objects_str = objects_match.group(1)
            # Find all { ... } blocks
            for obj_match in re.finditer(r"\{[^{}]*?\}", objects_str):
                raw_obj = obj_match.group(0)
                # Check for npc type (loose check for various quote styles)
                if re.search(r"['\"]type['\"]:\s*['\"]npc['\"]", raw_obj) or "type: \"npc\"" in raw_obj or "type: 'npc'" in raw_obj:
                    preserved_npcs.append(raw_obj.strip())

        # Step 2: Filter New Furniture (ignore any NPCs accidentally included in export)
        filtered_furniture = []
        for obj_line in new_objects_list:
            is_npc = re.search(r"['\"]type['\"]:\s*['\"]npc['\"]", obj_line) or "type: \"npc\"" in obj_line or "type: 'npc'" in obj_line
            if not is_npc:
                filtered_furniture.append(obj_line.strip())

        # Step 3: Merge (Furniture first, then NPCs for better visibility at end of array)
        final_objects = filtered_furniture + preserved_npcs
        
        # Build replacement string
        formatted_objects = ",\n        ".join(final_objects)
        new_content = re.sub(
            r"objects: \[.*?\]", 
            f"objects: [\n        {formatted_objects}\n    ]", 
            content, 
            flags=re.DOTALL
        )

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"[SYNC] Synced {len(filtered_furniture)} furniture items and preserved {len(preserved_npcs)} NPCs in {zone_name}.js.")

if __name__ == "__main__":
    import sys
    tool = MapSync()
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--validate":
            tool.validate_protocol()
        # Additional hooks can be added here
    else:
        print("Usage: python map_sync.py --validate")
