const BASE_URL = "http://localhost:3000/api/v1/events";

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${path}`, options);
  
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = {};
  }

  return { status: response.status, data };
}

async function runTests() {
  console.log("\n" + "=".repeat(50));
  console.log("🧪 REST API COMPREHENSIVE TESTS");
  console.log("=".repeat(50));

  let createdEventId;

  console.log("\n📋 GET /events - Get all events");
  let result = await request("GET", "");
  console.log(`   Events: ${result.data.data?.length || 0}`);
  console.log(`   Status: ${result.status}`);

  console.log("\n📋 POST /events - Create event");
  result = await request("POST", "", {
    title: "Test Workshop",
    date: "2026-07-15T10:00:00Z",
    location: "Sfax",
    capacity: 25
  });
  createdEventId = result.data.data?.id;
  console.log(`   Created ID: ${createdEventId}`);
  console.log(`   Status: ${result.status}`);

  console.log("\n📋 GET /events/:id - Get single");
  if (createdEventId) {
    result = await request("GET", `/${createdEventId}`);
    console.log(`   Event: ${result.data.data?.title}`);
    console.log(`   Status: ${result.status}`);
  }

  console.log("\n📋 PUT /events/:id - Update");
  if (createdEventId) {
    result = await request("PUT", `/${createdEventId}`, {
      title: "Updated Workshop Title"
    });
    console.log(`   Updated: ${result.data.data?.title}`);
    console.log(`   Status: ${result.status}`);
  }

  console.log("\n📋 POST /events - Validation error");
  result = await request("POST", "", { title: "A" });
  console.log(`   Error: ${result.data.message}`);
  console.log(`   Status: ${result.status}`);

  console.log("\n📋 GET /events/9999 - Not found");
  result = await request("GET", "/9999");
  console.log(`   Message: ${result.data.message}`);
  console.log(`   Status: ${result.status}`);

  console.log("\n📋 GET /events/stats - Statistics");
  result = await request("GET", "/stats");
  console.log(`   Total events: ${result.data.data?.totalEvents}`);
  console.log(`   Status: ${result.status}`);

  console.log("\n📋 DELETE /events/:id - Delete");
  if (createdEventId) {
    result = await request("DELETE", `/${createdEventId}`);
    console.log(`   Deleted successfully`);
    console.log(`   Status: ${result.status}`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ ALL TESTS COMPLETE!");
  console.log("=".repeat(50) + "\n");
}

console.log("Waiting for server on http://localhost:3000...");
console.log("Make sure the server is running in another terminal with: npm start\n");
setTimeout(runTests, 2000);