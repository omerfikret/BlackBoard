// ── STATE ──
let fikirler = [];
let projeler = [];
let aktifTip = null, aktifId = null, aktifModulId = null;
let trashBin = [];
let connections = [], lineColors = {}, lineWidths = {};
let nextFikirId=1, nextProjeId=1, nextModulId=1, nextNoteId=100, nextTrashId=1, nextConnectionId=1;
let selectedNoteIds = new Set();
let isConnectingMode = false, connectingFromCard = null;
let isLineEditMode = false, selectedLineIds = new Set();
let isSelecting = false, selectionStart={x:0,y:0}, selectionRect=null;
