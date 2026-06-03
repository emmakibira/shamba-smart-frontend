import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import type { SensorReading } from "@/types";
import { db } from "./firebase";

export interface PairedSensorDoc {
  id: string;
  userId: string;
  name: string;
  deviceId: string;
  sensorType?: string;
  location?: string;
  thresholds?: {
    temperature?: { min: number; max: number };
    humidity?: { min: number; max: number };
    soilMoisture?: { min: number; max: number };
  };
}

export async function saveSensorReading(
  userId: string,
  sensorId: string,
  reading: Omit<SensorReading, "sensorId" | "recordedAt">,
): Promise<void> {
  await addDoc(collection(db, "sensorReadings"), {
    userId,
    sensorId,
    ...reading,
    recordedAt: new Date().toISOString(),
  });
}

export async function getSensorHistory(
  userId: string,
  sensorId: string,
  max = 50,
): Promise<SensorReading[]> {
  const q = query(
    collection(db, "sensorReadings"),
    where("userId", "==", userId),
    where("sensorId", "==", sensorId),
    orderBy("recordedAt", "desc"),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      sensorId: data.sensorId,
      temperature: data.temperature,
      humidity: data.humidity,
      soilMoisture: data.soilMoisture,
      recordedAt: data.recordedAt,
    };
  });
}

export async function savePairedSensor(
  userId: string,
  sensor: Omit<PairedSensorDoc, "id" | "userId">,
): Promise<string> {
  const ref = doc(collection(db, "pairedSensors"));
  await setDoc(ref, { ...sensor, userId });
  return ref.id;
}

export async function deletePairedSensor(sensorDocId: string): Promise<void> {
  await deleteDoc(doc(db, "pairedSensors", sensorDocId));
}
