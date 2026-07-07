// ── MODÜL OPS ──
function AddNewModule() {
    if(aktifTip!=='proje'){ShowToast("Modül eklemek için bir proje seçin",1200);return;}
    const proje=projeler.find(p=>p.id===aktifId); if(!proje) return;
    ShowModal('Yeni Modül','Modül adı (ör: algoritmalar, tasarım)...',(name)=>{
        pushUndo();
        const m={id:nextModulId++,name,notes:[]};
        proje.modules.push(m); SetActiveModul(m.id); RenderModuleTabs(); RenderSidebar(); DebounceSave();
        ShowToast('"'+name+'" modülü eklendi');
    });
}
function SetActiveModul(mid) {
    aktifModulId=mid; selectedNoteIds.clear(); isConnectingMode=false; connectingFromCard=null;
    if(isLineEditMode) DisableLineEditMode();
    RenderModuleTabs(); RenderBoard(); DebounceSave();
}
function DeleteModule(mid) {
    const proje=projeler.find(p=>p.id===aktifId); if(!proje) return;
    const idx=proje.modules.findIndex(m=>m.id===mid); if(idx===-1) return;
    pushUndo();
    const m=proje.modules[idx];
    m.notes.forEach(note=>trashBin.push({id:nextTrashId++,type:'not',name:note.title,parentName:proje.name+' / '+m.name,deletedAt:new Date().toISOString(),originalData:note,parentId:proje.id,parentType:'proje',modulId:m.id}));
    trashBin.push({id:nextTrashId++,type:'modul',name:m.name,parentName:proje.name,deletedAt:new Date().toISOString(),originalData:{name:m.name,notes:m.notes},parentId:proje.id,parentType:'proje'});
    proje.modules.splice(idx,1);
    if(aktifModulId===mid){ if(proje.modules.length>0) SetActiveModul(proje.modules[0].id); else {aktifModulId=null; RenderModuleTabs(); RenderBoard();} }
    RenderModuleTabs(); RenderSidebar(); DebounceSave(); ShowToast('"'+m.name+'" modülü çöp kutusuna taşındı');
}
