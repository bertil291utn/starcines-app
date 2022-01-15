import Layout from '../../components/Layout';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

import { IoChevronBackOutline, IoPlay } from 'react-icons/io5';
import Image from 'next/image';
import ReadMoreReact from 'read-more-react';
import _ from 'lodash';
import {
  API_KEY,
  STARCINES_CARTELERA,
  STARCINES_IMAGE,
  STARCINES_PRICES_URL,
  TMBD_IMAGE_URL,
  TMBD_URL,
} from '../../config';

const FilmDetail = ({ film }) => {
  const router = useRouter();

  const _leftTabs = [
    { id: 1, name: 'Info', active: true, displayActive: true },
    {
      id: 2,
      name: 'Vermouth',
      active: false,
      displayActive: false,
    },
    { id: 3, name: 'Cast', active: false, displayActive: film.imdb.cast },
  ];
  const [leftTabs, setLeftTabs] = useState(_leftTabs);

  const updateTabs = (tabId) => () => {
    setLeftTabs((pTabs) =>
      pTabs.map((t) => ({
        ...t,
        active: t.id == tabId,
      }))
    );
  };

  return (
    <Layout subDir>
      <>
        <div className='flex flex-row pl-6'>
          <div className='mr-10 mt-10 h-10' onClick={() => router.push('/')}>
            <IoChevronBackOutline className='text-3xl' />
          </div>

          <div className='h-96 w-full relative'>
            <Image
              src={`${STARCINES_IMAGE}/${film.poster}`}
              alt='film-poster'
              layout='fill'
              objectFit='cover'
              placeholder='blur'
              blurDataURL={rgbDataURL(0, 0, 0)}
              className='rounded-bl-6xl'
            />
            <div className='absolute bottom-9 left-9'>
              {film.imdb.videos && (
                <button
                  className='rounded-full p-6 backdrop-filter bg-opacity-10 backdrop-blur-md'
                  onClick={() =>
                    window.open(
                      `https://youtu.be/${film.imdb.videos.results[0].key}`,
                      '_blank'
                    )
                  }
                >
                  <IoPlay className='text-white text-3xl' />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-row pl-6 pb-36'>
          <ul className='flex flex-col items-start text-lg'>
            {leftTabs.map(
              (t) =>
                t.displayActive && (
                  <li
                    key={`tab-${t.id}`}
                    className={`text-rotate-90-rl mb-10 ${
                      t.active ? 'font-bold' : 'text-gray-400'
                    }`}
                    onClick={updateTabs(t.id)}
                  >
                    {t.name}
                  </li>
                )
            )}
          </ul>
          <div className='mt-5 ml-12 mr-8 w-full'>
            {leftTabs.find((t) => t.active).id == 1 && <Info film={film} />}
            {leftTabs.find((t) => t.active).id == 2 && <Horarios film={film} />}
            {leftTabs.find((t) => t.active).id == 3 && <Cast film={film} />}
          </div>
        </div>
        <div className='pt-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-tl-4xl fixed bottom-0 w-full'>
          <div className='ml-24 flex overflow-x-auto space-x-5 mb-5 mr-3'>
            {film.funciones
              .map((r) => r.hora)
              .map((st, i) => (
                <span
                  key={`type-${i}`}
                  className='p-1 font-bold mr-1 uppercase'
                >
                  {st.substring(0, 5)}
                </span>
              ))}
          </div>
          <div className='flex justify-between items-center ml-10'>
            <div className='flex space-x-4'>
              {film.price.map((price, index) => {
                const [type, _price] = Object.entries(price)[0];
                return (
                  <div key={`price-${index}`} className='text-center'>
                    <p className='text-2xl font-bold'>{`$${_price}`}</p>
                    <p className='text-sm text-gray-500'>{type}</p>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => window.open(`tel:06-250-5023`)}
              className='bg-blue-600 rounded-tl-4xl w-1/2 font-bold py-7 text-white text-center text-2xl'
              type='button'
            >
              Comprar
            </button>
          </div>
        </div>
      </>
    </Layout>
  );
};

export async function getStaticPaths() {
  const _tempPaths = await getMovies();
  const paths = _tempPaths.map((m) => ({
    params: { movieId: m.id.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const _tempPaths = await getMovies();
  const film = _tempPaths.find((m) => m.id == params.movieId);
  return {
    props: {
      film,
    },
  };
}

export const Info = ({ film }) => {
  const sortedBackdrops = film.imdb.images?.backdrops.slice(0, 5);
  return (
    <div className=''>
      <p className='mb-5 text-3xl font-bold'>{film.titulo}</p>
      <div className='contenido text-gray-400'>
        <div className='flex flex-row flex-wrap'>
          <ul className='flex flex-row'>
            <li className='capitalize mr-3 last:mr-0'>{film.genero}</li>
          </ul>
          <p className='mx-4'>&#183;</p>
          <p className='font-bold'>
            {`${film.duracion.split(':')[0]}h ${film.duracion.split(':')[1]}m`}
          </p>
        </div>
        <div className='my-2'>
          {removeDuplicates(film.funciones.map((r) => r.formato)).map(
            (t, i) => (
              <span
                key={`type-${i}`}
                className='inline-block rounded-full px-5 py-1 text-xs font-bold mr-3 border uppercase'
              >
                {t}
              </span>
            )
          )}
        </div>

        <ul className='flex flex-row'>
          <li className='capitalize'>{film.funciones[0].idioma}</li>
          <li className='mx-4'>&#183;</li>
          <li className='font-bold'>{film.clasificacion}</li>
        </ul>
        <div className='my-5'>
          <ReadMoreReact
            text={film.synopsis}
            readMoreText={'Leer m\xE1s'}
            min={30}
            ideal={40}
            max={50}
          />
        </div>
        {film.imdb.images && (
          <div className='my-5 flex overflow-x-auto space-x-5'>
            {sortedBackdrops.map((backdrop, index) => (
              <div
                className='flex-shrink-0 h-28 w-8/12 relative'
                key={`image-${index}`}
              >
                <Image
                  src={TMBD_IMAGE_URL + backdrop.file_path}
                  alt={`poster-${1}`}
                  layout='fill'
                  objectFit='cover'
                  objectPosition='center'
                  placeholder='blur'
                  blurDataURL={rgbDataURL(0, 0, 0)}
                  className='rounded-3xl'
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const Horarios = ({ film }) => {
  return (
    <>
      <div className='d-flex overflow-x-auto space-x-5 my-4'>
        {film.showTime.vermouth._showtime.map((st, i) => (
          <span key={`type-${i}`} className='p-1 font-bold mr-1 uppercase'>
            {st}
          </span>
        ))}
      </div>
      <p className='text-gray-400'>{film.showTime.vermouth.days.join(' / ')}</p>
      <p className='text-2xl font-bold'>{`$${film.showTime.vermouth.price}`}</p>
      <p>{film.cityName}</p>
    </>
  );
};

export const Cast = ({ film }) => {
  return (
    <div className='grid grid-cols-2 gap-3'>
      {film.imdb.cast.map((f) => (
        <div key={f.id}>
          <div className='h-48 w-full relative'>
            <Image
              src={TMBD_IMAGE_URL + f.profile_path}
              alt={`actor-${f.id}`}
              layout='fill'
              objectFit='cover'
              placeholder='blur'
              blurDataURL={rgbDataURL(0, 0, 0)}
              className='rounded-xl'
            />
          </div>
          <p className='text-gray-400 my-3'>{f.name}</p>
        </div>
      ))}
    </div>
  );
};

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

async function getMovies() {
  const { data } = await axios.get(STARCINES_CARTELERA);
  const prices = await getPrices();
  return await Promise.all(
    data.map(async (m) => {
      return await addImdbMovie(m, prices);
    })
  );
}

async function addImdbMovie(movieObj, prices) {
  const response = { ...movieObj };
  const { data } = await axios.get(
    `${TMBD_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${response.titulo}&page=1&include_adult=false&year=2021`
  );
  let imdbId = '00001';
  let imdb = '';
  if (data.results.length > 0) {
    imdbId = data.results.reduce((prev, current) =>
      prev.popularity > current.popularity ? prev : current
    ).id;

    let movieByID = await axios.get(
      `${TMBD_URL}/movie/${imdbId}?api_key=${API_KEY}&language=es-ES&append_to_response=images,videos,release_dates`
    );
    movieByID = movieByID.data;

    let imagesByID = await axios.get(
      `${TMBD_URL}/movie/${imdbId}/images?api_key=${API_KEY}`
    );
    imagesByID = imagesByID.data;

    let videosByID = await axios.get(
      `${TMBD_URL}/movie/${imdbId}/videos?api_key=${API_KEY}`
    );
    videosByID = videosByID.data;

    let castByID = await axios.get(
      `${TMBD_URL}/movie/${imdbId}/credits?api_key=${API_KEY}`
    );
    castByID = castByID.data.cast;

    imdb = movieByID;
    imdb.images = imagesByID;
    imdb.videos = videosByID;
    imdb.cast = castByID;
  }
  response.imdb = imdb;
  response.price = await Promise.all(
    removeDuplicates(response.funciones.map((r) => r.formato)).map(
      async (r) => ({ [r]: await getPrice(prices, r) })
    )
  );
  return response;
}

const removeDuplicates = (array) => {
  let response = [];
  array.forEach((c) => {
    if (!response.includes(c)) {
      response.push(c);
    }
  });
  return response;
};

const getPrice = (prices, type) => {
  //if the current day is between mon-wed get the first array , otherwise get the second one
  const general = prices
    .filter((p) => p.audiencia == 'General')
    .find((r) =>
      r.dias == [1, 2, 3].includes(new Date().getDay())
        ? 'Lunes a Miércoles'
        : 'Jueves a Domingo'
    );
  if (!general) return '-';
  return general[type === '2D' ? 'precio' : 'precio3d'];
};

const getPrices = async () => {
  const { data } = await axios(STARCINES_PRICES_URL);
  return data;
};

export default FilmDetail;
