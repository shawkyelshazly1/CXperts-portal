import AddBulkUsersModal from "@/components/admin/users/addBulkUsersModal/AddBulkUsersModal";
import AddBulkUsersResultsModal from "@/components/admin/users/addBulkUsersResultsModal/AddBulkUsersResultsModal";
import AddUserModal from "@/components/admin/users/addUserModal/AddUserModal";
import UsersTable from "@/components/admin/users/UsersTable";
import { DataProvider } from "app/contexts/admin/UserPageContext";

import React, { Suspense } from "react";
import { ClipLoader } from "react-spinners";

export default async function Page() {
	return (
		<div className="w-full  flex container gap-4">
			<div className="flex flex-col h-full w-full py-4 gap-4">
				<div className="flex flex-row w-full justify-between ">
					<h1 className="text-2xl text-gray-400 font-semibold italic">USERS</h1>
					<div className="flex flex-row gap-1 self-end">
						<AddUserModal />
						<DataProvider>
							<AddBulkUsersModal />
							<AddBulkUsersResultsModal />
						</DataProvider>
					</div>
				</div>

				<Suspense fallback={<ClipLoader color="#1770b8" size={40} />}>
					<UsersTable />
				</Suspense>
			</div>
		</div>
	);
}
