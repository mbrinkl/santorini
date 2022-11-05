import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useBoardContext } from '../../hooks/useBoardContext';
import { isMobile } from '../../util';
import { ImageButton } from '../common/Button';
import sendIcon from '../../assets/png/send.png';
import './Chat.scss';

export const ChatMessage = ({
  sender,
  message,
}: {
  sender: string;
  message: string;
}): JSX.Element => {
  const { playerID, matchData } = useBoardContext();
  const senderName =
    (matchData?.[Number(sender)].name || `Player ${sender}`) +
    (playerID === sender ? ' (you)' : '');

  return (
    <p className="chat__message">
      <span className={`chat__message--sender-${sender}`}>{senderName}</span>
      {`: ${message}`}
    </p>
  );
};

export const Chat = (): JSX.Element => {
  const { chatMessages, sendChatMessage } = useBoardContext();
  const [message, setMessage] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();

    if (isMobile()) {
      inputRef.current?.blur();
    }

    if (message !== '') {
      sendChatMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="chat">
      <div className="chat__message-list" ref={messagesRef}>
        <p className={classNames('chat__message', 'chat__message--warning')}>
          Chat messages are not stored on the server and will only be received
          by connected players. Spectators cannot use the chat.
        </p>
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} sender={msg.sender} message={msg.payload} />
        ))}
      </div>

      <form className="chat__controls" onSubmit={send}>
        <input
          className="chat__input"
          ref={inputRef}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Enter your message..."
        />
        <ImageButton
          className="chat__send-button"
          theme="green"
          size="small"
          onClick={send}
          src={sendIcon}
          alt="sendIcon"
        />
      </form>
    </div>
  );
};
