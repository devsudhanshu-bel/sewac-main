import {
  X,
  Tag,
  FolderOpen,
  Phone,
  MapPin,
  Map,
  Image as ImageIcon,
  Expand,
  FileText,
  UserRound,
  ClipboardList,
} from "lucide-react";

export default function ComplaintDetails() {
  return (
    <div
      className="
        w-full
        h-[calc(100vh-104px)]
        bg-white
        border
        border-gray-100
        shadow-[0_8px_25px_rgba(15,23,42,0.05)]
        overflow-hidden
      "
    >
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-[15px] font-bold text-[#16295A]">
          Complaint Details
        </h2>

        <button
          className="
            w-7
            h-7
            rounded-lg
            flex
            items-center
            justify-center
            text-gray-400
            hover:bg-gray-50
            hover:text-gray-700
            transition
          "
        >
          <X size={17} />
        </button>
      </div>

      {/* ================= SCROLL CONTENT ================= */}

      <div className="h-[calc(100%-65px)] overflow-y-auto px-5 py-4">

        {/* ================= TICKET ================= */}

        <div className="mb-4">
          <p className="text-[10px] font-semibold text-gray-500 mb-1.5">
            Ticket Number
          </p>

          <div className="flex items-center justify-between">
            <span
              className="
                px-2.5
                py-1
                rounded-lg
                bg-[#F4ECFF]
                text-[11px]
                font-semibold
                text-violet-700
              "
            >
              CMP-20260731-001
            </span>

            <span
              className="
                px-2.5
                py-1
                rounded-full
                bg-[#FFF5D9]
                text-[10px]
                font-semibold
                text-[#D99100]
              "
            >
              Pending
            </span>
          </div>
        </div>

        <div className="border-b border-gray-100 mb-4" />

        {/* ================= TITLE ================= */}

        <div className="flex gap-2.5 mb-4">
          <Tag
            size={14}
            className="text-gray-500 mt-0.5 shrink-0"
          />

          <div>
            <p className="text-[10px] font-semibold text-gray-500">
              Title
            </p>

            <p className="text-[12px] font-medium text-[#16295A] mt-1">
              Garbage Overflow near Bus Stop
            </p>
          </div>
        </div>

        {/* ================= CATEGORY ================= */}

        <div className="flex gap-2.5 mb-4">
          <FolderOpen
            size={14}
            className="text-gray-500 mt-0.5 shrink-0"
          />

          <div>
            <p className="text-[10px] font-semibold text-gray-500">
              Category
            </p>

            <p className="text-[12px] text-[#16295A] mt-1">
              Solid Waste
            </p>
          </div>
        </div>

        {/* ================= PHONE ================= */}

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2.5">
            <Phone
              size={14}
              className="text-gray-500 mt-0.5 shrink-0"
            />

            <div>
              <p className="text-[10px] font-semibold text-gray-500">
                Citizen (Phone)
              </p>

              <p className="text-[12px] text-[#16295A] mt-1">
                9876543210
              </p>
            </div>
          </div>

          <button
            className="
              w-8
              h-8
              rounded-lg
              border
              border-violet-200
              flex
              items-center
              justify-center
              text-violet-600
              hover:bg-violet-50
              transition
            "
          >
            <Phone size={14} />
          </button>
        </div>

        {/* ================= ADDRESS ================= */}

        <div className="flex gap-2.5 mb-4">
          <MapPin
            size={14}
            className="text-gray-500 mt-0.5 shrink-0"
          />

          <div>
            <p className="text-[10px] font-semibold text-gray-500">
              Address
            </p>

            <p className="text-[12px] leading-5 text-[#16295A] mt-1">
              Ibbalur Main Road, Ward 23,
              <br />
              Bengaluru, Karnataka
            </p>
          </div>
        </div>

        {/* ================= COORDINATES ================= */}

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2.5">
            <Map
              size={14}
              className="text-gray-500 mt-0.5 shrink-0"
            />

            <div>
              <p className="text-[10px] font-semibold text-gray-500">
                Coordinates
              </p>

              <p className="text-[12px] text-[#16295A] mt-1">
                12.923456, 77.601234
              </p>
            </div>
          </div>

          <button
            className="
              w-8
              h-8
              rounded-lg
              border
              border-violet-200
              flex
              items-center
              justify-center
              text-violet-600
              hover:bg-violet-50
              transition
            "
          >
            <Map size={14} />
          </button>
        </div>

        {/* ================= IMAGE ================= */}

        <div className="mb-4">
          <div className="flex items-center gap-2.5 mb-2">
            <ImageIcon
              size={14}
              className="text-gray-500"
            />

            <p className="text-[10px] font-semibold text-gray-500">
              Complaint Image
            </p>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=700"
              alt="Complaint"
              className="
                w-full
                h-[145px]
                rounded-xl
                object-cover
              "
            />

            <button
              className="
                absolute
                bottom-2
                right-2
                w-8
                h-8
                rounded-lg
                bg-white
                shadow-md
                flex
                items-center
                justify-center
                text-violet-600
                hover:scale-105
                transition
              "
            >
              <Expand size={14} />
            </button>
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}

        <div className="flex gap-2.5 mb-4">
          <FileText
            size={14}
            className="text-gray-500 mt-0.5 shrink-0"
          />

          <div>
            <p className="text-[10px] font-semibold text-gray-500">
              Description
            </p>

            <p className="text-[12px] leading-5 text-[#16295A] mt-1">
              Garbage has not been collected for the last
              3 days. It is overflowing and causing bad
              smell in the area.
            </p>
          </div>
        </div>

        {/* ================= ASSIGNED TO ================= */}

        <div className="mb-4">
          <div className="flex items-center gap-2.5 mb-1.5">
            <UserRound
              size={14}
              className="text-gray-500"
            />

            <p className="text-[10px] font-semibold text-gray-500">
              Assigned To
            </p>
          </div>

          <select
            className="
              w-full
              h-9
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              text-[11px]
              text-gray-600
              outline-none
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100
            "
            defaultValue=""
          >
            <option value="" disabled>
              Select Assignee
            </option>

            <option value="ramesh">Ramesh K.</option>
            <option value="suresh">Suresh M.</option>
            <option value="mahesh">Mahesh T.</option>
          </select>
        </div>

        {/* ================= STATUS ================= */}

        <div className="mb-4">
          <div className="flex items-center gap-2.5 mb-1.5">
            <ClipboardList
              size={14}
              className="text-gray-500"
            />

            <p className="text-[10px] font-semibold text-gray-500">
              Status
            </p>
          </div>

          <select
            className="
              w-full
              h-9
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              text-[11px]
              text-[#16295A]
              outline-none
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100
            "
            defaultValue="Pending"
          >
            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Resolved">
              Resolved
            </option>
          </select>
        </div>

        {/* ================= REMARKS ================= */}

        <div className="mb-4">
          <div className="flex items-center gap-2.5 mb-1.5">
            <FileText
              size={14}
              className="text-gray-500"
            />

            <p className="text-[10px] font-semibold text-gray-500">
              Remarks
            </p>
          </div>

          <textarea
            placeholder="Add remarks..."
            className="
              w-full
              h-[58px]
              resize-none
              rounded-lg
              border
              border-gray-200
              px-3
              py-2
              text-[11px]
              text-[#16295A]
              outline-none
              placeholder:text-gray-400
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100
            "
          />
        </div>

        {/* ================= ACTIONS ================= */}

        <div className="flex justify-end gap-2 pt-1 pb-2">
          <button
            className="
              h-8
              px-4
              rounded-lg
              border
              border-gray-200
              bg-white
              text-[11px]
              font-semibold
              text-gray-600
              hover:bg-gray-50
              transition
            "
          >
            Cancel
          </button>

          <button
            className="
              h-8
              px-4
              rounded-lg
              bg-gradient-to-r
              from-violet-600
              to-fuchsia-600
              text-white
              text-[11px]
              font-semibold
              shadow-sm
              hover:opacity-95
              transition
            "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}