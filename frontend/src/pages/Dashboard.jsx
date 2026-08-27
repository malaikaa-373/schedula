import useAuthStore from "../store/authStore.js";

const Dashboard = () => {

    const { user } = useAuthStore()

    return (
        <h1>Welcome, {user.name}</h1>
    )
}

export default Dashboard