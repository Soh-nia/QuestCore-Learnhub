'use client';

import { LuCircleCheck, LuCircleX, LuTriangleAlert } from 'react-icons/lu';

type AlertVariant = 'success' | 'error' | 'warning';

interface AlertBannerProps {
  variant: AlertVariant;
  title?: string;
  description?: string;
  errors?: string[];
}

const AlertBanner = ({ variant, title, description, errors }: AlertBannerProps) => {
  const variantStyles = {
    success: {
      bg: 'bg-teal-50 dark:bg-teal-800/10',
      border: 'border-teal-200 dark:border-teal-900',
      text: 'text-teal-800 dark:text-teal-500',
      icon: <LuCircleCheck className="shrink-0 size-4 mt-0.5" />,
      secondaryText: 'text-teal-700 dark:text-teal-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-800/10',
      border: 'border-red-200 dark:border-red-900',
      text: 'text-red-800 dark:text-red-500',
      icon: <LuCircleX className="shrink-0 size-4 mt-0.5" />,
      secondaryText: 'text-red-700 dark:text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-800/10',
      border: 'border-yellow-200 dark:border-yellow-900',
      text: 'text-yellow-800 dark:text-yellow-500',
      icon: <LuTriangleAlert className="shrink-0 size-5 mt-1" />,
      secondaryText: 'text-yellow-700 dark:text-yellow-400',
    },
  };

  const { bg, border, text, icon, secondaryText } = variantStyles[variant];

  return (
    <div
      className={`border text-sm rounded-lg p-4 shadow-md mb-5 ${bg} ${border} ${text}`}
      role="alert"
      tabIndex={-1}
      aria-labelledby={`alert-${variant}-label`}
    >
      <div className="flex">
        <div className="shrink-0">{icon}</div>
        <div className="mx-4">
          <h3 id={`alert-${variant}-label`} className="text-base font-semibold mb-1">
            {title}
          </h3>
          {description && (
            <div className={`text-base ${secondaryText}`}>
              {description}
            </div>
          )}
          {errors && errors.length > 0 && (
            <div className={`mt-2 text-sm ${secondaryText}`}>
              <ul className="list-disc space-y-1 ps-5">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;