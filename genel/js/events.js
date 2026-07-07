// ── EVENTS ──
document.getElementById('AddFikirBtn').addEventListener('click', AddNewFikir);
document.getElementById('AddProjeBtn').addEventListener('click', AddNewProje);
document.getElementById('AddNoteToActiveBtn').addEventListener('click', AddNoteToActive);
document.getElementById('TrashBinBtn').addEventListener('click', ShowTrashModal);
document.getElementById('EnableLineEditBtn').addEventListener('click', EnableLineEditMode);
document.getElementById('UndoBtn').addEventListener('click', performUndo);

window.addEventListener('resize', ()=>{ RenderBoard(); setTimeout(()=>RenderLines(),100); });
