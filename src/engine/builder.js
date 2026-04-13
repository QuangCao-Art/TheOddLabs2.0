import { FURNITURE_TEMPLATES, TERRAIN_PALETTE, DOOR_TEMPLATES, furnitureMetadata } from '../data/furniture.js';

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
    isMirrored: false,
    
    // UI Elements
    paletteEl: null,
    rewardPanelEl: null,
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
                <div class="builder-debug-group">
                    <button id="builder-toggle-hidden" class="builder-debug-btn">SHOW HIDDEN: OFF</button>
                    <button id="builder-toggle-mirror" class="builder-debug-btn">MIRROR: OFF</button>
                </div>
                <button id="builder-export">EXPORT CODE</button>
            </div>
        `;
        document.body.appendChild(palette);
        this.paletteEl = palette;

        // Create Reward ID Panel (Left Side)
        const rewardPanel = document.createElement('div');
        rewardPanel.id = 'builder-reward-panel';
        rewardPanel.className = 'hidden';
        rewardPanel.innerHTML = `
            <div class="palette-header">
                <h3>HIDDEN REWARDS</h3>
            </div>
            <div class="builder-reward-group">
                <label>HIDDEN REWARD ID</label>
                <input type="text" id="builder-reward-id" placeholder="e.g. REWARD_CREDITS_50">
                <div id="reward-suggestions" class="reward-suggestions"></div>
            </div>
        `;
        document.body.appendChild(rewardPanel);
        this.rewardPanelEl = rewardPanel;

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
        this.renderRewardSuggestions();
    },

    renderRewardSuggestions() {
        const container = document.getElementById('reward-suggestions');
        const input = document.getElementById('builder-reward-id');
        if (!container || !input) return;

        // Categorize Rewards
        const resources = ['NONE'];
        const specialties = [];

        if (window.ITEM_PICKUP_DATA) {
            Object.keys(window.ITEM_PICKUP_DATA).forEach(id => {
                if (!id.startsWith('REWARD_')) return;
                const data = window.ITEM_PICKUP_DATA[id];
                if (data.type === 'resource') resources.push(id);
                else specialties.push(id);
            });
        }

        const createChips = (list) => list.map(id => {
            const label = id === 'NONE' ? 'NONE' : id.replace('REWARD_', '').replace('BLUEPRINT_', 'BP:').replace('CARD_', 'CD:');
            const isSelected = input.value === (id === 'NONE' ? '' : id);
            return `<span class="reward-chip ${isSelected ? 'selected' : ''}" data-id="${id}">${label}</span>`;
        }).join('');

        container.innerHTML = `
            <div class="suggestions-col left">
                <div class="col-label">RESOURCES</div>
                ${createChips(resources)}
            </div>
            <div class="suggestions-col right">
                <div class="col-label">SPECIALTIES</div>
                ${createChips(specialties)}
            </div>
        `;

        container.querySelectorAll('.reward-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const id = chip.dataset.id;
                input.value = id === 'NONE' ? '' : id;
                container.querySelectorAll('.reward-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
            });
        });

        input.addEventListener('input', () => {
            container.querySelectorAll('.reward-chip').forEach(c => {
                const targetId = c.dataset.id === 'NONE' ? '' : c.dataset.id;
                c.classList.toggle('selected', input.value === targetId);
            });
        });
    },

    setupEventListeners() {
        // Hotkey Toggle
        window.addEventListener('keydown', (e) => {
            const overworldHidden = document.getElementById('screen-overworld').classList.contains('hidden');
            if (e.key.toLowerCase() === 'b' && !Overworld.isDialogueActive && !overworldHidden) {
                this.toggle();
            }
            if (this.active && e.key.toLowerCase() === 'm') {
                this.toggleMirror();
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
        document.getElementById('export-close').addEventListener('mousedown', (e) => e.stopPropagation());
        document.getElementById('export-close').addEventListener('click', () => {
            document.getElementById('builder-export-modal').classList.add('hidden');
        });

        // Show Hidden Toggle
        const toggleHiddenBtn = document.getElementById('builder-toggle-hidden');
        if (toggleHiddenBtn) {
            toggleHiddenBtn.addEventListener('click', () => {
                window.gameState.showAllHiddenStuff = !window.gameState.showAllHiddenStuff;
                toggleHiddenBtn.textContent = `SHOW HIDDEN: ${window.gameState.showAllHiddenStuff ? 'ON' : 'OFF'}`;
                toggleHiddenBtn.classList.toggle('active', window.gameState.showAllHiddenStuff);
                Overworld.renderMap(Overworld.currentZone);
            });
        }

        const toggleMirrorBtn = document.getElementById('builder-toggle-mirror');
        if (toggleMirrorBtn) {
            toggleMirrorBtn.addEventListener('click', () => {
                this.toggleMirror();
            });
        }

        document.getElementById('export-copy').addEventListener('mousedown', (e) => e.stopPropagation());
        document.getElementById('export-copy').addEventListener('click', (e) => {
            e.stopPropagation();
            const textarea = document.getElementById('export-textarea');
            textarea.select();
            document.execCommand('copy');
            
            // Subtle feedback instead of modal alert
            const btn = e.target;
            const originalText = btn.innerText;
            btn.innerText = "COPIED TO CLIPBOARD";
            btn.style.background = "#00ff66";
            btn.style.color = "#000";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "";
                btn.style.color = "";
            }, 2000);
        });

        // Export Button

        // Global Mouse Move for Snapping
        window.addEventListener('mousemove', (e) => {
            if (!this.active) return;
            this.updateMousePos(e);
        });

        // Global Mouse Click for Placement/Deletion
        window.addEventListener('mousedown', (e) => {
            // Ignore placement if clicking on UI palette, modal content, or the export overlay backdrop
            if (!this.active || 
                e.target.closest('#builder-palette') || 
                e.target.closest('#builder-reward-panel') || 
                e.target.closest('.modal-content') || 
                e.target.closest('#builder-export-modal')) return;
            
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
            this.rewardPanelEl?.classList.remove('hidden');
            document.body.classList.add('builder-active');
            Overworld.isPaused = true;
        } else {
            this.paletteEl.classList.add('hidden');
            this.rewardPanelEl?.classList.add('hidden');
            this.ghostEl.classList.add('hidden');
            document.body.classList.remove('builder-active');
            Overworld.isPaused = false;
        }
    },

    getTransformedTiles(template, isMirrored) {
        const tiles = template.tiles || [{ id: template.id, relX: 0, relY: 0 }];
        // Systematic Change: We no longer swap relX in the data.
        // The Engine handles the mirror-swap visually around the machine's shared center.
        return tiles.map(t => ({
            ...t,
            mirrored: isMirrored // Tag tiles so other systems know their visual state
        }));
    },

    toggleMirror() {
        this.isMirrored = !this.isMirrored;
        const btn = document.getElementById('builder-toggle-mirror');
        if (btn) {
            btn.textContent = `MIRROR: ${this.isMirrored ? 'ON' : 'OFF'}`;
            btn.classList.toggle('active', this.isMirrored);
        }
        if (this.selectedTemplate) this.updateGhost();
    },

    switchTab(category) {
        this.selectedType = category;
        const container = document.getElementById('palette-items');
        container.innerHTML = '';

        let items = [];
        if (category === 'furniture') items = Object.entries(FURNITURE_TEMPLATES);
        else if (category === 'terrain') items = TERRAIN_PALETTE.map(t => [t.id, t]);
        else if (category === 'doors') items = Object.entries(DOOR_TEMPLATES);

        // Advanced Universal Sorting (Props, Terrain, etc.)
        const getSortData = (item) => {
            const data = item[1];
            const name = data.name;
            const positionalKeywords = ['Top', 'Bottom', 'Left', 'Right', 'TL', 'TR', 'BL', 'BR', 'Inner', 'Edge', 'Center', 'Front', 'Back', 'Side', 'Face'];
            
            // 1. Identify ID for chronological sorting
            let numericId = 0;
            if (category === 'furniture') {
                const firstTile = data.tiles ? data.tiles[0].id : '';
                numericId = parseInt(firstTile.replace('f', '')) || 0;
            } else {
                numericId = parseInt(data.id) || 0;
            }

            // 2. Identify Positional Suffix
            let suffix = '';
            const suffixMatch = name.match(/[\(\-]\s*(.*?)\s*\)?$/i);
            if (suffixMatch) {
                suffix = suffixMatch[1].trim();
            }

            // 3. Identify Group (Base Anchor)
            const anchors = [
                'Wall', 'Floor', 'Window', 'Corner', 'Door', 
                'Tank', 'Plant', 'Table', 'Chair', 'Bed', 'Box', 'Cabinet',
                'Nitrophil', 'Lydrosome', 'Cambihil', 'ScifiDeco', 'HeavyDirty',
                'Noodle', 'Poster', 'Sign', 'Skeleton', 'Reward', 'Item', 'Petry', 'Petri'
            ];
            
            let foundAnchor = '';
            for (const anchor of anchors) {
                if (name.toLowerCase().includes(anchor.toLowerCase())) {
                    foundAnchor = anchor;
                    break;
                }
            }
            
            let group = foundAnchor || name;
            if (group === 'Wall') {
                if (name.includes('Edge')) group = 'Wall Edge';
                else if (name.includes('Center')) group = 'Wall Center';
            } else if (group === 'Floor') {
                if (name.includes('Stripe')) group = 'Floor Stripe';
                else if (name.includes('Basic')) group = 'Floor Basic';
            }

            return { group, suffix, numericId, originalName: name };
        };

        // Pre-calculate minimum ID per group to ensure groups are ordered by ID
        const groupMinIds = {};
        const itemsWithData = items.map(item => {
            const sortData = getSortData(item);
            if (!groupMinIds[sortData.group] || sortData.numericId < groupMinIds[sortData.group]) {
                groupMinIds[sortData.group] = sortData.numericId;
            }
            return { item, sortData };
        });

        const suffixPriority = {
            'Top': 1, 'Bottom': 2, 'Left': 3, 'Right': 4,
            'Top-Face': 1, 'Bottom-Face': 2, 'Left-Face': 3, 'Right-Face': 4,
            'Front-Face': 5, 'Back-Face': 6, 'Small': 10
        };

        itemsWithData.sort((a, b) => {
            const sA = a.sortData;
            const sB = b.sortData;

            // 1. Sort by Group's Minimum ID (Layer 1)
            const minIdA = groupMinIds[sA.group];
            const minIdB = groupMinIds[sB.group];
            if (minIdA !== minIdB) return minIdA - minIdB;

            // 2. Tie-break with Group Name alphabetically just in case
            if (sA.group !== sB.group) return sA.group.localeCompare(sB.group);

            // 3. Same group, priority by suffix (Layer 2)
            if (sA.suffix === '' && sB.suffix !== '') return -1;
            if (sA.suffix !== '' && sB.suffix === '') return 1;

            const pA = suffixPriority[sA.suffix] || 100;
            const pB = suffixPriority[sB.suffix] || 100;

            if (pA !== pB) return pA - pB;

            // 4. Final tie-break by ID
            return sA.numericId - sB.numericId;
        });

        itemsWithData.forEach(({item, sortData}) => {
            const data = item[1];
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

        const tiles = this.getTransformedTiles(this.selectedTemplate, this.isMirrored);
        
        // Calculate Bounding Box for Assembly-Center Origin
        const minX = Math.min(...tiles.map(t => t.relX || 0));
        const maxX = Math.max(...tiles.map(t => t.relX || 0));
        const centerX = (minX + maxX) / 2;

        const maxY = Math.max(...tiles.map(t => t.relY || 0));
        const centerY = maxY; // Pivot at the base (y-bottom)
        
        tiles.forEach(t => {
            const tile = document.createElement('div');
            const rx = t.relX || 0;
            const ry = t.relY || 0;

            // Set base class based on selection type
            if (this.selectedType === 'furniture') {
                tile.className = `world-object prop ${t.id}`;
                if (this.isMirrored) {
                    tile.classList.add('mirrored-object');
                    
                    // Systematic Visual Mirror (Pixel-Precise):
                    // Using px instead of % prevents sub-pixel rounding errors on the grid.
                    const ox_px = (centerX - rx + 0.5) * Overworld.tileSize;
                    const oy_px = (centerY - ry + 1.0) * Overworld.tileSize;
                    tile.style.transformOrigin = `${ox_px}px ${oy_px}px`;
                    tile.style.transform = 'translateZ(0)'; // Force GPU layer for crisp mirroring
                }
                
                // Auto-detect Tileset 03 based on ID (f64+)
                const numericId = parseInt(t.id.substring(1));
                if (numericId >= 64) {
                    tile.classList.add('tileset-03');
                }
            } else if (this.selectedType === 'terrain' || this.selectedType === 'doors') {
                tile.className = `tile t-${t.id}`;
                if (this.isMirrored) tile.classList.add('mirrored-object');
            }

            tile.style.position = 'absolute';
            tile.style.left = `${rx * Overworld.tileSize}px`;
            tile.style.top = `${ry * Overworld.tileSize}px`;
            tile.style.width = '100%';
            tile.style.height = '100%';
            tile.style.opacity = '0.5';
            tile.style.pointerEvents = 'none';
            this.ghostEl.appendChild(tile);
        });

        // Ensure ghost is visible if we have a selection
        this.ghostEl.classList.remove('hidden');
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
        const reward = document.getElementById('builder-reward-id')?.value.trim();
        
        const mirroredToSave = this.isMirrored;

        const tiles = this.getTransformedTiles(this.selectedTemplate, mirroredToSave);

        const templateKey = Object.keys(FURNITURE_TEMPLATES).find(key => FURNITURE_TEMPLATES[key] === this.selectedTemplate);

        tiles.forEach(t => {
            const newObj = {
                id: `${t.id}_${tid}`,
                templateName: templateKey,
                x: this.mouseGridX + (t.relX || 0),
                y: this.mouseGridY + (t.relY || 0),
                type: 'prop',
                mirrored: mirroredToSave,
                name: this.selectedTemplate.name
            };
            if (reward) newObj.hiddenReward = reward;
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
            obj.x === this.mouseGridX && obj.y === this.mouseGridY &&
            obj.type !== 'npc' && obj.type !== 'cell'
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
                    const transformedTiles = this.getTransformedTiles(template, target.mirrored);
                    const part = transformedTiles.find(t => t.id === baseId);
                    
                    if (part) {
                        // We found a template match! Find the "Root/Origin" of this instance
                        const rootX = target.x - (part.relX || 0);
                        const rootY = target.y - (part.relY || 0);

                        // Check every other part of THIS template relative to that root
                        transformedTiles.forEach(t => {
                            const partnerIdx = zone.objects.findIndex(obj => 
                                obj.x === (rootX + (t.relX || 0)) && 
                                obj.y === (rootY + (t.relY || 0)) &&
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

        // Filter out wild cells (temp), spawned NPCs (wild), and all NPCs as requested
        const exportedObjects = zone.objects.filter(obj => 
            !obj.temp && 
            !(obj.id && obj.id.includes('_wild_')) && 
            obj.type !== 'npc'
        );

        const exportData = {
            layout: zone.layout,
            objects: exportedObjects,
            doors: zone.doors
        };

        // Format into a nice string
        let output = `// --- EXPORTED DATA FOR ${zone.name} ---\n`;
        output += `layout: [\n${zone.layout.map(row => "    [" + row.join(",") + "]").join(",\n")}\n],\n`;
        output += `objects: [\n${exportedObjects.map(obj => "    " + JSON.stringify(obj)).join(",\n")}\n],\n`;
        output += `doors: [\n${zone.doors.map(d => "    " + JSON.stringify(d)).join(",\n")}\n]`;

        textarea.value = output;
        modal.classList.remove('hidden');
    }
};

window.BuilderMode = BuilderMode;
