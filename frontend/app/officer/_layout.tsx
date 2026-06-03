import { Stack } from "expo-router";
import { useTranslation } from "@/hooks/useTranslation";

export default function OfficerLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1B5E20" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen
        name="OfficerDashboardScreen"
        options={{ title: t("auth.officer") }}
      />
      <Stack.Screen name="ManageAdvisoriesScreen" options={{ title: "Advisories" }} />
      <Stack.Screen name="SMSBroadcastScreen" options={{ title: "SMS" }} />
      <Stack.Screen name="MarketDataUploadScreen" options={{ title: "Market PDF" }} />
      <Stack.Screen name="FarmerManagementScreen" options={{ title: "Farmers" }} />
      <Stack.Screen name="AnalyticsScreen" options={{ title: "Analytics" }} />
    </Stack>
  );
}
