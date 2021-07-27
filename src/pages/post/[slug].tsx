import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import { Header } from '../../components/Header';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(): JSX.Element {
  return (
    <>
      <Head>
        <title>SpaceTraveling - Post</title>
      </Head>

      <Header />

      <img src="/banner.png" alt="Banner" className={styles.banner} />

      <main className={styles.content}>
        <header>
          <h1>Criando um app CRA do zero</h1>

          <ul>
            <li>
              <FiCalendar size={20} />
              15 Mar 2021
            </li>

            <li>
              <FiUser size={20} />
              Joseph Oliveira
            </li>

            <li>
              <FiClock size={20} />4 min
            </li>
          </ul>
        </header>

        <article className={styles.postContent}>
          <h2>Título da seção</h2>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
            voluptatem optio mollitia sed assumenda et, in placeat, voluptas
            quia odio expedita consectetur perspiciatis. Vitae facilis amet,
            quasi illo mollitia aliquid consequatur numquam. Vitae aliquid
            explicabo, quibusdam, in aspernatur quis itaque nobis laudantium
            soluta repudiandae tempora <strong>dolor odio</strong> alias aut
            fuga incidunt voluptatem nam eaque similique inventore libero
            perferendis consequuntur voluptate. Temporibus tempora ab saepe a
            consectetur rerum nisi in odit accusamus! Ipsa quaerat alias facere
            deserunt recusandae voluptas atque unde.
          </p>
        </article>
      </main>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
