// ── UNSAVED INDICATOR ──
let hasUnsaved = false;
let saveTimer = null;
function MarkUnsaved() {
    hasUnsaved = true;
    document.getElementById('SaveDot').classList.add('unsaved');
    document.getElementById('SaveText').textContent = 'Kaydedilmedi';
}
function MarkSaved() {
    hasUnsaved = false;
    document.getElementById('SaveDot').classList.remove('unsaved');
    document.getElementById('SaveText').textContent = 'Kaydedildi';
}
function DebounceSave() {
    MarkUnsaved();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => SaveToDB(), 1500);
}

const colorPalette = ["#1e293b","#2d1b36","#1a2e3a","#2a2a35","#1e3a4d","#2c2a3e","#1f3a3f","#3b2f2f","#2f3b2f"];
const lineColorsList = ["#60a5fa","#f59e0b","#10b981","#ef4444","#a855f7","#ec489a","#14b8a6","#f97316","#8b5cf6"];

const fikirlerListDiv = document.getElementById('fikirlerList');
const projelerListDiv = document.getElementById('projelerList');
const notesContainer = document.getElementById('NotesContainer');
const whiteboardCanvas = document.getElementById('WhiteboardCanvas');
const activeTitleSpan = document.getElementById('ActiveTitle');
const moduleTabsContainer = document.getElementById('ModuleTabsContainer');
const lineEditorContainer = document.getElementById('LineEditorContainer');
const toastEl = document.getElementById('ToastMsg');
const linesSvg = document.getElementById('LinesSvg');

function ShowToast(msg, dur=1400) {
    toastEl.style.opacity='1'; toastEl.innerText=msg;
    setTimeout(()=>toastEl.style.opacity='0', dur);
}
function EscapeHtml(str) {
    if(!str) return '';
    return str.replace(/[&<>'"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
}
function GetRandomPosition() {
    const rect = notesContainer.getBoundingClientRect();
    const w = rect.width||900, h=rect.height||500;
    return { left: Math.min(Math.max(50+Math.random()*(w-300),20),w-270), top: Math.min(Math.max(50+Math.random()*(h-250),20),h-200) };
}
