import React, { useEffect, useState } from 'react';
import { getUserList, deleteUser, updateUser } from '../../services/user.service';

enum UserType {
  Admin = 0,
  Common = 1,
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
}

const UserPortal: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editUser, setEditUser] = useState<User | null>(null);

    const userType: UserType = UserType.Common;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const userList = await getUserList();
        const filteredUsers = Array.isArray(userList) ? userList.filter((user: User) => user.id === 1) : [];
        setUsers(filteredUsers);
    };

    const handleDelete = async (id: number) => {
        if (UserType.Admin) {
        await deleteUser(id);
        fetchUsers();
        } else {
        alert("Você não tem permissão para excluir usuários.");
        }
    };

    const handleEdit = (user: User) => {
        setEditUser({ ...user });
    };

    const handleCancelEdit = () => {
        setEditUser(null);
    };

    const handleUpdate = async (id: number, updatedUser: User) => {
        const updatedFields = {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
        };
        await updateUser(id, updatedFields);
        setEditUser(null);
        fetchUsers();
    } 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editUser && userType === UserType.Common) {
        setEditUser({ ...editUser, [e.target.name]: e.target.value });
        }
    };

    return (
        <div>
        </div>
    );
};

export default UserPortal;
