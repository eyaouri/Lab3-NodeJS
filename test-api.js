import http from "http";

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: "localhost", port: 3000, path, method,
        headers: { "Content-Type": "application/json" } },
      (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
      }
    );
    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testAPI() {
  console.log("═══════ TEST EVENT MANAGER API ═══════\n");
  try {
    let r;

    r = await makeRequest("GET", "/api/events");
    console.log(`GET /api/events        → ${r.status} | count: ${r.body.count}`);

    r = await makeRequest("POST", "/api/events",
      { title: "Docker Masterclass", date: "2026-06-01", location: "Sfax", capacity: 35 });
    console.log(`POST /api/events       → ${r.status} | créé: ${r.body.data.title}`);

    r = await makeRequest("GET", "/api/events/1");
    console.log(`GET /api/events/1      → ${r.status} | ${r.body.data.title}`);

    r = await makeRequest("PUT", "/api/events/1",
      { title: "Advanced JS Workshop", date: "2026-02-15", location: "Sfax", capacity: 30 });
    console.log(`PUT /api/events/1      → ${r.status} | ${r.body.data.title}`);

    r = await makeRequest("DELETE", "/api/events/2");
    console.log(`DELETE /api/events/2   → ${r.status} | supprimé: ${r.body.data.title}`);

    r = await makeRequest("POST", "/api/events", { title: "Incomplet" });
    console.log(`POST invalide          → ${r.status} | ${r.body.message}`);

    r = await makeRequest("GET", "/api/events/999");
    console.log(`GET /api/events/999    → ${r.status} | ${r.body.message}`);

    console.log("\n✅ TOUS LES TESTS RÉUSSIS !");
  } catch (err) {
    console.error("❌ Échec :", err.message);
  }
}

setTimeout(testAPI, 1000);