import { IMAGE_BASE_URL, imageSizes } from '../utils/constants';

const CastCard = ({ cast }) => {
  const profileUrl = cast.profile_path 
    ? `${IMAGE_BASE_URL}/${imageSizes.poster.small}${cast.profile_path}`
    : '/placeholder-profile.jpg';

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-36 h-54"> 
        <img 
          src={profileUrl} 
          alt={cast.name} 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="mt-2">
        <p className="font-semibold text-sm">{cast.name}</p>
        <p className="text-xs text-gray-400">{cast.character}</p>
      </div>
    </div>
  );
};

export default CastCard;