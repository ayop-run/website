import React from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import AdminGate from "../../components/Admin/AdminGate";

function AdminCard({ title, description, href }) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-black/10 dark:border-white/10 p-5 hover:border-black/25 dark:hover:border-white/25 transition-colors"
    >
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm opacity-80">{description}</p>
    </Link>
  );
}

export default function AdminHomePage() {
  return (
    <Layout title="Admin" description="AYOP admin tools">
      <main className="mt-10 laptop:mt-16 max-w-3xl mx-auto">
        <p className="text-sm mb-4">
          <Link href="/" className="hover:underline opacity-80">
            ← Home
          </Link>
        </p>
        <h1 className="text-3xl tablet:text-4xl font-bold mb-8">Admin</h1>

        <AdminGate>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
            <AdminCard
              title="Edit website"
              description="Header, activities, team, social links, and other marketing copy (en.json editor)."
              href="/admin/edit"
            />
            <AdminCard
              title="Photo archive"
              description="Open the list; Add entry and row Edit appear after you sign in below."
              href="/photos"
            />
          </div>
        </AdminGate>
      </main>
    </Layout>
  );
}
