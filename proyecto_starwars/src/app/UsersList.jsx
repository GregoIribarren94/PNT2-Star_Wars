"use client";

"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthProvider"; 

const API = "https://690b87c26ad3beba00f55bf7.mockapi.io/users";

export default function UsersList() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(API);
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Error cargando usuarios:", err);
            alert("No se pudo cargar la lista de usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        // Previene borrar al mismo admin que está logueado
        if (currentUser?.id === id) {
            return alert("No podés eliminar tu propia cuenta mientras estás logueado/a.");
        }

        const confirm = window.confirm("¿Querés eliminar este usuario?");
        if (!confirm) return;

        // Optimistic UI: sacar del state inmediatamente (mejora UX)
        const prev = [...users];
        setUsers((u) => u.filter((x) => x.id !== id));

        try {
            const res = await fetch(`${API}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Error eliminando");
            alert("Usuario eliminado correctamente");
        } catch (err) {
            console.error(err);
            alert("No se pudo eliminar el usuario. Intenta de nuevo.");
            setUsers(prev); // revertir en caso de error
        }
    };

    if (loading) return <p>Cargando usuarios...</p>;

    return (
        <div style={{ padding: 16 }}>
            <h2>Usuarios</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: "left", padding: 8 }}>ID</th>
                        <th style={{ textAlign: "left", padding: 8 }}>Username</th>
                        <th style={{ textAlign: "left", padding: 8 }}>Email</th>
                        <th style={{ textAlign: "left", padding: 8 }}>Admin</th>
                        {currentUser?.admin && <th style={{ padding: 8 }}>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
                            <td style={{ padding: 8 }}>{u.id}</td>
                            <td style={{ padding: 8 }}>{u.username}</td>
                            <td style={{ padding: 8 }}>{u.email}</td>
                            <td style={{ padding: 8 }}>{u.admin ? "Sí" : "No"}</td>
                            {currentUser?.admin && (
                                <td style={{ padding: 8 }}>
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        style={{
                                            padding: "6px 10px",
                                            background: "#e53e3e",
                                            color: "white",
                                            border: "none",
                                            borderRadius: 6,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
