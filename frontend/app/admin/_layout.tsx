import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0D47A1" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="AdminDashboardScreen" options={{ title: "Admin" }} />
      <Stack.Screen name="UserManagementScreen" options={{ title: "Users" }} />
      <Stack.Screen name="SystemHealthScreen" options={{ title: "System Health" }} />
      <Stack.Screen name="AdvisoryApprovalScreen" options={{ title: "Approvals" }} />
      <Stack.Screen name="OfficerPerformanceScreen" options={{ title: "Officers" }} />
      <Stack.Screen name="RegionManagementScreen" options={{ title: "Regions" }} />
    </Stack>
  );
}
