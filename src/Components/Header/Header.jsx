
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import logo from '../../assets/logo.png'

  export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(window.scrollY);
  const threshold = 160;

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScrollPosition(window.scrollY);
    });
  }, []);

  const showMenu = () => {
    setIsOpen(!isOpen);
  };

  const onScroll = (style) => {
    return scrollPosition > threshold ? ` ${style}` : '';
  };

  const onActive = (isActive) => {
    return styles.link + (isActive ? ` ${styles.active}` : '');
  };

  return (
    <header className={styles.header + onScroll(styles.scroll)}>
      <div className={styles.wrapper}>
        <Link
          to='/'
          className={styles.logo + onScroll(styles.hide)}
        >
          <img
            className='rounded-xl'
            src={logo}
            alt='logo'
          />
        </Link>

        <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
          <button
            className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
            onClick={showMenu}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
          <ul className={`${styles.ul} ${isOpen ? styles.open : ''}`}>
            <li className={styles.li}>
              <NavLink
                to='/'
                className={({ isActive }) => onActive(isActive)}
              >
                Home
              </NavLink>
            </li>

            <li className={styles.li}>
              <NavLink
                to='/about'
                className={({ isActive }) => onActive(isActive)}
              >
                About
              </NavLink>
            </li>

            <li className={styles.li}>
              <NavLink
                to='/predict'
                className={({ isActive }) => onActive(isActive)}
              >
                Start Analysis
              </NavLink>
            </li>

            <li className={styles.li}>
              <NavLink
                to='/contact'
                className={({ isActive }) => onActive(isActive)}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};