import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", position: 'relative', overflow: 'hidden' }}>

      {/* Background decorative circles */}
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -80, left: -80 }}></div>
      <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -40, right: -40 }}></div>
      <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: '40%', right: '10%' }}></div>

      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: '10px 12px', fontSize: 24, backdropFilter: 'blur(10px)' }}>⚡</div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>Task Manager</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>
            {isLogin ? 'Welcome back! Ready to crush tasks? 🎯' : 'Join TaskFlow and boost your productivity!'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', borderRadius: 20, padding: '32px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', margin: '0 0 24px' }}>
            {isLogin ? '👋 Sign In' : '🚀 Create Account'}
          </h2>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
            <input
              type="email" required placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', margin: '8px 0 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.25)', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)' }}
            />

            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
            <input
              type="password" required placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', margin: '8px 0 26px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.25)', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)' }}
            />

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: 'white', color: '#7c3aed', border: 'none', padding: '13px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'transform 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              {loading ? '⏳ Please wait...' : isLogin ? '✨ Sign In' : '🚀 Sign Up'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => { setIsLogin(!isLogin); setError('') }}
              style={{ color: 'white', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          Task Manager v1.0 · Manage tasks efficiently
        </p>
      </div>
    </div>
  )
}