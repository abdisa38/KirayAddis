import dns from "node:dns/promises";

async function lookup() {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    console.log("Resolving SRV records for _mongodb._tcp.cluster0.ovb8kel.mongodb.net...");
    const srv = await dns.resolveSrv("_mongodb._tcp.cluster0.ovb8kel.mongodb.net");
    console.log("SRV Records found:", srv);
  } catch (err: any) {
    console.error("DNS Resolve Error:", err.code, err.message);
  }
}

lookup();
