import React from 'react'
import MemberDuesPanel from './DuesPanel'

const MemberDuesPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <MemberDuesPanel onFinanceUpdate={() => { }} />
        </div>
    )
}

export default MemberDuesPage
