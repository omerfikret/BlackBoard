// ── NOTE OPS ──
function GetCurrentNotes() {
    if(aktifTip==='fikir'){ const f=fikirler.find(fk=>fk.id===aktifId); return f?f.notes:[]; }
    if(aktifTip==='proje'){ const p=projeler.find(pp=>pp.id===aktifId); if(!p||!aktifModulId) return []; const m=p.modules.find(mm=>mm.id===aktifModulId); return m?m.notes:[]; }
    return [];
}
function AddNoteToActive() {
    if(!aktifTip||!aktifId){ShowToast("Önce bir fikir veya proje seçin",1200);return;}
    if(aktifTip==='proje'&&!aktifModulId){ShowToast("Önce bir modül seçin",1200);return;}
    pushUndo();
    const {left,top}=GetRandomPosition();
    const note={id:nextNoteId++,title:"Yeni Not",blocks:[MakeBlock('text')],left,top,bgColor:"#1e293b"};
    const notes=GetCurrentNotes();
    if(notes===null){ShowToast("Hata: hedef bulunamadı",1200);return;}
    notes.push(note);
    RenderBoard(); RenderSidebar(); DebounceSave(); ShowToast("Not eklendi",800);
}
function DeleteNote(noteId, skipUndo=false) {
    if(!skipUndo) pushUndo();
    const notes=GetCurrentNotes();
    const idx=notes.findIndex(n=>n.id===noteId); if(idx===-1) return;
    const removed=notes.splice(idx,1)[0];
    let parentName='';
    if(aktifTip==='fikir'){ const f=fikirler.find(fk=>fk.id===aktifId); parentName=f?f.name:''; trashBin.push({id:nextTrashId++,type:'not',name:removed.title,parentName,deletedAt:new Date().toISOString(),originalData:removed,parentId:aktifId,parentType:'fikir'}); }
    else if(aktifTip==='proje'){ const p=projeler.find(pp=>pp.id===aktifId); const m=p?p.modules.find(mm=>mm.id===aktifModulId):null; parentName=p&&m?p.name+' / '+m.name:''; trashBin.push({id:nextTrashId++,type:'not',name:removed.title,parentName,deletedAt:new Date().toISOString(),originalData:removed,parentId:aktifId,parentType:'proje',modulId:aktifModulId}); }
    RemoveConnectionsForNote(noteId);
    RenderBoard(); RenderSidebar(); DebounceSave(); ShowToast("Not çöp kutusuna taşındı",800);
}
