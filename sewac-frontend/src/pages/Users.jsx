import Header from "../components/layouts/Header";

import ListOfWorkers from "../components/users/ListOfWorkers";

const Users = () => {
  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FD]">
      <Header variant="default" />

      <div className="px-8 py-8">
        <ListOfWorkers />
      </div>
    </div>
  );
};

export default Users;