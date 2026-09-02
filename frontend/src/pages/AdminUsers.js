import {
    useCallback,
    useEffect,
    useState,
} from "react";

import API from "../api/axios";
import "./AdminUsers.css";
import Pagination from "../components/Pagination";

export default function AdminUser() {

    // =====================================================
    // USERS
    // =====================================================

    const [users, setUsers] = useState([]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalUsers, setTotalUsers] =
        useState(0);

    // Fixed limit
    const limit = 20;

    // =====================================================
    // SEARCH
    // =====================================================

    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [searchField, setSearchField] =
        useState("name");

    const [appliedSearchField, setAppliedSearchField] =
        useState("name");

    // =====================================================
    // MODALS
    // =====================================================

    const [editUser, setEditUser] =
        useState(null);

    const [viewUser, setViewUser] =
        useState(null);

    const [passwordUser, setPasswordUser] =
        useState(null);

    const [addUser, setAddUser] =
        useState(null);

    // =====================================================
    // FETCH USERS
    // =====================================================

    const fetchUsers = useCallback(
        async () => {
            try {

                const res = await API.get(
                    "/admin/users",
                    {
                        params: {
                            page,
                            limit,
                            search:
                                search.trim(),
                            searchField:
                                appliedSearchField,
                        },
                    }
                );

                // -------------------------------------------------
                // USERS
                // -------------------------------------------------

                setUsers(
                    res.data?.users || []
                );

                // -------------------------------------------------
                // TOTAL PAGES
                // -------------------------------------------------

                setTotalPages(
                    res.data?.pagination
                        ?.totalPages || 1
                );

                // -------------------------------------------------
                // TOTAL USERS
                // -------------------------------------------------

                setTotalUsers(
                    res.data?.pagination
                        ?.totalUsers || 0
                );

            } catch (error) {

                console.error(
                    "Fetch Users Error:",
                    error
                );

            }
        },
        [
            page,
            search,
            appliedSearchField,
        ]
    );

    // =====================================================
    // FETCH WHEN PAGE / SEARCH CHANGES
    // =====================================================

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // =====================================================
    // SEARCH INPUT
    // =====================================================

    const handleSearchChange = (e) => {
        setSearchInput(
            e.target.value
        );
    };

    // =====================================================
    // SEARCH FIELD
    // =====================================================

    const handleSearchFieldChange = (e) => {
        setSearchField(
            e.target.value
        );
    };

    // =====================================================
    // SEARCH BUTTON
    // =====================================================

    const handleSearch = () => {

        // Search हमेशा page 1 से
        setPage(1);

        setSearch(
            searchInput.trim()
        );

        setAppliedSearchField(
            searchField
        );
    };

    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClearSearch = () => {

        setSearchInput("");

        setSearch("");

        setPage(1);

        setAppliedSearchField(
            searchField
        );
    };

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (
        newPage
    ) => {

        const pageNumber =
            Number(newPage);

        if (
            pageNumber >= 1 &&
            pageNumber <= totalPages
        ) {
            setPage(pageNumber);
        }
    };

    // =====================================================
    // DELETE USER
    // =====================================================

    const handleDelete = async (
        userId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this user?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await API.delete(
                `/admin/users/${userId}`
            );

            // Current page में आखिरी user
            // delete होने पर previous page
            if (
                users.length === 1 &&
                page > 1
            ) {
                setPage(page - 1);
            } else {
                fetchUsers();
            }

        } catch (error) {

            console.error(
                "Delete User Error:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                "Failed to delete user"
            );
        }
    };

    // =====================================================
    // ADD USER
    // =====================================================

    const handleAddUser = async () => {

        if (!addUser) {
            return;
        }

        try {

            await API.post(
                "/admin/users",
                {
                    name:
                        addUser.name?.trim(),

                    employeeId:
                        addUser.employeeId
                            ?.trim()
                            .toUpperCase(),

                    password:
                        addUser.password,

                    role:
                        addUser.role?.trim(),

                    mobile:
                        addUser.mobile?.trim(),
                }
            );

            alert(
                "User added successfully"
            );

            setAddUser(null);

            // New user देखने के लिए page 1
            setPage(1);

            fetchUsers();

        } catch (error) {

            console.error(
                "Add User Error:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                "Failed to add user"
            );
        }
    };

    // =====================================================
    // UPDATE USER
    // =====================================================

    const handleUpdateUser = async () => {

        if (!editUser?._id) {
            return;
        }

        try {

            await API.put(
                `/admin/users/${editUser._id}`,
                {
                    name:
                        editUser.name?.trim(),

                    employeeId:
                        editUser.employeeId
                            ?.trim()
                            .toUpperCase(),

                    role:
                        editUser.role?.trim(),

                    mobile:
                        editUser.mobile?.trim(),
                }
            );

            alert(
                "User updated successfully"
            );

            setEditUser(null);

            fetchUsers();

        } catch (error) {

            console.error(
                "Update User Error:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                "Failed to update user"
            );
        }
    };

    // =====================================================
    // UPDATE PASSWORD
    // =====================================================

    const handleUpdatePassword = async () => {

        if (!passwordUser?._id) {
            return;
        }

        if (
            !passwordUser.newPassword
        ) {
            alert(
                "Please enter new password"
            );

            return;
        }

        try {

            await API.put(
                `/admin/users/${passwordUser._id}/password`,
                {
                    password:
                        passwordUser.newPassword,
                }
            );

            alert(
                "Password updated successfully"
            );

            setPasswordUser(null);

        } catch (error) {

            console.error(
                "Update Password Error:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                "Failed to update password"
            );
        }
    };

    // =====================================================
    // TABLE DATA
    // =====================================================

    const getSerialNumber = (
        index
    ) => {

        return (
            (page - 1) * limit +
            index +
            1
        );
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="admin-container">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="admin-header">

                <h2>
                    Users
                </h2>

                <button
                    className="add-user-btn"
                    onClick={() =>
                        setAddUser({
                            name: "",
                            employeeId: "",
                            password: "",
                            role: "",
                            mobile: "",
                        })
                    }
                >
                    + Add User
                </button>

            </div>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="admin-search-container">

                {/* SEARCH FIELD */}

                <div className="search-radio-group">

                    <label>
                        <input
                            type="radio"
                            name="searchField"
                            value="name"
                            checked={
                                searchField ===
                                "name"
                            }
                            onChange={
                                handleSearchFieldChange
                            }
                        />

                        Name
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="searchField"
                            value="employeeId"
                            checked={
                                searchField ===
                                "employeeId"
                            }
                            onChange={
                                handleSearchFieldChange
                            }
                        />

                        Employee ID
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="searchField"
                            value="role"
                            checked={
                                searchField ===
                                "role"
                            }
                            onChange={
                                handleSearchFieldChange
                            }
                        />

                        Role
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="searchField"
                            value="mobile"
                            checked={
                                searchField ===
                                "mobile"
                            }
                            onChange={
                                handleSearchFieldChange
                            }
                        />

                        Mobile
                    </label>

                </div>

                {/* SEARCH INPUT */}

                <div className="search-input-wrapper">

                    <input
                        type="text"
                        value={
                            searchInput
                        }
                        placeholder={
                            `Search by ${searchField}`
                        }
                        onChange={
                            handleSearchChange
                        }
                        onKeyDown={(e) => {

                            if (
                                e.key ===
                                "Enter"
                            ) {
                                handleSearch();
                            }

                        }}
                    />

                    <button
                        type="button"
                        onClick={
                            handleSearch
                        }
                    >
                        Search
                    </button>

                    {search && (
                        <button
                            type="button"
                            className="clear-search-btn"
                            onClick={
                                handleClearSearch
                            }
                        >
                            Clear
                        </button>
                    )}

                </div>

            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="admin-table-wrapper">

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>
                                S.No.
                            </th>

                            <th>
                                Name
                            </th>

                            <th>
                                Employee ID
                            </th>

                            <th>
                                Role
                            </th>

                            <th>
                                Mobile
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.length > 0 ? (

                            users.map(
                                (
                                    user,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            user._id
                                        }
                                    >

                                        <td>
                                            {
                                                getSerialNumber(
                                                    index
                                                )
                                            }
                                        </td>

                                        <td>
                                            {
                                                user.name ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                user.employeeId ||
                                                user.email ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                user.role ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                user.mobile ||
                                                "-"
                                            }
                                        </td>

                                        <td>

                                            <div className="admin-action-buttons">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setViewUser(
                                                            user
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditUser(
                                                            {
                                                                ...user,
                                                            }
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPasswordUser(
                                                            {
                                                                ...user,
                                                                newPassword:
                                                                    "",
                                                            }
                                                        )
                                                    }
                                                >
                                                    Password
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            user._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )

                        ) : (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="no-users"
                                >
                                    No users found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalUsers > 0 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalUsers={totalUsers}
                    limit={limit}
                    onPageChange={
                        handlePageChange
                    }
                />
            )}

            {/* =================================================
                VIEW USER MODAL
            ================================================= */}

            {viewUser && (

                <div className="admin-modal-overlay">

                    <div className="admin-modal">

                        <h3>
                            User Details
                        </h3>

                        <div className="row">
                            <label>
                                Name
                            </label>

                            <span>
                                {
                                    viewUser.name ||
                                    "-"
                                }
                            </span>
                        </div>

                        <div className="row">
                            <label>
                                Employee ID
                            </label>

                            <span>
                                {
                                    viewUser.employeeId ||
                                    viewUser.email ||
                                    "-"
                                }
                            </span>
                        </div>

                        <div className="row">
                            <label>
                                Role
                            </label>

                            <span>
                                {
                                    viewUser.role ||
                                    "-"
                                }
                            </span>
                        </div>

                        <div className="row">
                            <label>
                                Mobile
                            </label>

                            <span>
                                {
                                    viewUser.mobile ||
                                    "-"
                                }
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setViewUser(null)
                            }
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

            {/* =================================================
                EDIT USER MODAL
            ================================================= */}

            {editUser && (

                <div className="admin-modal-overlay">

                    <div className="admin-modal">

                        <h3>
                            Edit User
                        </h3>

                        {/* NAME */}

                        <div className="row">

                            <label>
                                Name
                            </label>

                            <input
                                type="text"
                                value={
                                    editUser.name ||
                                    ""
                                }
                                onChange={(e) =>
                                    setEditUser({
                                        ...editUser,
                                        name:
                                            e.target
                                                .value,
                                    })
                                }
                            />

                        </div>

                        {/* EMPLOYEE ID */}

                        <div className="row">

                            <label>
                                Employee ID
                            </label>

                            <input
                                type="text"
                                value={
                                    editUser.employeeId ||
                                    ""
                                }
                                onChange={(e) =>
                                    setEditUser({
                                        ...editUser,
                                        employeeId:
                                            e.target
                                                .value
                                                .toUpperCase(),
                                    })
                                }
                            />

                        </div>

                        {/* ROLE */}

                        <div className="row">

                            <label>
                                Role
                            </label>

                            <input
                                type="text"
                                value={
                                    editUser.role ||
                                    ""
                                }
                                onChange={(e) =>
                                    setEditUser({
                                        ...editUser,
                                        role:
                                            e.target
                                                .value,
                                    })
                                }
                            />

                        </div>

                        {/* MOBILE */}

                        <div className="row">

                            <label>
                                Mobile
                            </label>

                            <input
                                type="text"
                                value={
                                    editUser.mobile ||
                                    ""
                                }
                                onChange={(e) =>
                                    setEditUser({
                                        ...editUser,
                                        mobile:
                                            e.target
                                                .value,
                                    })
                                }
                            />

                        </div>

                        <div className="admin-add-user-btns">

                            <button
                                type="button"
                                onClick={
                                    handleUpdateUser
                                }
                            >
                                Update
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setEditUser(null)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* =================================================
                PASSWORD MODAL
            ================================================= */}

            {passwordUser && (

                <div className="admin-modal-overlay">

                    <div className="admin-modal">

                        <h3>
                            Change Password
                        </h3>

                        <div className="row">

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                value={
                                    passwordUser.newPassword ||
                                    ""
                                }
                                placeholder="Enter new password"
                                onChange={(e) =>
                                    setPasswordUser({
                                        ...passwordUser,
                                        newPassword:
                                            e.target
                                                .value,
                                    })
                                }
                            />

                        </div>

                        <div className="admin-add-user-btns">

                            <button
                                type="button"
                                onClick={
                                    handleUpdatePassword
                                }
                            >
                                Update Password
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setPasswordUser(
                                        null
                                    )
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* =================================================
                ADD USER MODAL
            ================================================= */}

            {addUser && (

                <div className="admin-modal-overlay">

                    <div className="admin-modal">

                        <h3>
                            Add User
                        </h3>

                        {/* NAME */}

                        <div className="row">

                            <label>
                                Name
                            </label>

                            <input
                                type="text"
                                value={
                                    addUser.name
                                }
                                placeholder="Enter Name"
                                onChange={(e) =>
                                    setAddUser({
                                        ...addUser,
                                        name:
                                            e.target
                                                .value,
                                    })
                                }
                            />

                        </div>

                        {/* EMPLOYEE ID */}

                        <div className="row">

                            <label>
                                Employee ID
                            </label>

                            <input
                                type="text"
                                value={
                                    addUser.employeeId
                                }
                                placeholder="Enter Employee ID"
                                onChange={(e) =>
                                    setAddUser({
                                        ...addUser,
                                        employeeId:
                                            e.target
                                                .value
                                                .toUpperCase(),
                                    })
                                }
                            />

                        </div>

                        {/* PASSWORD */}

                        <div className="row">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={
                                    addUser.password
                                }
                                placeholder="Enter Password"
                                onChange={(e) =>
                                    setAddUser({
                                        ...addUser,
                                        password:
                                            e.target
                                                .value,
                                    })
                                }
                            />

                        </div>

                        {/* ROLE */}

                        <div className="row">

                            <label>
                                Role
                            </label>

                            <input
                                type="text"
                                value={
                                    addUser.role
                                }
                                placeholder="Enter Role"
                                onChange={(e) =>
                                    setAddUser({
                                        ...addUser,
                                        role:
                                            e.target
                                                .value,
                                    })
                                }
                            />

                        </div>

                        {/* MOBILE */}

                        <div className="row">

                            <label>
                                Mobile
                            </label>

                            <input
                                type="text"
                                value={
                                    addUser.mobile
                                }
                                placeholder="Enter Mobile Number"
                                onChange={(e) =>
                                    setAddUser({
                                        ...addUser,
                                        mobile:
                                            e.target
                                                .value,
                                    })
                                }
                            />

                        </div>

                        {/* BUTTONS */}

                        <div className="admin-add-user-btns">

                            <button
                                type="button"
                                onClick={
                                    handleAddUser
                                }
                            >
                                Add User
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setAddUser(null)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}
