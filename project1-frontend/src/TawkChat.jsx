import React, { useEffect } from 'react';

const TawkToWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/66d7651e50c10f7a00a3a161/1i6sm602k';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    const s0 = document.getElementsByTagName('script')[0];
    s0.parentNode.insertBefore(script, s0);

    return () => {
      // Cleanup the script if the component is unmounted
      const tawkScript = document.querySelector(`script[src="${script.src}"]`);
      if (tawkScript) tawkScript.remove();
    };
  }, []);

  return null; // This component does not render anything visually
};

export default TawkToWidget;
