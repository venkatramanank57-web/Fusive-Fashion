export default function FeaturesBanner() {
  const features = [
    {
      icon: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/Group_340_cf3b65c1-22b6-41f8-911e-584047ae30f7.png",
      title: "Payment",
      text: "Credit card & PayPal",
    },
    {
      icon: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/Group_344c.png",
      title: "Delivery",
      text: "24h Green delivery",
    },
    {
      icon: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/Group_2222.png",
      title: "Wonder card",
      text: "Special discount club card",
    },
    {
      icon: "https://wonder-theme-fashion.myshopify.com/cdn/shop/files/Group_342.png",
      title: "Shipping",
      text: "Free standard shipping",
    },
  ];

  return (
    <section className="bg-white py-10 lg:py-16 lg:border-t lg:border-[#1f1919] relative z-10">

      {/* MOBILE LIST (Shopify layout) */}
      <div className="lg:hidden px-6 space-y-8 max-w-[500px] mx-auto">

        {features.map((item, i) => (
          <div key={i} className="flex items-start gap-4">

            {/* ICON */}
            <img
              src={item.icon}
              alt={item.title}
              className="w-[32px] mt-1"
            />

            {/* TEXT */}
            <div>
              <h3 className="text-[14px] tracking-[1px] uppercase text-gray-600 mb-1">
                {item.title}
              </h3>

              <p className="text-[15px] text-[#2b2b2b]">
                {item.text}
              </p>
            </div>

          </div>
        ))}

      </div>

      {/* DESKTOP GRID */}
      <div className="hidden lg:grid grid-cols-4 max-w-[1400px] mx-auto px-6 text-center">

        {features.map((item, i) => (
          <div key={i} className="flex flex-col items-center">

            <img
              src={item.icon}
              alt={item.title}
              className="w-[56px] mb-6"
            />

            <h3 className="text-[17px] font-medium mb-2">
              {item.title}
            </h3>

            <p className="text-[15px] text-gray-500">
              {item.text}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}
