import { useState } from "react";
import supabase from "../../utils/supabase";

const Team = () => {
  type Team = {
    id: string;
  }

const [user, setUser] = useState<{ name: string }>({
        name: "",
    });
      const fetchUser = async () => {
        const { data, error } = await supabase
            .from("teams_members")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error(error);
        } else {
            // setProject(data || []);
        }
    };
    return (
        <div className="do-sidection-box">
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
                                    Name
                                </th>
                                <th className="border-b text-left p-5 border-gray-300">
                                  Team ID
                                </th>
                                <th className="border-b text-left p-5 border-gray-300">
                                    Member UUID
                                </th>
                                <th className="border-b text-left p-5 border-gray-300">
                                    Role
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-5">Indiana</td>
                                <td className="p-5">Indianapolis</td>
                            </tr>
                            <tr>
                                <td className="p-5">Ohio</td>
                                <td className="p-5">Columbus</td>
                            </tr>
                            <tr>
                                <td className="p-5">Michigan</td>
                                <td className="p-5">Detroit</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Team;
