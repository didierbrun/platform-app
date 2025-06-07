import css from './App.module.css'
import { useState, useEffect, useRef } from 'react'
import { account, client } from './lib/appwrite'
import axios from 'axios';

function App() {

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [images, setImages] = useState([]);
  const [prompt, setPrompt] = useState("brunette girl")

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

  useEffect(() => {
    if (user === null) return;
    const unsubscribe = client.subscribe('account', response => {
      if (response.events.includes('users.*.update.name')) {
        setUser({
          ...user,
          name: response.payload.name
        })
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user])

  const handleLogin = async () => {
    setError(null);
    try {
      await account.createEmailPasswordSession(email, password);
      const result = await account.get();
      setUser(result);
    } catch (e) {
      setError(e.message);
      setUser(null);
    }
  }

  const renderLogin = () => {
    return (
      <div className={css.form}>
        <input value={email} onChange={(e) => { setEmail(e.currentTarget.value) }} placeholder='Email' />
        <input value={password} onChange={(e) => { setPassword(e.currentTarget.value) }} placeholder='Password' type="password" />
        {error && <div className={css.error}>{error}</div>}
        <button onClick={handleLogin}>Login</button>
      </div>
    )
  }

  const handleLogout = async () => {
    await account.deleteSessions();
    setUser(null);
    setFetching(false);
  }

  const handleFetch = async () => {
    setFetching(true)
    const response = await axios.post('https://create-image.cidplatform.com',
      {
        prompt
      }
    )
    setImages(response.data.images)
    setFetching(false)
  }

  const renderLogout = () => {
    return (
      <div className={css.content}>
        <div className={css.form}>
          <div className={css.hello}>Hello <span className={css.firstName}>{user.name}</span></div>
          <input value={prompt} onChange={(e) => {setPrompt(e.currentTarget.value)}} placeholder='Prompt'/>
          <button onClick={handleLogout} disabled={fetching}>Logout</button>
          <button onClick={handleFetch} disabled={fetching}>Generate</button>

        </div>
        <div className={css.images}>
          {
            images.map((im, index) => {return <img src={im} key={index}/>})
          }
        </div>
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
