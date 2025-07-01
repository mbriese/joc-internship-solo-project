interface UserSelectProps {
    users: { userId: number; fname: string; lname: string }[];
    selectedUserId: number | null;
    onChange: (userId: number | null) => void;
}

const UserSelect: React.FC<UserSelectProps> = ({
                                                   users,
                                                   selectedUserId,
                                                   onChange,
                                               }) => {
    return (
        <div className="my-4">
            <select
                value={selectedUserId !== null ? String(selectedUserId) : ''}
                onChange={(e) => {
                    const value = e.target.value;
                    onChange(value === '' ? null : Number(value));
                }}
                className="p-2 border border-gray-300 rounded-md"
            >
                <option value="">Select User to see tasks</option>
                <option value="-1">All Users</option>

                {users.map((user) => (
                    <option key={user.userId} value={String(user.userId)}>
                        {user.fname} {user.lname}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default UserSelect;
