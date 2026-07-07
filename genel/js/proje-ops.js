// ── PROJE OPS ──
function AddNewProje() {
    ShowModal('Yeni Proje','Proje adı...',(name)=>{
        pushUndo();
        const p={id:nextProjeId++,name,modules:[]};
        projeler.push(p); RenderSidebar(); SetActiveProje(p.id); DebounceSave();
        ShowToast('"'+name+'" projesi eklendi');
    });
}
function SetActiveProje(pid) {
    const p=projeler.find(pp=>pp.id===pid); if(!p) return;
    aktifTip='proje'; aktifId=pid;
    activeTitleSpan.innerText=p.name;
    if(p.modules.length>0){ aktifModulId=p.modules.find(m=>m.id===aktifModulId)?aktifModulId:p.modules[0].id; } else aktifModulId=null;
    selectedNoteIds.clear(); isConnectingMode=false; connectingFromCard=null;
    if(isLineEditMode) DisableLineEditMode();
    RenderSidebar(); RenderModuleTabs(); RenderBoard(); DebounceSave();
}
function DeleteProje(id) {
    const idx=projeler.findIndex(p=>p.id===id); if(idx===-1) return;
    pushUndo();
    const p=projeler[idx];
    p.modules.forEach(m=>{ m.notes.forEach(note=>trashBin.push({id:nextTrashId++,type:'not',name:note.title,parentName:p.name+' / '+m.name,deletedAt:new Date().toISOString(),originalData:note,parentId:p.id,parentType:'proje',modulId:m.id})); trashBin.push({id:nextTrashId++,type:'modul',name:m.name,parentName:p.name,deletedAt:new Date().toISOString(),originalData:{name:m.name,notes:m.notes},parentId:p.id,parentType:'proje'}); });
    trashBin.push({id:nextTrashId++,type:'proje',name:p.name,parentName:'Genel',deletedAt:new Date().toISOString(),originalData:{name:p.name,modules:p.modules},parentId:null,parentType:null});
    projeler.splice(idx,1);
    if(aktifTip==='proje'&&aktifId===id){ if(projeler.length>0) SetActiveProje(projeler[0].id); else if(fikirler.length>0) SetActiveFikir(fikirler[0].id); else {aktifTip=null;aktifId=null;aktifModulId=null;activeTitleSpan.innerText='Ana Pano';moduleTabsContainer.innerHTML='';RenderBoard();} }
    RenderSidebar(); DebounceSave(); ShowToast('"'+p.name+'" projesi çöp kutusuna taşındı');
}
