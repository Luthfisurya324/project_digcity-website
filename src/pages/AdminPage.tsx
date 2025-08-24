import React from 'react'
import AdminPanel from '../components/AdminPanel'

const AdminPage: React.FC = () => {
  return (
    <div className="admin-container min-h-screen">
      <div className="admin-content">
        <AdminPanel />
      </div>
    </div>
  )
}

export default AdminPage