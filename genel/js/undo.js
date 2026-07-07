// ── UNDO ──
const undoStack = [];
const MAX_UNDO = 50;
function pushUndo() {
    const snapshot = JSON.stringify({ fikirler, projeler, aktifTip, aktifId, aktifModulId, trashBin, connections, lineColors, lineWidths, nextFikirId, nextProjeId, nextModulId, nextNoteId, nextTrashId, nextConnectionId });
    undoStack.push(snapshot);
    if (undoStack.length > MAX_UNDO) undoStack.shift();
}
function performUndo() {
    if (undoStack.length === 0) { ShowToast("Geri alınacak işlem yok", 1200); return; }
    const snapshot = JSON.parse(undoStack.pop());
    fikirler = snapshot.fikirler || [];
    projeler = snapshot.projeler || [];
    aktifTip = snapshot.aktifTip;
    aktifId = snapshot.aktifId;
    aktifModulId = snapshot.aktifModulId;
    trashBin = snapshot.trashBin || [];
    connections = snapshot.connections || [];
    lineColors = snapshot.lineColors || {};
    lineWidths = snapshot.lineWidths || {};
    nextFikirId = snapshot.nextFikirId || 1;
    nextProjeId = snapshot.nextProjeId || 1;
    nextModulId = snapshot.nextModulId || 1;
    nextNoteId = snapshot.nextNoteId || 100;
    nextTrashId = snapshot.nextTrashId || 1;
    nextConnectionId = snapshot.nextConnectionId || 1;
    RenderSidebar(); RenderModuleTabs(); RenderBoard();
    SaveToDB(); ShowUndoHint();
}
function ShowUndoHint() {
    const el = document.getElementById('UndoHint');
    el.style.opacity = '1';
    setTimeout(() => el.style.opacity = '0', 1500);
}
