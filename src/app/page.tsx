import Shorten from "@/components/shorten";
import { Analytics } from "@vercel/analytics/react";
import Layout from "@/components/app/layout";

export default function Home() {
  return (
    <Layout>
      <Analytics />
      <div className="py-8 max-w-2xl w-full">
        <Shorten />
      </div>
    </Layout>
  );
}
