import { useEffect, useState } from "react";
import API from "../api/axios";
import "./AdminUsers.css";

export default function AdminUser() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [viewUser, setViewUser] = useState(null);
    const [passwordUser, setPasswordUser] = useState(null);


    const fetchUsers = async () => {
        const res = await API.get("/admin/users");
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            if (!window.confirm("Delete this user?")) return;

            await API.delete(`/admin/users/${id}`);

            fetchUsers(); // refresh
        } catch (err) {
            // console.error(err.response?.data || err.message);
            alert("Delete failed");
        }
    };

    const handleUpdate = async () => {
        await API.put(`/admin/users/${editUser._id}`, editUser);
        setEditUser(null);
        fetchUsers();
    };

    const handlePasswordUpdate = async () => {

        if (passwordUser.password !== passwordUser.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        await API.put(
            `/admin/users/${passwordUser._id}/password`,
            {
                password: passwordUser.password
            }
        );

        alert("Password Updated");

        setPasswordUser(null);
    };


    // const columns = 
    //     users.length > 0
    //         ? Object.keys(users[0]).filter((key) => key !== "_v")
    //     .slice(0, 6) : [];

    const columns = ["name", "employeeId", "role", "mobile"];


    return (
        <div className="admin-container">
            <h2>Users Management</h2>
            <table border="1" cellpadding="10" className="admin-table">
                <thead>
                    <tr>
                        <th>S.No.</th>
                        {columns.map((col, index) => (

                            <th key={col}>{col.toUpperCase()}</th>
                        ))}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, index) => (
                        <tr key={u._id}>
                            <td>{index + 1}</td>
                            {columns.map((col) => (
                                <td key={col}>
                                    {typeof u[col] === "object"
                                        ? JSON.stringify(u[col])
                                        : u[col]}
                                </td>
                            ))}
                            <td>
                                <button onClick={() => setViewUser(u)}>View</button>
                                <button onClick={() => setEditUser(u)}>Update</button>
                                <button onClick={() => handleDelete(u._id)}>Delete</button>
                                <button
                                    onClick={() =>
                                        setPasswordUser({
                                            _id: u._id,
                                            password: "",
                                            confirmPassword: ""
                                        })
                                    }
                                >
                                    Password
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editUser && (
                <div className="admin-user-modal">
                    <div className="admin-user-card">

                        {/* ❌ Close */}
                        <span className="close" onClick={() => setEditUser(null)}>×</span>

                        <h3>Edit User</h3>

                        <div className="admin-user-card-content">
                            {Object.keys(editUser)
                                .filter((key) => key !== "_id" && key !== "__v" && key !== "password")
                                .map((key) => (
                                    <div className="row" key={key}>
                                        <label>{key}</label>
                                        {key === "password" ? (
                                            <input
                                                type="password"
                                                placeholder="Enter new password"
                                                onChange={(e) =>
                                                    setEditUser({ ...editUser, password: e.target.value })
                                                }
                                            />

                                        ) : (
                                            <input
                                                value={editUser[key] || ""}
                                                onChange={(e) =>
                                                    setEditUser({ ...editUser, [key]: e.target.value })
                                                }
                                            />
                                        )}
                                        {/* <input
                                            value={editUser[key] || ""}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, [key]: e.target.value })
                                            }
                                        /> */}
                                    </div>
                                ))}
                        </div>

                        <div className="admin-user-btns">
                            <button onClick={handleUpdate}>Save</button>
                            <button onClick={() => setEditUser(null)}>Cancel</button>
                        </div>

                    </div>
                </div>
            )}

            {viewUser && (
                <div className="admin-user-modal">
                    <div className="admin-user-card">

                        {/* ❌ Close Button */}
                        <span className="close" onClick={() => setViewUser(null)}>×</span>

                        <h3>User Details</h3>

                        <div className="admin-user-card-content">
                            {Object.keys(viewUser).map((key) => (
                                <div className="row" key={key}>
                                    <b>{key}:</b>
                                    <span>
                                        {typeof viewUser[key] === "object"
                                            ? JSON.stringify(viewUser[key])
                                            : viewUser[key]}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}
            {passwordUser && (
                <div className="admin-user-modal">
                    <div className="admin-user-card">

                        <span
                            className="close"
                            onClick={() => setPasswordUser(null)}
                        >
                            ×
                        </span>

                        <h3>Change Password</h3>

                        <div className="row">
                            <label>New Password</label>

                            <input
                                type="password"
                                value={passwordUser.password}
                                onChange={(e) =>
                                    setPasswordUser({
                                        ...passwordUser,
                                        password: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="row">
                            <label>Confirm Password</label>

                            <input
                                type="password"
                                value={passwordUser.confirmPassword}
                                onChange={(e) =>
                                    setPasswordUser({
                                        ...passwordUser,
                                        confirmPassword: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="admin-user-btns">
                            <button onClick={handlePasswordUpdate}>
                                Save
                            </button>

                            <button onClick={() => setPasswordUser(null)}>
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}


        </div>


    );

}





// import { useCallback, useEffect, useState } from "react";
// import API from "../api/axios";
// import "./AdminUsers.css";
// import Pagination from "../components/Pagination";

// export default function AdminUser() {
//     const [users, setUsers] = useState([]);

//     const [editUser, setEditUser] = useState(null);
//     const [viewUser, setViewUser] = useState(null);
//     const [passwordUser, setPasswordUser] = useState(null);
//     const [addUser, setAddUser] = useState(null);

//     // =========================
//     // PAGINATION
//     // =========================

//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);

//     // Number of users per page
//     const limit = 20;

//     // =========================
//     // SEARCH
//     // =========================
//     const [searchInput, setSearchInput] = useState("");
//     const [search, setSearch] = useState("");
//     const [searchField, setSearchField] = useState("name");
//     const [appliedSearchField,setAppliedSearchField]=useState("name");
    
//     const [loading, setLoading] = useState(false);

//     // =========================
//     // FETCH USERS
//     // =========================

//     const fetchUsers = useCallback(async () => {
//         try {
//             setLoading(true);

//             const res = await API.get("/admin/users", {
//                 params: {
//                     page,
//                     limit,
//                     search: search.trim(),
//                     searchField:appliedSearchField,
//                 },
//             });

//             setUsers(res.data?.users || []);

//             // At least 1 page will always be shown
//             setTotalPages(
//                 Math.max(
//                     res.data?.pagination?.totalPages || 1,
//                     1
//                 )
//             );

//         } catch (error) {
//             console.error(
//                 "Fetch Users Error:",
//                 error.response?.data || error.message
//             );

//             alert(
//                 error.response?.data?.message ||
//                 "User fetch failed"
//             );
//         } finally {
//             setLoading(false);
//         }
//     }, [page, search, appliedSearchField]);

//     // =========================
//     // FETCH WHEN PAGE / SEARCH CHANGES
//     // =========================

//     useEffect(() => {
//         fetchUsers();
//     }, [fetchUsers]);

//     // =========================
//     // SEARCH FIELD CHANGE
//     // =========================

//     const handleSearchFieldChange = (e) => {
//         const field = e.target.value;

//         setSearchField(field);
//         // setSearchInput("");
//         // setSearch("")

//         // // Search starts from page 1
//         // setPage(1);
//     };

//     // =========================
//     // SEARCH CHANGE
//     // =========================

//     const handleSearchChange = (e) => {

//         setSearchInput(e.target.value);

//         // Always start search from page 1
//         // setPage(1);
//     };

//     const handleSearch = () => {
//         setPage(1);
//         setSearch(searchInput.trim());
//         setAppliedSearchField(searchField);
//     };


//     const handleClearSearch = () => {
//         setSearchInput("");
//         setSearch("");
//         setPage(1);
//         setAppliedSearchField(searchField);
//     };
//     // =========================
//     // PAGINATION CHANGE
//     // =========================

//     const handlePageChange = (newPage) => {
//         if (newPage < 1) return;

//         if (newPage > totalPages) return;

//         setPage(newPage);
//     };

//     // =========================
//     // DELETE USER
//     // =========================

//     const handleDelete = async (id) => {
//         try {
//             if (!window.confirm("Delete this user?")) {
//                 return;
//             }

//             await API.delete(`/admin/users/${id}`);

//             alert("User deleted successfully");

//             // If deleting last item of last page
//             // move to previous page
//             if (users.length === 1 && page > 1) {
//                 setPage(page - 1);
//             } else {
//                 fetchUsers();
//             }

//         } catch (err) {
//             console.error(
//                 err.response?.data || err.message
//             );

//             alert(
//                 err.response?.data?.message ||
//                 "Delete failed"
//             );
//         }
//     };

//     // =========================
//     // UPDATE USER
//     // =========================

//     const handleUpdate = async () => {
//         try {
//             if (!editUser.name?.trim()) {
//                 alert("Name is required");
//                 return;
//             }

//             if (!editUser.employeeId?.trim()) {
//                 alert("Employee Id is required");
//                 return;
//             }

//             if (!editUser.role?.trim()) {
//                 alert("Role is required");
//                 return;
//             }

//             if (!editUser.mobile?.trim()) {
//                 alert("Mobile Number is required");
//                 return;
//             }

//             await API.put(
//                 `/admin/users/${editUser._id}`,
//                 {
//                     name: editUser.name.trim(),

//                     employeeId: editUser.employeeId
//                         .trim()
//                         .toUpperCase(),

//                     mobile: editUser.mobile.trim(),

//                     role: editUser.role.trim(),
//                 }
//             );

//             alert("User updated successfully");

//             setEditUser(null);

//             fetchUsers();

//         } catch (err) {
//             console.error(
//                 err.response?.data || err.message
//             );

//             alert(
//                 err.response?.data?.message ||
//                 "Update failed"
//             );
//         }
//     };

//     // =========================
//     // PASSWORD UPDATE
//     // =========================

//     const handlePasswordUpdate = async () => {
//         try {
//             if (!passwordUser.password.trim()) {
//                 alert("Password is required");
//                 return;
//             }

//             if (
//                 passwordUser.password !==
//                 passwordUser.confirmPassword
//             ) {
//                 alert("Passwords do not match");
//                 return;
//             }

//             await API.put(
//                 `/admin/users/${passwordUser._id}/password`,
//                 {
//                     password: passwordUser.password,
//                 }
//             );

//             alert("Password Updated Successfully");

//             setPasswordUser(null);

//         } catch (err) {
//             console.error(
//                 err.response?.data || err.message
//             );

//             alert(
//                 err.response?.data?.message ||
//                 "Password update failed"
//             );
//         }
//     };

//     // =========================
//     // ADD USER
//     // =========================

//     const handleAddUser = async () => {
//         try {
//             if (!addUser.name.trim()) {
//                 alert("Name is required");
//                 return;
//             }

//             if (!addUser.employeeId.trim()) {
//                 alert("Employee Id is required");
//                 return;
//             }

//             if (!addUser.password.trim()) {
//                 alert("Password is required");
//                 return;
//             }

//             if (!addUser.role.trim()) {
//                 alert("Role is required");
//                 return;
//             }

//             if (!addUser.mobile.trim()) {
//                 alert("Mobile Number is required");
//                 return;
//             }

//             const res = await API.post(
//                 "/admin/users",
//                 {
//                     name: addUser.name.trim(),

//                     employeeId: addUser.employeeId
//                         .trim()
//                         .toUpperCase(),

//                     password: addUser.password,

//                     role: addUser.role.trim(),

//                     mobile: addUser.mobile.trim(),
//                 }
//             );

//             alert(
//                 res.data?.message ||
//                 "User added successfully"
//             );

//             setAddUser(null);

//             // Refresh current page
//             fetchUsers();

//         } catch (err) {
//             console.error(
//                 err.response?.data || err.message
//             );

//             alert(
//                 err.response?.data?.message ||
//                 "Failed to add user"
//             );
//         }
//     };

//     // =========================
//     // TABLE COLUMNS
//     // =========================

//     const columns = [
//         "name",
//         "employeeId",
//         "role",
//         "mobile",
//     ];

//     return (
//         <div className="admin-container">

//             <h2>Users Management</h2>

//             {/* =====================================================
//                 SEARCH
//             ====================================================== */}

//             <div className="user-search-container">

//                 <div className="search-fields">

//                     <label>
//                         <input
//                             type="radio"
//                             name="userSearchField"
//                             value="name"
//                             checked={
//                                 searchField === "name"
//                             }
//                             onChange={
//                                 handleSearchFieldChange
//                             }
//                         />
//                         Name
//                     </label>

//                     <label>
//                         <input
//                             type="radio"
//                             name="userSearchField"
//                             value="employeeId"
//                             checked={
//                                 searchField ===
//                                 "employeeId"
//                             }
//                             onChange={
//                                 handleSearchFieldChange
//                             }
//                         />
//                         Employee Id
//                     </label>

//                     <label>
//                         <input
//                             type="radio"
//                             name="userSearchField"
//                             value="role"
//                             checked={
//                                 searchField === "role"
//                             }
//                             onChange={
//                                 handleSearchFieldChange
//                             }
//                         />
//                         Role
//                     </label>

//                     <label>
//                         <input
//                             type="radio"
//                             name="userSearchField"
//                             value="mobile"
//                             checked={
//                                 searchField === "mobile"
//                             }
//                             onChange={
//                                 handleSearchFieldChange
//                             }
//                         />
//                         Mobile
//                     </label>

//                 </div>

//               <div className="search-input-wrapper">

//                     <input
//                         type="text"
//                         value={searchInput}
//                         onChange={
//                             handleSearchChange
//                         }
//                         placeholder={`Search by ${searchField}`}
//                     />

//                     <button
//                         type="button"
//                         className="search-btn"
//                         onClick={handleSearch}
//                     >
//                         Search
//                     </button>
//                     <button
//                         type="button"
//                         className="Clear-search-btn"
//                         onClick={handleClearSearch}
//                     >
//                         Clear

//                     </button>

            
                

//                     <button
//                         className="add-user-btn"
//                         onClick={() =>
//                             setAddUser({
//                                 name: "",
//                                 employeeId: "",
//                                 password: "",
//                                 role: "",
//                                 mobile: "",
//                             })
//                         }
//                     >
//                         Add User
//                     </button>

//                 </div>

//             </div>

//             {/* =====================================================
//                 ADD USER BUTTON
//             ====================================================== */}



//             {/* =====================================================
//                 TABLE
//             ====================================================== */}

//             <div className="admin-table-wrapper">

//                 <table
//                     border="1"
//                     cellPadding="10"
//                     className="admin-table"
//                 >

//                     <thead>
//                         <tr>

//                             <th>S.No.</th>

//                             {columns.map((col) => (
//                                 <th key={col}>
//                                     {col.toUpperCase()}
//                                 </th>
//                             ))}

//                             <th>Action</th>

//                         </tr>
//                     </thead>

//                     <tbody>

//                         {loading ? (

//                             <tr>
//                                 <td
//                                     colSpan={
//                                         columns.length + 2
//                                     }
//                                     className="table-message"
//                                 >
//                                     Loading users...
//                                 </td>
//                             </tr>

//                         ) : users.length === 0 ? (

//                             <tr>
//                                 <td
//                                     colSpan={
//                                         columns.length + 2
//                                     }
//                                     className="table-message"
//                                 >
//                                     No users found
//                                 </td>
//                             </tr>

//                         ) : (

//                             users.map((u, index) => (

//                                 <tr key={u._id}>

//                                     {/* Correct S.No. across pages */}
//                                     <td>
//                                         {
//                                             (page - 1) *
//                                             limit +
//                                             index +
//                                             1
//                                         }
//                                     </td>

//                                     {columns.map(
//                                         (col) => (

//                                             <td key={col}>

//                                                 {
//                                                     typeof u[
//                                                         col
//                                                     ] ===
//                                                         "object"
//                                                         ? JSON.stringify(
//                                                             u[
//                                                             col
//                                                             ]
//                                                         )
//                                                         : u[
//                                                         col
//                                                         ]
//                                                 }

//                                             </td>

//                                         )
//                                     )}

//                                     <td className="action-buttons">

//                                         <button
//                                             onClick={() =>
//                                                 setViewUser(
//                                                     u
//                                                 )
//                                             }
//                                         >
//                                             View
//                                         </button>

//                                         <button
//                                             onClick={() =>
//                                                 setEditUser(
//                                                     {
//                                                         ...u,
//                                                     }
//                                                 )
//                                             }
//                                         >
//                                             Update
//                                         </button>

//                                         <button
//                                             onClick={() =>
//                                                 handleDelete(
//                                                     u._id
//                                                 )
//                                             }
//                                         >
//                                             Delete
//                                         </button>

//                                         <button
//                                             onClick={() =>
//                                                 setPasswordUser(
//                                                     {
//                                                         _id:
//                                                             u._id,
//                                                         password:
//                                                             "",
//                                                         confirmPassword:
//                                                             "",
//                                                     }
//                                                 )
//                                             }
//                                         >
//                                             Password
//                                         </button>

//                                     </td>

//                                 </tr>

//                             ))

//                         )}

//                     </tbody>

//                 </table>

//             </div>

//             {/* =====================================================
//                 PAGINATION
//             ====================================================== */}

//             <Pagination
//                 page={page}
//                 totalPages={Math.max(totalPages, 1)}
//                 onPageChange={handlePageChange}
//             />

//             {/* =====================================================
//                 EDIT USER MODAL
//             ====================================================== */}

//             {editUser && (

//                 <div className="admin-user-modal">

//                     <div className="admin-user-card">

//                         <span
//                             className="close"
//                             onClick={() =>
//                                 setEditUser(null)
//                             }
//                         >
//                             ×
//                         </span>

//                         <h3>Edit User</h3>

//                         <div className="admin-user-card-content">

//                             <div className="row">

//                                 <label>Name</label>

//                                 <input
//                                     value={
//                                         editUser.name ||
//                                         ""
//                                     }
//                                     onChange={(e) =>
//                                         setEditUser({
//                                             ...editUser,
//                                             name: e.target
//                                                 .value,
//                                         })
//                                     }
//                                 />

//                             </div>

//                             <div className="row">

//                                 <label>
//                                     Employee Id
//                                 </label>

//                                 <input
//                                     value={
//                                         editUser.employeeId ||
//                                         ""
//                                     }
//                                     onChange={(e) =>
//                                         setEditUser({
//                                             ...editUser,
//                                             employeeId:
//                                                 e.target
//                                                     .value
//                                                     .toUpperCase(),
//                                         })
//                                     }
//                                 />

//                             </div>

//                             <div className="row">

//                                 <label>Role</label>

//                                 <input
//                                     value={
//                                         editUser.role ||
//                                         ""
//                                     }
//                                     onChange={(e) =>
//                                         setEditUser({
//                                             ...editUser,
//                                             role: e.target
//                                                 .value,
//                                         })
//                                     }
//                                 />

//                             </div>

//                             <div className="row">

//                                 <label>Mobile</label>

//                                 <input
//                                     value={
//                                         editUser.mobile ||
//                                         ""
//                                     }
//                                     onChange={(e) =>
//                                         setEditUser({
//                                             ...editUser,
//                                             mobile:
//                                                 e.target
//                                                     .value,
//                                         })
//                                     }
//                                 />

//                             </div>

//                         </div>

//                         <div className="admin-user-btns">

//                             <button
//                                 onClick={handleUpdate}
//                             >
//                                 Save
//                             </button>

//                             <button
//                                 onClick={() =>
//                                     setEditUser(null)
//                                 }
//                             >
//                                 Cancel
//                             </button>

//                         </div>

//                     </div>

//                 </div>

//             )}

//             {/* =====================================================
//                 VIEW USER MODAL
//             ====================================================== */}

//             {viewUser && (

//                 <div className="admin-user-modal">

//                     <div className="admin-user-card">

//                         <span
//                             className="close"
//                             onClick={() =>
//                                 setViewUser(null)
//                             }
//                         >
//                             ×
//                         </span>

//                         <h3>User Details</h3>

//                         <div className="admin-user-card-content">

//                             {Object.keys(viewUser)
//                                 .filter(
//                                     (key) =>
//                                         key !==
//                                         "password"
//                                 )
//                                 .map((key) => (

//                                     <div
//                                         className="row"
//                                         key={key}
//                                     >

//                                         <b>
//                                             {key}:
//                                         </b>

//                                         <span>

//                                             {typeof viewUser[
//                                                 key
//                                             ] === "object"
//                                                 ? JSON.stringify(
//                                                     viewUser[
//                                                     key
//                                                     ]
//                                                 )
//                                                 : String(
//                                                     viewUser[
//                                                     key
//                                                     ] ?? ""
//                                                 )}

//                                         </span>

//                                     </div>

//                                 ))}

//                         </div>

//                     </div>

//                 </div>

//             )}

//             {/* =====================================================
//                 PASSWORD MODAL
//             ====================================================== */}

//             {passwordUser && (

//                 <div className="admin-user-modal">

//                     <div className="admin-user-card">

//                         <span
//                             className="close"
//                             onClick={() =>
//                                 setPasswordUser(null)
//                             }
//                         >
//                             ×
//                         </span>

//                         <h3>Change Password</h3>

//                         <div className="row">

//                             <label>
//                                 New Password
//                             </label>

//                             <input
//                                 type="password"
//                                 value={
//                                     passwordUser.password
//                                 }
//                                 onChange={(e) =>
//                                     setPasswordUser({
//                                         ...passwordUser,
//                                         password:
//                                             e.target.value,
//                                     })
//                                 }
//                             />

//                         </div>

//                         <div className="row">

//                             <label>
//                                 Confirm Password
//                             </label>

//                             <input
//                                 type="password"
//                                 value={
//                                     passwordUser.confirmPassword
//                                 }
//                                 onChange={(e) =>
//                                     setPasswordUser({
//                                         ...passwordUser,
//                                         confirmPassword:
//                                             e.target.value,
//                                     })
//                                 }
//                             />

//                         </div>

//                         <div className="admin-user-btns">

//                             <button
//                                 onClick={
//                                     handlePasswordUpdate
//                                 }
//                             >
//                                 Save
//                             </button>

//                             <button
//                                 onClick={() =>
//                                     setPasswordUser(null)
//                                 }
//                             >
//                                 Cancel
//                             </button>

//                         </div>

//                     </div>

//                 </div>

//             )}

//             {/* =====================================================
//                 ADD USER MODAL
//             ====================================================== */}

//             {addUser && (

//                 <div className="admin-add-user-modal">

//                     <div className="admin-add-user-card">

//                         <span
//                             className="close"
//                             onClick={() =>
//                                 setAddUser(null)
//                             }
//                         >
//                             ×
//                         </span>

//                         <h3>Add New User</h3>

//                         <div className="add-add-user-card-content">

//                             <div className="row">

//                                 <label>Name</label>

//                                 <input
//                                     type="text"
//                                     value={
//                                         addUser.name
//                                     }
//                                     placeholder="Enter Name"
//                                     onChange={(e) =>
//                                         setAddUser({
//                                             ...addUser,
//                                             name:
//                                                 e.target
//                                                     .value,
//                                         })
//                                     }
//                                 />

//                             </div>

//                             <div className="row">

//                                 <label>
//                                     Employee Id
//                                 </label>

//                                 <input
//                                     type="text"
//                                     value={
//                                         addUser.employeeId
//                                     }
//                                     placeholder="Enter Employee Id"
//                                     onChange={(e) =>
//                                         setAddUser({
//                                             ...addUser,
//                                             employeeId:
//                                                 e.target
//                                                     .value
//                                                     .toUpperCase(),
//                                         })
//                                     }
//                                 />

//                             </div>

//                             <div className="row">

//                                 <label>
//                                     Password
//                                 </label>

//                                 <input
//                                     type="password"
//                                     value={
//                                         addUser.password
//                                     }
//                                     placeholder="Enter Password"
//                                     onChange={(e) =>
//                                         setAddUser({
//                                             ...addUser,
//                                             password:
//                                                 e.target
//                                                     .value,
//                                         })
//                                     }
//                                 />

//                             </div>

//                             <div className="row">

//                                 <label>Role</label>

//                                 <input
//                                     type="text"
//                                     value={
//                                         addUser.role
//                                     }
//                                     placeholder="Enter Role"
//                                     onChange={(e) =>
//                                         setAddUser({
//                                             ...addUser,
//                                             role:
//                                                 e.target
//                                                     .value,
//                                         })
//                                     }
//                                 />

//                             </div>

//                             <div className="row">

//                                 <label>
//                                     Mobile
//                                 </label>

//                                 <input
//                                     type="text"
//                                     value={
//                                         addUser.mobile
//                                     }
//                                     placeholder="Enter Mobile Number"
//                                     onChange={(e) =>
//                                         setAddUser({
//                                             ...addUser,
//                                             mobile:
//                                                 e.target
//                                                     .value,
//                                         })
//                                     }
//                                 />

//                             </div>

//                             <div className="admin-add-user-btns">

//                                 <button
//                                     onClick={
//                                         handleAddUser
//                                     }
//                                 >
//                                     Add User
//                                 </button>

//                                 <button
//                                     onClick={() =>
//                                         setAddUser(null)
//                                     }
//                                 >
//                                     Cancel
//                                 </button>

//                             </div>

//                         </div>

//                     </div>

//                 </div>

//             )}

//         </div>
//     );
// }
