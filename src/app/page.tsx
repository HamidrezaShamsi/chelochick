import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[500px] -mt-6 flex items-center">
        <Image
          src="/images/hero-bg.jpg"
          alt="Restaurant ambiance"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container relative z-10 text-white">
          <div className="max-w-2xl">
            <Image 
              src="/images/logo.png" 
              alt="Chelochick Logo" 
              width={120} 
              height={120}
              className="mb-6"
            />
            <h1 className="text-5xl font-bold mb-4">Crispy & Fresh<br />Chicken Sandwiches</h1>
            <p className="text-xl mb-8 text-gray-200">Experience the perfect blend of crispy, juicy and delicious in every bite.</p>
            <div className="flex gap-4">
              <Link href="/menu" className="btn bg-yellow-400 hover:bg-yellow-500 text-black border-none">
                Order Now
              </Link>
              <Link href="/menu" className="btn border-2 border-white text-white hover:bg-white/10">
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="container">
        <h2 className="text-3xl font-bold text-center mb-8">Our Signature Items</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Classic Chelo",
              image: "/images/classic.jpg", 
              desc: "Crispy chicken, fresh pickles, signature sauce"
            },
            {
              title: "Spicy Chelo",
              image: "/images/spicy.jpg",
              desc: "Extra spicy with jalapeños and hot sauce"
            },
            {
              title: "Golden Fries",
              image: "/images/fries.jpg",
              desc: "Perfectly crispy golden fries"
            }
          ].map(item => (
            <div key={item.title} className="group relative overflow-hidden rounded-xl">
              <div className="aspect-square relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-200 text-sm">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-yellow-400">
        <div className="container py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="mb-8 text-gray-700">Fast pickup in Hamilton. Secure payment with Stripe.</p>
          <Link href="/menu" className="btn bg-black text-white hover:bg-black/90 border-none">
            Browse Our Menu
          </Link>
        </div>
      </section>
    </div>
  );
}