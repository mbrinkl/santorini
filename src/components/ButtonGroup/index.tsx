import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';
import './style.scss';

export const ButtonGroup = ({ className, children } : HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames(className, 'buttonGroup')}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: classNames(child.props.className, 'buttonGroup__button'),
        });
      }
      return child;
    })}
  </div>
);
