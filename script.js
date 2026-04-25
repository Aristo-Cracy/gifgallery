
let rawData = {};

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    rawData = data;
    render();
  });

async function getFileSize(url){
  try{
    const res = await fetch(url);
    const blob = await res.blob();
    return (blob.size/1024).toFixed(1) + ' KB';
  }catch{ return '—'; }
}

async function render(){
  const container = document.getElementById('content');
  container.innerHTML = '';

  for(const sectionName in rawData){
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section';

    const title = document.createElement('h2');
    title.textContent = sectionName;
    sectionDiv.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'grid';

    let items = [...rawData[sectionName]];

    // search filter
    const searchVal = document.getElementById('search').value.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(searchVal));

    // sort (within section only)
    const sortVal = document.getElementById('sort').value;
    if (sortVal === 'az') {
        items.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
        );
    }
    if (sortVal === 'za') {
        items.sort((a, b) =>
            b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' })
        );
    }
    if(sortVal==='newest') items.sort((a,b)=>new Date(b.date)-new Date(a.date));
    if(sortVal==='oldest') items.sort((a,b)=>new Date(a.date)-new Date(b.date));

    for(const item of items){
      const size = await getFileSize(item.gif);

      const card = document.createElement('div');
      card.className='card';
      card.innerHTML = `
        <img src="${item.gif}" />
        <h3>${item.name}</h3>
        <div class="meta">${item.desc} • ${size}</div>
        <div class="actions">
          <button class="download" onclick="downloadGif('${item.gif}')">Download</button>
          <button class="code" onclick="openModal(\`${item.code}\`)">Code</button>
        </div>
      `;
      grid.appendChild(card);
    }

    sectionDiv.appendChild(grid);
    container.appendChild(sectionDiv);
  }
}

function downloadGif(url){
  const a = document.createElement('a');
  a.href=url;
  a.download='';
  a.click();
}

function openModal(code){
  document.getElementById('modal').classList.add('active');
  const el = document.getElementById('codeContent');
  el.textContent = code;
  Prism.highlightElement(el);
}

function closeModal(){ document.getElementById('modal').classList.remove('active'); }
function copyCode(){ navigator.clipboard.writeText(document.getElementById('codeContent').textContent); }

search.oninput = render;
sort.onchange = render;