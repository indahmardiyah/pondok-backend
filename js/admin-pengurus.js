let pengurusEditId = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchPengurus();

  document.getElementById('btn-simpan').addEventListener('click', simpanPengurus);
});

function fetchPengurus() {
  fetch('http://localhost:4000/api/pengurus')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('pengurus-list');
      list.innerHTML = data.map(p => `
        <tr>
          <td>${p.nama}</td>
          <td>${p.jabatan}</td>
          <td>${p.asal}</td>
          <td>${p.namaAyah}</td>
          <td>${p.namaIbu}</td>
          <td>${p.jumlahSaudara}</td>
          <td>${p.anakKe}</td>
          <td><img src="images/${p.foto}" width="50"></td>
          <td>
            <button onclick='editPengurus(${JSON.stringify(p)})'>Edit</button>
            <button onclick='hapusPengurus("${p._id}")'>Hapus</button>
          </td>
        </tr>
      `).join('');
    });
}

function simpanPengurus() {
  const formData = new FormData();
  formData.append('nama', document.getElementById('nama').value);
  formData.append('jabatan', document.getElementById('jabatan').value);
  formData.append('asal', document.getElementById('asal').value);
  formData.append('namaAyah', document.getElementById('namaAyah').value);
  formData.append('namaIbu', document.getElementById('namaIbu').value);
  formData.append('jumlahSaudara', document.getElementById('jumlahSaudara').value);
  formData.append('anakKe', document.getElementById('anakKe').value);

  const foto = document.getElementById('foto').files[0];
  if (foto) {
    formData.append('foto', foto);
  }

  const url = pengurusEditId
    ? `http://localhost:4000/api/pengurus/${pengurusEditId}`
    : 'http://localhost:4000/api/pengurus';
  const method = pengurusEditId ? 'PUT' : 'POST';

  fetch(url, {
    method,
    body: formData
  }).then(() => {
    pengurusEditId = null;
    clearForm();
    fetchPengurus();
    });
}

function editPengurus(p) {
  document.getElementById('nama').value = p.nama;
  document.getElementById('jabatan').value = p.jabatan;
  document.getElementById('asal').value = p.asal;
  document.getElementById('namaAyah').value = p.namaAyah;
  document.getElementById('namaIbu').value = p.namaIbu;
  document.getElementById('jumlahSaudara').value = p.jumlahSaudara;
  document.getElementById('anakKe').value = p.anakKe;
  document.getElementById('foto').value = p.foto;
  pengurusEditId = p._id;
}

function hapusPengurus(id) {
  fetch(`http://localhost:4000/api/pengurus/${id}`, {
    method: 'DELETE'
  }).then(fetchPengurus);
}

function clearForm() {
  document.getElementById('nama').value = '';
  document.getElementById('jabatan').value = '';
  document.getElementById('asal').value = '';
  document.getElementById('namaAyah').value = '';
  document.getElementById('namaIbu').value = '';
  document.getElementById('jumlahSaudara').value = '';
  document.getElementById('anakKe').value = '';
  document.getElementById('foto').value = '';
}
