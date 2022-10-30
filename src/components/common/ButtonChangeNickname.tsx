import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store';
import './ButtonChangeNickname.scss';

const ButtonChangeNickname = (): JSX.Element => {
  const nickname = useAppSelector((s) => s.user.nickname);

  return (
    <div className="Nickname">
      <p className="NicknameDisplay">{nickname}</p>

      <Link to="/nickname" className="ButtonChangeNickname">
        Change Nickname
      </Link>
    </div>
  );
};

export default ButtonChangeNickname;
