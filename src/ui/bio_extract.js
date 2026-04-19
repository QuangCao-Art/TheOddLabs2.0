/**
 * Bio Extract Module for The Odd Labs
 * Handles the 3x3 extraction grid, merging, and biomass farming.
 */

export const BioExtract = {
    selectedSlotIdx: null,
    draggedMonster: null,
    sourceType: null, // 'storage' or 'grid'
    sourceSlotIdx: null,
    tickInterval: null,

    init() {
        this.setupEventListeners();
        this.startBackgroundTick();
    },

    setupEventListeners() {
        document.getElementById('btn-bio-extract-close')?.addEventListener('click', () => this.close());
        document.getElementById('btn-collect-biomass')?.addEventListener('click', () => this.collectCurrentSlot());

        // Global ESC to close if active
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !document.getElementById('screen-bio-extract').classList.contains('hidden')) {
                this.close();
            }
        });
    },

    open() {
        if (window.setBioExtractInputReady) {
            window.setBioExtractInputReady(false);
            setTimeout(() => window.setBioExtractInputReady(true), 250);
        }

        document.getElementById('screen-bio-extract').classList.remove('hidden');
        this.renderAll();
        this.updateBalances();
    },

    close() {
        window.hideWithFade('screen-bio-extract');
        if (window.Overworld) {
            window.Overworld.resetStates();
            window.Overworld.startLoop();
            // Force re-render to show updated grid cells immediately on exit
            if (window.Overworld.currentZone === 'bioExtraction') {
                window.Overworld.renderMap();
            }
        }
    },

    renderAll() {
        this.renderStorage();
        this.renderGrid();
        this.updateDetailPanel();
    },

    updateBalances() {
        const bmBalance = document.getElementById('bio-extract-bm-balance');
        if (bmBalance) bmBalance.textContent = window.gameState.biomass;
    },

    renderStorage() {
        const grid = document.getElementById('bio-extract-storage-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const playerProfile = window.gameState.profiles.player;
        // Storage is party[3+] and any monster NOT in bioExtractGrid
        // Actually, to make it simple, let's say monster in grid are REMOVED from party storage
        // But the user said "spare Cell here". 
        // Let's filter monsters that are NOT in the grid.
        
        const monstersInGridIds = window.gameState.bioExtractGrid
            .filter(slot => slot !== null)
            .map(slot => slot.monster.instanceId);

        const storageMonsters = playerProfile.party.filter(m => m !== null && !monstersInGridIds.includes(m.instanceId));

        // Skip first 3 (Active Squad) if they shouldn't be here, but user said "spare Cell"
        // Let's assume active squad (0,1,2) can be spare too if the player wants?
        // Usually "spare" means from storage (index 3+).
        const spareMonsters = storageMonsters.filter((m, idx) => {
            const partyIdx = playerProfile.party.indexOf(m);
            return partyIdx >= 3;
        });

        if (spareMonsters.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-reserve-msg';
            emptyMsg.innerText = 'No Cells are home at the moment!';
            grid.appendChild(emptyMsg);
        }

        spareMonsters.forEach((monster) => {
            const icon = document.createElement('div');
            icon.className = 'monster-icon';
            icon.draggable = true;

            const imgName = monster.name.charAt(0).toUpperCase() + monster.name.slice(1);
            icon.innerHTML = `
                <img src="./assets/images/${imgName}.png" alt="${monster.name}" onerror="this.src='./assets/images/Card_Placeholder.png'">
                <div class="efficiency-badge">${monster.extractEfficiency ?? 0}</div>
            `;

            icon.ondragstart = (e) => {
                this.draggedMonster = monster;
                this.sourceType = 'storage';
                this.sourceSlotIdx = null;
                e.dataTransfer.setData('text/plain', 'monster');
            };

            icon.onclick = () => {
                this.selectedSlotIdx = null; // Deselect grid slot
                this.updateDetailPanel(monster);
            };

            icon.onmouseenter = () => {
                this.selectedSlotIdx = null;
                this.updateDetailPanel(monster);
            };

            icon.onmouseenter = () => {
                this.selectedSlotIdx = null;
                this.updateDetailPanel(monster);
            };

            grid.appendChild(icon);
        });

        // Drop target for returning monsters to storage
        grid.ondragover = (e) => {
            e.preventDefault();
            grid.classList.add('drag-over');
        };

        grid.ondragleave = () => {
            grid.classList.remove('drag-over');
        };

        grid.ondrop = (e) => {
            e.preventDefault();
            grid.classList.remove('drag-over');
            if (this.sourceType === 'grid' && this.sourceSlotIdx !== null) {
                this.returnToStorage(this.sourceSlotIdx);
            }
        };
    },

    renderGrid() {
        const gridEl = document.getElementById('bio-extract-3x3-grid');
        if (!gridEl) return;
        gridEl.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            const slot = window.gameState.bioExtractGrid[i];
            const slotEl = document.createElement('div');
            slotEl.className = `extraction-slot ${this.selectedSlotIdx === i ? 'selected' : ''}`;
            slotEl.dataset.idx = i;

            if (slot) {
                const m = slot.monster;
                const imgName = m.name.charAt(0).toUpperCase() + m.name.slice(1);
                
                const icon = document.createElement('div');
                icon.className = 'monster-icon';
                icon.draggable = true;
                icon.innerHTML = `<img src="./assets/images/${imgName}.png" alt="${m.name}" onerror="this.src='./assets/images/Card_Placeholder.png'">`;
                
                const badge = document.createElement('div');
                badge.className = 'efficiency-badge';
                badge.innerText = m.extractEfficiency;

                icon.ondragstart = (e) => {
                    this.draggedMonster = m;
                    this.sourceType = 'grid';
                    this.sourceSlotIdx = i;
                    e.dataTransfer.setData('text/plain', 'monster');
                };

                icon.appendChild(badge);
                slotEl.appendChild(icon);

                // Add remove button to return to storage
                const removeBtn = document.createElement('button');
                removeBtn.className = 'btn-remove-monster btn-icon danger';
                removeBtn.innerHTML = 'X';
                removeBtn.title = 'Return to Cell Reserve';
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.returnToStorage(i);
                };
                slotEl.appendChild(removeBtn);

                // If enough biomass, add pulse
                const maxBM = this.getMaxBiomass(m);
                if (slot.biomassStored >= maxBM) {
                    slotEl.classList.add('ready-to-collect');
                }
            }

            slotEl.onclick = () => {
                this.selectedSlotIdx = i;
                this.renderGrid();
                this.updateDetailPanel();
            };

            slotEl.onmouseenter = () => {
                this.selectedSlotIdx = i;
                this.renderGrid();
                this.updateDetailPanel();
            };

            slotEl.onmouseenter = () => {
                this.selectedSlotIdx = i;
                this.renderGrid();
                this.updateDetailPanel();
            };

            // Drag and Drop
            slotEl.ondragover = (e) => {
                e.preventDefault();
                slotEl.classList.add('drag-over');
            };

            slotEl.ondragleave = () => {
                slotEl.classList.remove('drag-over');
            };

            slotEl.ondrop = (e) => {
                e.preventDefault();
                slotEl.classList.remove('drag-over');
                this.handleDrop(i);
            };

            gridEl.appendChild(slotEl);
        }
    },

    handleDrop(targetIdx) {
        if (!this.draggedMonster) return;

        const targetSlot = window.gameState.bioExtractGrid[targetIdx];

        if (this.sourceType === 'storage') {
            if (!targetSlot) {
                // Place new monster
                const level = this.draggedMonster.extractEfficiency || 0;
                window.gameState.bioExtractGrid[targetIdx] = {
                    monster: this.draggedMonster,
                    biomassStored: 0,
                    cycleRemaining: (2 * level + 1) * 60, // Adjusted formula
                    isReady: false,
                    lastTick: Date.now()
                };
            } else if (targetSlot.monster.name === this.draggedMonster.name) {
                const targetLevel = targetSlot.monster.extractEfficiency || 0;
                const sourceLevel = this.draggedMonster.extractEfficiency || 0;
                if (targetLevel === sourceLevel) {
                    this.mergeMonsters(targetIdx, this.draggedMonster);
                } else {
                    console.log("Merge restricted: Efficiency Levels must be identical.");
                }
            } else {
                console.log("Slot occupied by different species.");
            }
        } else if (this.sourceType === 'grid') {
            const sourceIdx = this.sourceSlotIdx;
            if (sourceIdx === targetIdx) return;

            const sourceSlot = window.gameState.bioExtractGrid[sourceIdx];

            if (!targetSlot) {
                // Move in grid
                window.gameState.bioExtractGrid[targetIdx] = sourceSlot;
                window.gameState.bioExtractGrid[sourceIdx] = null;
            } else if (targetSlot.monster.name === sourceSlot.monster.name) {
                const targetLevel = targetSlot.monster.extractEfficiency || 0;
                const sourceLevel = sourceSlot.monster.extractEfficiency || 0;
                if (targetLevel === sourceLevel) {
                    this.mergeMonsters(targetIdx, sourceSlot.monster);
                    window.gameState.bioExtractGrid[sourceIdx] = null;
                } else {
                    console.log("Merge restricted: Efficiency Levels must be identical.");
                }
            } else {
                // Swap in grid
                const temp = window.gameState.bioExtractGrid[targetIdx];
                window.gameState.bioExtractGrid[targetIdx] = window.gameState.bioExtractGrid[sourceIdx];
                window.gameState.bioExtractGrid[sourceIdx] = temp;
            }
        }

        this.draggedMonster = null;
        this.renderAll();
        // Sync with Overworld visuals
        this.syncOverworld();
    },

    returnToStorage(slotIdx) {
        if (window.gameState.bioExtractGrid[slotIdx]) {
            console.log(`Returning ${window.gameState.bioExtractGrid[slotIdx].monster.name} to storage.`);
            window.gameState.bioExtractGrid[slotIdx] = null;
            if (this.selectedSlotIdx === slotIdx) {
                this.selectedSlotIdx = null;
            }
            this.renderAll();
            this.syncOverworld();
        }
    },

    syncOverworld() {
        if (window.Overworld && window.Overworld.updateBioExtractVisuals) {
            window.Overworld.updateBioExtractVisuals();
            if (window.Overworld.currentZone === 'bioExtraction') {
                window.Overworld.renderMap();
            }
        }
    },

    mergeMonsters(targetGridIdx, sourceMonster) {
        const targetSlot = window.gameState.bioExtractGrid[targetGridIdx];
        const targetMonster = targetSlot.monster;

        // Upgrade level
        targetMonster.extractEfficiency++;
        
        // Stats are now applied dynamically in combat.js based on level.
        
        // If the source was in the party, remove it from the party
        const party = window.gameState.profiles.player.party;
        const pIdx = party.findIndex(m => m && m.instanceId === sourceMonster.instanceId);
        if (pIdx > -1) {
            party.splice(pIdx, 1);
        }

        console.log(`Merged ${sourceMonster.name}. New Efficiency: ${targetMonster.extractEfficiency}`);
        
        // Reset timer for the new, longer cycle
        targetSlot.cycleRemaining = (2 * targetMonster.extractEfficiency - 1) * 60;
        targetSlot.isReady = false;
        targetSlot.biomassStored = 0;
        targetSlot.lastTick = Date.now();
    },

    updateDetailPanel(previewMonster = null) {
        const nameEl = document.getElementById('bio-extract-cell-name');
        const imgEl = document.getElementById('bio-extract-detail-img');
        const effEl = document.getElementById('bio-extract-cell-efficiency');
        const timerEl = document.getElementById('bio-extract-timer');
        const amountEl = document.getElementById('bio-extract-ready-amount');
        const collectBtn = document.getElementById('btn-collect-biomass');
        const statusBox = document.querySelector('.extraction-status');
        const imgContainer = document.querySelector('.detail-card-container.mini');
        const panelTitle = document.querySelector('#bio-extract-details .panel-title');
        const bonusEl = document.getElementById('bio-extract-stat-bonus');
        const detailsPanel = document.getElementById('bio-extract-details');

        let monster = previewMonster;
        let slot = null;

        if (!monster && this.selectedSlotIdx !== null) {
            slot = window.gameState.bioExtractGrid[this.selectedSlotIdx];
            if (slot) monster = slot.monster;
        }

        if (monster) {
            const imgName = monster.name.charAt(0).toUpperCase() + monster.name.slice(1);
            imgEl.src = `./assets/images/${imgName}.png`;
            nameEl.textContent = monster.name.toUpperCase();
            nameEl.classList.remove('guide-text');
            if (detailsPanel) detailsPanel.classList.remove('guide-mode');
            if (panelTitle) panelTitle.style.display = 'block';
            effEl.textContent = `EFFICIENCY LEVEL ${monster.extractEfficiency}`;
            effEl.style.display = 'block';
            if (statusBox) statusBox.style.display = 'block';
            if (collectBtn) collectBtn.style.display = 'block';
            if (imgContainer) imgContainer.style.display = 'flex';
            
            if (bonusEl) {
                const bonusPercent = monster.extractEfficiency * 3;
                bonusEl.textContent = `+${bonusPercent}% TO ATK, DEF`;
                bonusEl.style.display = 'block';
            }

            if (slot) {
                if (collectBtn) {
                    if (slot.isReady) {
                        collectBtn.classList.remove('disabled');
                        collectBtn.disabled = false;
                    } else {
                        collectBtn.classList.add('disabled');
                        collectBtn.disabled = true;
                    }
                }

                if (!slot.isReady) {
                    const totalSecs = Math.max(0, Math.floor(slot.cycleRemaining || 0));
                    const mins = Math.floor(totalSecs / 60);
                    const secs = totalSecs % 60;
                    timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                    timerEl.classList.remove('hidden');
                    amountEl.classList.add('hidden');
                    collectBtn.disabled = true;
                } else {
                    amountEl.innerHTML = `${slot.biomassStored} <div class="icon-biomass mini"></div>`;
                    amountEl.classList.remove('hidden');
                    timerEl.classList.add('hidden');
                    collectBtn.disabled = false;
                }
            } else if (monster) {
                // Not in grid (preview)
                timerEl.textContent = 'READY';
                timerEl.classList.remove('hidden');
                amountEl.classList.add('hidden');
                collectBtn.disabled = true;
            }
        } else {
            imgEl.src = '';
            if (imgContainer) imgContainer.style.display = 'none';
            if (panelTitle) panelTitle.style.display = 'none';
            if (detailsPanel) detailsPanel.classList.add('guide-mode');
            nameEl.innerHTML = 'Drag a Cell to Bio-Extractor to produce BioMass.<br><br>Drag 2 of the same Cell to each other to merge them.';
            nameEl.classList.add('guide-text');
            effEl.style.display = 'none';
            if (bonusEl) {
                bonusEl.textContent = '';
                bonusEl.style.display = 'none';
            }
            if (statusBox) statusBox.style.display = 'none';
            if (collectBtn) collectBtn.style.display = 'none';
            timerEl.textContent = '00:00';
            timerEl.classList.add('hidden');
            amountEl.classList.add('hidden');
            collectBtn.disabled = true;
        }
    },

    getMaxBiomass(monster) {
        const level = monster.extractEfficiency || 0;
        return (level + 1) * 30; // Increased cap to accommodate balanced rewards
    },

    getBiomassRate(monster) {
        // Stemmy: 3 BM / 60s = 0.05 BM/s
        // Efficiency scales the rate linearly.
        const baseRate = 0.05; 
        return baseRate * (monster.extractEfficiency || 1);
    },

    collectCurrentSlot() {
        if (this.selectedSlotIdx === null) return;
        const slot = window.gameState.bioExtractGrid[this.selectedSlotIdx];
        if (!slot || !slot.isReady) return;

        const amount = Math.floor(slot.biomassStored);
        if (window.changeResource) {
            window.changeResource('bm', amount, false);
        } else {
            window.gameState.biomass += amount;
            if (window.updateResourceHUD) window.updateResourceHUD();
        }
        
        // Reset cycle
        const level = slot.monster.extractEfficiency || 0;
        slot.biomassStored = 0;
        slot.isReady = false;
        slot.cycleRemaining = (2 * level + 1) * 60; 
        slot.lastTick = Date.now();

        this.updateBalances();
        this.renderAll();
        console.log(`Collected ${amount} Biomass.`);
    },

    startBackgroundTick() {
        if (this.tickInterval) clearInterval(this.tickInterval);
        this.tickInterval = setInterval(() => {
            if (!window.gameState || !window.gameState.bioExtractGrid) return;
            
            let updated = false;
            const now = Date.now();

            window.gameState.bioExtractGrid.forEach((slot, idx) => {
                if (slot && slot.monster) {
                    const now = Date.now();
                    const elapsed = (now - slot.lastTick) / 1000;
                    slot.lastTick = now;

                    if (!slot.isReady) {
                        const level = slot.monster.extractEfficiency || 0;
                        const totalCycleTime = (2 * level + 1) * 60;
                        slot.cycleRemaining = Math.max(0, (slot.cycleRemaining || totalCycleTime) - elapsed);
                        if (slot.cycleRemaining <= 0) {
                            slot.isReady = true;
                            // Balanced Formula: 10 * level + 5
                            slot.biomassStored = 10 * level + 5;
                        }
                        updated = true;
                    }
                }
            });

            if (updated && !document.getElementById('screen-bio-extract').classList.contains('hidden')) {
                this.updateDetailPanel();
                // Optionally refresh grid visuals for "ready" state
                const slots = document.querySelectorAll('.extraction-slot');
                window.gameState.bioExtractGrid.forEach((slot, idx) => {
                    if (slot && slots[idx]) {
                        const max = this.getMaxBiomass(slot.monster);
                        if (slot.biomassStored >= max) {
                            slots[idx].classList.add('ready-to-collect');
                        } else {
                            slots[idx].classList.remove('ready-to-collect');
                        }
                    }
                });
            }
        }, 1000); // Check every second
    }
};

// Auto-init if window is available
if (typeof window !== 'undefined') {
    window.BioExtract = BioExtract;
}
