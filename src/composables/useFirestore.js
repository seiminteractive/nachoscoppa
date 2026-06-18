import { ref, onUnmounted } from "vue";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export function useCollection(path, { order = "order", direction = "asc" } = {}) {
  const items = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const q = order
    ? query(collection(db, path), orderBy(order, direction))
    : collection(db, path);
  const unsub = onSnapshot(
    q,
    (snap) => {
      items.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      loading.value = false;
    },
    (err) => {
      error.value = err;
      loading.value = false;
    },
  );
  onUnmounted(unsub);
  return { items, loading, error };
}

export function useDoc(path) {
  const data = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const unsub = onSnapshot(
    doc(db, path),
    (snap) => {
      data.value = snap.exists() ? { id: snap.id, ...snap.data() } : null;
      loading.value = false;
    },
    (err) => {
      error.value = err;
      loading.value = false;
    },
  );
  onUnmounted(unsub);
  return { data, loading, error };
}

export async function createDoc(collectionPath, payload) {
  const ref = await addDoc(collection(db, collectionPath), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function upsertDoc(path, payload) {
  await setDoc(
    doc(db, path),
    { ...payload, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function patchDoc(path, payload) {
  await updateDoc(doc(db, path), { ...payload, updatedAt: serverTimestamp() });
}

export async function removeDoc(path) {
  await deleteDoc(doc(db, path));
}
