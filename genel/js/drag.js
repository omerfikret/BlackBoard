// ── DRAG ──
let DragActive=false, DragCard=null, DragNote=null, StartX, StartY, StartLeft, StartTop;
function StartDrag(e, cardEl, noteObj) {
    const r=cardEl.getBoundingClientRect(), cr=notesContainer.getBoundingClientRect();
    DragActive=true; DragCard=cardEl; DragNote=noteObj;
    StartX=e.clientX; StartY=e.clientY; StartLeft=r.left-cr.left; StartTop=r.top-cr.top;
    document.body.style.userSelect='none'; cardEl.style.cursor='grabbing';
    const onMove=(mv)=>{
        if(!DragActive) return; mv.preventDefault();
        let nl=StartLeft+(mv.clientX-StartX), nt=StartTop+(mv.clientY-StartY);
        const pr=notesContainer.getBoundingClientRect();
        nl=Math.min(Math.max(nl,5),Math.max(pr.width-DragCard.offsetWidth,5));
        nt=Math.min(Math.max(nt,5),Math.max(pr.height-DragCard.offsetHeight,5));
        DragCard.style.left=nl+'px'; DragCard.style.top=nt+'px';
        if(DragNote){DragNote.left=nl; DragNote.top=nt;}
        RenderLines();
    };
    const onUp=()=>{
        if(DragActive){DragActive=false; document.body.style.userSelect=''; if(DragCard)DragCard.style.cursor='grab'; document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); DebounceSave(); RenderLines();}
    };
    document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
}
