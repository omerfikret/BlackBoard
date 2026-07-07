// ── START ──
async function StartApp() {
    await InitDB();
    await LoadFromDB();
    RenderSidebar();
    RenderModuleTabs();
    RenderLineEditorBar();
    InitSearch();
    initSelection();
    if(aktifTip==='fikir'&&fikirler.find(f=>f.id===aktifId)) SetActiveFikir(aktifId);
    else if(aktifTip==='proje'&&projeler.find(p=>p.id===aktifId)) SetActiveProje(aktifId);
    else if(fikirler.length>0) SetActiveFikir(fikirler[0].id);
    else if(projeler.length>0) SetActiveProje(projeler[0].id);
    else RenderBoard();
}
StartApp();
