// Ganti dengan webhook Discord Anda
const WEBHOOK_URL = "https://discord.com/api/webhooks/1416665930523611136/fy3He59UHX07SzTdnAT5tqyxTAXDVnt_b_fFyctXGvjnYKs96iqDqz-73mkInqhmPNbv";

let allData = [];

// Render produk di list
function renderProduk(data) {
  const list = document.getElementById("stokList");
  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = `<p class="text-gray-400">Belum ada item ditambahkan...</p>`;
  } else {
    data.forEach(item => {
      list.innerHTML += `
        <li class="p-3 bg-gray-700 rounded-lg flex justify-between">
          <div>
            <span class="font-semibold">${item.nama}</span><br>
            <span class="text-gray-400">Rp${item.harga}</span>
          </div>
          <span class="text-sm text-green-400">Stok: ${item.stok}</span>
        </li>`;
    });
  }
  updateStats(data);
}

// Update statistik
function updateStats(data) {
  document.getElementById("total").innerText = data.length;
  document.getElementById("tersedia").innerText = data.filter(p => p.stok > 0).length;
  document.getElementById("terjual").innerText = data.filter(p => p.stok === 0).length;
}

// Tambah produk -> kirim ke webhook
async function tambahProduk() {
  const nama = document.getElementById("namaProduk").value;
  const harga = document.getElementById("hargaProduk").value;
  const deskripsi = document.getElementById("deskripsiProduk").value;
  const usernameRoblox = document.getElementById("usernameRoblox").value;
  const stok = document.getElementById("stokProduk").value;
  const fotoInput = document.getElementById("fotoProduk");

  const itemBaru = { nama, harga, deskripsi, usernameRoblox, stok };
  allData.push(itemBaru);
  renderProduk(allData);

  try {
    if (fotoInput.files.length > 0) {
      const formData = new FormData();
      const payload = {
        content: "📦 Produk Baru Ditambahkan!",
        embeds: [{
          title: nama,
          description: `💰 Harga: Rp${harga}\n📜 ${deskripsi || "-"}\n👤 Roblox ID: ${usernameRoblox}\n📦 Stok: ${stok}`,
          color: 5814783,
          image: { url: `attachment://${fotoInput.files[0].name}` }
        }]
      };
      formData.append("payload_json", JSON.stringify(payload));
      formData.append("file", fotoInput.files[0], fotoInput.files[0].name);

      await fetch(WEBHOOK_URL, { method: "POST", body: formData });
    } else {
      const payload = {
        content: `📦 Produk Baru Ditambahkan!\n🪐 Nama: **${nama}**\n💰 Harga: Rp${harga}\n📜 ${deskripsi || "-"}\n👤 Roblox ID: ${usernameRoblox}\n📦 Stok: ${stok}`
      };
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    alert("Produk berhasil dikirim ke Webhook!");
    resetForm();
  } catch (err) {
    console.error("Gagal kirim webhook:", err);
    alert("Gagal kirim ke Webhook!");
  }
}

// Reset form input
function resetForm() {
  document.getElementById("namaProduk").value = "";
  document.getElementById("hargaProduk").value = "";
  document.getElementById("deskripsiProduk").value = "";
  document.getElementById("usernameRoblox").value = "";
  document.getElementById("stokProduk").value = "";
  document.getElementById("fotoProduk").value = "";
}

// Search produk
document.getElementById("search").addEventListener("input", function() {
  const keyword = this.value.toLowerCase();
  const filtered = allData.filter(p => p.nama.toLowerCase().includes(keyword));
  renderProduk(filtered);
});

// Logout
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// Set profile username
document.getElementById("profileUsername").innerText = localStorage.getItem("loggedInUser");

// Load awal dummy
renderProduk(allData);
