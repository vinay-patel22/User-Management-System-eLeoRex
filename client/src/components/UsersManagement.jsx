import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [view, setView] = useState("list"); // "list", "add", "edit"
    const [userForm, setUserForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "user",
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate("/login"); // Redirect if no user is logged in
        } else if (currentUser?.role !== "admin" && currentUser?.role !== "manager") {
            navigate("/"); // Redirect if not admin or manager
        } else {
            fetchUsers();
        }
    }, [currentUser, navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/user/users", { withCredentials: true });
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError("Error fetching users");
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`/api/user/user/${userId}`, { withCredentials: true });
            setUsers(users.filter((user) => user._id !== userId));
        } catch (err) {
            setError("Error deleting user");
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (view === "add") {
                // For adding a new user
                await axios.post("/api/user/user", userForm, { withCredentials: true });
            } else if (view === "edit" && selectedUser) {
                // For editing an existing user
                await axios.put(`/api/user/user/${selectedUser._id}`, userForm, { withCredentials: true });
            }
            setView("list");
            fetchUsers();
        } catch (err) {
            setError("Error saving user");
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className="text-center text-gray-500">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-4">
            {view === "list" && (
                <>
                    <h1 className="text-3xl font-semibold text-center mb-6">User Management</h1>
                    {(currentUser.role === "admin" || currentUser.role === "manager") && (
                        <div className="mb-4 text-center">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
                                onClick={() => setView("add")}
                            >
                                Add User
                            </button>
                        </div>
                    )}
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="min-w-full table-auto text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Role</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b hover:bg-gray-100">
                                        <td className="px-4 py-2">{user.username}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">{user.role}</td>
                                        <td className="px-4 py-2 space-x-2">
                                            <button
                                                className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setUserForm({
                                                        username: user.username,
                                                        email: user.email,
                                                        role: user.role,
                                                        password: "",
                                                    });
                                                    setView("edit");
                                                }}
                                            >
                                                Edit
                                            </button>
                                            {currentUser.role === "admin" && (
                                                <button
                                                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {(view === "add" || view === "edit") && (
                <form onSubmit={handleFormSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">{view === "add" ? "Add User" : "Edit User"}</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name="username"
                            value={userForm.username}
                            onChange={handleFormChange}
                            placeholder="Name"
                            required
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleFormChange}
                            placeholder="Email"
                            required
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {view === "add" && (
                        <div className="mb-4">
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={userForm.password}
                                onChange={handleFormChange}
                                placeholder="Password"
                                required
                                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select
                            name="role"
                            value={userForm.role}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                        >
                            {view === "add" ? "Add User" : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setView("list")}
                            className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UsersManagement;
