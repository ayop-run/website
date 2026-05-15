import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import AdminGate from "../../components/Admin/AdminGate";

function OpenSiteEditor() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/edit");
  }, [router]);
  return (
    <p className="opacity-80 text-sm">
      Opening the site editor… If nothing happens,{" "}
      <Link href="/edit" className="underline">
        open it here
      </Link>
      .
    </p>
  );
}

export default function AdminEditPage() {
  return (
    <Layout title="Admin · Site editor" description="Open the AYOP site content editor">
      <main className="mt-10 laptop:mt-16 max-w-xl mx-auto">
        <p className="text-sm mb-4">
          <Link href="/admin" className="hover:underline opacity-80">
            ← Admin
          </Link>
        </p>
        <h1 className="text-3xl font-bold mb-4">Site editor</h1>
        <p className="text-sm opacity-80 mb-6">
          You will be redirected to the full-page editor for header, team, activities, and related
          content.
        </p>
        <AdminGate showSignOut={false}>
          <OpenSiteEditor />
        </AdminGate>
      </main>
    </Layout>
  );
}
