import React from 'react'
import { useOutletContext } from 'react-router-dom'
import MemberDuesPanel from './DuesPanel'

interface MemberDuesPageProps {
    userRole?: string
}

const MemberDuesPage: React.FC<MemberDuesPageProps> = ({ userRole = 'anggota' }) => {
    // const { userRole } = useOutletContext<{ userRole: string }>()

    return (
        <div className="space-y-6">
            <MemberDuesPanel onFinanceUpdate={() => { }} userRole={userRole} />
        </div>
    )
}

export default MemberDuesPage
