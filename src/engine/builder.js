import { FURNITURE_TEMPLATES, TERRAIN_PALETTE, DOOR_TEMPLATES } from '../data/furniture.js';

/**
 * Furniture Builder Mode for Odd Labs 2.0
 * Allows visual decoration and map modification with automatic stacking.
 */
export const BuilderMode = {
    active: false,
    selectedTemplate: null, // From FURNITURE_TEMPLATES, TERRAIN_PALETTE, or DOOR_TEMPLATES
    selectedType: 'furniture', // 'furniture', 'terrain', or 'door'
    mouseGridX: 0,
    mouseGridY: 0,
    currentZoneId: null,
    
    // UI Elements
    paletteEl: null,
    ghostEl: null,
    
    init() {
        console.log("Builder Mode Initialized. Press 'B' to toggle.");
        this.createUI();
        this.setupEventListeners();
    },

    createUI() {
        // Create Palette Sidebar
        const palette = document.createElement('div');
        palette.id = 'builder-palette';
        palette.className = 'hidden';
        palette.innerHTML = `
            <div class="palette-header">
                <h3>BUILDER MODE</h3>
                <button id="builder-close">X</button>
            </div>
            <div class="palette-tabs">
                <button class="tab-btn active" data-tab="furniture">PROPS</button>
                <button class="tab-btn" data-tab="terrain">TERRAIN</button>
                <button class="tab-btn" data-tab="doors">DOORS</button>
            </div>
            <div class="palette-content" id="palette-items"></div>
            <div class="palette-footer">
                <button id="builder-export">EXPORT CODE</button>
            </div>
        `;
        document.body.appendChild(palette);
        this.paletteEl = palette;

        // Create Ghost Preview
        const ghost = document.createElement('div');
        ghost.id = 'builder-ghost';
        ghost.className = 'hidden';
        document.body.appendChild(ghost);
        this.ghostEl = ghost;

        // Create Export Modal
        const modal = document.createElement('div');
        modal.id = 'builder-export-modal';
        modal.className = 'hidden';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>EXPORTED LAYOUT</h3>
                <p>Copy this code and ask Antigravity to "Apply the layout for [Zone Name]".</p>
                <textarea id="export-textarea" readonly></textarea>
                <button id="export-copy">COPY TO CLIPBOARD</button>
                <button id="export-close">CLOSE</button>
            </div>
        `;
        document.body.appendChild(modal);

        this.switchTab('furniture');
    },

    setupEventListeners() {
        // Hotkey Toggle
        window.addEventListener('keydown', (e) => {
            const overworldHidden = document.getElementById('screen-overworld').classList.contains('hidden');
            if (e.key.toLowerCase() === 'b' && !Overworld.isDialogueActive && !overworldHidden) {
                this.toggle();
            }
        });

        // Palette Tab Switching
        this.paletteEl.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.paletteEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.switchTab(btn.dataset.tab);
            });
        });

        // Close Button
        document.getElementById('builder-close').addEventListener('click', () => this.toggle());

        // Export Button
        document.getElementById('builder-export').addEventListener('click', () => this.showExport());
        document.getElementById('export-close').addEventListener('click', () => {
            document.getElementById('builder-export-modal').classList.add('hidden');
        });
        document.getElementById('export-copy').addEventListener('click', () => {
            const textarea = document.getElementById('export-textarea');
            textarea.select();
            document.execCommand('copy');
            window.showAlertModal("DATA EXPORTOR", "Layout code copied to clipboard successfully.");
        });

        // Export Button

        // Global Mouse Move for Snapping
        window.addEventListener('mousemove', (e) => {
            if (!this.active) return;
            this.updateMousePos(e);
        });

        // Global Mouse Click for Placement/Deletion
        window.addEventListener('mousedown', (e) => {
            if (!this.active || e.target.closest('#builder-palette') || e.target.closest('.modal-content')) return;
            
            if (e.button === 0) { // Left Click: Place or Selection
                this.handlePlacement();
            } else if (e.button === 2) { // Right Click: Delete
                e.preventDefault();
                this.handleDeletion();
            }
        });

        window.addEventListener('contextmenu', (e) => {
            if (this.active) e.preventDefault();
        });
    },

    toggle() {
        this.active = !this.active;
        this.currentZoneId = Overworld.currentZone;
        
        if (this.active) {
            this.paletteEl.classList.remove('hidden');
            document.body.classList.add('builder-active');
            Overworld.isPaused = true;
        } else {
            this.paletteEl.classList.add('hidden');
            this.ghostEl.classList.add('hidden');
            document.body.classList.remove('builder-active');
            Overworld.isPaused = false;
        }
    },

    switchTab(category) {
        this.selectedType = category;
        const container = document.getElementById('palette-items');
        container.innerHTML = '';

        let items = [];
        if (category === 'furniture') items = Object.entries(FURNITURE_TEMPLATES);
        else if (category === 'terrain') items = TERRAIN_PALETTE.map(t => [t.id, t]);
        else if (category === 'doors') items = Object.entries(DOOR_TEMPLATES);

        items.forEach(([key, data]) => {
            const btn = document.createElement('div');
            btn.className = 'palette-item';
            btn.innerHTML = `<span>${data.name}</span>`;
            
            // Preview Icon (64x64 wrapper scaled in CSS)
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'item-preview-wrapper';
            
            const icon = document.createElement('div');
            const tid = data.tiles ? data.tiles[0].id : data.id;
            
            if (category === 'furniture') {
                icon.className = `item-preview world-object prop ${tid}`;
                // Auto-detect Tileset 03 based on ID (f64+)
                const numericId = parseInt(tid.substring(1));
                if (numericId >= 64) {
                    icon.classList.add('tileset-03');
                }
            } else if (category === 'terrain') {
                icon.className = `item-preview terrain t-${tid}`;
            } else if (category === 'doors') {
                icon.className = `item-preview door t-${tid}`;
            }
            
            iconWrapper.appendChild(icon);
            btn.prepend(iconWrapper);

            btn.addEventListener('click', () => {
                this.paletteEl.querySelectorAll('.palette-item').forEach(i => i.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedTemplate = data;
                this.updateGhost();
            });
            container.appendChild(btn);
        });
    },

    updateMousePos(e) {
        const mapEl = document.getElementById('overworld-map');
        const rect = mapEl.getBoundingClientRect();
        
        // Calculate grid coords based on map scroll/offset
        const x = Math.floor((e.clientX - rect.left) / Overworld.tileSize);
        const y = Math.floor((e.clientY - rect.top) / Overworld.tileSize);
        
        this.mouseGridX = x;
        this.mouseGridY = y;

        if (this.selectedTemplate) {
            this.ghostEl.style.left = `${(x * Overworld.tileSize) + rect.left}px`;
            this.ghostEl.style.top = `${(y * Overworld.tileSize) + rect.top}px`;
            this.ghostEl.classList.remove('hidden');
        }
    },

    updateGhost() {
        if (!this.selectedTemplate) return;
        this.ghostEl.innerHTML = '';
        this.ghostEl.style.width = `${Overworld.tileSize}px`;
        this.ghostEl.style.height = `${Overworld.tileSize}px`;

        const tiles = this.selectedTemplate.tiles || [{ id: this.selectedTemplate.id, relX: 0, relY: 0 }];
        
        tiles.forEach(t => {
            const tile = document.createElement('div');
            
            // Set base class based on selection type
            if (this.selectedType === 'furniture') {
                tile.className = `world-object prop ${t.id}`;
                // Auto-detect Tileset 03 based on ID (f64+)
                const numericId = parseInt(t.id.substring(1));
                if (numericId >= 64) {
                    tile.classList.add('tileset-03');
                }
            } else if (this.selectedType === 'terrain' || this.selectedType === 'doors') {
                tile.className = `tile t-${t.id}`;
            }

            tile.style.position = 'absolute';
            tile.style.left = `${t.relX * Overworld.tileSize}px`;
            tile.style.top = `${t.relY * Overworld.tileSize}px`;
            tile.style.width = '100%';
            tile.style.height = '100%';
            tile.style.opacity = '0.5';
            this.ghostEl.appendChild(tile);
        });
    },

    handlePlacement() {
        if (!this.selectedTemplate) return;
        const zone = Overworld.zones[this.currentZoneId];

        if (this.selectedType === 'furniture') {
            this.placeFurniture(zone);
        } else if (this.selectedType === 'terrain') {
            this.placeTerrain(zone);
        } else if (this.selectedType === 'doors') {
            this.placeDoor(zone);
        }

        Overworld.renderMap(this.currentZoneId);
    },

    placeFurniture(zone) {
        const tid = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        this.selectedTemplate.tiles.forEach(t => {
            const newObj = {
                id: `${t.id}_${tid}`,
                x: this.mouseGridX + t.relX,
                y: this.mouseGridY + t.relY,
                type: 'prop',
                name: this.selectedTemplate.name
            };
            zone.objects.push(newObj);
        });
    },

    placeTerrain(zone) {
        if (this.mouseGridY >= 0 && this.mouseGridY < zone.height && 
            this.mouseGridX >= 0 && this.mouseGridX < zone.width) {
            zone.layout[this.mouseGridY][this.mouseGridX] = this.selectedTemplate.id;
        }
    },

    placeDoor(zone) {
        window.showPromptModal("DOOR CALIBRATION", "Target Zone ID (e.g. 'atrium'):", "atrium", (targetZone) => {
            if (!targetZone) return;
            window.showPromptModal("DOOR CALIBRATION", "Target X Coordinate:", "5", (targetXStr) => {
                const targetX = parseInt(targetXStr);
                if (isNaN(targetX)) return;
                window.showPromptModal("DOOR CALIBRATION", "Target Y Coordinate:", "5", (targetYStr) => {
                    const targetY = parseInt(targetYStr);
                    if (isNaN(targetY)) return;

                    // Update Layout
                    this.placeTerrain(zone);

                    // Add to Doors array
                    if (!zone.doors) zone.doors = [];
                    zone.doors.push({
                        x: this.mouseGridX,
                        y: this.mouseGridY,
                        targetZone,
                        targetX,
                        targetY
                    });

                    Overworld.renderMap(this.currentZoneId);
                });
            });
        });
    },

    handleDeletion() {
        const zone = Overworld.zones[this.currentZoneId];
        
        // Find if there's an object at this location
        const targetIdx = zone.objects.findIndex(obj => 
            obj.x === this.mouseGridX && obj.y === this.mouseGridY
        );

        if (targetIdx !== -1) {
            const target = zone.objects[targetIdx];
            
            // --- Strategy 1: Modern Atomic Suffix Grouping ---
            const suffixMatch = target.id.match(/_([a-z0-9]{10,})$/); // Only trigger for long tool-generated suffixes
            if (suffixMatch) {
                const suffix = suffixMatch[1];
                zone.objects = zone.objects.filter(obj => !obj.id.endsWith(`_${suffix}`));
            } else {
                // --- Strategy 2: Legacy Template Detection ---
                // If it's an old manual ID (e.g. "f14_at_tl"), try to find its partners nearby
                const baseId = target.id.split('_')[0];
                let deletedCount = 0;

                // Look for templates that contain this fID
                for (const key in FURNITURE_TEMPLATES) {
                    const template = FURNITURE_TEMPLATES[key];
                    const part = template.tiles.find(t => t.id === baseId);
                    
                    if (part) {
                        // We found a template match! Find the "Root/Origin" of this instance
                        const rootX = target.x - part.relX;
                        const rootY = target.y - part.relY;

                        // Check every other part of THIS template relative to that root
                        template.tiles.forEach(t => {
                            const partnerIdx = zone.objects.findIndex(obj => 
                                obj.x === (rootX + t.relX) && 
                                obj.y === (rootY + t.relY) &&
                                obj.id.startsWith(t.id)
                            );
                            if (partnerIdx !== -1) {
                                zone.objects.splice(partnerIdx, 1);
                                deletedCount++;
                            }
                        });
                        
                        if (deletedCount > 0) break; // We found and cleared the set
                    }
                }

                // Fallback: If no template logic found, just remove this one tile
                if (deletedCount === 0) {
                    zone.objects.splice(targetIdx, 1);
                }
            }
            Overworld.renderMap(this.currentZoneId);
        }
    },

    modifyGrid(action) {
        const zone = Overworld.zones[this.currentZoneId];
        
        switch(action) {
            case 'addRowTop':
                zone.layout.unshift(new Array(zone.width).fill(12));
                zone.height++;
                zone.objects.forEach(o => o.y++);
                zone.doors?.forEach(d => d.y++);
                Overworld.player.y++;
                break;
            case 'addRowBot':
                zone.layout.push(new Array(zone.width).fill(12));
                zone.height++;
                break;
            case 'addColLeft':
                zone.layout.forEach(row => row.unshift(12));
                zone.width++;
                zone.objects.forEach(o => o.x++);
                zone.doors?.forEach(d => d.x++);
                Overworld.player.x++;
                break;
            case 'addColRight':
                zone.layout.forEach(row => row.push(12));
                zone.width++;
                break;
        }

        Overworld.renderMap(this.currentZoneId);
    },

    showExport() {
        const zone = Overworld.zones[this.currentZoneId];
        const modal = document.getElementById('builder-export-modal');
        const textarea = document.getElementById('export-textarea');

        const exportData = {
            layout: zone.layout,
            objects: zone.objects,
            doors: zone.doors
        };

        // Format into a nice string
        let output = `// --- EXPORTED DATA FOR ${zone.name} ---\n`;
        output += `layout: [\n${zone.layout.map(row => "    [" + row.join(",") + "]").join(",\n")}\n],\n`;
        output += `objects: [\n${zone.objects.map(obj => "    " + JSON.stringify(obj)).join(",\n")}\n],\n`;
        output += `doors: [\n${zone.doors.map(d => "    " + JSON.stringify(d)).join(",\n")}\n]`;

        textarea.value = output;
        modal.classList.remove('hidden');
    }
};

window.BuilderMode = BuilderMode;
