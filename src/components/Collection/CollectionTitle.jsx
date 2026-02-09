// ======================================
// CollectionTitle.jsx
// Shopify collection title section
// ======================================

export default function CollectionTitle({ title, description }) {
  return (
    <section className="bg-[#f7f7f7] py-10 md:py-14">

      <div className="max-w-4xl mx-auto px-6 text-center">

        {/* TITLE */}
        <h1 className="text-3xl md:text-5xl font-light mb-4">
          {title}
        </h1>

        {/* DESCRIPTION */}
        {description && (
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}

      </div>

    </section>
  );
}
