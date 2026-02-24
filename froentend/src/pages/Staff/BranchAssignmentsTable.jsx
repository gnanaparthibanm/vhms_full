import { Button } from "../../components/ui/button";

const branchAssignments = [
  {
    staff: "Test Staff",
    branch: "Fusionedge Test Hospital - Main Branch",
    startDate: "Not set",
    endDate: "Ongoing",
    status: "Active",
  },
  {
    staff: "Dr. Sarah Wilson",
    branch: "Fusionedge Animal Care - East Wing",
    startDate: "Jan 10, 2026",
    endDate: "Ongoing",
    status: "Active",
  },
  {
    staff: "Mark Johnson",
    branch: "Fusionedge Pet Clinic - West Branch",
    startDate: "Dec 02, 2025",
    endDate: "Mar 01, 2026",
    status: "Active",
  },
  {
    staff: "Anita Sharma",
    branch: "Fusionedge Veterinary Hospital - North Branch",
    startDate: "Nov 15, 2025",
    endDate: "Ongoing",
    status: "Active",
  },
  {
    staff: "Kevin Blake",
    branch: "Fusionedge Emergency Care - Central",
    startDate: "Feb 01, 2026",
    endDate: "Ongoing",
    status: "Active",
  },
];


const statusClass = (status) => {
  switch (status) {
    case "Active":
      return "bg-emerald-500/10 text-emerald-600";
    default:
      return "bg-[var(--dashboard-secondary)] text-[var(--dashboard-text-light)]";
  }
};

const BranchAssignmentsTable = () => {
  const handleDelete = (index) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this branch assignment?"
  );

  if (!confirmDelete) return;

  console.log("Delete row:", index);

  
};

  return (
    <>
   <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
    {/* ================= MOBILE VIEW ================= */}
<div className="md:hidden space-y-3 p-3">
{branchAssignments.map((item, i) => (
<div
key={i}
className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm"
>

<div className="flex justify-between">
<p className="font-semibold text-[var(--dashboard-text)]">
{item.staff}
</p>
<span
className={`text-xs px-2 py-1 rounded-full ${statusClass(item.status)}`}
>
{item.status}
</span>
</div>

<p className="text-xs text-[var(--dashboard-text-light)] mt-1">
Branch: {item.branch}
</p>

<p className="text-xs text-[var(--dashboard-text-light)]">
Start: {item.startDate}
</p>

<p className="text-xs text-[var(--dashboard-text-light)]">
End: {item.endDate}
</p>

<Button
onClick={() => handleDelete(i)}
className="w-full mt-3 h-8 text-xs text-red-600"
>
Delete
</Button>

</div>
))}
</div>

      <div className="hidden md:block overflow-x-auto">
<table className="w-full text-sm">
        <thead className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
          <tr>
            {[
              "Staff Member",
              "Branch",
              "Start Date",
              "End Date",
              "Status",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {branchAssignments.map((item, i) => (
            <tr
              key={i}
              className="border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] transition-colors"
            >
              <td className="p-4">{item.staff}</td>
              <td className="p-4">{item.branch}</td>
              <td className="p-4">{item.startDate}</td>
              <td className="p-4">{item.endDate}</td>

              <td className="p-4">
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </td>

              <td className="p-4">
                <Button
  onClick={() => handleDelete(i)}
  className="h-8 rounded-md border border-red-200 px-3 text-xs text-red-600 bg-red-50 hover:bg-red-100"
>
  Delete
</Button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
   

    </>
  );
  
};


export default BranchAssignmentsTable;
