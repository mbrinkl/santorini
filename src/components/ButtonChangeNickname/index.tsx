import { Link } from 'react-router-dom';
import { useStoreState } from '../../store';
import './style.scss';

export const ButtonChangeNickname = () : JSX.Element => {
  const nickname = useStoreState((s) => s.nickname);

  return (
    <div className="Nickname">
      <p className="NicknameDisplay">
        {nickname}
      </p>

      <Link to="/nickname" className="ButtonChangeNickname">
        Change Nickname
      </Link>
    </div>
  );
};
