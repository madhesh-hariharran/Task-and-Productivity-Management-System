import { Navigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import { hasAssignedTasksAccess } from "../utils/roleGuard"
import AssignedTasksContent from "../components/assignedtaskcomponents/AssignedTasksContent"

function AssignedTasks() {
    const { role } = useAuth()

    if (!hasAssignedTasksAccess(role)) {
        return <Navigate to="/dashboard" replace />
    }

    return <AssignedTasksContent />    
}

export default AssignedTasks