let santriEditId = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchSantri();

  document.getElementById('btn-simpan').addEventListener('click', simpanSantri);
});

function fetchSantri() {
  fetch('http://localhost:4000/api/santri')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('santri-list');
      list.innerHTML = data.map(s => `
        <tr>
          <td>${s.nama}</td>
          <td>${s.umur}</td>
          <td>${s.asal}</td>
          <td>${s.namaAyah}</td>
          <td>${s.namaIbu}</td>
          <td>${s.jumlahHafalan}</td>

          <td><img src="uploads/${s.foto}" width="50"></td>
          <td>
            <button onclick='editSantri(${JSON.stringify(s)})'>Edit</button>
            <button onclick='hapusSantri("${s._id}")'>Hapus</button>
          </td>
        </tr>
      `).join('');
    });
}

function simpanSantri() {
  const formData = new FormData();
  formData.append('nama', document.getElementById('nama').value);
  formData.append('umur', document.getElementById('umur').value);
  formData.append('asal', document.getElementById('asal').value);
  formData.append('namaAyah', document.getElementById('namaAyah').value);
  formData.append('namaIbu', document.getElementById('namaIbu').value);
  formData.append('jumlahHafalan', document.getElementById('jumlahHafalan').value);


  const foto = document.getElementById('foto').files[0];
  if (foto) {
    formData.append('foto', foto);
  }

  const url = santriEditId
    ? `http://localhost:4000/api/santri/${santriEditId}`
    : 'http://localhost:4000/api/santri';
  const method = santriEditId ? 'PUT' : 'POST';

  fetch(url, {
    method,
    body: formData
  }).then(() => {
    santriEditId = null;
    clearForm();
    fetchSantri();
  });
}

function editSantri(s) {
  document.getElementById('nama').value = s.nama;
  document.getElementById('umur').value = s.umur;
  document.getElementById('asal').value = s.asal;
  document.getElementById('namaAyah').value = s.namaAyah;
  document.getElementById('namaIbu').value = s.namaIbu;
  document.getElementById('jumlahHafalan').value = s.jumlahHafalan;

  santriEditId = s._id;
}

function hapusSantri(id) {
  fetch(`http://localhost:4000/api/santri/${id}`, {
    method: 'DELETE'
  }).then(fetchSantri);
}

function clearForm() {
  document.getElementById('nama').value = '';
  document.getElementById('umur').value = '';
  document.getElementById('asal').value = '';
  document.getElementById('namaAyah').value = '';
  document.getElementById('namaIbu').value = '';
  document.getElementById('jumlahHafalan').value = '';
    document.getElementById('foto').value = '';
}
