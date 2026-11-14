import test from 'node:test';
import assert from 'node:assert/strict';
import { GameUI } from '../../js/ui/GameUI.js';

// Raid EMP expiry can change support stats without a session event. The periodic
// refresh must supply type/level/branch, just as the event-driven read model does.
test('periodic live inspector retains selected tower metadata across support changes', () => {
  const tower = { id: 'defense-1', type: 'encryption', level: 3, specialization: 'sustain' };
  const session = { state: { selectedDefenseId: tower.id,
    defenses: new Map([[tower.id, tower]]), phase: 'WAVE', resources: { dharma: 12, bandwidth: 8, anonymity: 0 } } };
  let rendered;
  const ui = { renderCombatFeedback: () => {}, renderInspector: (s, model) => {
    assert.equal(s, session); rendered = model;
  } };
  GameUI.prototype.refreshLiveInspection.call(ui, session);
  assert.deepEqual(rendered.selectedTower, tower);
  assert.equal(rendered.phase, 'WAVE');
  assert.deepEqual(rendered.resources, session.state.resources);
  // Clearing selection still leaves combat text refresh usable.
  rendered = null;
  session.state.selectedDefenseId = null;
  GameUI.prototype.refreshLiveInspection.call(ui, session);
  assert.equal(rendered, null);
});
