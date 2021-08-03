/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';
import ExitPreviewButton from '../../components/ExitPreviewButton';
import Comments from '../../components/Comments';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
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
  navigation: {
    previousPost: {
      uid: string;
      data: {
        title: string;
      };
    }[];
    nextPost: {
      uid: string;
      data: {
        title: string;
      };
    }[];
  };
  preview: boolean;
}

export default function Post({
  post,
  navigation,
  preview,
}: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  const formattedDate = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );

  const isPostEdited =
    post.first_publication_date !== post.last_publication_date;

  let editionDate;
  if (isPostEdited) {
    editionDate = format(
      new Date(post.last_publication_date),
      "'* editado em' dd MMM yyyy', ás ' H':'m",
      { locale: ptBR }
    );
  }

  const totalWords = post.data.content.reduce((total, contentItem) => {
    total += contentItem.heading?.split(' ').length || 0;

    const words = contentItem.body.map(item => item.text.split(' ').length);
    words.map(word => (total += word));

    return total;
  }, 0);

  const readTime = Math.ceil(totalWords / 200);

  return (
    <>
      <Head>
        <title>SpaceTraveling - {post.data.title}</title>
      </Head>

      <Header />

      <img src={post.data.banner.url} alt="Banner" className={styles.banner} />

      <main className={styles.content}>
        <header>
          <h1>{post.data.title}</h1>

          <ul>
            <li>
              <FiCalendar size={20} />
              {formattedDate}
            </li>

            <li>
              <FiUser size={20} />
              {post.data.author}
            </li>

            <li>
              <FiClock size={20} />
              {`${readTime} min`}
            </li>
          </ul>

          {isPostEdited && <span>{editionDate}</span>}
        </header>

        {post.data.content.map(content => (
          <article key={content.heading}>
            <h2>{content.heading}</h2>

            <div
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(content.body),
              }}
            />
          </article>
        ))}
      </main>

      <div className={styles.divider} />

      <section className={styles.navigation}>
        {navigation?.previousPost.length > 0 ? (
          <div>
            <h3>{navigation.previousPost[0].data.title}</h3>

            <Link href={`/post/${navigation.previousPost[0].uid}`}>
              <a>Post anterior</a>
            </Link>
          </div>
        ) : (
          <div />
        )}

        {navigation?.nextPost.length > 0 ? (
          <div>
            <h3>{navigation.nextPost[0].data.title}</h3>

            <Link href={`/post/${navigation.nextPost[0].uid}`}>
              <a>Próximo post</a>
            </Link>
          </div>
        ) : (
          <div />
        )}
      </section>

      <Comments />

      {preview && <ExitPreviewButton />}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref ?? null,
  });

  const previousPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
    }
  );

  const nextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.last_publication_date desc]',
    }
  );

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  return {
    props: {
      post,
      navigation: {
        previousPost: previousPost?.results,
        nextPost: nextPost?.results,
      },
      preview,
    },
  };
};
