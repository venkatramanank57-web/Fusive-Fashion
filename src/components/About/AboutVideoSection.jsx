export default function AboutVideoSection() {
  return (
    <section className="w-full">
      
      <div className="relative w-full h-[460px] md:h-[660px] overflow-hidden">
        
        {/* VIDEO */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          controls
          poster="https://wonder-theme-fashion.myshopify.com/cdn/shop/files/preview_images/19ee62c0121645b189323b3804779054.thumbnail.0000000000_600x.jpg?v=1725997257"
        >
          <source
            src="https://wonder-theme-fashion.myshopify.com/cdn/shop/videos/c/vp/19ee62c0121645b189323b3804779054/19ee62c0121645b189323b3804779054.HD-1080p-2.5Mbps-34544900.mp4?v=0"
            type="video/mp4"
          />
        </video>

      </div>

    </section>
  );
}
