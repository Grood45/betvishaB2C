import { Image } from '@chakra-ui/react';
import img1 from '../../assets/logo.svg';
const Loader = () => {
  return (
    <>
      <div
        style={{
          backgroundColor: '#f3f3f3',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          maxW={{ base: '100px', xl: '170px' }}
          height={{ base: '22px', xl: '42px' }}
          // src={img1}
          alt="Logo"
        />
      </div>
    </>
  );
};
export default Loader;
