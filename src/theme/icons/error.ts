import type {
  IconDefinition,
  IconName,
  IconPrefix,
} from '@fortawesome/fontawesome-svg-core';

export const width = 48;
export const height = 48;
export const unicode = 'e01c';
export const svgPathData =
  'M33.8438 1.40625L46.5938 14.1562C47.4375 15 48 16.125 48 17.3438V30.75C48 31.9688 47.5312 33.0938 46.6875 33.9375L33.8438 46.6875C33 47.5312 31.875 48 30.6562 48H17.25C16.0312 48 14.9062 47.5312 14.0625 46.6875L1.3125 33.9375C0.46875 33.0938 0 31.9688 0 30.75V17.3438C0 16.125 0.46875 15 1.3125 14.1562L14.0625 1.40625C14.9062 0.5625 16.0312 0 17.25 0H30.6562C31.875 0 33 0.5625 33.8438 1.40625ZM30.6562 43.5L43.5 30.75V17.3438L30.6562 4.5H17.25L4.5 17.3438V30.75L17.25 43.5H30.6562ZM24 38C21.7944 38 20 36.1776 20 33.9375C20 31.6974 21.7944 29.875 24 29.875C26.2056 29.875 28 31.6974 28 33.9375C28 36.1776 26.2056 38 24 38ZM26.857 27.0921L27.537 13.2796C27.5713 12.5835 27.0248 12 26.3385 12H21.6615C20.9752 12 20.4287 12.5835 20.463 13.2796L21.143 27.0921C21.1749 27.7408 21.702 28.25 22.3415 28.25H25.6585C26.298 28.25 26.8251 27.7408 26.857 27.0921Z';

export const error = {
  prefix: 'ssc' as IconPrefix,
  iconName: 'error' as IconName,
  icon: [width, height, [], unicode, svgPathData],
} as IconDefinition;
