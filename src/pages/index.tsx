import Head from 'next/head';
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import styles from '../styles/home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>SpaceTraveling - Home</title>
      </Head>

      <div className={styles.container}>
        <header>
          <img src="/logo.png" alt="SpaceTraveling" />
        </header>

        <main>
          <div className={styles.post}>
            <h1>Como utilizar Hooks</h1>

            <span>Pensando em sincronização em vez de ciclos de vida.</span>

            <footer>
              <div>
                <FiCalendar />

                <p>15 Mar 2021</p>
              </div>

              <div>
                <FiUser />

                <p>Joseph Oliveira</p>
              </div>
            </footer>
          </div>

          <button type="button">Carregar mais posts</button>
        </main>
      </div>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
