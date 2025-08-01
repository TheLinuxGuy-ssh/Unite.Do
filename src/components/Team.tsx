import { useState } from "react";
import supabase from "../../utils/supabase";
import * as type from "../../utils/interfaces"


const Team = () => {

const [users, setUsers] = useState<type.User[]>([]);
          const fetchUsers = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error(error);
        } else {
            setUsers(data || []);
        }
    };
    useState(() => {
        fetchUsers();
    })
    return (
        <div className="do-section-box">
            <div className="bg-white w-full rounded-4xl">
                <div className="team team-header bg-white p-5 rounded-t-4xl border-b-2 border-gray-300 w-full h-fit">
                    <span className="title text-3xl font-semibold">
                        Manage Your Team
                    </span>
                </div>
                <div className="content px-4 bg-white w-full ">
                    <table className="w-full mt-4 border-3 border-gray-100 rounded-4xl rounded-4xl">
                        <thead className="">
                            <tr>
                                <th className="border-b text-left p-5 border-gray-300">
                                    ID
                                </th>
                                <th className="border-b text-left p-5 border-gray-300">
                                  User Name
                                </th>
                                <th className="border-b text-left p-5 border-gray-300">
                                    User Email
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr>
                                    <td className="border-b text-left p-5 border-gray-300">{user.id}</td>
                                    <td className="border-b text-left p-5 border-gray-300">{user.name}</td>
                                    <td className="border-b text-left p-5 border-gray-300">{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default Team;
