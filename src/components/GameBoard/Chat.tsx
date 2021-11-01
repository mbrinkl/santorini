import { useStoreState } from "store";
import { useBoardContext } from "./BoardContext";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "utility";
import sendIcon from "../../assets/png/send.png";

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
  const inputRef : any = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
  }

  const close = (e) => {
    if (onCloseMessages) {
      onCloseMessages();
    }
  }

  return (
    <div className='chat'>
      <div className='messages'>
        <p className='chatWarning'>Chat messages are not stored on the server and will only be received 
          by connected players.</p>
        {chatMessages.map((message) => (
          <ChatMessage key={message.id} sender={message.sender} message={message.payload}/>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <form className='chatControls' onSubmit={send}>
        <input ref={inputRef}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder='Enter your message...' />
        <button className="sendBtn" onClick={send}><img className="sendImg" src={sendIcon} alt="send" /></button>
        {isMobile() && <button className="closeBtn" onClick={close}>Close</button>}
      </form>
    </div>
  );
};