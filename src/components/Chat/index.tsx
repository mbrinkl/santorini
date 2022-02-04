import { useEffect, useRef, useState } from 'react';
import { useBoardContext } from '../GameBoard/BoardContext';
import { isMobile } from '../../utility';
import sendIcon from '../../assets/png/send.png';
import './style.scss';

export const ChatMessage = ({ sender, message } : {
  sender: string,
  message: string
}) : JSX.Element => {
  const { playerID, matchData } = useBoardContext();
  const senderName = (matchData?.[sender].name || `Player ${sender}`) + (playerID === sender ? ' (you)' : '');

  return (
    <p>
      <span className={`sender-${sender}`}>{senderName}</span>
      {`: ${message}`}
    </p>
  );
};

export const Chat = ({ onCloseMessages } : {
  onCloseMessages? : () => void
}) : JSX.Element => {
  const { chatMessages, sendChatMessage } = useBoardContext();
  const [message, setMessage] = useState('');
  const messagesEndRef: any = useRef(null);
  const inputRef: any = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const send = (e) => {
    e.preventDefault();

    if (isMobile()) {
      inputRef.current.blur();
    }

    if (message !== '') {
      sendChatMessage(message);
      setMessage('');
    }
  };

  const close = () => {
    if (onCloseMessages) {
      onCloseMessages();
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        <p className="chatWarning">
          Chat messages are not stored on the server and will only be received
          by connected players. Spectators cannot use the chat.
        </p>
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} sender={msg.sender} message={msg.payload} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chatControls" onSubmit={send}>
        <input
          ref={inputRef}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Enter your message..."
        />
        <button className="sendBtn" onClick={send} type="button">
          <img className="sendImg" src={sendIcon} alt="send" />
        </button>
        {isMobile() && <button className="closeBtn" onClick={close} type="button">Close</button>}
      </form>
    </div>
  );
};
