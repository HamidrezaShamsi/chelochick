import { prisma } from "@/lib/prisma";
import { fmt } from "@/lib/money";
import { AddButton } from "@/components/AddButton";
export const dynamic = "force-dynamic";
export default async function MenuPage(){
  const categories = await prisma.menuCategory.findMany({
    orderBy:{ sortOrder:"asc" },
    include:{ items:{ where:{ isAvailable:true }, orderBy:{ name:"asc" } } }
  });
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Menu</h2>
      {categories.map(cat=>(
        <section key={cat.id}>
          <h3 className="text-xl font-medium mb-3">{cat.name}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.items.map(item=>(
              <div key={item.id} className="card flex flex-col justify-between">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold">{fmt(item.priceCents)}</span>
                  <AddButton item={{ id:item.id, name:item.name, priceCents:item.priceCents, quantity:1 }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}