import { ref, computed } from "vue";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, isAdminEmail } from "../lib/firebase";

const user = ref(null);
const ready = ref(false);

onAuthStateChanged(auth, (u) => {
  user.value = u;
  ready.value = true;
});

export function useAuth() {
  const isAdmin = computed(() => isAdminEmail(user.value?.email));
  return {
    user,
    ready,
    isAdmin,
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
  };
}
