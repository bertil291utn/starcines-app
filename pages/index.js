import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import axios from 'axios';
import { STARCINES_CARTELERA, STARCINES_IMAGE } from '../config';

export default function Home({ movies }) {
  return (
    <Layout>
      <main className='container px-3'>
        <div className='my-5 text-center grid grid-cols-2 gap-3'>
          {movies.map((movie, i) => (
            <Link
              href={`/film/${encodeURIComponent(movie.id)}`}
              key={`poster-${i}`}
            >
              <a>
                <div className='h-96 w-full relative'>
                  <Image
                    src={`${STARCINES_IMAGE}/${movie.poster}`}
                    alt={`poster-${i}`}
                    layout='fill'
                    objectFit='cover'
                    placeholder='blur'
                    blurDataURL={rgbDataURL(0, 0, 0)}
                    className='rounded-2xl'
                  />
                  {isEstreno(movie.estreno) && (
                    <span className='absolute left-1 top-1 inline-block rounded-full text-white bg-red-700 px-2 py-1 text-xs font-bold mr-3'>
                      Estreno
                    </span>
                  )}
                </div>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const movies = await getMovies();
  return {
    props: {
      movies,
    },
  };
}

export const sortMovies = (movies, field) =>
  movies.sort((x, y) => (x[field] === y[field] ? 0 : x[field] ? 1 : -1));

async function getMovies() {
  const { data } = await axios.get(STARCINES_CARTELERA);
  return data;
}

const keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const triplet = (e1, e2, e3) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r, g, b) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

const isEstreno = (date) => {
  //past 8 days is not estreno anymore
  const diffInMs = Math.abs(new Date() - new Date(date));
  return Math.round(diffInMs / (1000 * 60 * 60 * 24)) <= 7;
};
