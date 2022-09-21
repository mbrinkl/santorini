import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';
import './ButtonGroup.scss';

export const ButtonGroup = ({
  className,
  children,
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames(className, 'buttonGroup')}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childClassName = classNames(
          child.props.className,
          'buttonGroup__button',
        );

        const childProps = {
          className: childClassName,
        };

        return React.cloneElement(child, childProps);
      }
      return child;
    })}
  </div>
);
