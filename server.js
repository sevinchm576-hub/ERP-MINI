const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Bosh sahifa
app.get("/", (req, res) => {
    res.send("ERP Mini dasturi ishlayapti!");
});

// Barcha mahsulotlarni ko'rish
app.get("/products", async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Yangi mahsulot qo'shish
app.post("/products", async (req, res) => {
    try {
        const { name, sku, unit, quantity } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                sku,
                unit,
                quantity: Number(quantity)
            }
        });

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Mahsulot qo'shishda xatolik",
            error: error.message
        });
    }
});

// Mahsulotni o'chirish
app.delete("/products/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.product.delete({
            where: { id: id }
        });

        res.json({
            message: "Mahsulot muvaffaqiyatli o'chirildi!"
        });
    } catch (error) {
        res.status(500).json({
            message: "Mahsulotni o'chirishda xatolik",
            error: error.message
        });
    }
});

// Mahsulotni tahrirlash
app.put("/products/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, sku, unit, quantity } = req.body;

        const product = await prisma.product.update({
            where: { id: id },
            data: {
                name,
                sku,
                unit,
                quantity: Number(quantity)
            }
        });

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Mahsulotni tahrirlashda xatolik",
            error: error.message
        });
    }
});


// Mahsulot kirimi va chiqimini amalga oshirish
app.post("/movements", async (req, res) => {
  try {
    const { productId, type, quantity, note } = req.body;

    if (!productId || !["KIRIM", "CHIQIM"].includes(type)) {
      return res.status(400).json({
        error: "Mahsulot yoki operatsiya turi noto'g'ri!"
      });
    }

    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      return res.status(400).json({
        error: "Miqdor musbat butun son bo'lishi kerak!"
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: Number(productId) }
      });

      if (!product) {
        throw new Error("Mahsulot topilmadi!");
      }

      const amount = Number(quantity);

      if (type === "CHIQIM" && product.quantity < amount) {
        throw new Error("Omborda mahsulot yetarli emas!");
      }

      const newQuantity =
        type === "KIRIM"
          ? product.quantity + amount
          : product.quantity - amount;

      const updatedProduct = await tx.product.update({
        where: { id: product.id },
        data: { quantity: newQuantity }
      });

      const movement = await tx.stockMovement.create({
        data: {
          type,
          quantity: amount,
          note,
          productId: product.id
        }
      });

      return { updatedProduct, movement };
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Kirim va chiqimlar tarixini olish
app.get("/movements", async (req, res) => {
  try {
    const movements = await prisma.stockMovement.findMany({
      include: {
        product: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Serverni ishga tushirish
app.listen(5000, () => {
    console.log("ERP Mini server 5000-portda ishlayapti!");
});