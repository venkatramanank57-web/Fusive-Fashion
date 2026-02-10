import { useState, useRef, useEffect } from "react";

const collections = [
  {
    label: "Denim",
    path: "/collections/denim",
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/skirt_aa319e58-878a-4f10-98ee-b2c940532b83.jpg?v=1708091165&width=300",
  },
  {
    label: "Printed",
    path: "/collections/printed",
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/jumper_jpg.webp?v=170811114&width=300",
  },
  {
    label: "Solids",
    path: "/collections/solids",
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/Group_4782_jpg.webp?v=1708091058&width=300",
  },
  {
    label: "Bodycon",
    path: "/collections/bodycon",
    img: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/Group_4784_jpg.webp?v=1708091076&width=300",
  },
];

export default function CollectionFeature() {
  const [hovered, setHovered] = useState(null);
  const [topPos, setTopPos] = useState(0);
  const [textRight, setTextRight] = useState(0);
  const itemRefs = useRef([]);
  const linkRefs = useRef([]);

  /* Calculate floating image position */
  useEffect(() => {
    if (hovered === null) return;
    const el = itemRefs.current[hovered];
    const linkEl = linkRefs.current[hovered];
    if (!el || !linkEl) return;
    
    // Get the vertical center position of the text element
    setTopPos(el.offsetTop + el.offsetHeight / 2);
    
    // Get the right edge position of the text element
    const linkRect = linkEl.getBoundingClientRect();
    const containerRect = el.parentElement.getBoundingClientRect();
    const textRightPosition = linkRect.right - containerRect.left;
    
    setTextRight(textRightPosition);
  }, [hovered]);

  return (
    <section className="bg-[#efefef] py-24 text-center overflow-hidden">

      {/* SMALL TITLE */}
      <p className="text-lg mb-14">Discover our Collections</p>

      <div className="relative max-w-[900px] mx-auto px-4">

        {/* COLLECTION LIST */}
        {collections.map((item, i) => (
          <div
            key={i}
            ref={(el) => (itemRefs.current[i] = el)}
            className="py-3 flex items-center justify-center gap-3 md:block relative"
          >
            <a 
              href={item.path}
              ref={(el) => (linkRefs.current[i] = el)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="inline-block"
            >
              <h2 className="
                text-[44px] md:text-[90px]
                leading-[1.1]
                font-light tracking-wide
                transition-opacity duration-300
                hover:opacity-60
                inline-block
              ">
                {item.label.toUpperCase()}
              </h2>
            </a>

            {/* MOBILE IMAGE (always visible) */}
            <img
              src={item.img}
              alt=""
              className="w-12 h-12 object-cover rounded-full md:hidden"
            />
          </div>
        ))}

        {/* DESKTOP FLOATING IMAGE (only visible when hovering over brand name text) */}
        {hovered !== null && (
          <div
            className="
              hidden md:block
              absolute 
              w-24 h-24
              rounded-full
              overflow-hidden
              border-2 border-white
              shadow-lg
              z-10
            "
            style={{
              top: topPos,
              left: `${textRight + 20}px`, // 20px gap from the right edge of text
              transform: "translateY(-50%)",
            }}
          >
            <img
              src={collections[hovered].img}
              alt=""
              className="
                w-full h-full
                object-cover
              "
            />
          </div>
        )}

      </div>
    </section>
  );
}