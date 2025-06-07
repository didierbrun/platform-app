import css from './App.module.css'
import { useState, useEffect } from 'react'
import { account } from './lib/appwrite'

function App() {

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const result = await account.get();
        setUser(result);
      } catch { }
      setLoading(false);
    }
    init()
  }, [])

  const handleLogin = async () => {
    setError(null);
    try {
      await account.createEmailPasswordSession(email, password);
      const result = await account.get();
      setUser(result);
    } catch (e){
      setError(e.message);
      setUser(null);
    }
  }

  const renderLogin = () => {
    return (
      <div className={css.form}>
        <input value={email} onChange={(e) => {setEmail(e.currentTarget.value)}} placeHolder='Email'/>
        <input value={password} onChange={(e) => {setPassword(e.currentTarget.value)}} placeHolder='Password' type="password"/>
        { error && <div className={css.error}>{error}</div>}
        <button onClick={handleLogin}>Login</button>
      </div>
    )
  }

  const handleLogout = async () => {
    await account.deleteSessions();
    setUser(null);
  }

  const renderLogout = () => {
    return (
      <div className={css.form}>
        <div className={css.hello}>Hello <span className={css.firstName}>{user.name}</span></div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  const renderContent = () => {
    return user == null ? renderLogin() : renderLogout()
  }

  const renderLoading = () => {
    return (
      <div className={css.loading}>Loading...</div>
    )
  }


  return (
    <div className={css.container}>
      {
        loading ? renderLoading() : renderContent()
      }
    </div>
  )
}

export default App
