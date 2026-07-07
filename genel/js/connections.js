// ── CONNECTIONS ──
function AddConnection(from, to) {
    if(from===to){ShowToast("Aynı nota bağlantı olmaz",1000); return false;}
    if(connections.some(c=>(c.from===from&&c.to===to)||(c.from===to&&c.to===from))){ShowToast("Bu bağlantı zaten var",1000); return false;}
    pushUndo();
    const nid=nextConnectionId++;
    connections.push({id:nid,from,to});
    RenderLines(); DebounceSave(); ShowToast("Bağlantı oluşturuldu",800); return true;
}
function RemoveConnection(cid) {
    pushUndo();
    connections=connections.filter(c=>c.id!==cid);
    delete lineColors[cid]; delete lineWidths[cid]; selectedLineIds.delete(cid);
    RenderLines(); DebounceSave(); ShowToast("Bağlantı kaldırıldı",800);
}
function RemoveConnectionsForNote(noteId) {
    const toDelete=connections.filter(c=>c.from===noteId||c.to===noteId);
    toDelete.forEach(c=>{ delete lineColors[c.id]; delete lineWidths[c.id]; selectedLineIds.delete(c.id); });
    connections=connections.filter(c=>c.from!==noteId&&c.to!==noteId);
    RenderLines(); DebounceSave();
}
function RenderLines() {
    linesSvg.innerHTML='';
    connections.forEach(conn=>{
        const fc=document.querySelector(`.idea-card[data-note-id='${conn.from}']`);
        const tc=document.querySelector(`.idea-card[data-note-id='${conn.to}']`);
        if(!fc||!tc) return;
        const fr=fc.getBoundingClientRect(), tr=tc.getBoundingClientRect();
        const cr=notesContainer.getBoundingClientRect();
        const x1=fr.left+fr.width/2-cr.left, y1=fr.top+fr.height/2-cr.top;
        const x2=tr.left+tr.width/2-cr.left, y2=tr.top+tr.height/2-cr.top;
        const color=lineColors[conn.id]||'#60a5fa';
        const width=lineWidths[conn.id]||3;
        const isSel=selectedLineIds.has(conn.id);
        const line=document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1',x1); line.setAttribute('y1',y1);
        line.setAttribute('x2',x2); line.setAttribute('y2',y2);
        line.setAttribute('stroke', isSel?'#f59e0b':color);
        line.setAttribute('stroke-width', isSel?width+3:width);
        line.setAttribute('stroke-dasharray','6,4');
        line.style.cursor='pointer'; line.style.pointerEvents='stroke';
        line.addEventListener('click',(e)=>{
            e.stopPropagation();
            if(isLineEditMode) ToggleLineSelection(conn.id);
            else if(confirm('Bu bağlantıyı silmek istiyor musunuz?')) RemoveConnection(conn.id);
        });
        linesSvg.appendChild(line);
    });
}
