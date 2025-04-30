import { assertEquals, assertArrayIncludes } from "jsr:@std/assert";
import { activityApp } from "../handler/activity.ts";
import { Activity } from "../type/app.ts";
import { loginUserInCognito } from "./cognito_test.ts"; // ฟังก์ชันที่สร้างและล็อกอินผู้ใช้ผ่าน Cognito

Deno.test("Activity routes", async (t) => {
  // สร้างผู้ใช้และรับ token ผ่าน Cognito
  const token = await loginUserInCognito();

  if (!token) {
    throw new Error("Login failed");
  }

  // ข้อมูลกิจกรรมใหม่ที่ใช้ในการทดสอบ
  const newActivity: Activity = {
    id: "123e4567-e89b-12d3-a456-426614174000",  // เปลี่ยน UUID ตามต้องการ
    name: "Test Activity",
    description: "Test description",
    activity_type: "academic", // กิจกรรมประเภท academic
    event_date: new Date().toISOString().split('T')[0],  // วันที่ของกิจกรรม
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let createdActivity: Activity;

  await t.step("POST / - create activity", async () => {
    const res = await activityApp.request("/", {
      method: "POST",
      body: JSON.stringify(newActivity),
      headers: {
        Authorization: `Bearer ${token}`, // ใช้ token จากการล็อกอิน
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    createdActivity = await res.json();
    assertEquals(createdActivity.name, newActivity.name);
  });

  await t.step("GET / - fetch all activities", async () => {
    const res = await activityApp.request("/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // ใช้ token จากการล็อกอิน
      },
    });

    assertEquals(res.status, 200);
    const activities: Activity[] = await res.json();
    // ตรวจสอบว่ากิจกรรมที่สร้างขึ้นมีในรายการ
    assertArrayIncludes(activities.map(a => a.id), [createdActivity.id]);
  });

  await t.step("GET /:id - fetch single activity", async () => {
    const res = await activityApp.request(`/${createdActivity.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // ใช้ token จากการล็อกอิน
      },
    });

    assertEquals(res.status, 200);
    const fetched = await res.json();
    assertEquals(fetched.id, createdActivity.id);
  });

  await t.step("PUT /:id - update activity", async () => {
    const updatedActivity: Activity = { ...createdActivity, name: "Updated Test Activity" };

    const res = await activityApp.request(`/${createdActivity.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedActivity),
      headers: {
        Authorization: `Bearer ${token}`, // ใช้ token จากการล็อกอิน
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    const updatedRes = await res.json();
    assertEquals(updatedRes.name, "Updated Test Activity");
  });

  await t.step("DELETE /:id - delete activity", async () => {
    const res = await activityApp.request(`/${createdActivity.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // ใช้ token จากการล็อกอิน
      },
    });

    assertEquals(res.status, 200);
  });

  await t.step("POST / - create activity with missing fields", async () => {
    const incompleteActivity = { ...newActivity, name: undefined }; // ขาดข้อมูล name
    const res = await activityApp.request("/", {
      method: "POST",
      body: JSON.stringify(incompleteActivity),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    assertEquals(res.status, 400); // คาดว่า API ควรส่ง status 400
  });  
});
