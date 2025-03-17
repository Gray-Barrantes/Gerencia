import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDUgzs3xWORXgaHyn63sjpKEolGGNXggNw",
    authDomain: "proyectogerencia-a6851.firebaseapp.com",
    projectId: "proyectogerencia-a6851",
    storageBucket: "proyectogerencia-a6851.firebasestorage.app",
    messagingSenderId: "1088959609768",
    appId: "1:1088959609768:web:fd59003f1e8c07f88c7b9d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
console.log("✅ Firebase inicializado correctamente:", app);
console.log("✅ Firebase Auth cargado:", auth);

// Función para iniciar sesión con Google

window.loginWithGoogle = async function () {
    try {
        console.log("🔹 Iniciando sesión con Google...");
        const result = await signInWithPopup(auth, googleProvider);
        console.log("✅ Usuario autenticado:", result.user);
        return result.user.accessToken;
    } catch (error) {
        console.error("❌ Error en Google Login:", error);
        return null;
    }
};

// Función para iniciar sesión con email/contraseña
window.loginWithEmail = async function (email, password) {
    try {
        console.log("🔹 Iniciando sesión con Email...");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Usuario autenticado:", userCredential.user);
        return userCredential.user.accessToken;
    } catch (error) {
        console.error("❌ Error en Login Email:", error);
        return null;
    }
};

// Función para registrar usuario con email/contraseña
window.registerWithEmail = async function (email, password) {
    try {
        console.log("🔹 Registrando usuario...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("✅ Usuario registrado:", userCredential.user);
        return userCredential.user.accessToken;
    } catch (error) {
        console.error("❌ Error en registro:", error);
        return null;
    }
};

// Función para cerrar sesión
window.logout = async function () {
    try {
        await signOut(auth);
        console.log("✅ Sesión cerrada.");
        return true;
    } catch (error) {
        console.error("❌ Error al cerrar sesión:", error);
        return false;
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

// 🔹 Agregar un gasto
window.addGasto = async function (userId, monto, categoria, fecha) {
    try {
        const docRef = await addDoc(collection(db, `users/${userId}/gastos`), {
            monto: monto,
            categoria: categoria,
            fecha: fecha || new Date().toISOString()
        });
        console.log("✅ Gasto agregado:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ Error al agregar gasto:", error);
        return null;
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////

// 🔹 Agregar un ingreso
window.addIngreso = async function (userId, monto, fuente, fecha) {
    try {
        const docRef = await addDoc(collection(db, `users/${userId}/ingresos`), {
            monto: monto,
            fuente: fuente,
            fecha: fecha || new Date().toISOString()
        });
        console.log("✅ Ingreso agregado:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ Error al agregar ingreso:", error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Guardar usuario en Firestore si no existe
export async function saveUserToFirestore(user) {
    if (!user || !user.uid) {
        console.error("❌ Error: Usuario inválido o sin UID.");
        return;
    }

    const userRef = doc(db, "users", user.uid);  // 🔹 UID correcto
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,  // 🔹 Guardamos el UID correcto
            email: user.email || "",
            nombre: user.displayName || "",
            createdAt: new Date().toISOString()
        });
        console.log("✅ Usuario guardado en Firestore con UID:", user.uid);
    } else {
        console.log("✅ Usuario ya existe en Firestore:", user.uid);
    }
}
