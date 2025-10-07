import FavoriteView from './FavoriteView';
import { useSelector } from 'react-redux';

const Favorite = () => {
  const favorites = useSelector(state => state.favorites);

  return <FavoriteView favorites={favorites} />;
};

export default Favorite;