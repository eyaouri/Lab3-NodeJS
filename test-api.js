const BASE_URL = "http://localhost:3000/api/v1/events";

async function runTests() {
  console.log("\n" + "=".repeat(50));
  console.log("🧪 REST API TESTS");
  console.log("=".repeat(50));

  let createdEventId;

  console.log("\n📋 GET /events");
  let res = await fetch(BASE_URL);
  let data = await res.json();
  console.log(`   Status: ${res.status}, Events: ${data.data?.length}`);

  console.log("\n📋 POST /events - Create");
  res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Test Workshop", date: "2026-07-15T10:00:00Z", location: "Sfax", capacity: 25 })
  });
  data = await res.json();
  createdEventId = data.data?.id;
  console.log(`   Status: ${res.status}, Created ID: ${createdEventId}`);

  console.log("\n📋 GET /events/:id");
  if (createdEventId) {
    res = await fetch(`${BASE_URL}/${createdEventId}`);
    data = await res.json();
    console.log(`   Status: ${res.status}, Event: ${data.data?.title}`);
  }

  console.log("\n📋 PUT /events/:id");
  if (createdEventId) {
    res = await fetch(`${BASE_URL}/${createdEventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated Workshop" })
    });
    data = await res.json();
    console.log(`   Status: ${res.status}, Updated: ${data.data?.title}`);
  }

  console.log("\n📋 DELETE /events/:id");
  if (createdEventId) {
    res = await fetch(`${BASE_URL}/${createdEventId}`, { method: "DELETE" });
    console.log(`   Status: ${res.status} (204 = Deleted)`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ TESTS COMPLETE!");
  console.log("=".repeat(50) + "\n");
}

console.log("⏳ Waiting for server...\n");
setTimeout(runTests, 2000);