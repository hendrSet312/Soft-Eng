import React from 'react';
import goto from '../assets/logo_goto.png';

// const NewsCard = ({ image, title, description }) => {
//   return (
//     <div className="border rounded-lg p-4 shadow-md bg-white">
//       <img src={image} alt={title} className="w-full h-32 object-cover mb-4 rounded" />
//       <h3 className="text-lg font-bold mb-2">{title}</h3>
//       <p className="text-gray-600">{description}</p>
//     </div>
//   );
// };

const NewsCard = ({ image, title, description }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <img src={goto} alt={title} className="w-full h-32 object-cover mb-4 rounded" />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default NewsCard;
