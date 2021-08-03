import Link from 'next/link';

import styles from './previewButton.module.scss';

export default function ExitPreviewButton(): JSX.Element {
  return (
    <aside className={styles.container}>
      <Link href="/api/exit-preview">
        <a>Sair do modo Preview</a>
      </Link>
    </aside>
  );
}
