import React, { HTMLAttributes } from 'react';
import './style.scss';

export const ButtonGroup = ({ className, children } : HTMLAttributes<HTMLDivElement>) => (
  <div className={`${className} buttonGroup`}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: `${child.props.className} buttonGroup__button`,
        });
      }
      return child;
    })}
  </div>
);
