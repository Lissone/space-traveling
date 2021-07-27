import styles from './header.module.scss';

export function Header(): JSX.Element {
  return (
    <header className={styles.headerContainer}>
      <img src="/logo.png" alt="logo" />
    </header>
  );
}
