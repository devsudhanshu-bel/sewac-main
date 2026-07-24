import { useEffect, useRef, useState } from "react";

import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Trash2,
  ChevronDown,
  X,
} from "lucide-react";

const workers = [
  {
    id: 1,
    name: "Ramesh Kumar",
    phone: "9876543210",
    zone: "North Zone",
    wards: 78,
  },
  {
    id: 2,
    name: "Suresh Patel",
    phone: "9123456780",
    zone: "East Zone",
    wards: 65,
  },
  {
    id: 3,
    name: "Anjali Singh",
    phone: "9988776655",
    zone: "South Zone",
    wards: 82,
  },
  {
    id: 4,
    name: "Vikram Shetty",
    phone: "9001122334",
    zone: "West Zone",
    wards: 71,
  },
  {
    id: 5,
    name: "Mahesh Yadav",
    phone: "8899001122",
    zone: "Central Zone",
    wards: 69,
  },
  {
    id: 6,
    name: "Deepak Nair",
    phone: "9765432100",
    zone: "North East Zone",
    wards: 55,
  },
  {
    id: 7,
    name: "Kavita Rao",
    phone: "9012345678",
    zone: "South West Zone",
    wards: 61,
  },
];

export default function ListOfWorkers() {
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setActiveMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const filteredWorkers = workers.filter((worker) => {
    const value = search.toLowerCase();

    return (
      worker.name.toLowerCase().includes(value) ||
      worker.phone.includes(value) ||
      worker.zone.toLowerCase().includes(value)
    );
  });

  return (
    <>
      <div
        className="
          rounded-[24px]
          border
          border-[#E8ECF5]
          bg-white
          shadow-sm
          p-8
        "
      >
        {/* ================= Header ================= */}

        <div className="space-y-6">

          <div className="flex items-center justify-between">

            <h2 className="text-[24px] font-bold text-[#16295A]">
              List of Workers
            </h2>

            <div className="relative w-[500px] ">

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by phone number, name or zone..."
                className="
                  w-full
                  h-11
                  rounded-xl
                  border
                  border-[#E4E7EC]
                  bg-white
                  pl-4
                  pr-11
                  text-[14px]
                  text-[#16295A]
                  outline-none
                  placeholder:text-[#98A2B3]
                  focus:border-violet-500
                "
              />

              <Search
                size={18}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-violet-700
                "
              />

            </div>

          </div>

        <button
        onClick={() => setShowModal(true)}
        className="
            mt-1
            mb-3
            flex
            h-10
            items-center
            gap-2
            rounded-xl
            border
            border-violet-500
            bg-white
            px-4
            text-[14px]
            font-semibold
            text-violet-700
            transition-all
            hover:bg-violet-50
        "
        >
            <PlusCircle size={17} />

            Add workers

          </button>

        </div>

        {/* ================= Table ================= */}

        <div className="mt-7 overflow-visible rounded-2xl border border-[#EEF2F7]">

          <table className="w-full table-fixed">

            <thead className="bg-[#FAFBFE]">

              <tr>

                <th className="w-[70px] px-4 py-4 text-left text-[13px] font-semibold text-[#3F51B5]">
                  Sl.No
                </th>

                <th className="w-[220px] px-4 py-4 text-left text-[13px] font-semibold text-[#3F51B5]">
                  Worker Name
                </th>

                <th className="w-[170px] px-4 py-4 text-left text-[13px] font-semibold text-[#3F51B5]">
                  Phone Number
                </th>

                <th className="w-[190px] px-4 py-4 text-left text-[13px] font-semibold text-[#3F51B5]">
                  Zone Name
                </th>

                <th className="px-4 py-4 text-center text-[13px] font-semibold text-[#3F51B5]">
                  Number of Wards under the Zone
                </th>

                <th className="w-[90px]" />

              </tr>

            </thead>

            <tbody>

              {filteredWorkers.map((worker) => (

                <tr
                  key={worker.id}
                  className="
                    border-t
                    border-[#EEF2F7]
                    transition-all
                    hover:bg-[#FBFCFF]
                  "
                >

                  <td className="px-4 py-5 text-[14px] font-medium text-[#16295A]">
                    {worker.id}
                  </td>

                  <td className="px-4 py-5 text-[14px] text-[#16295A]">
                    {worker.name}
                  </td>

                  <td className="px-4 py-5 text-[14px] text-[#16295A]">
                    {worker.phone}
                  </td>

                  <td className="px-4 py-5 text-[14px] text-[#16295A]">
                    {worker.zone}
                  </td>

                  <td className="px-4 py-5 text-center text-[14px] text-[#16295A]">
                    {worker.wards}
                  </td>

                  <td className="relative overflow-visible px-4 py-5">

                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === worker.id
                            ? null
                            : worker.id
                        )
                      }
                      className="
                        ml-auto
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        text-violet-700
                        transition
                        hover:bg-violet-100
                      "
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {activeMenu === worker.id && (

                      <div
                        ref={menuRef}
                        className="
                          absolute
                          right-[52px]
                          top-1/2
                          z-50
                          -translate-y-1/2
                          w-[170px]
                          rounded-2xl
                          border
                          border-[#E8ECF5]
                          bg-white
                          py-2
                          shadow-2xl
                        "
                      >

                        <button
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            px-5
                            py-3
                            text-[14px]
                            font-medium
                            text-red-500
                            transition
                            hover:bg-red-50
                          "
                        >
                          <Trash2 size={16} />

                          Delete

                        </button>

                      </div>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
                    <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-[#EEF2F7]
              bg-white
              px-6
              py-4
            "
          >

            <p className="text-[13px] font-medium text-[#3F51B5]">
              Showing 1 to {filteredWorkers.length} of {workers.length} entries
            </p>

            <div className="flex items-center gap-3">

              <span className="text-[13px] text-[#3F51B5]">
                Rows per page:
              </span>

              <button
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  bg-white
                  px-4
                  text-[14px]
                  font-medium
                  text-[#16295A]
                "
              >
                10

                <ChevronDown size={16} />

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ================= Add Worker Modal ================= */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/25
            backdrop-blur-sm
          "
        >

          <div
            className="
              relative
              w-[430px]
              rounded-[24px]
              border
              border-[#E8ECF5]
              bg-white
              p-7
              shadow-2xl
            "
          >

            <button
              onClick={() => setShowModal(false)}
              className="
                absolute
                right-5
                top-5
                rounded-lg
                p-1
                text-[#667085]
                transition
                hover:bg-gray-100
                hover:text-violet-700
              "
            >
              <X size={20} />
            </button>

            <h2 className="text-[26px] font-bold text-[#16295A]">
              Add Worker
            </h2>

            <div className="mt-7 space-y-5">

              <div>

                <label className="mb-2 block text-[13px] font-medium text-[#16295A]">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Enter worker name"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-[#E4E7EC]
                    px-4
                    text-[14px]
                    outline-none
                    focus:border-violet-500
                  "
                />

              </div>

              <div>

                <label className="mb-2 block text-[13px] font-medium text-[#16295A]">
                  Phone Number
                </label>

                <input
                  type="text"
                  placeholder="Enter phone number"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-[#E4E7EC]
                    px-4
                    text-[14px]
                    outline-none
                    focus:border-violet-500
                  "
                />

              </div>

              <div>

                <label className="mb-2 block text-[13px] font-medium text-[#16295A]">
                  Zone Name
                </label>

                <button
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-[#E4E7EC]
                    px-4
                    text-[14px]
                    text-[#98A2B3]
                  "
                >
                  Select Zone

                  <ChevronDown size={18} />

                </button>

              </div>

            </div>

            <div className="mt-8 flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="
                  h-11
                  rounded-xl
                  border
                  border-[#E4E7EC]
                  px-6
                  text-[14px]
                  font-medium
                  text-[#16295A]
                  transition
                  hover:bg-gray-50
                "
              >
                Cancel
              </button>

              <button
                className="
                  h-11
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-purple-700
                  px-6
                  text-[14px]
                  font-semibold
                  text-white
                  transition
                  hover:opacity-95
                "
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}