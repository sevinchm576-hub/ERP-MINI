import { useState, useEffect } from "react";
import "./App.css";

function App() {
  
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

    // Kirim va chiqim uchun
  const [movementType, setMovementType] = useState("KIRIM");
  const [movementProduct, setMovementProduct] = useState("");
  const [movementQuantity, setMovementQuantity] = useState("");
  const [movementNote, setMovementNote] = useState("");
  const [movements, setMovements] = useState([]);

  // Mahsulotlarni bazadan olish
  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setMessage("Server bilan bog'lanishda xatolik!");
    }
  };

  useEffect(() => {
    getProducts();
    getMovements();
  }, []);

  // Yangi mahsulot qo'shish
  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          sku,
          unit: "dona",
          quantity: Number(quantity)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Mahsulot qo'shilmadi");
      }

      setMessage("Mahsulot muvaffaqiyatli qo'shildi!");
      setName("");
      setSku("");
      setQuantity("");
      getProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Mahsulotni o'chirish
const deleteProduct = async (id) => {
  const confirmDelete = window.confirm(
    "Haqiqatan ham mahsulotni o'chirmoqchimisiz?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:5000/products/${id}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Mahsulotni o'chirib bo'lmadi");
    }

    setMessage("Mahsulot muvaffaqiyatli o'chirildi!");
    getProducts();
  } catch (error) {
    setMessage(error.message);
  }
};

// Mahsulotni tahrirlash
const editProduct = async (product) => {
  const newName = prompt("Yangi mahsulot nomini kiriting:", product.name);
  if (newName === null || newName.trim() === "") return;

  const newQuantity = prompt("Yangi miqdorni kiriting:", product.quantity);
  if (newQuantity === null || newQuantity.trim() === "") return;

  if (!Number.isInteger(Number(newQuantity)) || Number(newQuantity) < 0) {
    alert("Miqdor 0 yoki undan katta butun son bo'lishi kerak!");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/products/${product.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newName,
          sku: product.sku,
          unit: product.unit,
          quantity: Number(newQuantity)
        })
      }
    );

    if (!response.ok) {
      throw new Error("Mahsulotni tahrirlashda xatolik!");
    }

    setMessage("Mahsulot muvaffaqiyatli tahrirlandi!");
    getProducts();
  } catch (error) {
    setMessage(error.message);
  }
};

// Kirim va chiqimlar tarixini olish
const getMovements = async () => {
  try {
    const response = await fetch("http://localhost:5000/movements");
    const data = await response.json();
    setMovements(data);
  } catch (error) {
    console.log("Tarixni yuklashda xatolik:", error);
  }
};

// Mahsulot kirimi yoki chiqimini bajarish
const addMovement = async (e) => {
  e.preventDefault();

  if (!movementProduct || !movementQuantity) {
    setMessage("Mahsulot va miqdorni kiriting!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/movements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: Number(movementProduct),
        type: movementType,
        quantity: Number(movementQuantity),
        note: movementNote
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Xatolik yuz berdi!");
    }

    setMessage("Operatsiya muvaffaqiyatli bajarildi!");
    setMovementQuantity("");
    setMovementNote("");

    getProducts();
    getMovements();
  } catch (error) {
    setMessage(error.message);
  }
};

  return (
    <div className="app">
      <header className="header">
        <h1>ERP MINI</h1>
        <p>Kichik korxona ombor boshqaruv tizimi</p>
      </header>

      <main className="container">
       
<section className="summary">
  <h2>Ombor hisoboti</h2>

  <div className="summary-card">
    <h3>Jami mahsulot turlari</h3>
    <p>{products.length}</p>
  </div>

  <div className="summary-card">
    <h3>Jami mahsulot miqdori</h3>
    <p>
      {products.reduce(
        (total, product) => total + product.quantity,
        0
      )}
    </p>
  </div>

  <div className="summary-card">
    <h3>Mavjud mahsulotlar</h3>
    <p>
      {products.filter((product) => product.quantity > 0).length}
    </p>
  </div>
</section>


        <section className="form-section">
          <h2>Yangi mahsulot qo'shish</h2>

          <form onSubmit={addProduct}>
            <input
              type="text"
              placeholder="Mahsulot nomi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Mahsulot kodi"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Miqdori"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              required
            />

            <button type="submit">Mahsulot qo'shish</button>
          </form>

          {message && <p className="message">{message}</p>}
        </section>

        <section className="form-section">
  <h2>Mahsulot kirimi va chiqimi</h2>

  <form onSubmit={addMovement}>
    <select
      value={movementProduct}
      onChange={(e) => setMovementProduct(e.target.value)}
      required
    >
      <option value="">Mahsulotni tanlang</option>

      {products.map((product) => (
        <option key={product.id} value={product.id}>
          {product.name} (Qoldiq: {product.quantity})
        </option>
      ))}
    </select>

    <select
      value={movementType}
      onChange={(e) => setMovementType(e.target.value)}
    >
      <option value="KIRIM">KIRIM</option>
      <option value="CHIQIM">CHIQIM</option>
    </select>

    <input
      type="number"
      placeholder="Miqdori"
      value={movementQuantity}
      onChange={(e) => setMovementQuantity(e.target.value)}
      min="1"
      required
    />

    <input
      type="text"
      placeholder="Izoh"
      value={movementNote}
      onChange={(e) => setMovementNote(e.target.value)}
    />

    <button type="submit">Saqlash</button>
  </form>
</section>


<section className="table-section">
  <h2>Kirim va chiqimlar tarixi</h2>

  <table>
    <thead>
      <tr>
        <th>Mahsulot</th>
        <th>Operatsiya</th>
        <th>Miqdor</th>
        <th>Izoh</th>
        <th>Sana</th>
      </tr>
    </thead>

    <tbody>
      {movements.map((movement) => (
        <tr key={movement.id}>
          <td>{movement.product.name}</td>
          <td>{movement.type}</td>
          <td>{movement.quantity}</td>
          <td>{movement.note || "-"}</td>
          <td>
            {new Date(movement.createdAt).toLocaleString("uz-UZ")}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</section>

        <section className="table-section">
          <h2>Ombordagi mahsulotlar</h2>

          <div className="search-box">
  <input
    type="text"
    placeholder="Mahsulot nomi yoki kodini qidiring..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Mahsulot nomi</th>
                <th>Kodi</th>
                <th>Birligi</th>
                <th>Miqdori</th>
                <th>Amallar</th>
              </tr>
            </thead>

            <tbody>
             {products
  .filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku || "").toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.unit}</td>
                  <td>{product.quantity}</td>
            <td>
  <button onClick={() => editProduct(product)}>
    Tahrirlash
  </button>

  <button
    onClick={() => deleteProduct(product.id)}
    style={{ background: "red", marginLeft: "5px" }}
  >
    O'chirish
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;

