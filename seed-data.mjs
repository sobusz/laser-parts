import mysql from "mysql2/promise";
import { URL } from "url";

function parseDatabaseUrl(dbUrl) {
  try {
    const url = new URL(dbUrl);
    return {
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: url.searchParams.get("ssl") ? JSON.parse(url.searchParams.get("ssl")) : undefined,
    };
  } catch (e) {
    console.error("Błąd parsowania DATABASE_URL:", e.message);
    process.exit(1);
  }
}

async function seedData() {
  const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
  console.log(`🔗 Łączę się z bazą: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

  const pool = mysql.createPool({
    connectionLimit: 5,
    ...dbConfig,
  });

  const connection = await pool.getConnection();

  try {
    console.log("🌱 Seedowanie danych...\n");

    // Clear existing data
    await connection.query("DELETE FROM order_items");
    await connection.query("DELETE FROM orders");
    await connection.query("DELETE FROM products");
    await connection.query("DELETE FROM categories");

    // Insert categories
    const categories = [
      { name: "Trumpf", slug: "trumpf", description: "Części i materiały eksploatacyjne do wycinarek Trumpf" },
      { name: "Bystronic", slug: "bystronic", description: "Materiały do laserów Bystronic" },
      { name: "Mazak", slug: "mazak", description: "Części do wycinarek Mazak Optiplex" },
      { name: "LVD", slug: "lvd", description: "Elementy eksploatacyjne do laserów LVD" },
      { name: "Elementy optyki", slug: "optyka", description: "Soczewki, lustra, papiery do czyszczenia" },
      { name: "Filtry i wkłady", slug: "filtry", description: "Filtry wody, powietrza i wkłady chłodzące" },
    ];

    const categoryIds = [];
    for (const cat of categories) {
      const [result] = await connection.query(
        "INSERT INTO categories (name, slug, description, sortOrder) VALUES (?, ?, ?, ?)",
        [cat.name, cat.slug, cat.description, 0]
      );
      categoryIds.push(result.insertId);
    }
    console.log(`✓ Dodano ${categoryIds.length} kategorii`);

    // Insert products
    const products = [
      // Trumpf
      {
        categoryId: categoryIds[0],
        name: "Dysza tnąca 1.0mm Trumpf",
        slug: "dysza-1-0mm-trumpf",
        referenceNumber: "0700-000-001",
        description: "Dysza tnąca do wycinarek Trumpf TruLaser. Wymiar otworu: 1.0mm. Materiał: mosiądz.",
        specifications: "Średnica: 1.0mm | Materiał: mosiądz | Kompatybilna z: Trumpf TruLaser 1030, 1040, 3030, 5030",
        price: "45.00",
        unit: "szt.",
        inStock: true,
        featured: true,
      },
      {
        categoryId: categoryIds[0],
        name: "Soczewka fokusująca Zn-Se 20mm",
        slug: "soczewka-zn-se-20mm",
        referenceNumber: "0700-000-002",
        description: "Soczewka fokusująca z materiału Zn-Se do głowicy laserowej. Ogniskowa: 20mm.",
        specifications: "Materiał: Zn-Se | Ogniskowa: 20mm | Średnica: 20mm | Powłoka: AR",
        price: "120.00",
        unit: "szt.",
        inStock: true,
        featured: true,
      },
      {
        categoryId: categoryIds[0],
        name: "Uchwyt ceramiczny dyszy Trumpf",
        slug: "uchwyt-ceramiczny-dyszy",
        referenceNumber: "0700-000-003",
        description: "Ceramiczny uchwyt dyszy do głowicy tnącej wycinarek Trumpf. Zapewnia stabilne pozycjonowanie.",
        specifications: "Materiał: ceramika | Kompatybilna z: Trumpf TruLaser | Temperatura pracy: do 200°C",
        price: "28.50",
        unit: "szt.",
        inStock: true,
        featured: false,
      },
      {
        categoryId: categoryIds[0],
        name: "Szyba ochronna do głowicy",
        slug: "szyba-ochronna-glowica",
        referenceNumber: "0700-000-004",
        description: "Szyba ochronna (okno laserowe) chroniące soczewkę fokusującą. Jednorazowa.",
        specifications: "Materiał: ZnSe | Średnica: 20mm | Grubość: 2mm | Transmisja: >90%",
        price: "35.00",
        unit: "szt.",
        inStock: true,
        featured: false,
      },
      // Bystronic
      {
        categoryId: categoryIds[1],
        name: "Dysza tnąca 1.5mm Bystronic",
        slug: "dysza-1-5mm-bystronic",
        referenceNumber: "0800-000-001",
        description: "Dysza tnąca do wycinarek Bystronic. Wymiar otworu: 1.5mm. Wysokiej jakości mosiądz.",
        specifications: "Średnica: 1.5mm | Materiał: mosiądz | Kompatybilna z: Bystronic BySpeed, ByVario",
        price: "52.00",
        unit: "szt.",
        inStock: true,
        featured: true,
      },
      {
        categoryId: categoryIds[1],
        name: "Filtr powietrza Bystronic",
        slug: "filtr-powietrza-bystronic",
        referenceNumber: "0800-000-002",
        description: "Wkład filtracyjny do systemu powietrza. Zapobiega zabrudzeniu optyki.",
        specifications: "Typ: wkład papierowy | Rozmiar: standard | Wymiana: co 500 godzin pracy",
        price: "18.00",
        unit: "szt.",
        inStock: true,
        featured: false,
      },
      // Mazak
      {
        categoryId: categoryIds[2],
        name: "Dysza tnąca 0.8mm Mazak",
        slug: "dysza-0-8mm-mazak",
        referenceNumber: "0900-000-001",
        description: "Dysza precyzyjna do wycinarek Mazak Optiplex. Wymiar otworu: 0.8mm.",
        specifications: "Średnica: 0.8mm | Materiał: mosiądz | Kompatybilna z: Mazak Optiplex 3015, 4020",
        price: "48.00",
        unit: "szt.",
        inStock: true,
        featured: true,
      },
      // LVD
      {
        categoryId: categoryIds[3],
        name: "Dysza tnąca 1.2mm LVD",
        slug: "dysza-1-2mm-lvd",
        referenceNumber: "1000-000-001",
        description: "Dysza tnąca do wycinarek LVD. Wymiar otworu: 1.2mm. Materiał: mosiądz wysokiej czystości.",
        specifications: "Średnica: 1.2mm | Materiał: mosiądz | Kompatybilna z: LVD Strippit",
        price: "50.00",
        unit: "szt.",
        inStock: true,
        featured: true,
      },
      // Elementy optyki
      {
        categoryId: categoryIds[4],
        name: "Lustro laserowe 45° (25x25mm)",
        slug: "lustro-laserowe-45",
        referenceNumber: "1100-000-001",
        description: "Lustro odbijające wiązkę laserową pod kątem 45°. Wysokiej klasy powłoka.",
        specifications: "Rozmiar: 25x25mm | Kąt: 45° | Powłoka: złota | Refleksja: >99%",
        price: "65.00",
        unit: "szt.",
        inStock: true,
        featured: false,
      },
      {
        categoryId: categoryIds[4],
        name: "Papier do czyszczenia optyki (50 szt.)",
        slug: "papier-czyszczacy-optyka",
        referenceNumber: "1100-000-002",
        description: "Bezpyłowy papier do czyszczenia soczewek i luster laserowych. Opakowanie 50 szt.",
        specifications: "Ilość: 50 arkuszy | Rozmiar: 10x10cm | Materiał: bezpyłowy | Bezpieczny dla ZnSe",
        price: "12.00",
        unit: "opak.",
        inStock: true,
        featured: false,
      },
      // Filtry
      {
        categoryId: categoryIds[5],
        name: "Filtr wody do agregatu chłodzącego",
        slug: "filtr-wody-agregat",
        referenceNumber: "1200-000-001",
        description: "Wkład filtracyjny do systemu chłodzenia. Zapobiega osadzaniu się zanieczyszczeń.",
        specifications: "Typ: wkład węglowy | Przepustowość: 50L/min | Wymiana: co 1000 godzin",
        price: "22.00",
        unit: "szt.",
        inStock: true,
        featured: false,
      },
      {
        categoryId: categoryIds[5],
        name: "Wkład filtracyjny powietrza (standard)",
        slug: "wklad-filtracyjny-powietrza",
        referenceNumber: "1200-000-002",
        description: "Uniwersalny wkład filtracyjny do systemów pneumatycznych. Rozmiar standard.",
        specifications: "Typ: papier syntetyczny | Rozmiar: standard | Przepustowość: 100L/min",
        price: "15.00",
        unit: "szt.",
        inStock: true,
        featured: false,
      },
    ];

    let productCount = 0;
    for (const prod of products) {
      await connection.query(
        `INSERT INTO products 
         (categoryId, name, slug, referenceNumber, description, specifications, price, unit, inStock, featured, sortOrder) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.categoryId,
          prod.name,
          prod.slug,
          prod.referenceNumber,
          prod.description,
          prod.specifications,
          prod.price,
          prod.unit,
          prod.inStock ? 1 : 0,
          prod.featured ? 1 : 0,
          0,
        ]
      );
      productCount++;
    }
    console.log(`✓ Dodano ${productCount} produktów`);

    console.log("\n✅ Seedowanie ukończone!\n");
    console.log(`Statystyka:`);
    console.log(`  • ${categoryIds.length} kategorii`);
    console.log(`  • ${productCount} produktów`);
    console.log(`\n📍 Produkty wyróżnione (featured): 5`);
  } catch (error) {
    console.error("❌ Błąd podczas seedowania:", error.message);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedData();
