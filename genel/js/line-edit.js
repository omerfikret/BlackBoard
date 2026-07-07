// ── LINE EDIT MODE ──
function EnableLineEditMode() {
    if(connections.length===0){ShowToast("Düzenlenecek çizgi yok",1500);return;}
    isLineEditMode=true; selectedLineIds.clear(); RenderLineEditorBar(); RenderLines();
    ShowToast("Çizgi düzenleme modu aktif",1800);
}
function DisableLineEditMode() {
    isLineEditMode=false; selectedLineIds.clear(); RenderLineEditorBar(); RenderLines();
}
function ToggleLineSelection(lid) {
    if(selectedLineIds.has(lid)) selectedLineIds.delete(lid); else selectedLineIds.add(lid);
    RenderLineEditorBar(); RenderLines();
}
function ApplyColorToSelected(color) {
    if(selectedLineIds.size===0){ShowToast("Önce çizgi seçin",1000);return;}
    selectedLineIds.forEach(id=>lineColors[id]=color); RenderLines(); DebounceSave();
    ShowToast(selectedLineIds.size+" çizginin rengi değiştirildi",1000);
}
function ApplyStrokeToSelected(w) {
    if(selectedLineIds.size===0){ShowToast("Önce çizgi seçin",1000);return;}
    selectedLineIds.forEach(id=>lineWidths[id]=w); RenderLines(); DebounceSave();
}
function DeleteSelectedLines() {
    if(selectedLineIds.size===0){ShowToast("Silinecek çizgi seçin",1000);return;}
    if(!confirm(selectedLineIds.size+" çizgiyi silmek istiyor musunuz?")) return;
    pushUndo();
    connections=connections.filter(c=>!selectedLineIds.has(c.id));
    selectedLineIds.forEach(id=>{delete lineColors[id];delete lineWidths[id];});
    selectedLineIds.clear(); DebounceSave(); RenderLines();
    if(connections.length===0) DisableLineEditMode(); else RenderLineEditorBar();
    ShowToast("Seçilen çizgiler silindi",1200);
}
function DeleteAllLines() {
    if(connections.length===0){ShowToast("Silinecek çizgi yok",1000);return;}
    if(!confirm("Tüm "+connections.length+" çizgiyi silmek istiyor musunuz?")) return;
    pushUndo();
    connections=[]; lineColors={}; lineWidths={}; selectedLineIds.clear();
    DebounceSave(); RenderLines(); DisableLineEditMode(); ShowToast("Tüm çizgiler silindi",1200);
}
function RenderLineEditorBar() {
    if(!isLineEditMode){lineEditorContainer.innerHTML='';return;}
    lineEditorContainer.innerHTML=`
        <div class="line-editor-bar">
            <span class="line-editor-label">Çizgi Düzenleme</span>
            <span class="selection-info">${selectedLineIds.size} seçili</span>
            <div class="color-picker-group">${lineColorsList.map(c=>`<div class="line-color-option" style="background:${c}" data-c="${c}"></div>`).join('')}</div>
            <div class="color-picker-group">
                <button class="stroke-btn" data-w="2">İnce</button>
                <button class="stroke-btn" data-w="4">Normal</button>
                <button class="stroke-btn" data-w="6">Kalın</button>
            </div>
            <div class="color-picker-group">
                <button class="line-action-btn" id="SelAllL">Tümünü Seç</button>
                <button class="line-action-btn" id="DeSelL">Seçimi Kaldır</button>
                <button class="line-action-btn" id="DelSelL" style="background:#b91c1c;color:#fff;">Seçilenleri Sil</button>
                <button class="line-action-btn" id="DelAllL" style="background:#7f1d1d;color:#fff;">Tümünü Sil</button>
            </div>
            <button class="close-editor-btn" id="CloseLineEd">Düzenlemeyi Kapat</button>
        </div>`;
    document.querySelectorAll('.line-color-option').forEach(el=>el.onclick=()=>ApplyColorToSelected(el.getAttribute('data-c')));
    document.querySelectorAll('.stroke-btn').forEach(el=>el.onclick=()=>ApplyStrokeToSelected(parseInt(el.getAttribute('data-w'))));
    document.getElementById('SelAllL').onclick=()=>{ connections.forEach(c=>selectedLineIds.add(c.id)); RenderLineEditorBar(); RenderLines(); ShowToast(selectedLineIds.size+" çizgi seçildi",1000); };
    document.getElementById('DeSelL').onclick=()=>{ selectedLineIds.clear(); RenderLineEditorBar(); RenderLines(); };
    document.getElementById('DelSelL').onclick=()=>DeleteSelectedLines();
    document.getElementById('DelAllL').onclick=()=>DeleteAllLines();
    document.getElementById('CloseLineEd').onclick=()=>DisableLineEditMode();
}
