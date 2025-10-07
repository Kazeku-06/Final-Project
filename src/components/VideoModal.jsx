import { useSelector } from 'react-redux';
import { selectTranslations } from '../redux/slices/languageSlice';

const VideoModal = ({ video, isOpen, onClose }) => {
  const t = useSelector(selectTranslations);

  if (!isOpen || !video) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{t.trailer}</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle">✕</button>
        </div>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${video.key}`}
            title={video.name}
            className="w-full h-96"
            allowFullScreen
          />
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default VideoModal;