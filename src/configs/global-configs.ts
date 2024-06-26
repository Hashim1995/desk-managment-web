import { ToastOptions } from 'react-toastify';

/**
 * Configuration options for toast notifications.
 */
const toastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined
};

/**
 * Configuration object for the text area component.
 */
const textAreaConfig = {
  base: ['shadow-none'],
  label: 'text-md font-normal',
  inputWrapper: [
    'relative',
    'px-0 py-3',
    'border-none',
    'w-full',
    'inline',
    'inline-flex',
    'tap-highlight-transparent',
    'min-h-unit-8',
    'flex-col',
    'items-start',
    'justify-center',
    'shadow-none',
    'gap-0',
    'border',
    'rounded-md',
    ' h-6',
    'data-[hover=true]:border-[#292D32]',
    'group-data-[focus=true]:border-gray-200',
    'border-[#292D32]',
    'transition-background',
    '!duration-150 ',
    'transition-colors',
    '',
    'motion-reduce:transition-none '
  ],
  innerWrapper: 'h-fit  text-xs',
  input: ' font-light p-3'
};

export { toastOptions, textAreaConfig };
