// ── SEARCH ──
function InitSearch() {
    const inp = document.getElementById('SearchInput');
    const resultsDiv = document.getElementById('SearchResults');
    inp.addEventListener('mousedown', e => e.stopPropagation());
    inp.addEventListener('input', () => {
        const q = inp.value.trim().toLowerCase();
        resultsDiv.innerHTML = '';
        if (!q) return;
        const hits = [];
        fikirler.forEach(f => { if (f.name.toLowerCase().includes(q)) hits.push({type:'fikir', item:f}); });
        projeler.forEach(p => { if (p.name.toLowerCase().includes(q)) hits.push({type:'proje', item:p}); });
        if (hits.length === 0) {
            resultsDiv.innerHTML = '<div class="search-no-result">Sonuç bulunamadı</div>';
            return;
        }
        hits.forEach(({type, item}) => {
            const div = document.createElement('div'); div.className = 'search-result-item';
            const badge = document.createElement('span');
            badge.className = 'search-result-badge ' + (type==='fikir' ? 'srb-fikir' : 'srb-proje');
            badge.innerText = type==='fikir' ? 'Fikir' : 'Proje';
            const name = document.createElement('span'); name.className = 'search-result-name'; name.innerText = item.name;
            div.appendChild(badge); div.appendChild(name);
            div.addEventListener('click', () => {
                if (type==='fikir') SetActiveFikir(item.id);
                else SetActiveProje(item.id);
                inp.value = ''; resultsDiv.innerHTML = '';
            });
            resultsDiv.appendChild(div);
        });
    });
}
