<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from './lib/supabaseClient'; // Sesuaikan path jika berbeda

  type Produk = {
    id: number;
    namaBarang: string;
    stok: number;
    harga: number;
  };

  // State untuk Svelte 5
  let produk: Produk[] = $state([]);
  let namaBarang = $state('');
  let stok = $state<number | string>('');
  let harga = $state<number | string>('');
  let editId = $state<number | null>(null);

  // Fungsi untuk mengambil data dari Supabase
  async function fetchProduk() {
    let { data, error } = await supabase
      .from('produk')
      .select('*')
      .order('id', { ascending: true }); // Mengurutkan berdasarkan ID

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      produk = data ?? []; // Update state tabel UI
    }
  }

  // Panggil fetchProduk saat komponen pertama kali dimuat
  onMount(() => {
    fetchProduk();
  });

  // Fungsi untuk handle submit form
  /** @param {SubmitEvent} event */
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault(); 

    if (editId) {
      // Jika mode edit, lakukan UPDATE
      const { error } = await supabase
        .from('produk')
        .update({ 
          namaBarang: namaBarang, 
          stok: Number(stok), 
          harga: Number(harga) 
        })
        .eq('id', editId);
      if (error) console.error("Error update:", error);
    } else {
      // Jika bukan mode edit, lakukan INSERT
      const { error } = await supabase
        .from('produk')
        .insert([{ namaBarang, stok: Number(stok), harga: Number(harga) }]);
      if (error) console.error("Error insert:", error);
    }

    fetchProduk(); 
    resetForm(); // Panggil fungsi reset setelah selesai
  }

  async function hapusProduk(id: number) {
    if (confirm('Yakin ingin menghapus data ini?')) {
      const { error } = await supabase.from('produk').delete().eq('id', id);
      if (!error) fetchProduk(); 
    }
  }

  function siapkanEdit(p: Produk) {
    editId = p.id; 
    namaBarang = p.namaBarang;
    stok = p.stok;
    harga = p.harga;
  }

  function resetForm() {
    editId = null;
    namaBarang = '';
    stok = '';
    harga = '';
  }
</script>

<!-- FORM INPUT -->
<h2>Input Data Produk</h2>
<form onsubmit={handleSubmit} style="margin-bottom: 20px;">
  <input type="text" bind:value={namaBarang} placeholder="Nama Barang" required />
  <input type="number" bind:value={stok} placeholder="Stok" required />
  <input type="number" bind:value={harga} placeholder="Harga" required />
  <button type="submit">{editId ? 'Update Data' : 'Submit'}</button>
  {#if editId}
    <button type="button" onclick={resetForm}>Batal</button>
  {/if}
</form>

<!-- TABEL TAMPILAN -->
<h2>Daftar Produk</h2>
<table border="1" style="width: 100%; text-align: left; border-collapse: collapse;">
  <thead>
    <tr>
      <th>ID</th>
      <th>Nama Barang</th>
      <th>Stok</th>
      <th>Harga</th>
      <th>Aksi</th>
    </tr>
  </thead>
  <tbody>
    {#each produk as p, i}
      <tr>
        <td>{i + 1}</td>
        <td>{p.namaBarang}</td>
        <td>{p.stok}</td>
        <td>{p.harga}</td>
        <td>
          <button onclick={() => siapkanEdit(p)}>Edit</button>
          <button onclick={() => hapusProduk(p.id)}>Hapus</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>