// ---- State ----
let partners = [];
let currentPartnerId = null;
let barChartInstance = null;
let radarChartInstance = null;
let compareBarChartInstance = null;
let compareGroupedBarInstance = null;

const STORAGE_KEY = 'lpat_partners';

// ---- Utilities ----
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

function getEmptyScores() {
  const scores = {};
  ASSESSMENT_SCHEMA.sections.forEach(s => {
    s.questions.forEach(q => {
      scores[q.id] = { score: 0, evidence: '', priority: 'Low', nextAction: '' };
    });
  });
  return scores;
}

function getEmptyPartner(name) {
  return {
    id: genId(),
    name: name || '',
    orgType: '', geography: '', website: '', groveLink: '', contactPerson: '',
    currentWork: '', keyCommunities: '', valueChains: '', partnerNotes: '', evidenceLinks: '',
    isDemo: false,
    scores: getEmptyScores(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function sectionQuestionIds(sectionId) {
  const s = ASSESSMENT_SCHEMA.sections.find(x => x.id === sectionId);
  return s ? s.questions.map(q => q.id) : [];
}

function sumSection(scores, sectionId) {
  const ids = sectionQuestionIds(sectionId);
  return ids.reduce((sum, id) => sum + (scores[id] ? parseInt(scores[id].score) || 0 : 0), 0);
}

function sectionMax(sectionId) {
  const s = ASSESSMENT_SCHEMA.sections.find(x => x.id === sectionId);
  return s ? s.maxScore : 0;
}

function totalScore(scores) {
  return ASSESSMENT_SCHEMA.sections.reduce((sum, s) => sum + sumSection(scores, s.id), 0);
}

function percentFor(scores, sectionId) {
  const max = sectionMax(sectionId);
  return max ? Math.round((sumSection(scores, sectionId) / max) * 100) : 0;
}

function totalPercent(scores) {
  return Math.round((totalScore(scores) / ASSESSMENT_SCHEMA.maxTotalScore) * 100);
}

function getClassification(pct) {
  for (const c of ASSESSMENT_SCHEMA.classification) {
    if (pct <= c.max) return c;
  }
  return ASSESSMENT_SCHEMA.classification[ASSESSMENT_SCHEMA.classification.length - 1];
}

function getColorForPercent(pct) {
  if (pct <= 30) return 'var(--weak)';
  if (pct <= 50) return 'var(--emerging)';
  if (pct <= 70) return 'var(--moderate)';
  if (pct <= 85) return 'var(--strong)';
  return 'var(--very-high)';
}

function getClassForPercent(pct) {
  if (pct <= 30) return 'color-weak';
  if (pct <= 50) return 'color-emerging';
  if (pct <= 70) return 'color-moderate';
  if (pct <= 85) return 'color-strong';
  return 'color-very-high';
}

function getBgClassForPercent(pct) {
  if (pct <= 30) return 'bg-weak';
  if (pct <= 50) return 'bg-emerging';
  if (pct <= 70) return 'bg-moderate';
  if (pct <= 85) return 'bg-strong';
  return 'bg-very-high';
}

// ---- localStorage ----
function loadPartners() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
}

function savePartners() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
}

// ---- Demo Data ----
function generateDemoScores(sectionScores) {
  const scores = getEmptyScores();
  ASSESSMENT_SCHEMA.sections.forEach(s => {
    const targetTotal = sectionScores[s.id] || 0;
    const ids = s.questions.map(q => q.id);
    const n = ids.length;
    if (n === 0) return;
    const base = Math.floor(targetTotal / n);
    let remainder = targetTotal - base * n;
    ids.forEach((id, i) => {
      let val = base;
      if (i < remainder) val++;
      val = Math.min(val, 4);
      scores[id] = { score: val, evidence: '', priority: 'Medium', nextAction: '' };
    });
  });
  return scores;
}

function initDemoData() {
  const existing = loadPartners();
  if (existing.length > 0) { partners = existing; return; }
  DEMO_PARTNERS.forEach(dp => {
    const p = getEmptyPartner(dp.name);
    p.isDemo = true;
    p.scores = generateDemoScores(dp.sections);
    // Assign demo typology assessment based on total score tiers
    p.typologyAssessment = PARTNER_TYPES.map((pt, i) => {
      const baseScore = dp.totalScore >= 385 ? 4 : dp.totalScore >= 375 ? 3 : 2;
      const variance = (i % 3 === 0) ? 0 : (i % 3 === 1) ? -1 : 1;
      const fs = Math.max(0, Math.min(4, baseScore + variance));
      return { typeName: pt.name, fitScore: fs, evidence: '', recommendedEngagement: '' };
    });
    partners.push(p);
  });
  savePartners();
}

// ---- Tab Switching ----
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  document.querySelector(`.nav-btn[data-tab="${tabId}"]`).classList.add('active');
  if (tabId === 'score') updateScoreView();
  if (tabId === 'graphs') updateGraphs();
  if (tabId === 'compare') updateComparison();
  if (tabId === 'typology') updateTypology();
  if (tabId === 'journey') updateJourney();
  if (tabId === 'typology-form') loadTypologyForm(document.getElementById('typologyFormPartnerSelect').value);
}

// ---- Partner Form ----
function populatePartnerSelect() {
  const selects = ['partnerSelect', 'scorePartnerSelect', 'graphPartnerSelect', 'typologyPartnerSelect', 'journeyPartnerSelect', 'typologyFormPartnerSelect'];
  selects.forEach(sid => {
    const sel = document.getElementById(sid);
    if (!sel) return;
    const current = sel.value;
    sel.innerHTML = '<option value="">-- Select Partner --</option>' +
      (sid === 'partnerSelect' ? '<option value="">-- New Partner --</option>' : '');
    partners.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name || 'Unnamed Partner';
      if (p.isDemo) opt.textContent += ' (Demo)';
      sel.appendChild(opt);
    });
    if (current && [...sel.options].some(o => o.value === current)) sel.value = current;
  });
}

function renderChecklist() {
  const container = document.getElementById('checklistContainer');
  container.innerHTML = '';
  ASSESSMENT_SCHEMA.sections.forEach(section => {
    const acc = document.createElement('div');
    acc.className = 'accordion open';
    const ids = section.questions.map(q => q.id);
    let secScore = 0;
    if (currentPartnerId) {
      const p = partners.find(x => x.id === currentPartnerId);
      if (p) secScore = sumSection(p.scores, section.id);
    }
    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.onclick = () => acc.classList.toggle('open');
    header.innerHTML = `<span>${section.id}. ${section.name} <span class="section-score">(${secScore}/${section.maxScore})</span></span><span>&#9660;</span>`;
    const body = document.createElement('div');
    body.className = 'accordion-body';
    section.questions.forEach(q => {
      const row = document.createElement('div');
      row.className = 'question-row';
      row.id = 'qrow-' + q.id;

      const qText = document.createElement('div');
      qText.className = 'question-text';
      qText.textContent = q.text;

      const scoreSelect = document.createElement('select');
      for (let i = 0; i <= 4; i++) scoreSelect.appendChild(new Option(i.toString(), i));
      scoreSelect.onchange = () => updateQuestionScore(q.id, parseInt(scoreSelect.value));

      const evArea = document.createElement('textarea');
      evArea.rows = 2;
      evArea.placeholder = 'Evidence / notes';
      evArea.onchange = () => updateQuestionField(q.id, 'evidence', evArea.value);

      const prioSelect = document.createElement('select');
      ['Low', 'Medium', 'High'].forEach(pr => prioSelect.appendChild(new Option(pr, pr)));
      prioSelect.onchange = () => updateQuestionField(q.id, 'priority', prioSelect.value);

      const actionArea = document.createElement('textarea');
      actionArea.rows = 2;
      actionArea.placeholder = 'Suggested next action';
      actionArea.onchange = () => updateQuestionField(q.id, 'nextAction', actionArea.value);

      row.appendChild(qText);
      row.appendChild(scoreSelect);
      row.appendChild(evArea);
      row.appendChild(prioSelect);
      row.appendChild(actionArea);
      body.appendChild(row);
    });
    // Add column headers before questions
    const headerRow = document.createElement('div');
    headerRow.className = 'question-row-header';
    headerRow.innerHTML = '<div>Question</div><div>Score</div><div>Evidence / Notes</div><div>Priority</div><div>Next Action</div>';
    body.appendChild(headerRow);
    acc.appendChild(header);
    acc.appendChild(body);
    container.appendChild(acc);
  });
}

function loadFormFromPartner(p) {
  if (!p) return;
  document.getElementById('partnerName').value = p.name || '';
  document.getElementById('orgType').value = p.orgType || '';
  document.getElementById('geography').value = p.geography || '';
  document.getElementById('website').value = p.website || '';
  document.getElementById('groveLink').value = p.groveLink || '';
  document.getElementById('contactPerson').value = p.contactPerson || '';
  document.getElementById('currentWork').value = p.currentWork || '';
  document.getElementById('keyCommunities').value = p.keyCommunities || '';
  document.getElementById('valueChains').value = p.valueChains || '';
  document.getElementById('partnerNotes').value = p.partnerNotes || '';
  document.getElementById('evidenceLinks').value = p.evidenceLinks || '';
  const badge = document.getElementById('demoBadge');
  badge.style.display = p.isDemo ? 'inline-block' : 'none';
  document.getElementById('deletePartnerBtn').style.display = 'inline-block';

  // Load scores into form
  ASSESSMENT_SCHEMA.sections.forEach(section => {
    section.questions.forEach(q => {
      const val = p.scores[q.id];
      if (!val) return;
      const row = document.getElementById('qrow-' + q.id);
      if (!row) return;
      row.querySelectorAll('select')[0].value = val.score || 0;
      row.querySelectorAll('textarea')[0].value = val.evidence || '';
      row.querySelectorAll('select')[1].value = val.priority || 'Low';
      row.querySelectorAll('textarea')[1].value = val.nextAction || '';
    });
  });
  updateAllSectionScores();
}

function getFormData() {
  const name = document.getElementById('partnerName').value.trim();
  if (!name) { showToast('Partner name is required', 'error'); return null; }
  const scores = {};
  ASSESSMENT_SCHEMA.sections.forEach(section => {
    section.questions.forEach(q => {
      const row = document.getElementById('qrow-' + q.id);
      if (!row) { scores[q.id] = { score: 0, evidence: '', priority: 'Low', nextAction: '' }; return; }
      scores[q.id] = {
        score: parseInt(row.querySelectorAll('select')[0].value) || 0,
        evidence: row.querySelectorAll('textarea')[0].value || '',
        priority: row.querySelectorAll('select')[1].value || 'Low',
        nextAction: row.querySelectorAll('textarea')[1].value || ''
      };
    });
  });
  return {
    name, scores,
    orgType: document.getElementById('orgType').value,
    geography: document.getElementById('geography').value,
    website: document.getElementById('website').value,
    groveLink: document.getElementById('groveLink').value,
    contactPerson: document.getElementById('contactPerson').value,
    currentWork: document.getElementById('currentWork').value,
    keyCommunities: document.getElementById('keyCommunities').value,
    valueChains: document.getElementById('valueChains').value,
    partnerNotes: document.getElementById('partnerNotes').value,
    evidenceLinks: document.getElementById('evidenceLinks').value
  };
}

function savePartner() {
  const data = getFormData();
  if (!data) return;
  if (currentPartnerId) {
    const idx = partners.findIndex(p => p.id === currentPartnerId);
    if (idx >= 0) {
      const existing = partners[idx];
      partners[idx] = { ...existing, ...data, isDemo: false, id: existing.id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() };
    }
  } else {
    const p = getEmptyPartner(data.name);
    partners.push({ ...p, ...data, id: p.id, createdAt: p.createdAt, updatedAt: new Date().toISOString() });
    currentPartnerId = p.id;
  }
  savePartners();
  populatePartnerSelect();
  if (currentPartnerId) document.getElementById('partnerSelect').value = currentPartnerId;
  renderCompareSelection();
  showToast('Partner saved successfully', 'success');
}

function loadPartner(id) {
  if (!id) { resetForm(); return; }
  const p = partners.find(x => x.id === id);
  if (!p) return;
  currentPartnerId = id;
  renderChecklist();
  loadFormFromPartner(p);
}

function resetForm() {
  currentPartnerId = null;
  document.getElementById('partnerSelect').value = '';
  document.getElementById('partnerName').value = '';
  document.getElementById('orgType').value = '';
  document.getElementById('geography').value = '';
  document.getElementById('website').value = '';
  document.getElementById('groveLink').value = '';
  document.getElementById('contactPerson').value = '';
  document.getElementById('currentWork').value = '';
  document.getElementById('keyCommunities').value = '';
  document.getElementById('valueChains').value = '';
  document.getElementById('partnerNotes').value = '';
  document.getElementById('evidenceLinks').value = '';
  document.getElementById('demoBadge').style.display = 'none';
  document.getElementById('deletePartnerBtn').style.display = 'none';
  renderChecklist();
}

function deletePartner() {
  if (!currentPartnerId) return;
  if (!confirm('Delete this partner assessment? This cannot be undone.')) return;
  partners = partners.filter(p => p.id !== currentPartnerId);
  savePartners();
  populatePartnerSelect();
  renderCompareSelection();
  resetForm();
}

let saveTimeout = null;
function debouncedSavePartners() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => { savePartners(); }, 500);
}

function updateQuestionScore(qid, val) {
  if (!currentPartnerId) return;
  const p = partners.find(x => x.id === currentPartnerId);
  if (!p) return;
  if (!p.scores[qid]) p.scores[qid] = { score: 0, evidence: '', priority: 'Low', nextAction: '' };
  p.scores[qid].score = val;
  p.updatedAt = new Date().toISOString();
  debouncedSavePartners();
  updateAllSectionScores();
}

function updateQuestionField(qid, field, val) {
  if (!currentPartnerId) return;
  const p = partners.find(x => x.id === currentPartnerId);
  if (!p) return;
  if (!p.scores[qid]) p.scores[qid] = { score: 0, evidence: '', priority: 'Low', nextAction: '' };
  p.scores[qid][field] = val;
  p.updatedAt = new Date().toISOString();
  debouncedSavePartners();
}

function updateAllSectionScores() {
  if (!currentPartnerId) return;
  const p = partners.find(x => x.id === currentPartnerId);
  if (!p) return;
  const accordions = document.querySelectorAll('#checklistContainer .accordion');
  ASSESSMENT_SCHEMA.sections.forEach((section, idx) => {
    const score = sumSection(p.scores, section.id);
    const header = accordions[idx] ? accordions[idx].querySelector('.accordion-header span') : null;
    if (header) {
      header.innerHTML = `${section.id}. ${section.name} <span class="section-score">(${score}/${section.maxScore})</span>`;
    }
  });
}

// ---- Notification Toast ----
function showToast(message, type) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:8px;color:#fff;font-size:14px;font-weight:500;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);animation:slideIn 0.3s ease;max-width:400px';
  toast.style.background = type === 'error' ? '#dc3545' : type === 'warning' ? '#fd7e14' : '#1a7a37';
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ---- Export / Import ----
function exportPartner() {
  if (!currentPartnerId) { showToast('No partner selected', 'warning'); return; }
  const p = partners.find(x => x.id === currentPartnerId);
  if (!p) return;
  const blob = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (p.name || 'partner') + '_assessment.json';
  a.click();
}

function importPartner(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.scores) { showToast('Invalid partner data', 'error'); return; }
      const name = data.name || 'Imported Partner';
      const idx = partners.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
      if (idx >= 0) {
        const existing = partners[idx];
        partners[idx] = {
          ...existing,
          ...data,
          id: existing.id, isDemo: false, createdAt: existing.createdAt, updatedAt: new Date().toISOString()
        };
        savePartners();
        populatePartnerSelect();
        renderCompareSelection();
        currentPartnerId = existing.id;
        loadPartner(existing.id);
        showToast(`Updated "${name}" from import`, 'success');
      } else {
        const p = getEmptyPartner(name);
        partners.push({
          ...data,
          id: p.id, isDemo: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          orgType: data.orgType || '', geography: data.geography || '', website: data.website || '',
          groveLink: data.groveLink || '', contactPerson: data.contactPerson || '',
          currentWork: data.currentWork || '', keyCommunities: data.keyCommunities || '',
          valueChains: data.valueChains || '', partnerNotes: data.partnerNotes || '',
          evidenceLinks: data.evidenceLinks || ''
        });
        savePartners();
        populatePartnerSelect();
        renderCompareSelection();
        currentPartnerId = p.id;
        loadPartner(p.id);
        showToast('Partner imported successfully', 'success');
      }
    } catch (err) { showToast('Invalid JSON file', 'error'); }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function downloadCSV() {
  if (!currentPartnerId) { showToast('No partner selected', 'warning'); return; }
  const p = partners.find(x => x.id === currentPartnerId);
  if (!p) return;
  let csv = 'Section,Question ID,Question,Score (0-4),Evidence,Priority,Next Action\n';
  ASSESSMENT_SCHEMA.sections.forEach(s => {
    s.questions.forEach(q => {
      const v = p.scores[q.id] || {};
      csv += `"${s.name}","${q.id}","${q.text.replace(/"/g, '""')}",${v.score || 0},"${(v.evidence||'').replace(/"/g, '""')}","${v.priority||'Low'}","${(v.nextAction||'').replace(/"/g, '""')}"\n`;
    });
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (p.name || 'partner') + '_assessment.csv';
  a.click();
}

function exportAllData() {
  const blob = new Blob([JSON.stringify(partners, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'lpat_all_partners.json';
  a.click();
}

function importAllData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) { showToast('Invalid data format - expected array', 'error'); return; }
      if (!confirm(`Replace all existing data with ${data.length} partners?`)) return;
      partners = data;
      savePartners();
      populatePartnerSelect();
      renderCompareSelection();
      resetForm();
      showToast(`Imported ${data.length} partners successfully`, 'success');
    } catch (err) { showToast('Invalid JSON file', 'error'); }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// ---- XLSX Import ----
function importExcel(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (typeof XLSX === 'undefined') { showToast('XLSX library not loaded. Check internet connection.', 'error'); return; }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const partner = getEmptyPartner('Imported from Excel');
      partner.isDemo = false;

      // Store for imported typology assessment
      const importedTypology = [];

      // --- Parse Partner_Typology sheet ---
      const typologySheet = workbook.Sheets['Partner_Typology'];
      if (typologySheet) {
        const typologyRows = XLSX.utils.sheet_to_json(typologySheet, { header: 1 });
        typologyRows.forEach((row, idx) => {
          if (idx < 3) return; // skip title and header rows
          if (!row || row.length < 4 || !row[0]) return;
          const typeName = String(row[0]).trim();
          const fitScore = parseInt(row[3]);
          if (!typeName || isNaN(fitScore)) return;
          importedTypology.push({
            typeName,
            fitScore: Math.max(0, Math.min(4, fitScore)),
            evidence: row[4] ? String(row[4]).trim() : '',
            recommendedEngagement: row[6] ? String(row[6]).trim() : ''
          });
        });
      }

      // Map imported typology into the standard typologyAssessment array
      partner.typologyAssessment = getEmptyTypologyAssessment();
      importedTypology.forEach(imp => {
        const idx = PARTNER_TYPES.findIndex(pt => pt.name.toLowerCase() === imp.typeName.toLowerCase());
        if (idx >= 0) {
          partner.typologyAssessment[idx] = imp;
        }
      });

      // --- Parse Partner_Profile sheet ---
      const profileSheet = workbook.Sheets['Partner_Profile'];
      if (profileSheet) {
        const profileRows = XLSX.utils.sheet_to_json(profileSheet, { header: 1 });
        const labelsToFields = {
          'organisation name': 'name',
          'primary geography': 'geography',
          'states': 'geography',
          'domain of work': 'orgType',
          'current livelihood': 'currentWork',
          'primary contact': 'contactPerson',
          'email': 'contactPerson',
          'website': 'website',
          'communities served': 'keyCommunities',
          'key value chains': 'valueChains',
          'value chain': 'valueChains'
        };
        profileRows.forEach(row => {
          if (!row || !row[0]) return;
          const label = String(row[0]).trim().toLowerCase();
          const value = row[1] ? String(row[1]).trim() : '';
          if (!value) return;
          for (const [key, field] of Object.entries(labelsToFields)) {
            if (label.includes(key)) {
              if (field === 'geography' && partner[field]) {
                partner[field] += '; ' + value;
              } else if (field === 'contactPerson' && partner[field]) {
                partner[field] += ' / ' + value;
              } else {
                partner[field] = value;
              }
              break;
            }
          }
        });
      }

      // --- Parse Checklist sheet ---
      const checklistSheet = workbook.Sheets['Checklist'];
      if (!checklistSheet) { showToast('Excel must have a "Checklist" sheet', 'error'); return; }

      const checklistRows = XLSX.utils.sheet_to_json(checklistSheet, { header: 1 });
      let importCount = 0;

      checklistRows.forEach((row, idx) => {
        if (idx === 0) return; // skip header row
        if (!row || row.length < 6) return;

        const sectionCode = String(row[0] || '').trim();
        const questionNum = String(row[2] || '').trim();
        const qId = sectionCode + questionNum;
        if (!qId || qId.length < 2) return;

        // Validate question ID exists in schema
        const validId = ASSESSMENT_SCHEMA.sections.some(s =>
          s.questions.some(q => q.id === qId)
        );
        if (!validId) return;

        const scoreVal = parseInt(row[5]) || 0;
        const clampedScore = Math.max(0, Math.min(4, scoreVal));
        const evidence = row[6] ? String(row[6]).trim() : '';
        const nextAction = row[7] ? String(row[7]).trim() : '';
        let priority = 'Low';
        if (row[8]) {
          const p = String(row[8]).trim().toLowerCase();
          if (p.includes('high')) priority = 'High';
          else if (p.includes('medium') || p.includes('med')) priority = 'Medium';
        }

        partner.scores[qId] = { score: clampedScore, evidence, priority, nextAction };
        importCount++;
      });

      if (importCount === 0) { showToast('No valid question data found in Checklist sheet', 'error'); return; }

      // Rename if still using default
      if (partner.name === 'Imported from Excel' || !partner.name) {
        partner.name = partner.name || 'Imported Partner';
      }

      const existingIdx = partners.findIndex(p => p.name.toLowerCase() === partner.name.toLowerCase());
      if (existingIdx >= 0) {
        const existing = partners[existingIdx];
        partners[existingIdx] = {
          ...existing,
          scores: partner.scores,
          typologyAssessment: partner.typologyAssessment,
          isDemo: false, updatedAt: new Date().toISOString()
        };
        // Merge profile fields from Excel
        ['orgType', 'geography', 'website', 'currentWork', 'contactPerson', 'keyCommunities', 'valueChains'].forEach(f => {
          if (partner[f]) partners[existingIdx][f] = partner[f];
        });
        savePartners();
        populatePartnerSelect();
        renderCompareSelection();
        currentPartnerId = existing.id;
        loadPartner(existing.id);
        showToast(`Updated "${partner.name}" with ${importCount} questions from Excel`, 'success');
      } else {
        partners.push(partner);
        savePartners();
        populatePartnerSelect();
        renderCompareSelection();
        currentPartnerId = partner.id;
        loadPartner(partner.id);
        showToast(`Imported ${importCount} questions from Excel for "${partner.name}"`, 'success');
      }
    } catch (err) { showToast('Error reading Excel file: ' + err.message, 'error'); }
  };
  reader.readAsArrayBuffer(file);
  event.target.value = '';
}

// ---- Typology Form ----
function getEmptyTypologyAssessment() {
  return PARTNER_TYPES.map(pt => ({
    typeName: pt.name,
    fitScore: 0,
    evidence: '',
    recommendedEngagement: ''
  }));
}

function loadTypologyForm(id) {
  const container = document.getElementById('typologyFormContainer');
  if (!id) {
    container.innerHTML = '<p class="text-muted">Select a partner to assess typology fit</p>';
    return;
  }
  const p = partners.find(x => x.id === id);
  if (!p) return;
  if (!p.typologyAssessment || p.typologyAssessment.length !== PARTNER_TYPES.length) {
    p.typologyAssessment = getEmptyTypologyAssessment();
  }
  renderTypologyForm(p);
}

function renderTypologyForm(p) {
  const container = document.getElementById('typologyFormContainer');
  let html = '';
  PARTNER_TYPES.forEach((pt, idx) => {
    const ta = p.typologyAssessment[idx] || { fitScore: 0, evidence: '', recommendedEngagement: '' };
    html += `<div class="card" style="margin-bottom:12px">
      <div class="card-header"><h3>${pt.name}</h3></div>
      <div class="card-body">
        <p style="font-size:12px;color:var(--text-light);margin-bottom:12px">${pt.description}</p>
        <div style="display:grid;grid-template-columns:120px 1fr;gap:10px;align-items:start">
          <div>
            <label style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-light)">Fit Score (0-4)</label>
            <select id="tf-${pt.id}-score" onchange="saveTypologyField('${p.id}', ${idx}, 'fitScore', parseInt(this.value))" style="display:block;margin-top:4px;width:100%">
              ${[0,1,2,3,4].map(v => `<option value="${v}" ${ta.fitScore === v ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div>
              <label style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-light)">Evidence</label>
              <textarea id="tf-${pt.id}-ev" rows="3" style="display:block;margin-top:4px;width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;font-family:inherit;resize:vertical" placeholder="Notes explaining the fit score" onchange="saveTypologyField('${p.id}', ${idx}, 'evidence', this.value)">${ta.evidence || ''}</textarea>
            </div>
            <div>
              <label style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-light)">Recommended Engagement</label>
              <textarea id="tf-${pt.id}-eng" rows="3" style="display:block;margin-top:4px;width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;font-family:inherit;resize:vertical" placeholder="How should we engage this partner?" onchange="saveTypologyField('${p.id}', ${idx}, 'recommendedEngagement', this.value)">${ta.recommendedEngagement || ''}</textarea>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  });
  container.innerHTML = html;
}

function saveTypologyField(partnerId, typeIdx, field, value) {
  const p = partners.find(x => x.id === partnerId);
  if (!p) return;
  if (!p.typologyAssessment) p.typologyAssessment = getEmptyTypologyAssessment();
  if (!p.typologyAssessment[typeIdx]) p.typologyAssessment[typeIdx] = { fitScore: 0, evidence: '', recommendedEngagement: '' };
  p.typologyAssessment[typeIdx][field] = value;
  p.updatedAt = new Date().toISOString();
  debouncedSavePartners();
}

function confirmResetAll() {
  if (!confirm('Delete ALL partner data? This cannot be undone.')) return;
  partners = [];
  savePartners();
  populatePartnerSelect();
  renderCompareSelection();
  resetForm();
  document.querySelectorAll('.tab-content').forEach(t => {
    const dynamicAreas = t.querySelectorAll('[id$="Results"], [id$="Summary"], [id$="Table"], [id$="ScoresTable"]');
    dynamicAreas.forEach(el => { if (el) el.innerHTML = ''; });
  });
  showToast('All data reset. Reload page to re-initialize demo data.', 'warning');
}

// ---- Score View ----
function updateScoreView() {
  const id = document.getElementById('scorePartnerSelect').value;
  const p = partners.find(x => x.id === id);
  if (!p) {
    document.getElementById('scoreSummaryCards').innerHTML = '<p class="text-muted">Select a partner to view scores</p>';
    document.getElementById('sectionScoresTable').innerHTML = '';
    document.getElementById('gapsRecommendations').innerHTML = '';
    document.getElementById('strongestWeakest').innerHTML = '';
    return;
  }
  const total = totalScore(p.scores);
  const pct = totalPercent(p.scores);
  const cls = getClassification(pct);

  // Summary cards
  let cardsHtml = `
    <div class="score-card"><div class="score-value" style="color:${getColorForPercent(pct)}">${total}</div><div class="score-label">Total Score / ${ASSESSMENT_SCHEMA.maxTotalScore}</div></div>
    <div class="score-card"><div class="score-value" style="color:${getColorForPercent(pct)}">${pct}%</div><div class="score-label">Percentage</div></div>
    <div class="score-card"><div class="score-value" style="color:${cls.color};font-size:20px">${cls.label}</div><div class="score-label">Classification</div><div class="score-sub" style="color:${cls.color}">${cls.description}</div></div>
  `;
  document.getElementById('scoreSummaryCards').innerHTML = cardsHtml;

  // Section scores table
  let tableHtml = '<div class="table-responsive"><table class="section-scores-table"><thead><tr><th>Section</th><th>Score</th><th>Max</th><th>%</th><th>Bar</th></tr></thead><tbody>';
  const sectionPcts = [];
  ASSESSMENT_SCHEMA.sections.forEach(s => {
    const sc = sumSection(p.scores, s.id);
    const pct2 = percentFor(p.scores, s.id);
    const barColor = getColorForPercent(pct2);
    sectionPcts.push({ id: s.id, name: s.name, pct: pct2, score: sc, max: s.maxScore });
    tableHtml += `<tr>
      <td><strong>${s.id}.</strong> ${s.name}</td>
      <td style="font-weight:600">${sc}</td>
      <td>${s.maxScore}</td>
      <td style="color:${barColor};font-weight:600">${pct2}%</td>
      <td><div class="score-bar"><div class="score-bar-fill ${getBgClassForPercent(pct2)}" style="width:${pct2}%"></div></div></td>
    </tr>`;
  });
  tableHtml += '</tbody></table></div>';
  document.getElementById('sectionScoresTable').innerHTML = tableHtml;

  // Strongest & Weakest
  const sorted = [...sectionPcts].sort((a, b) => b.pct - a.pct);
  const strongest = sorted.slice(0, 3);
  const weakest = sorted.slice(-3).reverse();
  document.getElementById('strongestWeakest').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div><h4 style="color:var(--strong);margin-bottom:8px">Strongest 3 Sections</h4>
        ${strongest.map(s => `<div style="padding:4px 0"><strong>${s.id}.</strong> ${s.name} — ${s.pct}% (${s.score}/${s.max})</div>`).join('')}
      </div>
      <div><h4 style="color:var(--danger);margin-bottom:8px">Weakest 3 Sections</h4>
        ${weakest.map(s => `<div style="padding:4px 0"><strong>${s.id}.</strong> ${s.name} — ${s.pct}% (${s.score}/${s.max})</div>`).join('')}
      </div>
    </div>
  `;

  // Gaps
  let gapsHtml = '';
  let hasGap = false;
  GAP_RECOMMENDATIONS.forEach(g => {
    const scPct = percentFor(p.scores, g.section);
    if (scPct < g.threshold) {
      hasGap = true;
      gapsHtml += `<div class="gap-item"><strong>Section ${g.section}:</strong> ${scPct}% — ${g.recommendation}</div>`;
    }
  });
  if (!hasGap) gapsHtml = '<p style="color:var(--strong)">No critical gaps identified. All sections above 60%.</p>';
  document.getElementById('gapsRecommendations').innerHTML = gapsHtml;
}

// ---- Graphs ----
function updateGraphs() {
  // Render section key (A-M legend)
  const keyContainer = document.getElementById('sectionKeyContainer');
  keyContainer.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:4px 16px;font-size:12px">' +
    ASSESSMENT_SCHEMA.sections.map(s => `<div><strong>${s.id}:</strong> ${s.name}</div>`).join('') +
    '</div>';

  const id = document.getElementById('graphPartnerSelect').value;
  const p = partners.find(x => x.id === id);
  if (!p) {
    document.getElementById('scoreCardSummary').innerHTML = '<p class="text-muted">Select a partner to view graphs</p>';
    return;
  }
  const pcts = ASSESSMENT_SCHEMA.sections.map(s => percentFor(p.scores, s.id));
  const colors = pcts.map(pct => getColorForPercent(pct));

  // Bar Chart
  if (barChartInstance) barChartInstance.destroy();
  const barCtx = document.getElementById('barChart').getContext('2d');
  barChartInstance = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ASSESSMENT_SCHEMA.sections.map(s => s.id),
      datasets: [{
        label: 'Score %',
        data: pcts,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ctx.raw + '%' } } },
      scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage' } } }
    }
  });

  // Radar Chart
  if (radarChartInstance) radarChartInstance.destroy();
  const radarCtx = document.getElementById('radarChart').getContext('2d');
  radarChartInstance = new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: ASSESSMENT_SCHEMA.sections.map(s => s.id),
      datasets: [{
        label: p.name,
        data: pcts,
        backgroundColor: 'rgba(26,122,55,0.2)',
        borderColor: 'rgba(26,122,55,0.8)',
        pointBackgroundColor: colors,
        pointBorderColor: '#fff',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } } },
      plugins: { tooltip: { callbacks: { label: ctx => ctx.label + ': ' + ctx.raw + '%' } } }
    }
  });

  // Score Card Summary
  const total = totalScore(p.scores);
  const pct = totalPercent(p.scores);
  const cls = getClassification(pct);
  document.getElementById('scoreCardSummary').innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px">
      <div style="text-align:center"><strong style="font-size:28px;color:${getColorForPercent(pct)}">${total}</strong><br><span style="font-size:12px;color:var(--text-light)">Total / ${ASSESSMENT_SCHEMA.maxTotalScore}</span></div>
      <div style="text-align:center"><strong style="font-size:28px;color:${getColorForPercent(pct)}">${pct}%</strong><br><span style="font-size:12px;color:var(--text-light)">Overall</span></div>
      <div style="text-align:center"><strong style="font-size:16px;color:${cls.color}">${cls.label}</strong><br><span style="font-size:12px;color:var(--text-light)">${cls.description}</span></div>
      ${ASSESSMENT_SCHEMA.sections.map(s => `<div style="text-align:center"><strong style="color:${getColorForPercent(percentFor(p.scores, s.id))}">${sumSection(p.scores, s.id)}/${s.maxScore}</strong><br><span style="font-size:11px;color:var(--text-light)">${s.id}: ${percentFor(p.scores, s.id)}%</span></div>`).join('')}
    </div>
  `;
}

// ---- Compare ----
function renderCompareSelection() {
  const container = document.getElementById('compareSelection');
  let html = '<div class="compare-checkbox-group">';
  partners.forEach(p => {
    html += `<label class="compare-checkbox" data-id="${p.id}">
      <input type="checkbox" value="${p.id}" onchange="updateComparison()"> ${p.name}${p.isDemo ? ' (Demo)' : ''}
    </label>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

function getSelectedCompareIds() {
  const checks = document.querySelectorAll('#compareSelection input[type="checkbox"]:checked');
  return [...checks].map(c => c.value);
}

function recheckCompareBoxes(ids) {
  ids.forEach(id => {
    const cb = document.querySelector(`#compareSelection input[value="${id}"]`);
    if (cb) cb.checked = true;
    const lbl = document.querySelector(`.compare-checkbox[data-id="${id}"]`);
    if (lbl) lbl.classList.add('selected');
  });
}

function updateComparison() {
  const prevIds = getSelectedCompareIds();
  renderCompareSelection();
  recheckCompareBoxes(prevIds);
  const ids = getSelectedCompareIds();
  const selected = ids.map(id => partners.find(p => p.id === id)).filter(Boolean);
  const filterSection = document.getElementById('compareSectionFilter').value;

  if (selected.length === 0) {
    document.getElementById('compareTable').innerHTML = '<p class="text-muted">Select partners to compare</p>';
    if (compareBarChartInstance) { compareBarChartInstance.destroy(); compareBarChartInstance = null; }
    if (compareGroupedBarInstance) { compareGroupedBarInstance.destroy(); compareGroupedBarInstance = null; }
    return;
  }

  // Comparison table
  let tableHtml = '<div class="table-responsive"><table class="section-scores-table"><thead><tr><th>Partner</th><th>Total Score</th><th>%</th><th>Classification</th>';
  if (filterSection === 'ALL') {
    ASSESSMENT_SCHEMA.sections.forEach(s => { tableHtml += `<th>${s.id}</th>`; });
  } else {
    const s = ASSESSMENT_SCHEMA.sections.find(x => x.id === filterSection);
    if (s) tableHtml += `<th>${s.id} (/${s.maxScore})</th>`;
  }
  tableHtml += '</tr></thead><tbody>';

  const sectionBest = {};
  if (filterSection === 'ALL') {
    ASSESSMENT_SCHEMA.sections.forEach(s => { sectionBest[s.id] = { val: -1, name: '' }; });
  } else {
    sectionBest[filterSection] = { val: -1, name: '' };
  }

  selected.forEach(p => {
    const t = totalScore(p.scores);
    const pt = totalPercent(p.scores);
    const cls = getClassification(pt);
    tableHtml += `<tr><td><strong>${p.name}</strong></td><td>${t}</td><td style="color:${getColorForPercent(pt)};font-weight:600">${pt}%</td><td style="color:${cls.color}">${cls.label}</td>`;
    if (filterSection === 'ALL') {
      ASSESSMENT_SCHEMA.sections.forEach(s => {
        const sc = sumSection(p.scores, s.id);
        const pct = percentFor(p.scores, s.id);
        if (sc > sectionBest[s.id].val) sectionBest[s.id] = { val: sc, name: p.name };
        tableHtml += `<td>${sc}<br><small style="color:${getColorForPercent(pct)}">${pct}%</small></td>`;
      });
    } else {
      const sc = sumSection(p.scores, filterSection);
      const s = ASSESSMENT_SCHEMA.sections.find(x => x.id === filterSection);
      const scPct = percentFor(p.scores, filterSection);
      if (sc > sectionBest[filterSection].val) sectionBest[filterSection] = { val: sc, name: p.name };
      tableHtml += `<td>${sc}/${s ? s.maxScore : '?'}<br><small style="color:${getColorForPercent(scPct)}">${scPct}%</small></td>`;
    }
    tableHtml += '</tr>';
  });
  tableHtml += '</tbody></table></div>';

  // Best per section
  tableHtml += '<div style="margin-top:12px"><h4 style="font-size:13px;color:var(--text-light)">Best per section:</h4><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">';
  Object.entries(sectionBest).forEach(([sec, best]) => {
    tableHtml += `<span style="background:#e8f5e9;padding:3px 8px;border-radius:4px;font-size:12px"><strong>${sec}:</strong> ${best.name} (${best.val})</span>`;
  });
  tableHtml += '</div></div>';
  document.getElementById('compareTable').innerHTML = tableHtml;

  // Total comparison bar chart
  if (compareBarChartInstance) compareBarChartInstance.destroy();
  const barCtx = document.getElementById('compareBarChart').getContext('2d');
  const names = selected.map(p => p.name.substring(0, 15) + (p.name.length > 15 ? '...' : ''));
  const totals = selected.map(p => totalPercent(p.scores));
  compareBarChartInstance = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: names,
      datasets: [{
        label: 'Total %',
        data: totals,
        backgroundColor: totals.map(t => getColorForPercent(t)),
        borderColor: totals.map(t => getColorForPercent(t)),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ctx.raw + '%' } } },
      scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage' } } }
    }
  });

  // Grouped bar chart
  if (compareGroupedBarInstance) compareGroupedBarInstance.destroy();

  let sectionLabels, datasets;
  if (filterSection === 'ALL') {
    sectionLabels = ASSESSMENT_SCHEMA.sections.map(s => s.id);
    datasets = selected.map(p => ({
      label: p.name.substring(0, 12) + (p.name.length > 12 ? '...' : ''),
      data: ASSESSMENT_SCHEMA.sections.map(s => percentFor(p.scores, s.id)),
      backgroundColor: '#' + Math.floor(Math.abs(hashStr(p.id)) * 16777215).toString(16).padStart(6, '0'),
      borderRadius: 3
    }));
  } else {
    sectionLabels = [filterSection];
    datasets = selected.map(p => ({
      label: p.name.substring(0, 12) + (p.name.length > 12 ? '...' : ''),
      data: [percentFor(p.scores, filterSection)],
      backgroundColor: '#' + Math.floor(Math.abs(hashStr(p.id)) * 16777215).toString(16).padStart(6, '0'),
      borderRadius: 3
    }));
  }

  const groupedCtx = document.getElementById('compareGroupedBarChart').getContext('2d');
  compareGroupedBarInstance = new Chart(groupedCtx, {
    type: 'bar',
    data: { labels: sectionLabels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { tooltip: { callbacks: { label: ctx => ctx.raw + '%' } } },
      scales: {
        y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage' } },
        x: { ticks: { maxRotation: 0 } }
      }
    }
  });
}

function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
  return Math.abs(hash) / 0x7FFFFFFF;
}

// ---- Typology ----
function updateTypology() {
  const id = document.getElementById('typologyPartnerSelect').value;
  const p = partners.find(x => x.id === id);
  if (!p) {
    document.getElementById('typologyResults').innerHTML = '<p class="text-muted">Select a partner to view typology</p>';
    return;
  }

  const results = PARTNER_TYPES.map(pt => {
    const check = pt.check(p.scores);
    const relevant = check.relevant;
    const threshold = check.threshold;
    let supporting = [];
    let totalPct = 0;
    relevant.forEach(r => {
      const section = ASSESSMENT_SCHEMA.sections.find(s => s.id === r);
      if (section) {
        const pct = percentFor(p.scores, r);
        supporting.push({ id: r, pct });
        totalPct += pct;
      } else {
        // It might be a sub-question reference like "E1", "H7", "I5", etc.
        const mainSection = r.charAt(0);
        const qNum = r.substring(1);
        const section2 = ASSESSMENT_SCHEMA.sections.find(s => s.id === mainSection);
        if (section2) {
          const q = section2.questions.find(qq => qq.id === r);
          if (q && p.scores[r]) {
            const score = parseInt(p.scores[r].score) || 0;
            const pctVal = Math.round((score / 4) * 100);
            supporting.push({ id: r, pct: pctVal });
            totalPct += pctVal;
          } else {
            // If question doesn't exist, use section score as proxy
            const pctVal = percentFor(p.scores, mainSection);
            supporting.push({ id: r, pct: pctVal });
            totalPct += pctVal;
          }
        }
      }
    });
    const avgPct = supporting.length > 0 ? Math.round(totalPct / supporting.length) : 0;
    const assigned = avgPct >= threshold;
    return { pt, assigned, supporting, avgPct, threshold };
  });

  // Show typology assessment if entered via Typology Form or imported
  let taHtml = '';
  if (p.typologyAssessment && p.typologyAssessment.some(t => t.fitScore > 0)) {
    taHtml = '<div class="card" style="margin-bottom:20px"><div class="card-header"><h3>Partner Typology Assessment</h3></div><div class="card-body"><div class="table-responsive"><table class="section-scores-table"><thead><tr><th>Partner Type</th><th>Fit Score (0-4)</th><th>Evidence</th><th>Recommended Engagement</th></tr></thead><tbody>';
    p.typologyAssessment.forEach(t => {
      if (t.fitScore <= 0 && !t.evidence && !t.recommendedEngagement) return;
      const pctVal = Math.round((t.fitScore / 4) * 100);
      taHtml += `<tr><td><strong>${t.typeName}</strong></td><td style="color:${getColorForPercent(pctVal)};font-weight:600">${t.fitScore}/4</td><td>${t.evidence || '-'}</td><td>${t.recommendedEngagement || '-'}</td></tr>`;
    });
    taHtml += '</tbody></table></div></div></div>';
  }

  let html = '<div class="typology-grid">';
  results.forEach(r => {
    const assigned = r.assigned;
    const supStr = r.supporting.map(s => `${s.id} (${s.pct}%)`).join(', ');
    html += `<div class="typology-card ${assigned ? 'assigned' : 'not-assigned'}">
      <h4>${r.pt.name}</h4>
      <span class="typology-badge ${assigned ? 'badge-assigned' : 'badge-not-assigned'}">${assigned ? 'Assigned' : 'Not Assigned'}</span>
      <p style="margin-top:8px;font-size:12px"><strong>Supporting sections:</strong> ${supStr}</p>
      <p style="font-size:12px"><strong>Average score:</strong> ${r.avgPct}% (threshold ${r.threshold}%)</p>
      <p style="font-size:12px;margin-top:4px"><strong>Role:</strong> ${r.pt.suggestedRole}</p>
    </div>`;
  });
  html += '</div>';
  document.getElementById('typologyResults').innerHTML = taHtml + html;
}

// ---- Journey ----
function updateJourney() {
  const id = document.getElementById('journeyPartnerSelect').value;
  const p = partners.find(x => x.id === id);
  if (!p) {
    document.getElementById('journeyResults').innerHTML = '<p class="text-muted">Select a partner to view journey mapping</p>';
    return;
  }

  const pct = totalPercent(p.scores);
  let currentStageIndex = -1;
  for (let i = JOURNEY_STAGES.length - 1; i >= 0; i--) {
    const st = JOURNEY_STAGES[i];
    if (pct >= st.range[0] && pct <= st.range[1]) { currentStageIndex = i; break; }
  }
  if (pct > JOURNEY_STAGES[JOURNEY_STAGES.length - 1].range[1]) currentStageIndex = JOURNEY_STAGES.length - 1;

  let html = `<div style="margin-bottom:20px;padding:16px;background:var(--card-bg);border-radius:var(--radius);box-shadow:var(--shadow)">
    <h3>Current Score: ${pct}% — ${getClassification(pct).label}</h3>
    <div class="score-bar" style="height:16px;margin-top:8px"><div class="score-bar-fill ${getBgClassForPercent(pct)}" style="width:${pct}%"></div></div>
  </div>`;

  html += '<h3 style="margin-bottom:12px">Journey Stages</h3>';
  JOURNEY_STAGES.forEach((st, idx) => {
    const state = idx === currentStageIndex ? 'current' : idx < currentStageIndex ? 'past' : 'future';
    const rangeStr = `${st.range[0]}%–${st.range[1]}%`;
    html += `<div class="journey-stage ${state}">
      <h3>Stage ${st.stage}: ${st.name}</h3>
      <span class="stage-range">Score range: ${rangeStr}</span>
      ${idx === currentStageIndex ? '<div style="margin-top:6px"><span class="typology-badge badge-assigned">Current Stage</span></div>' : ''}
      <ul>${st.actions.map(a => `<li>${a}</li>`).join('')}</ul>
    </div>`;
  });

  // Gap recommendations
  let gapsHtml = '<h3 style="margin:16px 0 8px">Gap-based Recommendations</h3>';
  let hasGap = false;
  GAP_RECOMMENDATIONS.forEach(g => {
    const scPct = percentFor(p.scores, g.section);
    if (scPct < g.threshold) {
      hasGap = true;
      gapsHtml += `<div class="gap-item"><strong>Section ${g.section}</strong> (${scPct}%): ${g.recommendation}</div>`;
    }
  });
  if (!hasGap) gapsHtml += '<p style="color:var(--strong)">No critical gaps identified.</p>';
  html += gapsHtml;

  document.getElementById('journeyResults').innerHTML = html;
}

function initCompareSectionFilter() {
  const filter = document.getElementById('compareSectionFilter');
  if (!filter) return;
  filter.innerHTML = '<option value="ALL">All Sections</option>';
  ASSESSMENT_SCHEMA.sections.forEach(s => {
    filter.innerHTML += `<option value="${s.id}">${s.id}. ${s.name}</option>`;
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', function() {
  partners = loadPartners();
  if (partners.length === 0) {
    initDemoData();
    partners = loadPartners();
  }
  populatePartnerSelect();
  renderChecklist();
  renderCompareSelection();
  initCompareSectionFilter();
  // Render section key (A-M legend) for Graphs tab
  const keyContainer = document.getElementById('sectionKeyContainer');
  if (keyContainer) {
    keyContainer.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:4px 16px;font-size:12px">' +
      ASSESSMENT_SCHEMA.sections.map(s => `<div><strong>${s.id}:</strong> ${s.name}</div>`).join('') +
      '</div>';
  }
  updateScoreView();
});
