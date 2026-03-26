import axios from "axios";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function pushDivisions() {
  console.log("--- PUSHING 19-DIVISION REGISTRY TO EDGE (via AXIOS) ---");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL + "/rest/v1/divisions";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const divisionsFile = path.join(process.cwd(), "src", "lib", "divisions.ts");
  const source = fs.readFileSync(divisionsFile, "utf8");

  const rows = [...source.matchAll(/slug:\s*'([^']+)',\s*name:\s*'([^']+)'/g)].map((match) => ({
    slug: match[1],
    name: match[2],
    description: "Synchronized division via v4 registry.",
    grid_signature: "9x9x9"
  }));

  console.log(`Extracted ${rows.length} divisions from source.`);

  try {
    const res = await axios.post(url, rows, {
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
      }
    });
    console.log(`? SUCCESS: ${rows.length} divisions synchronized (Status: ${res.status})`);
  } catch (e: any) {
    console.error("?? FAILED to push divisions:", e.response?.data || e.message);
    process.exit(1);
  }
}

pushDivisions().catch(console.error);
