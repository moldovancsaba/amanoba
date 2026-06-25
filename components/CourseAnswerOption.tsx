'use client';

import classes from './CourseAnswerOption.module.css';

interface CourseAnswerOptionProps {
  children: string;
  disabled?: boolean;
  isRtl?: boolean;
  onClick: () => void;
}

export default function CourseAnswerOption({
  children,
  disabled = false,
  isRtl = false,
  onClick,
}: CourseAnswerOptionProps) {
  return (
    <button
      type="button"
      className={`${classes.option} ${isRtl ? classes.rtl : ''}`}
      disabled={disabled}
      onClick={onClick}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <span className={classes.label}>{children}</span>
    </button>
  );
}
