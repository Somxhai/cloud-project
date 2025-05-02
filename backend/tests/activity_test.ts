import {
  assertEquals,
  assertArrayIncludes,
  assertExists
} from "jsr:@std/assert";
import { activityApp } from "../handler/activity.ts";
import { Activity } from "../type/app.ts";
import { loginUserInCognito } from "../lib/cognito.ts";
import { UUIDTypes } from "uuid";

Deno.test("Activity routes", async (t) => {
  const username = "testuser";
  const password = "TestPassword123!";
  const token = await loginUserInCognito(username, password);
  if (!token) throw new Error("Login failed");

  const newActivity: Partial<Activity> = {
    name: "Test Activity",
    description: "Test description",
    activity_type: "academic",
    event_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let activityId: UUIDTypes;

  // POST request to create an activity
  await t.step("POST / - create activity", async () => {
    const res = await activityApp.request("/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newActivity),
    });

    assertEquals(res.status, 200);
    const created: Activity = await res.json();
    console.log("Created Activity:", created); // Debugging line
    if (!created.id) throw new Error("No ID returned from POST /");
    activityId = created.id;
  });

  // GET request to fetch all activities
  await t.step("GET / - fetch all activities", async () => {
    const res = await activityApp.request("/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    assertEquals(res.status, 200);
    const activities: Activity[] = await res.json();
    assertArrayIncludes(activities.map((a) => a.id), [activityId]);
  });

  await t.step("GET /:id - fetch single activity", async () => {
    // Ensure that we are passing the correct `activityId` from the previous POST request.
    const res = await activityApp.request(`/${activityId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  
    // Check if the response status is 200 (successful).
    assertEquals(res.status, 200);
    
    // Parse the response JSON as an Activity object.
    const activity: Activity = await res.json();
    
    // Check that the returned activity's ID matches the ID we used in the URL.
    assertEquals(activity.id, activityId);
    
    // Check that the returned activity has a name.
    assertExists(activity.name);
  });

  await t.step("PUT /:id - update activity", async () => {
    const updated: Activity = {
      id: activityId,
      name: "Updated Activity",
      description: newActivity.description ?? "Default description",
      activity_type: newActivity.activity_type ?? "art",
      event_date: newActivity.event_date ?? new Date().toISOString().split("T")[0],
      created_at: newActivity.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(), // Usually updated_at should change
    };
  
    const res = await activityApp.request(`/${activityId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updated),
    });
  
    assertEquals(res.status, 200);
  
    const updatedRes: Activity = await res.json();
    assertEquals(updatedRes.name, "Updated Activity");
  });
  
  await t.step("DELETE /:id - delete activity", async () => {
    const res = await activityApp.request(`/${activityId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  
    assertEquals(res.status, 200);
    const deleted: Activity = await res.json();
    assertEquals(deleted.id, activityId);
  });

  await t.step("POST / - fail if missing required fields", async () => {
    const invalid = { ...newActivity };
    delete invalid.name;

    const res = await activityApp.request("/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalid),
    });

    assertEquals(res.status, 400);
  });
});
