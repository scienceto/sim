import { Link } from 'react-router-dom'

const Header = ({ handleSignOut }) => {
    return (
        <header className="header">
            <h1 className="logo">LogiMasters</h1>
            <nav>
                <ul>
                    <li><Link to="/">Console</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
            <button
                className="sign-out-btn"
                onClick={handleSignOut}
                style={{
                    margin: '20px',
                    fontSize: '0.8rem',
                    padding: '5px 10px',
                    marginTop: '20px'
                }}
            >
                Sign Out
            </button>
        </header>
    );
};

export default Header;
