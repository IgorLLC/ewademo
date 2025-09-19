import React from 'react';

const phrases = [
  'agua en caja, fresca y sustentable',
  'suscríbete y ahorra cada mes',
  'reduce plásticos, hidrátate mejor',
  'entrega a domicilio en PR',
];

const PromoMarquee: React.FC = () => {
  const sequence = [...phrases, ...phrases];
  return (
    <div className="ewa-marquee">
      <div className="ewa-marquee-inner">
        <div className="ewa-marquee-track">
          {sequence.map((text, i) => (
            <React.Fragment key={i}>
              <span className="uppercase tracking-wide font-semibold">
                {text}
              </span>
              <span className="dot" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoMarquee;


