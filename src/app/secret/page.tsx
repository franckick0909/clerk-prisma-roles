import Secret from "@/components/secret"
import AdminContent from "@/components/AdminContent"
import UsersTable from "@/components/UsersTable"

export default function SecretPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Secret />
      
      <AdminContent>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h2>
          <UsersTable />
        </div>
      </AdminContent>
    </div>
  )
}

