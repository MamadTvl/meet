import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useRoom from '../hooks/useRoom';
import Meet from '../room/Meet';
import MeetGateway from '../room/MeetGateway';

const Room = () => {
    const { roomId } = useParams();
    const [showGateway, setShowGateway] = useState(true);
    const roomData = useRoom({
        roomId: roomId || '',
    });
    return (
        <>
            {showGateway ? (
                <MeetGateway
                    joinLoading={roomData.statusLoading}
                    joinToRoom={roomData.joinToRoom}
                    shouldAskForJoin={roomData.shouldAskForJoin}
                    setShowGateway={setShowGateway}
                />
            ) : (
                <Meet
                    roomId={roomId || ''}
                    roomStarted={roomData.roomStarted}
                    socket={roomData.socket}
                />
            )}
        </>
    );
};

export default Room;
