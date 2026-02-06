import { useState } from "react";

/* =========================
   PRODUCT DATA
========================= */
const products = [
  {
    id: 1,
    name: "Nainital Block Print Dress",
    price: 1299,
    colorVariants: [
      {
        colorName: "Blue",
        colorCode: "#3B82F6",
        frontImage:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80",
      },
      {
        colorName: "Green",
        colorCode: "#10B981",
        frontImage:
          "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1585487000160-6eb9ce6b5aae?w=500&auto=format&fit=crop&q=80",
      },
      {
        colorName: "Red",
        colorCode: "#EF4444",
        frontImage:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=80",
      },
      {
        colorName: "Yellow",
        colorCode: "#F59E0B",
        frontImage:
          "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: 2,
    name: "Floral Summer Dress",
    price: 1499,
    colorVariants: [
      {
        colorName: "Purple",
        colorCode: "#8B5CF6",
        frontImage:
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1580458148391-8c49525dc45c?w=500&auto=format&fit=crop&q=80",
      },
      {
        colorName: "Pink",
        colorCode: "#EC4899",
        frontImage:
          "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1523381294911-8a3f81df6d7e?w=500&auto=format&fit=crop&q=80",
      },
      {
        colorName: "Cyan",
        colorCode: "#06B6D4",
        frontImage:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: 3,
    name: "Evening Party Gown",
    price: 1999,
    colorVariants: [
      {
        colorName: "Black",
        colorCode: "#000000",
        frontImage:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=80",
      },
      {
        colorName: "Gray",
        colorCode: "#6B7280",
        frontImage:
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=500&auto=format&fit=crop&q=80",
      },
      {
        colorName: "Maroon",
        colorCode: "#DC2626",
        frontImage:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1523381294911-8a3f81df6d7e?w=500&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: 4,
    name: "Casual Cotton Dress",
    price: 899,
    colorVariants: [
      {
        colorName: "Lime",
        colorCode: "#84CC16",
        frontImage:
          "https://images.unsplash.com/photo-1585487000160-6eb9ce6b5aae?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=80",
      },
      {
        colorName: "Orange",
        colorCode: "#F97316",
        frontImage:
          "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=500&auto=format&fit=crop&q=80",
      },
      {
        colorName: "Teal",
        colorCode: "#14B8A6",
        frontImage:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80",
        backImage:
          "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=80",
      },
    ],
  },
];

/* =========================
   PRODUCT CARD
========================= */
function ProductCard({ product }) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const selectedColor = product.colorVariants[selectedColorIndex];

  return (
    <div className="group">
      {/* IMAGE */}
      <div
        className="relative h-80 overflow-hidden rounded-lg mb-4 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* FRONT */}
        <img
          src={selectedColor.frontImage}
          alt="front"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />

        {/* BACK */}
        <img
          src={selectedColor.backImage}
          alt="back"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        />
      </div>

      {/* INFO */}
      <div className="text-center">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-lg font-medium mb-3">₹{product.price}</p>

        {/* COLOR DOTS */}
        <div className="flex justify-center gap-3">
          {product.colorVariants.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColorIndex(index)}
              className={`w-6 h-6 rounded-full border-2 transition ${
                selectedColorIndex === index
                  ? "border-black ring-2 ring-gray-300 scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.colorCode }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================
   MAIN SECTION
========================= */
export default function BestSellerSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Best Sellers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
