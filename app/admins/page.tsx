import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Admins() {
  const admins = await prisma.admin.findMany();

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Admin List</h1>
      <ul className="space-y-4">
        {admins.map((admin) => (
          <li
            key={admin.id}
            className="flex items-center gap-4 border p-3 rounded-lg shadow"
          >
            <img
              src={admin?.image || ""}
              alt={admin?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-lg text-black">{admin.name}</span>
          </li>
        ))}
      </ul>

      <Link href="/" className="bg-red-500  p-4 mt-5">
        home
      </Link>
    </div>
  );
}
