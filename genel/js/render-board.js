// ── RENDER BOARD ──
function RenderBoard() {
    notesContainer.innerHTML='';
    if(!aktifTip||!aktifId){ notesContainer.innerHTML='<div style="color:#5a6e85;text-align:center;margin-top:80px;font-size:0.9rem;">Bir fikir veya proje seçin</div>'; return; }
    let notes=[];
    if(aktifTip==='fikir'){
        const f=fikirler.find(fk=>fk.id===aktifId);
        if(!f){notesContainer.innerHTML='<div style="color:#5a6e85;text-align:center;margin-top:80px;">Fikir bulunamadı</div>';return;}
        notes=f.notes;
    } else {
        const p=projeler.find(pp=>pp.id===aktifId);
        if(!p){notesContainer.innerHTML='<div style="color:#5a6e85;text-align:center;margin-top:80px;">Proje bulunamadı</div>';return;}
        if(!aktifModulId||!p.modules.find(m=>m.id===aktifModulId)){
            if(p.modules.length>0){aktifModulId=p.modules[0].id;RenderModuleTabs();}
            else{notesContainer.innerHTML='<div style="color:#5a6e85;text-align:center;margin-top:80px;">Modül eklemek için "+ Modül ekle"ye tıklayın</div>';return;}
        }
        const m=p.modules.find(mm=>mm.id===aktifModulId);
        notes=m.notes;
    }
    if(notes.length===0){ notesContainer.innerHTML='<div style="color:#5a6e85;text-align:center;margin-top:80px;font-size:0.85rem;">Not eklemek için "+ Not Ekle"ye tıklayın</div>'; return; }
    notes.forEach(note=>RenderNoteCard(note));
    setTimeout(()=>RenderLines(),50);
}
