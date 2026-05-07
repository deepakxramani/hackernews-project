import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        borderBottom: '1px solid #ccc',
      }}
    >
      <Link to='/'>Home</Link>

      {user && <Link to='/bookmarks'>Bookmarks</Link>}

      {!user ? (
        <>
          <Link to='/login'>Login</Link>

          <Link to='/register'>Register</Link>
        </>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  );
};

export default Navbar;
