// ── FİKİR OPS ──
function AddNewFikir() {
    ShowModal('Yeni Fikir','Fikir adı...',(name)=>{
        pushUndo();
        const f={id:nextFikirId++,name,notes:[]};
        fikirler.push(f); RenderSidebar(); SetActiveFikir(f.id); DebounceSave();
        ShowToast('"'+name+'" fikri eklendi');
    });
}
function SetActiveFikir(fid) {
    const f=fikirler.find(fk=>fk.id===fid); if(!f) return;
    aktifTip='fikir'; aktifId=fid; aktifModulId=null;
    activeTitleSpan.innerText=f.name;
    moduleTabsContainer.innerHTML='';
    selectedNoteIds.clear(); isConnectingMode=false; connectingFromCard=null;
    if(isLineEditMode) DisableLineEditMode();
    RenderSidebar(); RenderBoard(); DebounceSave();
}
function DeleteFikir(id) {
    const idx=fikirler.findIndex(f=>f.id===id); if(idx===-1) return;
    pushUndo();
    const f=fikirler[idx];
    f.notes.forEach(note=>trashBin.push({id:nextTrashId++,type:'not',name:note.title,parentName:f.name,deletedAt:new Date().toISOString(),originalData:note,parentId:f.id,parentType:'fikir'}));
    trashBin.push({id:nextTrashId++,type:'fikir',name:f.name,parentName:'Genel',deletedAt:new Date().toISOString(),originalData:{name:f.name,notes:f.notes},parentId:null,parentType:null});
    fikirler.splice(idx,1);
    if(aktifTip==='fikir'&&aktifId===id){ if(fikirler.length>0) SetActiveFikir(fikirler[0].id); else if(projeler.length>0) SetActiveProje(projeler[0].id); else {aktifTip=null;aktifId=null;activeTitleSpan.innerText='Ana Pano';moduleTabsContainer.innerHTML='';RenderBoard();} }
    RenderSidebar(); DebounceSave(); ShowToast('"'+f.name+'" çöp kutusuna taşındı');
}
function ConvertFikirToProje(fid) {
    const f=fikirler.find(fk=>fk.id===fid); if(!f) return;
    if(!confirm('"'+f.name+'" fikrini projeye dönüştürmek istiyor musunuz?\nFikir silinecek, notlar yeni projenin "Genel" modülüne taşınacak.')) return;
    pushUndo();
    const modul={id:nextModulId++,name:'Genel',notes:[...f.notes]};
    const proje={id:nextProjeId++,name:f.name,modules:[modul]};
    projeler.push(proje);
    fikirler.splice(fikirler.indexOf(f),1);
    RenderSidebar(); SetActiveProje(proje.id); DebounceSave();
    ShowToast('"'+f.name+'" projeye dönüştürüldü!',2000);
}
