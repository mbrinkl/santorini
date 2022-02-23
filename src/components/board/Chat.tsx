import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useBoardContext } from '../../context/boardContext';
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
    (matchData?.[sender].name || `Player ${sender}`) +
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }, [chatMessages]);

  const send = (e) => {
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
      <div className="chat__message-list">
        <p className={classNames('chat__message', 'chat__message--warning')}>
          Chat messages are not stored on the server and will only be received
          by connected players. Spectators cannot use the chat.
        </p>
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} sender={msg.sender} message={msg.payload} />
        ))}
        <div ref={messagesEndRef} />
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
