import { useStoreState } from "store";
import { useBoardContext } from "./BoardContext";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "utility";

export const ChatMessage: React.FC<{ sender: string, message: string }> = ({ sender, message }) => {
  
  const { playerID } = useBoardContext();
  const roomMetadata = useStoreState((s) => s.roomMetadata);

  const senderName = roomMetadata?.players[sender].name + (playerID === sender ? ' (you)' : '');
  const cssClass = 'sender-' + sender;

  return <p><span className={cssClass}>{senderName}</span>: {message}</p>
}

export const Chat: React.FC<{onCloseMessages? : () => void | null}> = ({onCloseMessages}) => {

  const {chatMessages, sendChatMessage} = useBoardContext();
  const [message, setMessage] = useState('');
  const messagesEndRef : any = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const send = (e) => {
    e.preventDefault();
    if (message !== '') {
      sendChatMessage(message);
      setMessage('');
    }
  }

  const close = (e) => {
    if (onCloseMessages) {
      onCloseMessages();
    }
  }

  return (
    <div className='chat'>
      <div className='messages'>
        <p className='chatWarning'>CHAT MESSAGES ARE NOT SAVED</p>
        {chatMessages.map((message) => (
          <ChatMessage key={message.id} sender={message.sender} message={message.payload}/>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <form className='chatControls' onSubmit={send}>
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder='Enter your message...' />
        <button onClick={send}>send</button>
        {isMobile() && <button onClick={close}>close</button>}
      </form>
    </div>
  );
};