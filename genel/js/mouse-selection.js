// ── MOUSE SELECTION ──
// FIX: Çizgiler her zaman seçime dahil (line edit modu açık olmasa bile)
function initSelection() {
    selectionRect=document.getElementById('SelectionRect');
    whiteboardCanvas.addEventListener('mousedown',(e)=>{
        if(e.target.closest('.idea-card')||e.target.closest('.connection-point')||e.target.closest('.connector-btn')) return;
        if(e.button!==0) return;
        isSelecting=true;
        const r=whiteboardCanvas.getBoundingClientRect();
        selectionStart.x=e.clientX-r.left; selectionStart.y=e.clientY-r.top;
        selectionRect.style.display='block';
        selectionRect.style.left=selectionStart.x+'px'; selectionRect.style.top=selectionStart.y+'px';
        selectionRect.style.width='0px'; selectionRect.style.height='0px';
        selectedNoteIds.clear(); selectedLineIds.clear();
        document.querySelectorAll('.idea-card').forEach(c=>c.classList.remove('selected-card'));
    });
    window.addEventListener('mousemove',(e)=>{
        if(!isSelecting) return;
        const r=whiteboardCanvas.getBoundingClientRect();
        const cx=e.clientX-r.left, cy=e.clientY-r.top;
        const l=Math.min(selectionStart.x,cx), t=Math.min(selectionStart.y,cy);
        const w=Math.abs(cx-selectionStart.x), h=Math.abs(cy-selectionStart.y);
        selectionRect.style.left=l+'px'; selectionRect.style.top=t+'px';
        selectionRect.style.width=w+'px'; selectionRect.style.height=h+'px';
    });
    window.addEventListener('mouseup',(e)=>{
        if(!isSelecting) return;
        isSelecting=false;
        const r=whiteboardCanvas.getBoundingClientRect();
        const ex=e.clientX-r.left, ey=e.clientY-r.top;
        const l=Math.min(selectionStart.x,ex), t=Math.min(selectionStart.y,ey);
        const ri=Math.max(selectionStart.x,ex), b=Math.max(selectionStart.y,ey);
        if(ri-l>5&&b-t>5) {
            // Kart seçimi
            document.querySelectorAll('.idea-card').forEach(card=>{
                const cr=card.getBoundingClientRect();
                const cl=cr.left-r.left, ct=cr.top-r.top, crr=cr.right-r.left, cb=cr.bottom-r.top;
                if(crr>l&&cl<ri&&cb>t&&ct<b){
                    const nid=parseInt(card.getAttribute('data-note-id'));
                    selectedNoteIds.add(nid); card.classList.add('selected-card');
                }
            });
            // FIX: Çizgi seçimi — her zaman aktif, line edit moduna bağlı değil
            connections.forEach(conn=>{
                const fc=document.querySelector(`.idea-card[data-note-id='${conn.from}']`);
                const tc=document.querySelector(`.idea-card[data-note-id='${conn.to}']`);
                if(!fc||!tc) return;
                const fr=fc.getBoundingClientRect(), tr=tc.getBoundingClientRect();
                // Çizginin birden fazla noktasını kontrol et (daha iyi seçim)
                for(let i=0; i<=10; i++){
                    const mx=(fr.left+fr.width/2)*(1-i/10)+(tr.left+tr.width/2)*(i/10)-r.left;
                    const my=(fr.top+fr.height/2)*(1-i/10)+(tr.top+tr.height/2)*(i/10)-r.top;
                    if(mx>l&&mx<ri&&my>t&&my<b){ selectedLineIds.add(conn.id); break; }
                }
            });
            if(selectedLineIds.size>0){
                RenderLines();
                // Line edit modunu otomatik aç (çizgiler seçildiyse)
                if(!isLineEditMode && selectedLineIds.size>0){
                    isLineEditMode=true; RenderLineEditorBar();
                }
                RenderLineEditorBar();
            }
            const total=selectedNoteIds.size+selectedLineIds.size;
            if(total>0) ShowToast(total+" öğe seçildi. Delete ile sil.",2000);
        }
        selectionRect.style.display='none';
    });
    window.addEventListener('keydown',(e)=>{
        if(e.ctrlKey&&e.key==='z') { e.preventDefault(); performUndo(); return; }
        if(e.key==='Delete') {
            if(selectedLineIds.size>0){ DeleteSelectedLines(); return; }
            if(selectedNoteIds.size>0){
                if(confirm(selectedNoteIds.size+" notu silmek istiyor musunuz?")){
                    pushUndo();
                    selectedNoteIds.forEach(nid=>DeleteNote(nid, true));
                    selectedNoteIds.clear(); ShowToast("Seçilen notlar silindi",1000);
                }
            }
        }
        if(e.key==='Escape'){
            selectedNoteIds.clear(); selectedLineIds.clear();
            document.querySelectorAll('.idea-card').forEach(c=>c.classList.remove('selected-card'));
            if(isConnectingMode){ isConnectingMode=false; connectingFromCard=null; document.querySelectorAll('.connector-btn').forEach(b=>b.classList.remove('active-connector')); }
            if(isLineEditMode){ DisableLineEditMode(); }
            RenderLines();
        }
    });
}
