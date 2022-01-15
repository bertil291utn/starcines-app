import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className='bg-black py-3 lg:sticky lg:top-0 lg:z-10'>
      <div className='h-12 w-1/2 relative mx-auto'>
        <a
          href='https://starcines.com/#/'
          target='_blank'
          rel='noReferrer'
        >
          <Image
            src='https://starcines.com/img/StarCines-logo.png'
            alt='logo'
            layout='fill'
            objectFit='cover'
          />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
