import { ref as sref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../lib/firebase";

// Prefijo propio del sitio: el bucket es compartido con otra web, así que
// todo lo de Nacho Scoppa vive bajo esta carpeta para no pisar sus archivos.
const STORAGE_ROOT = "nachoscoppa";

function safeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
}

export async function uploadFile(folder, file) {
  const filename = `${Date.now()}-${safeFileName(file.name)}`;
  const objectRef = sref(storage, `${STORAGE_ROOT}/${folder}/${filename}`);
  await uploadBytes(objectRef, file);
  const url = await getDownloadURL(objectRef);
  return { url, path: `${STORAGE_ROOT}/${folder}/${filename}` };
}

export async function removeFile(path) {
  if (!path) return;
  try {
    await deleteObject(sref(storage, path));
  } catch {
    /* ya no existe */
  }
}
