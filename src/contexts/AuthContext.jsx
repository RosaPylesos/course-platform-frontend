import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

import {
    getCurrentUser,
    loginUser,
    updateUserProfile,
} from "@/api/auth"

const AuthContext = createContext(null)

const TOKEN_KEY = "access_token"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(
        () => localStorage.getItem(TOKEN_KEY)
    )
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadUser() {
            if (!token) {
                setLoading(false)
                return
            }

            try {
                const profile = await getCurrentUser(token)
                setUser(profile)
            } catch {
                localStorage.removeItem(TOKEN_KEY)
                setToken(null)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [token])

    async function login(credentials) {
        const data = await loginUser(credentials)

        localStorage.setItem(TOKEN_KEY, data.access_token)
        setToken(data.access_token)

        return data
    }

    async function updateProfile(userData) {
        const updatedUser = await updateUserProfile(token, userData)

        setUser(updatedUser)

        return updatedUser
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: Boolean(user),
                login,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        )
    }

    return context
}