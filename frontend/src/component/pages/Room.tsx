import { useParams, useSearchParams } from 'react-router-dom';
import Meet from '../room';

const Room = () => {
    const { roomId } = useParams();
    return <Meet roomId={roomId || ''} />;
};

export default Room;
